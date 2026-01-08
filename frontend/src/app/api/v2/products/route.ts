import { NextResponse } from 'next/server';
import { SmartInventoryPredictor } from '@/lib/predictor';
import { getSupabase } from '@/lib/supabase';
import { MOCK_PRODUCTS, Product } from '@/lib/products';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * PRODUCTS API v9.0 - "QUANTUM CATALOG"
 * ═══════════════════════════════════════════════════════════════════════════════
 * [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO] | [SHORT-TERM YIELD]
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Performance: Cache de seed para evitar upserts repetitivos
let seedPromise: Promise<void> | null = null;
let isSeeded = false;

// Non-blocking seed function
async function ensureSeeded(): Promise<void> {
    if (isSeeded) return;
    if (seedPromise) return seedPromise;

    seedPromise = (async () => {
        const supabase = getSupabase();
        if (!supabase) return;

        try {
            const seedData = MOCK_PRODUCTS.map(p => ({
                id: p.id,
                name: p.name,
                price: p.price,
                description: p.description,
                category: p.category,
                image_url: p.image_url,
                demand_score: p.demand_score || 50,
                is_viral: p.is_viral || false,
                original_price: p.original_price || p.price * 1.5
            }));

            await supabase.from('products').upsert(seedData, { onConflict: 'id', ignoreDuplicates: true });
            isSeeded = true;
        } catch (err) {
            console.warn('[SEED] Non-critical seed error:', err);
            // Don't block request if seed fails - use mock data fallback
        } finally {
            seedPromise = null;
        }
    })();

    return seedPromise;
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit');
    const search = searchParams.get('search')?.trim();
    const limit = limitParam ? Math.min(Number(limitParam), 50) : 20; // Cap at 50 for performance

    const supabase = getSupabase();

    // Fallback to MOCK_PRODUCTS if DB is not ready - "Custo Zero" uptime
    if (!supabase) {
        const mockAnalyzed = MOCK_PRODUCTS.slice(0, limit).map(p => ({
            ...SmartInventoryPredictor.analyze(p),
            estimated_profit: Number((p.price * 0.45).toFixed(2))
        }));
        return NextResponse.json(mockAnalyzed);
    }

    try {
        // Non-blocking seed (doesn't delay response)
        ensureSeeded();

        // OPTIMIZED QUERY: Select all to catch Apex Metadata (Mood, Model, Strategy)
        let query = supabase
            .from('products')
            .select('*')
            .eq('is_active', true)
            .order('is_featured', { ascending: false })
            .limit(limit);

        // Search with sanitized input
        if (search && search.length >= 2) {
            const sanitized = search.replace(/[%_]/g, '');
            query = query.or(`name.ilike.%${sanitized}%,description.ilike.%${sanitized}%`);
        }

        const { data: products, error: queryError } = await query;

        if (queryError) {
            console.error('[PRODUCTS] Query error:', queryError);
            throw queryError;
        }

        // LOG DE DEMANDA (Non-blocking)
        if (search && (!products || products.length === 0)) {
            void supabase.from('logs').insert({
                type: 'demand_miss',
                message: `🔍 OPORTUNIDADE: "${search}". Sourcing sugerido.`,
                created_at: new Date().toISOString()
            });
        }

        // CAMADA DE INTELIGÊNCIA (ANÁLISE PREDITIVA)
        const analyzedProducts = (products || []).map((product: any) => {
            const meta = product.metadata || {};
            return {
                ...product,
                // Garantindo compatibilidade com frontend ShopClient
                original_price: product.original_price || (product.price * 1.5),
                demand_score: product.demand_score || meta.demand_score || 0,
                is_viral: product.is_viral || meta.is_viral || false,
                business_model: meta.business_model || 'DROPSHIPPING',
                location: meta.location || 'SP',
                estimated_profit: product.estimated_profit || Number((product.price * 0.40).toFixed(2))
            };
        });

        // Response with Edge Cache (Aggressive for performance)
        return NextResponse.json(analyzedProducts, {
            headers: {
                'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=150',
            },
        });

    } catch (e: any) {
        console.error('[PRODUCTS] Critical error:', e.message);
        // Graceful degradation: Return mock data on error
        const fallback = MOCK_PRODUCTS.slice(0, limit).map(p => ({
            ...SmartInventoryPredictor.analyze(p),
            estimated_profit: Number((p.price * 0.45).toFixed(2))
        }));
        return NextResponse.json(fallback);
    }
}


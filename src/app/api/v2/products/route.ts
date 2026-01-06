import { NextResponse } from 'next/server';
import { SmartInventoryPredictor } from '@/lib/predictor';
import { getSupabase } from '@/lib/supabase';
import { MOCK_PRODUCTS } from '@/lib/products';

// 1. AUTO-SEED LOGIC: Cache local para garantir custo zero de consultas repetitivas
let isSeeded = false;

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit');
    const search = searchParams.get('search');
    const supabase = getSupabase();

    if (!supabase) {
        // Fallback to MOCK_PRODUCTS if DB is not ready - "Custo Zero" uptime
        return NextResponse.json(MOCK_PRODUCTS.slice(0, Number(limit) || 20));
    }

    try {
        // AUTO-SEED: Otimizado com UPSERT para evitar erros de duplicidade (Logical Fix)
        if (!isSeeded) {
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

            // Upsert garante que se o ID já existir, apenas atualize ou ignore, sem quebrar o build/request
            await supabase.from('products').upsert(seedData, { onConflict: 'id' });
            isSeeded = true;
        }

        // 2. BUSCA AUTOMATIZADA - Performance: Select only needed columns
        let query = supabase.from('products').select('id, name, price, description, category, image_url, demand_score, is_viral, original_price');

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data: products, error: queryError } = await query;
        if (queryError) throw queryError;

        // 3. LOG DE DEMANDA (Automação de Repasse de Interesse) - Melhoria Crítica
        if (search && (!products || products.length === 0)) {
            await supabase.from('logs').insert({
                type: 'demand_miss',
                message: `AUTOMAÇÃO 2026: Sourcing imediato necessário para "${search}". Interesse detectado sem oferta correspondente.`,
                created_at: new Date().toISOString()
            });
        }

        // 4. CAMADA DE INTELIGÊNCIA (ANÁLISE PREDITIVA) - Otimizada
        const analyzedProducts = (products || []).map(product => {
            const analyzed = SmartInventoryPredictor.analyze(product) as any;

            // Margem Inteligente: Custo Zero de Estoque permite margens agressivas
            const baseMargin = 0.45; // 45% de margem padrão dropshipping premium
            analyzed.estimated_profit = Number((product.price * baseMargin).toFixed(2));

            return analyzed;
        });

        // Configuração de Cache para Performance (Vercel Edge Network)
        const response = NextResponse.json(
            limit ? analyzedProducts.slice(0, Number(limit)) : analyzedProducts,
            {
                headers: {
                    'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=30',
                },
            }
        );

        return response;

    } catch (e: any) {
        console.error('API Products Error:', e);
        return NextResponse.json({ error: 'Quantum Sync Failure' }, { status: 500 });
    }
}

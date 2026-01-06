import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { GLOBAL_PRODUCT_CATALOG, normalize } from '@/lib/globalCatalog';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FLASH SOURCING API v2.3 - "CACHED INTELLIGENCE"
 * ═══════════════════════════════════════════════════════════════════════════════
 * Modelo: INTERMEDIADOR ÁGIL + LOGÍSTICA DE PROXIMIDADE + EDGE CACHING
 * - Detecta região do usuário via IP (Vercel Headers)
 * - Prioriza fornecedores LOCAIS para reduzir custo e tempo de envio
 * - Implementa Cache-Control para performance extrema (Zero Latency)
 * 
 * [ZERO STOCK] | [SMART LOGISTICS] | [AUTO PAYOUT] | [INSTANT YIELD]
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Gera URL de imagem baseada na categoria
function generateProductImage(category: string): string {
    const images: Record<string, string> = {
        'Fotografia': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500',
        'Vídeo': 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=500',
        'Drones': 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500',
        'Smartphones': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500',
        'Gaming': 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500',
        'Informática': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500',
        'Áudio': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500',
        'Wearables': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
        'Casa Inteligente': 'https://images.unsplash.com/photo-1558089687-f282ffcbc126?w=500',
        'Acessórios': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500',
        'Saúde': 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=500',
        'Ferramentas': 'https://images.unsplash.com/photo-1581783898377-1c85bf937427?w=500',
        'Pet': 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=500',
    };
    return images[category] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500';
}

// Busca produtos com inteligência logística
function searchProducts(query: string, userRegion: string): any[] {
    const normalizedQuery = normalize(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

    if (queryWords.length === 0) return [];

    // Pontuação: Keywords + Relevância + PROXIMIDADE
    const scored = GLOBAL_PRODUCT_CATALOG.map(product => {
        let score = 0;
        const productKeywords = product.keywords.map((k: string) => normalize(k));

        // 1. Keyword matching
        for (const word of queryWords) {
            for (const keyword of productKeywords) {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score += 10;
                }
            }
            if (normalize(product.name).includes(word)) {
                score += 5;
            }
        }

        // 2. Logistic Boost (Se fornecedor for da mesma região)
        const isLocal = product.location === userRegion;
        if (isLocal && score > 0) {
            score += 20; // Super Boost para local
        }

        return { ...product, score, is_local: isLocal };
    });

    // Filtra e ordena
    return scored
        .filter(p => p.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, 5)
        .map((p, index) => ({
            id: `flash_${Date.now()}_${index}`,
            name: p.name,
            description: p.description,
            price: p.price,
            original_price: p.original_price,
            category: p.category,
            supplier: p.supplier,
            location: p.location, // Return location to UI
            is_local: p.is_local, // Flag for UI badge
            image_url: generateProductImage(p.category),
            demand_score: 85 + Math.floor(Math.random() * 15),
            profit_margin: 35,
            is_flash: true,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            stock_model: 'ZERO_INVENTORY',
            delivery_estimate: p.is_local ? '1-3 dias (Expresso)' : '7-15 dias (Nacional)'
        }));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    // Vercel Geolocation Headers
    const city = request.headers.get('x-vercel-ip-city') || 'São Paulo';
    const region = request.headers.get('x-vercel-ip-country-region') || 'SP';

    if (!query || query.length < 2) {
        return NextResponse.json({
            products: [],
            message: 'Digite pelo menos 2 caracteres',
            source: 'none'
        });
    }

    const supabase = getSupabase();

    // Busca com Inteligência Logística
    const flashProducts = searchProducts(query, region);

    // HEADERS DE CACHE PARA PERFORMANCE EXTREMA
    const headers = {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300'
    };

    if (flashProducts.length > 0) {
        // Log "Fire-and-Forget": Não damos await para não bloquear a resposta
        // Em Vercel Edge/Serverless, isso pode ser cortado se a função terminar muito rápido,
        // mas é um trade-off aceitável para performance. Para garantias, usamos `waitUntil`.
        if (supabase) {
            // Nota: Para logs críticos, usaríamos p-retry ou waitUntil. Aqui é analytics.
            void supabase.from('logs').insert({
                type: 'flash_sourcing_logistics',
                message: `🚚 LOGISTICS: Busca "${query}" (${city}-${region}) → ${flashProducts.length} produtos. Local Matches: ${flashProducts.filter(p => p.is_local).length}`,
                created_at: new Date().toISOString()
            });
        }

        return NextResponse.json({
            products: flashProducts,
            count: flashProducts.length,
            source: 'flash_global',
            user_location: { city, region },
            message: `${flashProducts.length} produto(s) encontrados. Priorizando fornecedores próximos de ${region}.`,
            expires_in: '24 horas'
        }, { headers });
    }

    // Nada encontrado
    if (supabase) {
        void supabase.from('logs').insert({
            type: 'demand_miss',
            message: `🔍 DEMANDA: Busca "${query}" sem match.`,
            created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
        products: [],
        count: 0,
        source: 'none',
        message: `Nenhum produto encontrado para "${query}".`
    }, { headers });
}

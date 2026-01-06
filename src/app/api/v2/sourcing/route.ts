import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { GLOBAL_PRODUCT_CATALOG, normalize } from '@/lib/globalCatalog';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FLASH SOURCING API v2.1 - "INSTANT GLOBAL BRIDGE"
 * ═══════════════════════════════════════════════════════════════════════════════
 * Modelo: INTERMEDIADOR ÁGIL
 * - Busca instantânea em fornecedores globais (via LIB compartilhada)
 * - Retorna produtos prontos para venda IMEDIATA
 * - Produtos temporários (entram e saem do sistema)
 * - Foco: RENDIMENTO A CURTO PRAZO
 * 
 * [ZERO STOCK] | [FLASH PRODUCTS] | [AUTO PAYOUT] | [INSTANT YIELD]
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

// Busca produtos que correspondem à query
function searchProducts(query: string): any[] {
    const normalizedQuery = normalize(query);
    const queryWords = normalizedQuery.split(/\s+/).filter(w => w.length > 2);

    if (queryWords.length === 0) return [];

    // Pontua cada produto baseado em quantas keywords batem
    const scored = GLOBAL_PRODUCT_CATALOG.map(product => {
        let score = 0;
        const productKeywords = product.keywords.map((k: string) => normalize(k));

        for (const word of queryWords) {
            for (const keyword of productKeywords) {
                if (keyword.includes(word) || word.includes(keyword)) {
                    score += 10;
                }
            }
            // Bonus se aparece no nome
            if (normalize(product.name).includes(word)) {
                score += 5;
            }
        }

        return { ...product, score };
    });

    // Filtra e ordena por relevância
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
            image_url: generateProductImage(p.category),
            demand_score: 85 + Math.floor(Math.random() * 15),
            profit_margin: 35,
            is_flash: true,
            expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24h
            stock_model: 'ZERO_INVENTORY',
            delivery_estimate: '7-15 dias úteis'
        }));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({
            products: [],
            message: 'Digite pelo menos 2 caracteres',
            source: 'none'
        });
    }

    const supabase = getSupabase();

    // BUSCA INSTANTÂNEA nos fornecedores globais
    const flashProducts = searchProducts(query);

    if (flashProducts.length > 0) {
        // Log da oportunidade de venda (fire and forget)
        if (supabase) {
            void supabase.from('logs').insert({
                type: 'flash_sourcing',
                message: `⚡ FLASH: Busca "${query}" → ${flashProducts.length} produtos prontos para venda imediata.`,
                created_at: new Date().toISOString()
            });
        }

        return NextResponse.json({
            products: flashProducts,
            count: flashProducts.length,
            source: 'flash_global',
            message: `${flashProducts.length} produto(s) disponíveis para venda imediata`,
            expires_in: '24 horas'
        });
    }

    // Nada encontrado
    if (supabase) {
        void supabase.from('logs').insert({
            type: 'demand_miss',
            message: `🔍 DEMANDA: Busca "${query}" sem match. Oportunidade de sourcing.`,
            created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
        products: [],
        count: 0,
        source: 'none',
        message: `Nenhum produto encontrado para "${query}". Tente outras palavras-chave.`
    });
}

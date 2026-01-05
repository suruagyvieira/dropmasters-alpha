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
        return NextResponse.json({ error: 'Database connection not available' }, { status: 500 });
    }

    try {
        // AUTO-SEED: Só verifica se o banco está vazio uma vez por ciclo de vida da instância
        if (!isSeeded) {
            const { count, error: countError } = await supabase
                .from('products')
                .select('id', { count: 'exact', head: true });

            if (!countError && count === 0) {
                console.log('🌱 AUTO-SEED: Banco vazio detectado. Populando catálogo real...');
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

                await supabase.from('products').insert(seedData);
            }
            isSeeded = true;
        }

        // 2. BUSCA AUTOMATIZADA NO BANCO - Otimizada selecionando apenas colunas necessárias
        let query = supabase.from('products').select('id, name, price, description, category, image_url, demand_score, is_viral, original_price');

        if (search) {
            query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }

        const { data: products, error: queryError } = await query;

        if (queryError) throw queryError;

        // 3. LOG DE DEMANDA (Para produtos não encontrados - Automação de Repasse de Interesse)
        if (search && (!products || products.length === 0)) {
            await supabase.from('logs').insert({
                type: 'demand_miss',
                message: `AUTOMAÇÃO DE BUSCA: Cliente interessado em "${search}", mas não temos no catálogo real. Providenciar sourcing.`,
                created_at: new Date().toISOString()
            });
        }

        // 4. CAMADA DE INTELIGÊNCIA (ANÁLISE PREDITIVA)
        const analyzedProducts = (products || []).map(product => {
            const analyzed = SmartInventoryPredictor.analyze(product) as any;

            // Precificação Dinâmica
            if (analyzed.analysis.action === 'increase_price') {
                analyzed.price = Number((analyzed.price * 1.1).toFixed(2));
            }
            if (analyzed.analysis.action === 'discount') {
                analyzed.price = Number((analyzed.price * 0.9).toFixed(2));
            }

            // Simulação de Margem de Lucro Real (Foco Rendimento Curto Prazo)
            const baseMargin = 35;
            const demandBonus = (product.demand_score || 50) / 10;
            analyzed.profit_margin = Number((baseMargin + demandBonus).toFixed(0));

            return analyzed;
        });

        const recommend = searchParams.get('recommend');

        if (recommend === 'true') {
            const recommended = [...analyzedProducts]
                .sort((a, b) => (b.demand_score * 1.5 + b.price / 10) - (a.demand_score * 1.5 + a.price / 10))
                .slice(0, 5);
            return NextResponse.json(recommended);
        }

        analyzedProducts.sort((a, b) => (b.demand_score || 0) - (a.demand_score || 0));

        const result = limit ? analyzedProducts.slice(0, Number(limit)) : analyzedProducts;

        return NextResponse.json(result);

    } catch (e: any) {
        console.error('API Products Error:', e);
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

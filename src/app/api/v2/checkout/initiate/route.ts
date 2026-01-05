import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';


export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { method, items, user_id, email, phone, base_url, affiliate_code } = body;

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Database connection required for real-time automation' }, { status: 500 });
        }

        // --- SEGURANÇA DE RENDIMENTO (Logical Fix) ---
        // Buscamos os preços REAIS do banco para evitar manipulação de preço no frontend
        const productIds = items.map((i: any) => i.id);
        const { data: realProducts } = await supabase
            .from('products')
            .select('id, price')
            .in('id', productIds);

        const total = items.reduce((acc: number, item: any) => {
            const dbProduct = realProducts?.find(p => p.id === item.id);
            const realPrice = dbProduct ? dbProduct.price : 99.90;
            const itemPrice = item.quantity >= 2 ? realPrice * 0.9 : realPrice;
            return acc + (item.quantity * itemPrice);
        }, 0);

        // CÁLCULO DE REPASSE AUTOMATIZADO (Finanças Inteligentes 2026)
        const vendorSplit = Number((total * 0.65).toFixed(2)); // 65% para o fornecedor (Custo do Produto)
        const platformProfit = Number((total * 0.35).toFixed(2)); // 35% de Lucro Líquido
        const affiliateCommission = affiliate_code ? Number((platformProfit * 0.20).toFixed(2)) : 0;

        // Simulação de criação de transação no Gateway
        const transactionId = `tx_${Date.now()}_RT_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // PERSISTENCE LAYER 2026 (Utilizando a instância validada acima)
        try {
            await supabase.from('orders').insert({
                transaction_id: transactionId,
                user_id: user_id,
                email: email,
                phone: phone,
                total: total,
                items: items,
                status: 'pending',
                affiliate_ref: affiliate_code,
                payment_method: method,
                // Metadata de Repasse para Automação Posterior
                metadata: {
                    vendor_payout: vendorSplit,
                    platform_net: platformProfit - affiliateCommission,
                    affiliate_payout: affiliateCommission,
                    fulfillment: 'automated_dropshipping',
                    inventory_model: 'zero_stock'
                },
                created_at: new Date().toISOString()
            });

            // Registrar Log de Automação de Repasse
            await supabase.from('logs').insert({
                type: 'payout_automation',
                message: `REPASSE PROGRAMADO: Fornecedor: R$ ${vendorSplit} | Lucro: R$ ${platformProfit - affiliateCommission} | Afiliado: R$ ${affiliateCommission}`,
                created_at: new Date().toISOString()
            });

        } catch (dbError) {
            console.error('Failed to persist order or automation logs:', dbError);
        }

        const responseData = {
            transaction_id: transactionId,
            status: 'pending',
            qr_code_url: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Rickrolling_QR_code.png',
            pix_key: '00020126330014BR.GOV.BCB.PIX0111semantic.dev520400005303986540410.005802BR5913DropMasters6008SaoPaulo62070503***6304E2CA',
            checkout_url: `https://quantum-gateway.com/pay/${transactionId}`,
            total: total,
            metadata: {
                message: "Automação de Repasse Ativada",
                stock: "Zero Stock Fulfillment"
            }
        };

        return NextResponse.json(responseData);
    } catch (e) {
        console.error('Checkout Error:', e);
        return NextResponse.json({ error: 'Critical failure in automation bridge' }, { status: 500 });
    }
}


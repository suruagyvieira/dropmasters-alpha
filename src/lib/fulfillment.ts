import { getSupabase } from './supabase';

export interface FulfillmentOrder {
    order_id: string;
    items: any[];
    customer: {
        email: string;
        phone?: string;
        name?: string;
    };
    total: number;
}

export class FulfillmentEngine {
    /**
     * BRAIN-CENTRAL: Fulfillment Engine 2026
     * Optimized for: [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO]
     */
    static async process(transaction_id: string) {
        const supabase = getSupabase();
        if (!supabase) return false;

        try {
            // 1. DATA ACQUISITION & VALIDATION (Performance: Single Row Fetch)
            const { data: order, error } = await supabase
                .from('orders')
                .select('*')
                .eq('transaction_id', transaction_id)
                .single();

            if (error || !order) {
                console.error('Order missing for bridge process:', transaction_id);
                return false;
            }

            // CRITICAL LOGICAL FIX: Prevenção de dupla execução / Fulfillment Idempotency
            if (order.status !== 'paid' || order.metadata?.fulfillment_triggered === true) {
                console.log(`[BRIDGE] Skip: Order ${transaction_id} not eligible or already triggered.`);
                return true;
            }

            // 2. WEBHOOK CONFIGURATION (Keep Existing ENV Variables)
            const WEBHOOK_URL = process.env.FULFILLMENT_WEBHOOK_URL;

            const payload = {
                version: 'v8.9-sentient',
                timestamp: new Date().toISOString(),
                order_data: {
                    id: order.transaction_id,
                    total: order.total,
                    items: order.items,
                    payout_split: order.metadata?.vendor_payout,
                    shipping: order.metadata?.shipping_address || 'pendente_preenchimento'
                },
                strategy: 'zero_inventory_autodispatch'
            };

            // 3. PERFORMANCE OPTIMIZATION: Fetch with Timeout & AbortController
            // Evita que a Serverless Function gaste tempo (e custo) travada em conexões lentas
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 segundos de limite

            if (WEBHOOK_URL) {
                try {
                    const response = await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });
                    clearTimeout(timeoutId);

                    if (response.ok) {
                        // Atualiza a ordem marcando o disparo de automação para segurança
                        await supabase.from('orders').update({
                            metadata: { ...order.metadata, fulfillment_triggered: true }
                        }).eq('id', order.id);

                        await supabase.from('logs').insert({
                            type: 'system',
                            message: `🔥 AUTOMAÇÃO REAL: Pedido ${transaction_id} enviado ao braço logístico.`,
                            created_at: new Date().toISOString()
                        });
                        return true;
                    }
                } catch (webhookErr: any) {
                    if (webhookErr.name === 'AbortError') {
                        console.error('Fulfillment Webhook Timeout');
                    }
                    console.error('Bridge Connection Error:', webhookErr);
                }
            }

            // 4. FALLBACK LOGIC (Zero Stock Mode)
            // Caso não haja webhook, o sistema mantém o repasse em segurança no dashboard admin
            await supabase.from('logs').insert({
                type: 'system',
                message: `🤖 VIRTUAL DISPATCH: Pedido ${transaction_id} agendado para processamento manual (Autônomo).`,
                created_at: new Date().toISOString()
            });

            return true;
        } catch (e) {
            console.error('Fulfillment Logic Failure:', e);
            return false;
        }
    }
}

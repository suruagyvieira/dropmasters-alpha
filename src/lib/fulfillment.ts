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
     * Dispara a automação de fulfillment (Estoque Zero)
     * Pode ser conectado via Webhook com Dropi, DSers ou scripts personalizados.
     */
    static async process(transaction_id: string) {
        const supabase = getSupabase();
        if (!supabase) return false;

        try {
            // 1. Coleta os dados completos da ordem
            const { data: order, error } = await supabase
                .from('orders')
                .select('*')
                .eq('transaction_id', transaction_id)
                .single();

            if (error || !order) {
                console.error('Order not found for fulfillment:', transaction_id);
                return false;
            }

            // 2. Verifica se já existe um Webhook configurado na Vercel
            const WEBHOOK_URL = process.env.FULFILLMENT_WEBHOOK_URL;

            const payload = {
                source: 'DropMasters_Alpha_V2026',
                event: 'order.paid',
                data: {
                    id: order.transaction_id,
                    external_id: order.id,
                    amount: order.total,
                    items: order.items,
                    shipping_address: order.metadata?.shipping_address || {},
                    customer: {
                        email: order.email,
                        phone: order.phone
                    },
                    automation_payout: order.metadata?.vendor_payout
                }
            };

            // 3. Se houver Webhook, dispara o sinal real
            if (WEBHOOK_URL) {
                try {
                    const response = await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload)
                    });

                    if (response.ok) {
                        await supabase.from('logs').insert({
                            type: 'system',
                            message: `FULFILLMENT REAL: Ordem ${transaction_id} enviada via Webhook externo com sucesso.`,
                            created_at: new Date().toISOString()
                        });
                        return true;
                    }
                } catch (webhookErr) {
                    console.error('Failed to dispatch webhook:', webhookErr);
                }
            }

            // 4. Fallback: Log de Simulação/Repasse Interno (Custo Zero)
            await supabase.from('logs').insert({
                type: 'system',
                message: `AUTOMAÇÃO DE FILA: Ordem ${transaction_id} aguardando processamento em lote (Batch Mode).`,
                created_at: new Date().toISOString()
            });

            return true;
        } catch (e) {
            console.error('Fulfillment Critical Error:', e);
            return false;
        }
    }
}

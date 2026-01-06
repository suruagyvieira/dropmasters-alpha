import { getSupabase } from './supabase';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * FULFILLMENT ENGINE v9.0 - "NEURAL BRIDGE"
 * ═══════════════════════════════════════════════════════════════════════════════
 * Core Principles:
 *   [ZERO STOCK]      → Não há inventário físico. O produto vai direto do fornecedor ao cliente.
 *   [AUTO PAYOUT]     → Cálculo automático de repasse (65% fornecedor / 35% lucro).
 *   [COST ZERO]       → Sem infraestrutura extra. Serverless puro.
 *   [SHORT-TERM YIELD]→ Otimizado para gerar receita imediata.
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export interface FulfillmentPayload {
    version: string;
    timestamp: string;
    order_data: {
        id: string;
        total: number;
        items: any[];
        payout_split: number;
        net_profit: number;
        shipping: any;
        customer: {
            email: string;
            phone?: string;
        };
    };
    strategy: string;
}

// Performance: Timeout padrão para conexões externas (evita custo de função travada)
const WEBHOOK_TIMEOUT_MS = 6000;

export class FulfillmentEngine {
    /**
     * Processa o fulfillment de uma ordem paga.
     * Idempotente: Não processa a mesma ordem duas vezes.
     */
    static async process(transaction_id: string): Promise<boolean> {
        // LAZY INIT: Só conecta ao Supabase se necessário
        const supabase = getSupabase();
        if (!supabase) {
            console.warn('[BRIDGE] Supabase offline. Fulfillment skipped.');
            return false;
        }

        let timeoutId: ReturnType<typeof setTimeout> | null = null;

        try {
            // ─────────────────────────────────────────────────────────────────
            // 1. DATA ACQUISITION (Performance: Select only needed columns)
            // ─────────────────────────────────────────────────────────────────
            const { data: order, error } = await supabase
                .from('orders')
                .select('id, transaction_id, total, items, email, phone, status, metadata')
                .eq('transaction_id', transaction_id)
                .single();

            if (error || !order) {
                console.error(`[BRIDGE] Order not found: ${transaction_id}`);
                return false;
            }

            // ─────────────────────────────────────────────────────────────────
            // 2. IDEMPOTENCY GUARD (Critical Logical Fix)
            //    Previne dupla execução em cenários de retry/webhook duplicado.
            // ─────────────────────────────────────────────────────────────────
            if (order.status !== 'paid') {
                console.log(`[BRIDGE] Order ${transaction_id} not paid yet. Skipping.`);
                return false;
            }
            if (order.metadata?.fulfillment_triggered === true) {
                console.log(`[BRIDGE] Order ${transaction_id} already processed. Idempotent skip.`);
                return true; // Retorna true pois não é um erro, apenas já foi feito.
            }

            // ─────────────────────────────────────────────────────────────────
            // 3. PROFIT CALCULATION (Zero Stock Model)
            //    Lucro líquido = 35% do total. Repasse ao fornecedor = 65%.
            // ─────────────────────────────────────────────────────────────────
            const vendorPayout = order.metadata?.vendor_payout ?? Number((order.total * 0.65).toFixed(2));
            const netProfit = Number((order.total - vendorPayout).toFixed(2));

            // ─────────────────────────────────────────────────────────────────
            // 4. BUILD PAYLOAD (Estrutura para Webhook Externo)
            // ─────────────────────────────────────────────────────────────────
            const payload: FulfillmentPayload = {
                version: 'v9.0-neural-bridge',
                timestamp: new Date().toISOString(),
                order_data: {
                    id: order.transaction_id,
                    total: order.total,
                    items: order.items,
                    payout_split: vendorPayout,
                    net_profit: netProfit,
                    shipping: order.metadata?.shipping_address || null,
                    customer: {
                        email: order.email,
                        phone: order.phone
                    }
                },
                strategy: 'zero_inventory_autodispatch'
            };

            // ─────────────────────────────────────────────────────────────────
            // 5. WEBHOOK DISPATCH (Com Timeout para Performance)
            // ─────────────────────────────────────────────────────────────────
            const WEBHOOK_URL = process.env.FULFILLMENT_WEBHOOK_URL;

            if (WEBHOOK_URL) {
                const controller = new AbortController();
                timeoutId = setTimeout(() => controller.abort(), WEBHOOK_TIMEOUT_MS);

                try {
                    const response = await fetch(WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                        signal: controller.signal
                    });

                    if (timeoutId) clearTimeout(timeoutId);

                    if (response.ok) {
                        // Marca como processado para idempotência
                        await supabase.from('orders').update({
                            metadata: { ...order.metadata, fulfillment_triggered: true, dispatched_at: new Date().toISOString() }
                        }).eq('id', order.id);

                        await supabase.from('logs').insert({
                            type: 'system',
                            message: `🚀 FULFILLMENT REAL: Pedido ${transaction_id} despachado. Lucro: R$ ${netProfit}.`,
                            created_at: new Date().toISOString()
                        });
                        return true;
                    } else {
                        console.error(`[BRIDGE] Webhook failed with status: ${response.status}`);
                    }
                } catch (fetchErr: any) {
                    if (timeoutId) clearTimeout(timeoutId);
                    if (fetchErr.name === 'AbortError') {
                        console.error('[BRIDGE] Webhook timeout exceeded.');
                    } else {
                        console.error('[BRIDGE] Webhook fetch error:', fetchErr.message);
                    }
                }
            }

            // ─────────────────────────────────────────────────────────────────
            // 6. FALLBACK: MANUAL QUEUE (Custo Zero)
            //    Se não há webhook ou ele falhou, registra para processamento manual.
            // ─────────────────────────────────────────────────────────────────
            await supabase.from('orders').update({
                metadata: { ...order.metadata, awaiting_manual_fulfillment: true }
            }).eq('id', order.id);

            await supabase.from('logs').insert({
                type: 'system',
                message: `📦 FILA MANUAL: Pedido ${transaction_id} aguardando despacho. Lucro potencial: R$ ${netProfit}.`,
                created_at: new Date().toISOString()
            });

            return true;

        } catch (e: any) {
            if (timeoutId) clearTimeout(timeoutId);
            console.error('[BRIDGE] Critical failure:', e.message);
            return false;
        }
    }
}


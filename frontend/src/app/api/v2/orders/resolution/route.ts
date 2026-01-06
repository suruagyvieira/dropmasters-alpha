import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { getReturnAddress } from '@/lib/logistics';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * ORDER RESOLUTION ENGINE v3.0 - "AUTOMATED RMA & NETTING"
 * ═══════════════════════════════════════════════════════════════════════════════
 * Lógica:
 * 1. Cliente solicita devolução.
 * 2. Sistema gera etiqueta direto para o FORNECEDOR (Zero Estoque).
 * 3. Sistema calcula "Supplier Debt" (Netting) para abater do próximo repasse.
 * 
 * [AUTO-APPROVE] | [REVERSE LOGISTICS] | [FINANCIAL RECOVERY]
 * ═══════════════════════════════════════════════════════════════════════════════
 */

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_id, reason, action, evidence_url } = body;

        if (!order_id || !action) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Database connection required' }, { status: 500 });
        }

        // 1. Fetch Order Data
        const { data: order, error } = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .single();

        if (error || !order) {
            return NextResponse.json({ error: 'Order not found' }, { status: 404 });
        }

        // 2. Validate Eligibility (Automated Rule: 7 Days)
        const deliveryDate = new Date(order.created_at); // Simulating delivery = creation + 7 days
        deliveryDate.setDate(deliveryDate.getDate() + 7);
        const now = new Date();
        const daysSinceDelivery = Math.floor((now.getTime() - deliveryDate.getTime()) / (1000 * 3600 * 24));

        // Se passou de 30 dias, bloqueia (Regra de negócio)
        if (daysSinceDelivery > 30) {
            return NextResponse.json({
                error: 'Return window expired. Contact support.',
                window_days: 30,
                days_passed: daysSinceDelivery
            }, { status: 400 });
        }

        // 3. LOGIC: RETURN REQUEST
        if (action === 'request_return') {
            // A. Get Supplier Info for Reverse Logistics
            // Fallback to SP if location is missing in older orders
            const itemLocation = order.items && order.items[0] ? order.items[0].location || 'SP' : 'Global';
            const returnHub = getReturnAddress(itemLocation);

            // B. Financial Netting Calculation
            // We refund 100% to user, but we must recover 65% (cost) from supplier
            const refundAmount = Number(order.total);
            const supplierDebt = Number((refundAmount * 0.65).toFixed(2));

            // C. Execute Database Updates (Parallel)
            await Promise.all([
                // Update Order Status
                supabase.from('orders').update({
                    status: 'return_requested',
                    metadata: {
                        ...order.metadata,
                        return_reason: reason,
                        return_tracking: `REV-${order.transaction_id}`,
                        supplier_debt: supplierDebt // Tagging debt for payout system
                    }
                }).eq('id', order_id),

                // Log the Financial Event (Netting)
                supabase.from('logs').insert({
                    type: 'financial_netting',
                    message: `📉 RMA OPENED: Order #${order_id}. Refund: R$${refundAmount}. ALERT: Deduct R$${supplierDebt} from Supplier [${order.items[0]?.supplier || 'Unknown'}] in next payout.`,
                    created_at: new Date().toISOString()
                })
            ]);

            // D. Generate Return Label (Simulated)
            return NextResponse.json({
                success: true,
                message: 'Return authorized. Print your label.',
                status: 'return_authorized',
                rma_code: `RMA-${order.transaction_id.slice(-6)}`,
                return_label: {
                    carrier: 'Loggi Reverse',
                    tracking_code: `REV-${Math.floor(Math.random() * 1000000)}`,
                    recipient: returnHub.name,
                    address: returnHub.address,
                    city: returnHub.city,
                    state: returnHub.state,
                    zip: returnHub.zip,
                    instructions: 'Cole esta etiqueta na caixa e despache em qualquer agência parceira.'
                },
                financial_summary: {
                    user_refund: refundAmount,
                    platform_loss: 0, // Recoverable via supplier debt
                    supplier_debit: supplierDebt
                }
            });
        }

        // 4. LOGIC: INSTANT REFUND (No Return Needed - for low value or errors)
        if (action === 'instant_refund') {
            // Only for admins or specific rules
            // ... (Simple status update)
            await supabase.from('orders').update({
                status: 'refunded'
            }).eq('id', order_id);

            return NextResponse.json({ success: true, status: 'refunded' });
        }

        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

    } catch (e: any) {
        console.error('[RESOLUTION] Error:', e.message);
        return NextResponse.json({ error: 'Resolution failed' }, { status: 500 });
    }
}

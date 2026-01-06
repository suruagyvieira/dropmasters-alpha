import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { FulfillmentEngine } from '@/lib/fulfillment';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { transaction_id, status } = body;

        if (status === 'paid') {
            const supabase = getSupabase();
            if (!supabase) return NextResponse.json({ error: 'Database offline' }, { status: 500 });

            // IDEMPOTENCY CORE: Tentamos atualizar apenas se NÃO for 'paid' ainda
            const { data: updatedOrder, error: updateError } = await supabase
                .from('orders')
                .update({ status: 'paid', paid_at: new Date().toISOString() })
                .eq('transaction_id', transaction_id)
                .neq('status', 'paid')
                .select()
                .single();

            if (updateError) {
                const { data: currentOrder } = await supabase
                    .from('orders')
                    .select('status, total')
                    .eq('transaction_id', transaction_id)
                    .single();

                if (currentOrder?.status === 'paid') {
                    return NextResponse.json({ success: true, message: 'Payment already processed.' });
                }

                console.error(`❌ Erro no callback de pagamento: ${transaction_id}`, updateError);
                return NextResponse.json({ error: 'Order failed' }, { status: 404 });
            }

            // --- PROFIT SAFEGUARD ---
            const totalValue = updatedOrder?.total || 0;

            // Log de Receita Real
            await supabase.from('logs').insert({
                type: 'revenue',
                message: `✅ PAGAMENTO CONFIRMADO: R$ ${totalValue} via ${updatedOrder?.payment_method || 'PIX'}.`,
                created_at: new Date().toISOString()
            });

            // --- AUTOMATION CORE: Acionando o Motor de Fulfillment ---
            await FulfillmentEngine.process(transaction_id);

            return NextResponse.json({ success: true, message: 'Payment confirmed and automation triggered.' });
        }

        return NextResponse.json({ success: false, message: 'Status not paid' });
    } catch (e) {
        console.error('Callback critical failure:', e);
        return NextResponse.json({ error: 'Callback processing failed' }, { status: 500 });
    }
}

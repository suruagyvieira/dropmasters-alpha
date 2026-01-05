import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { order_id, user_id, reason, type } = body; // type: 'return' | 'refund' | 'exchange'

        const supabase = getSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Database connection offline' }, { status: 500 });
        }

        // 1. BUSCAR PEDIDO ORIGINAL
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .select('*')
            .eq('id', order_id)
            .eq('user_id', user_id)
            .single();

        if (orderError || !order) {
            return NextResponse.json({ error: 'Pedido não encontrado na rede' }, { status: 404 });
        }

        // 2. LÓGICA CRÍTICA DE TEMPO (7 DIAS ÚTEIS)
        const orderDate = new Date(order.created_at);
        const now = new Date();

        // Simulação de cálculo de dias úteis (simplificado para 10 dias corridos ~ 7 úteis)
        const diffTime = Math.abs(now.getTime() - orderDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays > 10) { // Aproximadamente 7 dias úteis
            return NextResponse.json({
                error: 'Prazo de 7 dias úteis expirado.',
                message: 'A política de intermediação garante proteção apenas nos primeiros 7 dias após o recebimento/compra.'
            }, { status: 403 });
        }

        // 3. LÓGICA DE INTERMEDIAÇÃO (DROPSHIPPING)
        // O sistema não detém o produto, então "abre um chamado" entre cliente e fornecedor.

        const resolutionId = `RES_${Date.now()}_${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

        // Atualizar o status do pedido para 'in_resolution' (Intermediação Ativa)
        await supabase.from('orders').update({
            status: 'in_resolution',
            metadata: {
                ...order.metadata,
                resolution: {
                    id: resolutionId,
                    type,
                    reason,
                    opened_at: new Date().toISOString(),
                    status: 'awaiting_supplier_response',
                    note: 'PLATAFORMA ATUANDO COMO INTERMEDIADORA'
                }
            }
        }).eq('id', order_id);

        // REGISTRAR LOG DE DISPUTA PARA O ADMIN/FORNECEDOR
        await supabase.from('logs').insert({
            type: 'order_dispute',
            message: `INTERMEDIAÇÃO SOLICITADA: Pedido ${order_id} | Tipo: ${type} | Motivo: ${reason}. Notificando fornecedor para logística reversa.`,
            created_at: new Date().toISOString()
        });

        return NextResponse.json({
            success: true,
            resolution_id: resolutionId,
            message: 'Solicitação de intermediação aberta com sucesso. O fornecedor será notificado para processar a devolução/reembolso.',
            policy_note: 'Lembre-se: Somos apenas intermediadores. Garantimos o repasse do seu reembolso assim que o fornecedor confirmar o recebimento do item em condições originais.'
        });

    } catch (e) {
        console.error('Resolution API Error:', e);
        return NextResponse.json({ error: 'Falha crítica no bridge de resolução' }, { status: 500 });
    }
}

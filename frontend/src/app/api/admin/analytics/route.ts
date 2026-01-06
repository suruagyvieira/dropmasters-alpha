import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAdminAuthorized } from '@/lib/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: 'Unauthorized Access Denied' }, { status: 401 });
    }

    const supabase = getSupabase();

    if (!supabase) {
        return NextResponse.json({
            revenue: 0,
            profit: 0,
            conversions: '0%',
            ai_status: { mood: 'OFFLINE', velocity: '0%', last_pivot: 'N/A' },
            logs: []
        });
    }

    try {
        // 1. Calculate Real Revenue & Profit from Paid Orders
        const { data: orders, error: ordersError } = await supabase
            .from('orders')
            .select('total, created_at')
            .eq('status', 'paid');

        const totalRevenue = orders?.reduce((acc, order) => acc + (Number(order.total) || 0), 0) || 0;
        const totalProfit = totalRevenue * 0.3; // 30% Margin Estimation based on Dropshipping Standards

        // 2. Fetch Real System Logs
        const { data: logs, error: logsError } = await supabase
            .from('logs')
            .select('type, message, created_at')
            .order('created_at', { ascending: false })
            .limit(20);

        // 3. AI Status Logic (Based on Real Activity, not random)
        const orderCount = orders?.length || 0;
        const mood = orderCount > 10 ? 'EUPHORIC' : (orderCount > 0 ? 'FOCUSED' : 'WAITING');
        const velocity = (orderCount * 10) + '%'; // Velocity based on volume

        return NextResponse.json({
            revenue: totalRevenue,
            profit: totalProfit,
            conversions: orderCount > 0 ? 'Active' : '0%',
            ai_status: {
                mood: mood,
                velocity: velocity,
                last_pivot: 'Real-time'
            },
            logs: logs || []
        });

    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }
}

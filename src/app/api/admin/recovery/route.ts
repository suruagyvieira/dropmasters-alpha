import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';
import { isAdminAuthorized } from '@/lib/auth';

export async function GET() {
    if (!(await isAdminAuthorized())) {
        return NextResponse.json({ error: 'Unauthorized Access Denied' }, { status: 401 });
    }
    try {
        const supabase = getSupabase();

        if (supabase) {
            const { data, error } = await supabase
                .from('checkouts')
                .select('*')
                .eq('status', 'abandoned')
                .order('created_at', { ascending: false })
                .limit(20);

            if (error) {
                return NextResponse.json({ error: error.message }, { status: 500 });
            }

            return NextResponse.json(data || []);
        } else {
            return NextResponse.json({ error: 'Database not configured' }, { status: 500 });
        }

    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}

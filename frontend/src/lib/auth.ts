import { headers } from 'next/headers';

export async function isAdminAuthorized(): Promise<boolean> {
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    const adminSecret = process.env.ADMIN_SECRET || 'dropmasters_2026_sentient_core';

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return false;
    }

    const token = authHeader.split(' ')[1];
    return token === adminSecret;
}

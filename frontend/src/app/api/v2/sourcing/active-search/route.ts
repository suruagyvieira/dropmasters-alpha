import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get('q');

    const backendUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

    try {
        const response = await fetch(`${backendUrl}/api/v2/sourcing/active-search?q=${encodeURIComponent(q || '')}`, {
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error) {
        console.error('Active Sourcing Proxy Error:', error);
        return NextResponse.json({ products: [], message: 'Erro ao conectar com o motor de busca.' }, { status: 500 });
    }
}

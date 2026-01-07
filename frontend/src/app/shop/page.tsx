import React from 'react';
import { getSupabase } from '@/lib/supabase';
import ShopClient from './ShopClient';
import { Product } from '@/lib/products';

// SSG/ISR Optimization: Revalidate every 60 seconds (High performance, low server cost)
export const revalidate = 60;

export default async function ShopPage() {
    let initialProducts: Product[] = [];

    try {
        const supabase = getSupabase();
        if (supabase) {
            // Fetch real products directly during build/request for SSG
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('demand_score', { ascending: false })
                .limit(20);

            if (!error && data) {
                initialProducts = data as Product[];
            }
        }
    } catch (e: any) {
        console.error("Critical: Failed to pre-render products:", e);
    }

    return (
        <div className="container section">
            <div style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div className="animate-fade-in">
                    <h1 style={{ marginBottom: '0.5rem' }}>Catálogo de Ofertas</h1>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '600px', fontSize: '1.1rem' }}>
                        Produtos selecionados com envio imediato e garantia total. <br />
                        <span style={{ color: 'var(--success)', fontSize: '0.85rem', fontWeight: 'bold' }}>● Estoque Disponível no Brasil</span>
                    </p>
                </div>
            </div>

            <React.Suspense fallback={
                <div className="grid-main">
                    {[1, 2, 3, 4, 5, 6].map(i => (
                        <div key={i} className="glass" style={{ height: '400px', animation: 'pulse 2s infinite' }}></div>
                    ))}
                </div>
            }>
                <ShopClient initialProducts={initialProducts} />
            </React.Suspense>
        </div>
    );
}


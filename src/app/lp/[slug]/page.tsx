import React from 'react';
import { getSupabase } from '@/lib/supabase';
import LandingPageClient from './LandingPageClient';
import { notFound } from 'next/navigation';

export const revalidate = 900; // updates every 15 min

export async function generateStaticParams() {
    const supabase = getSupabase();
    if (!supabase) return [];

    const { data: products } = await supabase.from('products').select('name');

    return (products || []).map((p: any) => ({
        slug: p.name.toLowerCase().replace(/ /g, '-')
    }));
}

export default async function LandingPage({ params }: { params: { slug: string } }) {
    const { slug } = params;
    const supabase = getSupabase();

    if (!supabase) return <div>Database configuration error.</div>;

    // Fetch product details on server
    const { data: products } = await supabase.from('products').select('*');
    const product = products?.find((item: any) =>
        item.name.toLowerCase().replace(/ /g, '-') === slug
    );

    if (!product) {
        notFound();
    }

    return <LandingPageClient product={product} />;
}


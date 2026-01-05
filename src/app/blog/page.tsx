import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Sparkles, TrendingUp } from 'lucide-react';
import { getSupabase } from '@/lib/supabase';

export const revalidate = 300; // 5 min background revalidation

export default async function Blog() {
    let posts: any[] = [];

    try {
        const supabase = getSupabase();
        if (supabase) {
            const { data } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
            if (data) posts = data;
        }
    } catch (e) {
        console.error("AI Blog Engine Pre-render Offline");
    }

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 className="cyber-glitch" data-text="AI INSIGHTS">AI INSIGHTS</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Conteúdo gerado autonomamente para dominar o tráfego orgânico.</p>
                </div>
                <div className="glass" style={{ padding: '10px 20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={18} color="var(--primary)" />
                    <span style={{ fontSize: '0.7rem', fontWeight: '900' }}>SEO ENGINE v8.5</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
                {posts.length > 0 ? posts.map((post, i) => (
                    <div key={i} className="glass card-hover" style={{ overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ position: 'relative', height: '200px', width: '100%', overflow: 'hidden' }}>
                            <Image src={post.image_url} alt={post.title} fill style={{ objectFit: 'cover' }} />
                        </div>
                        <div style={{ padding: '2rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <span style={{ color: 'var(--primary)', fontSize: '0.7rem', fontWeight: '900' }}>
                                    {new Date(post.created_at).toLocaleDateString()}
                                </span>
                                <span style={{ color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: '900' }}>TENDÊNCIA IA</span>
                            </div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', lineHeight: '1.2' }}>{post.title}</h2>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', flex: 1 }}>{post.excerpt}</p>
                            <Link href={`/blog/${post.slug}`} className="btn-cyber" style={{ display: 'inline-flex', fontSize: '0.8rem', padding: '10px 20px' }}>
                                Ler Insights <TrendingUp size={14} style={{ marginLeft: '8px' }} />
                            </Link>
                        </div>
                    </div>
                )) : (
                    <div className="glass" style={{ padding: '3rem', textAlign: 'center', gridColumn: '1 / -1' }}>
                        <BookOpen size={48} color="var(--text-muted)" style={{ marginBottom: '1rem' }} />
                        <h3>Gerando conteúdo de valor...</h3>
                        <p style={{ color: 'var(--text-muted)' }}>A IA Sentinel está analisando as vendas para criar o próximo artigo viral.</p>
                    </div>
                )}
            </div>
        </div>
    );
}

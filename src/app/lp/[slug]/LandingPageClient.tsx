'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import {
    Zap, ShieldCheck, Truck, Star,
    ArrowRight, ShoppingCart, CheckCircle2,
    Users, TrendingUp, Clock
} from 'lucide-react';
import Image from 'next/image';

interface LandingPageClientProps {
    product: any;
}

export default function LandingPageClient({ product }: LandingPageClientProps) {
    const router = useRouter();
    const { addToCart } = useCart();
    const [timeLeft, setTimeLeft] = useState(3600); // 1h countdown

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleBuyNow = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image_url,
            quantity: 1
        });
        router.push('/cart');
    };

    return (
        <div style={{ background: '#050507', color: '#fff', minHeight: '100vh', scrollBehavior: 'smooth' }}>
            {/* Urgency Bar */}
            <div style={{ background: 'var(--accent)', padding: '10px', textAlign: 'center', fontSize: '0.8rem', fontWeight: '900', letterSpacing: '1px' }}>
                OFERTA EXPIRA EM: {formatTime(timeLeft)} | {product.demand_score || 85}% DE DEMANDA DETECTADA
            </div>

            {/* Hero Section */}
            <section className="container section" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '4rem', alignItems: 'center' }}>
                <div className="animate-fade-in">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--secondary)', fontWeight: '900', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '1rem' }}>
                        <TrendingUp size={14} /> Winner da Semana - Lote 2026
                    </div>
                    <h1 className="cyber-glitch" data-text={product.name.toUpperCase()} style={{ fontSize: '4rem', marginBottom: '1.5rem', lineHeight: '1' }}>{product.name.toUpperCase()}</h1>
                    <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                        Transforme sua experiência com a tecnologia do {product.name}. Projetado para quem busca performance absoluta no modelo de Rendimento Direto 2026.
                    </p>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '3rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>R$ {product.original_price?.toFixed(2) || (product.price * 1.5).toFixed(2)}</span>
                            <span style={{ fontSize: '3rem', fontWeight: '900', color: 'var(--secondary)' }}>R$ {product.price?.toFixed(2)}</span>
                        </div>
                        <div className="glass" style={{ padding: '8px 16px', borderRadius: '100px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', color: '#22c55e', fontWeight: '900', fontSize: '0.8rem' }}>
                            FOCO RENDIMENTO: +{product.profit_margin || 45}%
                        </div>
                    </div>

                    <button onClick={handleBuyNow} className="btn-cyber pulse-ai optimistic" style={{ width: '100%', padding: '1.5rem', fontSize: '1.2rem', justifyContent: 'center' }}>
                        GARANTIR MEU {product.name.toUpperCase()} AGORA <ArrowRight style={{ marginLeft: '10px' }} />
                    </button>

                    <div style={{ display: 'flex', gap: '20px', marginTop: '2rem', flexWrap: 'wrap' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <ShieldCheck size={16} color="var(--secondary)" /> Automação de Repasse Ativa
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                            <Truck size={16} color="var(--secondary)" /> Frete Expresso Global
                        </div>
                    </div>
                </div>

                <div className="animate-float" style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '40px', overflow: 'hidden', boxShadow: '0 0 50px rgba(139, 92, 246, 0.2)', border: '1px solid var(--glass-border)' }}>
                    <Image src={product.image_url} alt={product.name} fill style={{ objectFit: 'cover' }} />
                </div>
            </section>

            {/* Why Us Section */}
            <section className="container section">
                <h2 style={{ textAlign: 'center', fontSize: '2.5rem', marginBottom: '4rem' }}>Por que o <span style={{ color: 'var(--primary)' }}>{product.name}</span> é Essencial?</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2.5rem' }}>
                        <Zap size={40} color="var(--secondary)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ marginBottom: '1rem' }}>Tecnologia Sentiente</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Algoritmos que se adaptam ao seu estilo de vida, proporcionando eficiência máxima.</p>
                    </div>
                    <div className="glass" style={{ padding: '2.5rem' }}>
                        <ShieldCheck size={40} color="var(--primary)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ marginBottom: '1rem' }}>Segurança de Repasse</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Transações protegidas por contratos inteligentes e liquidez instantânea.</p>
                    </div>
                    <div className="glass" style={{ padding: '2.5rem' }}>
                        <Clock size={40} color="var(--accent)" style={{ marginBottom: '1.5rem' }} />
                        <h3 style={{ marginBottom: '1rem' }}>Entrega Prioritária</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Logística otimizada com rastreio neural em tempo real.</p>
                    </div>
                </div>
            </section>

            {/* CTA Final */}
            <section className="glass" style={{ margin: '6rem 0', padding: '6rem 0', border: 'none' }}>
                <div className="container" style={{ textAlign: 'center' }}>
                    <h2 style={{ fontSize: '3rem', marginBottom: '2rem' }}>Pronto para o Próximo Nível?</h2>
                    <button onClick={handleBuyNow} className="btn-cyber" style={{ padding: '1.5rem 4rem', fontSize: '1.5rem' }}>
                        RESERVAR O MEU AGORA
                    </button>
                    <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'center', gap: '20px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><CheckCircle2 size={16} color="#22c55e" /> Garantia de 30 Dias</span>
                    </div>
                </div>
            </section>
        </div>
    );
}

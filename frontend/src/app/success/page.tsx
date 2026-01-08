'use client';

import React, { useEffect, useState } from 'react';
import { CheckCircle, Package, ArrowRight, ShoppingBag, Zap, Clock } from 'lucide-react';
import Link from 'next/link';
import { fetchApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import { CartItem } from '@/lib/cartTypes';
import Image from 'next/image';

export default function SuccessPage() {
    const { addToCart } = useCart();
    const [orderId, setOrderId] = useState<string | null>(null);
    const [upsell, setUpsell] = useState<any>(null);
    const [timeLeft, setTimeLeft] = useState(300);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const txn = params.get('external_reference') || params.get('payment_id');

        if (txn) {
            setOrderId(txn);
        } else {
            const pending = sessionStorage.getItem('pending_payment');
            if (pending) {
                const data = JSON.parse(pending);
                setOrderId(data.transaction_id);
            }
        }

        // Busca Recomendação de Upsell
        async function loadUpsell() {
            try {
                const data = await fetchApi('/api/v2/marketing/upsell');
                if (data && !data.error) {
                    setUpsell(data);
                    setTimeLeft(data.deadline_seconds || 300);
                }
            } catch (e) {
                console.log("Upsell Link Offline");
            }
        }
        loadUpsell();
    }, []);

    useEffect(() => {
        if (!upsell) return;
        const timer = setInterval(() => {
            setTimeLeft(prev => prev > 0 ? prev - 1 : 0);
        }, 1000);
        return () => clearInterval(timer);
    }, [upsell]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="container section" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '4rem 0' }}>
            <div className="glass" style={{ padding: '3rem', textAlign: 'center', maxWidth: '700px', width: '100%', border: '1px solid var(--secondary-glow)', marginBottom: '3rem' }}>
                <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div className="pulse-ai aggressive" style={{ width: '60px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', border: '2px solid #22c55e' }}>
                        <CheckCircle size={30} color="#22c55e" />
                    </div>
                </div>

                <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>PAGAMENTO CONFIRMADO</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '1rem' }}>
                    Seu pedido foi recebido e já está sendo processado por nossa equipe.
                </p>

                {orderId && (
                    <div className="glass" style={{ padding: '1.5rem', background: '#f8fafc', marginBottom: '2rem', borderRadius: '12px' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '700', marginBottom: '4px', textTransform: 'uppercase' }}>Código da Transação</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--foreground)', letterSpacing: '0.5px' }}>{orderId}</div>
                    </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <Link href="/rastreio" className="btn-cyber" style={{ justifyContent: 'center', padding: '0.8rem', fontSize: '0.8rem' }}>
                        <Package size={16} style={{ marginRight: '8px' }} /> RASTREIO
                    </Link>
                    <Link href="/shop" className="glass" style={{ padding: '0.8rem', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', color: 'var(--foreground)', textDecoration: 'none', background: 'white' }}>
                        <ShoppingBag size={16} /> VOLTAR À LOJA
                    </Link>
                </div>
            </div>

            {/* NEURAL UPSELL SECTION v8.9 */}
            {upsell && timeLeft > 0 && (
                <div className="animate-fade-in" style={{ width: '100%', maxWidth: '700px' }}>
                    <div className="glass" style={{ padding: '2.5rem', border: '2px solid var(--primary)', background: '#eff6ff', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px 20px', background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Clock size={14} /> EXPIRA EM: {formatTime(timeLeft)}
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem', alignItems: 'center', marginTop: '1rem' }}>
                            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--glass-border)' }}>
                                <Image src={upsell.image_url} alt={upsell.name} fill style={{ objectFit: 'cover' }} />
                            </div>

                            <div style={{ textAlign: 'left' }}>
                                <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.7rem', display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '8px' }}>
                                    <Zap size={14} fill="var(--primary)" /> OFERTA EXCLUSIVA
                                </div>
                                <h3 style={{ fontSize: '1.5rem', marginBottom: '10px' }}>{upsell.name}</h3>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                    {upsell.hook}
                                </p>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                                    <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--foreground)' }}>R$ {upsell.price.toFixed(2)}</span>
                                    <span style={{ fontSize: '1rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>R$ {upsell.original_price.toFixed(2)}</span>
                                </div>

                                <button
                                    className="btn-cyber pulse-ai optimistic"
                                    style={{ width: '100%', padding: '1.2rem', justifyContent: 'center' }}
                                    onClick={() => {
                                        addToCart({
                                            id: `upsell-${Date.now()}`,
                                            name: upsell.name,
                                            price: upsell.price,
                                            quantity: 1,
                                            image: upsell.image_url
                                        } as CartItem);
                                        window.location.href = '/cart';
                                    }}
                                >
                                    ADICIONAR AO MEU PEDIDO <ArrowRight style={{ marginLeft: '10px' }} size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                        * Adicionando agora você aproveita o mesmo frete e um desconto exclusivo de agradecimento.
                    </p>
                </div>
            )}
        </div>
    );
}

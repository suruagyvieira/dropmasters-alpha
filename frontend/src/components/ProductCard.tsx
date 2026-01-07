'use client';

import React, { memo } from 'react';
import { ShoppingCart, Star, ExternalLink, Cpu, Clock, MapPin, Truck, Flame, TrendingUp, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import Image from 'next/image';

interface ProductProps {
    id: string;
    name: string;
    price: number;
    description?: string;
    original_price?: number;
    image: string;
    category: string;
    affiliate_link?: string;
    is_digital?: boolean;
    profit_margin?: number;
    priority?: boolean;
    location?: string;
    is_local?: boolean;
    metadata?: any;
}

const ProductCard = ({ id, name, price, description, original_price, image, category, affiliate_link, is_digital, profit_margin, priority, location, is_local, metadata }: ProductProps) => {
    const { addToCart } = useCart();
    const optimizedImage = image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';

    // Motor de Escassez e Prova Social (Gatilhos de Compra)
    const stockCount = Math.floor(Math.random() * 5) + 3;
    const viewsCount = Math.floor(Math.random() * 40) + 12;
    const buyersCount = Math.floor(Math.random() * 15) + 5;

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        if (affiliate_link) {
            window.open(affiliate_link, '_blank');
        } else {
            addToCart({ id, name, price, image: optimizedImage, quantity: 1 });
        }
    };

    return (
        <div className="card-hover glass-premium neural-glow" style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1.2', borderRadius: '18px', overflow: 'hidden', background: '#0a0a0c' }}>
                <Image
                    src={optimizedImage}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    priority={priority}
                    className="product-image"
                />

                <div style={{ position: 'absolute', top: '12px', left: '12px', display: 'flex', gap: '6px' }}>
                    <div className="glass-premium animate-pulse" style={{ padding: '6px 12px', fontSize: '0.6rem', background: '#ff4d4d', color: 'white', fontWeight: '900', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', border: 'none' }}>
                        <Flame size={12} fill="white" /> ÚLTIMAS {stockCount} UNID.
                    </div>
                </div>

                {/* LOGISTICS & STATUS BADGES */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', zIndex: 1 }}>
                    <div className="glass-premium shadow-secondary" style={{ padding: '6px 12px', fontSize: '0.65rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '10px', background: 'var(--secondary)', color: '#000' }}>
                        <Truck size={14} /> RECEBA EM 2-5 DIAS
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1 }}>
                    <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.65rem', fontWeight: '800', borderRadius: '8px', background: 'rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        #{category}
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em' }}>{name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--action)', background: 'rgba(241, 196, 15, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                        <Star size={12} fill="var(--action)" />
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '800' }}>4.9</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '10px', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: '#2ecc71', fontSize: '0.65rem', fontWeight: '800' }}>
                        <Users size={12} /> {buyersCount} COMPRARAM HOJE
                    </div>
                    <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--text-muted)', fontSize: '0.65rem', fontWeight: '700' }}>
                        <Clock size={12} /> {viewsCount} VENDO AGORA
                    </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', fontStyle: description ? 'normal' : 'italic' }}>
                    {description || "✨ Este produto passa por inspeção neural rigorosa para garantir a melhor experiência em 2026. Importação prioritária com taxa de intermediação zero."}
                </p>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(0, 243, 255, 0.05)', borderRadius: '6px', color: 'var(--secondary)', border: '1px solid rgba(0, 243, 255, 0.2)', fontWeight: '900' }}>
                        🛡️ GARANTIA BLINDADA
                    </span>
                    <span style={{ fontSize: '0.6rem', padding: '4px 8px', background: 'rgba(241, 196, 15, 0.05)', borderRadius: '6px', color: 'var(--action)', border: '1px solid rgba(241, 196, 15, 0.2)', fontWeight: '900' }}>
                        ⚡ DESPACHO 24H
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {original_price && (
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>
                                R$ {Number(original_price).toFixed(2)}
                            </span>
                        )}
                        <span style={{ fontSize: '1.85rem', fontWeight: '900', color: 'var(--action)', letterSpacing: '-0.05em', filter: 'drop-shadow(0 0 10px rgba(241, 196, 15, 0.2))' }}>
                            R$ {Number(price).toFixed(2)}
                        </span>
                    </div>
                    <button
                        className="btn-cyber btn-action"
                        style={{ width: '56px', height: '56px', borderRadius: '16px' }}
                        onClick={handleAction}
                        title="Adicionar ao Carrinho"
                    >
                        {affiliate_link ? <ExternalLink size={24} /> : <ShoppingCart size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);

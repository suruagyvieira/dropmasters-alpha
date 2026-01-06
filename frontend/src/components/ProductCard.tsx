'use client';

import React, { memo } from 'react';
import { ShoppingCart, Star, ExternalLink, Cpu, Clock, MapPin, Truck } from 'lucide-react';
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
    const benefits = metadata?.benefits || [];

    const optimizedImage = image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop';

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

                {/* LOGISTICS & STATUS BADGES (Otimizado) */}
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', zIndex: 1 }}>
                    {is_local && (
                        <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.6rem', background: 'var(--success)', color: 'white', fontWeight: '800', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Truck size={12} /> ENVIO EXPRESSO
                        </div>
                    )}
                    <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.6rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px', background: 'rgba(0,0,0,0.6)', color: 'var(--action)' }}>
                        <Cpu size={12} /> SMART SOURCING
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1 }}>
                    <div className="glass-premium" style={{ padding: '4px 10px', fontSize: '0.65rem', fontWeight: '700', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {category}
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

                {description && (
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                        {description}
                    </p>
                )}

                {benefits.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
                        {benefits.slice(0, 3).map((b: string, i: number) => (
                            <span key={i} style={{ fontSize: '0.65rem', padding: '2px 8px', background: 'rgba(255,255,255,0.05)', borderRadius: '6px', color: '#fff', border: '1px solid rgba(255,255,255,0.1)' }}>
                                ✓ {b}
                            </span>
                        ))}
                    </div>
                )}

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

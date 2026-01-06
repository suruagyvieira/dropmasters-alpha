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
        <div className="card-hover glass-premium neural-glow" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1rem', position: 'relative', overflow: 'hidden', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '18px', overflow: 'hidden', background: '#0a0a0c' }}>
                <Image
                    src={optimizedImage}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover', transition: 'transform 0.5s' }}
                    priority={priority}
                    className="product-image"
                />
                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexWrap: 'wrap', justifyContent: 'flex-end', gap: '6px', zIndex: 1 }}>
                    {/* LOGISTICS BADGE: LOCAL SHIPPING */}
                    {is_local && (
                        <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.6rem', background: '#10b981', color: 'white', fontWeight: '800', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Truck size={12} /> ENVIO EXPRESSO
                        </div>
                    )}

                    {/* LOGISTICS BADGE: LOCATION */}
                    {location && !is_local && (
                        <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '700', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(0,0,0,0.6)' }}>
                            <MapPin size={12} /> {location}
                        </div>
                    )}

                    {is_digital && (
                        <div className="glass-premium" style={{ padding: '6px 12px', fontSize: '0.6rem', background: 'var(--accent)', color: 'white', fontWeight: '800', borderRadius: '8px' }}>
                            NEURAL CORE
                        </div>
                    )}
                    <div className="glass-premium badge-success" style={{ padding: '6px 12px', fontSize: '0.6rem', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '8px' }}>
                        <Cpu size={12} /> ESTOQUE ZERO
                    </div>
                </div>

                <div style={{ position: 'absolute', bottom: '12px', left: '12px', zIndex: 1 }}>
                    <div className="glass-premium" style={{ padding: '4px 10px', fontSize: '0.65rem', fontWeight: '700', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                        {category}
                    </div>
                </div>

                {/* FLASH EXPIRE BADGE */}
                {id.startsWith('flash_') && (
                    <div className="glass-premium animate-pulse" style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 1, padding: '6px 10px', fontSize: '0.65rem', fontWeight: '900', borderRadius: '8px', color: '#fbbf24', background: 'rgba(251, 191, 36, 0.1)', border: '1px solid rgba(251, 191, 36, 0.3)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Clock size={12} /> FLASH: 24h
                    </div>
                )}
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em', lineHeight: '1.2' }}>{name}</h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--secondary)', background: 'rgba(6, 182, 212, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                        <Star size={12} fill="var(--secondary)" />
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '800' }}>4.9</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '1.5rem' }}>
                    <div className="pulse-ai" style={{ width: '8px', height: '8px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)' }}></div>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '500' }}>
                        {profit_margin ? (
                            <span style={{ color: 'var(--success)', fontWeight: '700' }}>Yield: {profit_margin}% Otimizado</span>
                        ) : 'Algoritmo de Valor Ativo'}
                    </span>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        {original_price && (
                            <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through', marginBottom: '-4px' }}>
                                R$ {Number(original_price).toFixed(2)}
                            </span>
                        )}
                        <span style={{ fontSize: '1.75rem', fontWeight: '900', color: '#fff', letterSpacing: '-0.04em' }}>
                            R$ {Number(price).toFixed(2)}
                        </span>
                    </div>
                    <button
                        className="btn-cyber"
                        style={{
                            width: '56px',
                            height: '56px',
                            borderRadius: '16px',
                            background: affiliate_link ? 'var(--accent)' : 'var(--primary)',
                            boxShadow: affiliate_link ? '0 10px 20px rgba(244, 63, 94, 0.2)' : '0 10px 20px rgba(139, 92, 246, 0.2)',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                        }}
                        onClick={handleAction}
                    >
                        {affiliate_link ? <ExternalLink size={24} /> : <ShoppingCart size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);

'use client';

import React, { memo } from 'react';
import { ShoppingCart, Star, ExternalLink, Cpu, Clock, MapPin, Truck, Flame, TrendingUp, Users, Globe, Briefcase, CheckCircle } from 'lucide-react';
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
    // Estabilizador de Prova Social (Garante que os números não mudem a cada hover)
    const seed = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const stockCount = (seed % 5) + 3;
    const viewsCount = (seed % 40) + 12;
    const buyersCount = (seed % 15) + 5;

    // Metadados do Modelo de Negócio Apex (v14.0)
    const businessModel = metadata?.business_model || 'DROPSHIPPING';
    const modelTag = metadata?.model_tag || '📦 DESPACHO DIRETO';
    const affiliateLink = metadata?.affiliate_link || affiliate_link;

    const handleAction = (e: React.MouseEvent) => {
        e.preventDefault();
        if (businessModel === 'AFFILIATE' && affiliateLink) {
            window.open(affiliateLink, '_blank');
        } else {
            addToCart({
                id, name, price, image: optimizedImage, quantity: 1,
                metadata: { ...metadata, business_model: businessModel }
            });
        }
    };

    return (
        <div className="card-hover" style={{
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            position: 'relative',
            overflow: 'hidden',
            borderRadius: '16px',
            background: 'white',
            border: '1px solid #e2e8f0',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
        }}>
            <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '12px', overflow: 'hidden', background: '#f1f5f9' }}>
                <Image
                    src={optimizedImage}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                    priority={priority}
                />

                <div style={{ position: 'absolute', top: '8px', left: '8px', display: 'flex', gap: '6px' }}>
                    <div className="badge-urgency" style={{ padding: '4px 10px', fontSize: '0.65rem', fontWeight: '700', borderRadius: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Flame size={12} fill="currentColor" /> {stockCount} RESTANTES
                    </div>
                </div>

                <div style={{ position: 'absolute', top: '8px', right: '8px' }}>
                    <div className="badge-primary" style={{ padding: '4px 10px', fontSize: '0.65rem', fontWeight: '700', borderRadius: '6px' }}>
                        {modelTag}
                    </div>
                </div>
            </div>

            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--foreground)', marginBottom: '4px' }}>{name}</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#f59e0b' }}>
                                <Star size={12} fill="currentColor" />
                                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--foreground)' }}>4.9</span>
                            </div>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({buyersCount * 3} avaliações)</span>
                        </div>
                    </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.4', marginBottom: '0.5rem' }}>
                    {description || "Produto verificado pela curadoria DropMasters. Garantia de qualidade e envio rastreado para todo o Brasil."}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0.5rem 0' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Users size={12} color="var(--primary)" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{viewsCount} interessados</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <CheckCircle size={12} color="var(--success)" />
                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '500' }}>{buyersCount} vendidos</span>
                    </div>
                </div>

                <div style={{ marginTop: 'auto', paddingTop: '0.75rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <div>
                        {original_price && (
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textDecoration: 'line-through' }}>
                                R$ {Number(original_price).toFixed(2)}
                            </div>
                        )}
                        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--foreground)' }}>
                            R$ {Number(price).toFixed(2)}
                        </div>
                    </div>
                    <button
                        className="btn-cyber btn-action"
                        style={{ width: '48px', height: '48px', borderRadius: '12px', padding: 0 }}
                        onClick={handleAction}
                    >
                        {businessModel === 'AFFILIATE' ? <ExternalLink size={20} /> : <ShoppingCart size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);

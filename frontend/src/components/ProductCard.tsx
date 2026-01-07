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
    const stockCount = Math.floor(Math.random() * 5) + 3;
    const viewsCount = Math.floor(Math.random() * 40) + 12;
    const buyersCount = Math.floor(Math.random() * 15) + 5;

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
            } as any);
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

                <div style={{ position: 'absolute', top: '12px', right: '12px', display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '6px', zIndex: 1 }}>
                    <div className="glass-premium animate-pulse" style={{ padding: '6px 12px', fontSize: '0.65rem', background: businessModel === 'WHITE_LABEL' ? 'var(--primary)' : 'var(--secondary)', color: '#000', fontWeight: '900', borderRadius: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                        {businessModel === 'AFFILIATE' ? <Globe size={14} /> : <Truck size={14} />}
                        {modelTag}
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
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.03em' }}>{name}</h3>
                        {businessModel === 'MARKETPLACE' && (
                            <span style={{ fontSize: '0.65rem', color: 'var(--primary)', fontWeight: '700', marginTop: '2px' }}>
                                <Briefcase size={10} style={{ display: 'inline', marginRight: '4px' }} />
                                Vendido por: {metadata?.vendor_name || 'Parceiro Verificado'}
                            </span>
                        )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--action)', background: 'rgba(241, 196, 15, 0.1)', padding: '4px 8px', borderRadius: '8px' }}>
                        <Star size={12} fill="var(--action)" />
                        <span style={{ fontSize: '0.75rem', color: '#fff', fontWeight: '800' }}>4.9</span>
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.03)', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <Users size={12} color="var(--primary)" />
                        <span style={{ fontSize: '0.65rem', color: '#fff', fontWeight: '700' }}>{viewsCount} olhando</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'rgba(34, 197, 94, 0.05)', padding: '4px 10px', borderRadius: '100px', border: '1px solid rgba(34, 197, 94, 0.2)' }}>
                        <CheckCircle size={12} color="#22c55e" />
                        <span style={{ fontSize: '0.65rem', color: '#22c55e', fontWeight: '700' }}>{buyersCount} vendidos</span>
                    </div>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem', fontStyle: description ? 'normal' : 'italic' }}>
                    {description || "✨ Este produto passa por inspeção neural rigorosa para garantir a melhor experiência em 2026. Importação prioritária com taxa de intermediação zero."}
                </p>

                {/* Motor de Pressão de Venda (Apex v15.0) */}
                <div style={{ marginBottom: '1.2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                        <span style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <Flame size={12} className="animate-pulse" /> DISPONIBILIDADE
                        </span>
                        <span style={{ fontSize: '0.65rem', fontWeight: '800', color: stockCount < 5 ? '#ff4d4d' : 'var(--text-muted)' }}>
                            {stockCount} UNIDADES RESTANTES
                        </span>
                    </div>
                    <div style={{ width: '100%', height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <div style={{
                            width: `${(stockCount / 40) * 100}%`,
                            height: '100%',
                            background: stockCount < 5 ? 'linear-gradient(90deg, #ff4d4d, #f1c40f)' : 'var(--primary)',
                            boxShadow: stockCount < 5 ? '0 0 10px #ff4d4d' : '0 0 10px var(--primary-glow)',
                            transition: 'width 1s ease-in-out'
                        }}></div>
                    </div>
                </div>

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
                        title={businessModel === 'AFFILIATE' ? 'Ver na Loja Oficial' : 'Adicionar ao Carrinho'}
                    >
                        {businessModel === 'AFFILIATE' ? <ExternalLink size={24} /> : <ShoppingCart size={24} />}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(ProductCard);

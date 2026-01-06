'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User as UserIcon, Search, LogIn } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
    const { cart, isHydrated } = useCart();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

    return (
        <header className="glass" style={{
            position: 'fixed',
            top: '1rem',
            left: '1rem',
            right: '1rem',
            zIndex: 1000,
            height: 'var(--header-height)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 2rem',
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', whiteSpace: 'nowrap' }}>
                    DROPMASTERS
                </Link>
                <nav style={{ display: 'flex', gap: '1.5rem', marginLeft: '2rem' }}>
                    <Link href="/shop" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Produtos</Link>
                    <Link href="/rastreio" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Rastreio</Link>
                    <Link href="/afiliados" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Afiliados</Link>
                    <Link href="/blog" style={{ fontSize: '0.9rem', fontWeight: '500' }}>Blog</Link>
                    <Link href="/admin" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--accent)' }}>Admin</Link>
                </nav>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                    <ShoppingCart size={22} />
                    {mounted && isHydrated && cartCount > 0 && (
                        <span style={{
                            position: 'absolute',
                            top: '-8px',
                            right: '-8px',
                            background: 'var(--primary)',
                            color: 'white',
                            fontSize: '0.65rem',
                            fontWeight: '800',
                            padding: '2px 6px',
                            borderRadius: '50%',
                            minWidth: '16px',
                            textAlign: 'center'
                        }}>
                            {cartCount}
                        </span>
                    )}
                </Link>

                {mounted && (
                    user ? (
                        <Link href="/dashboard" className="glass" style={{ padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '8px', borderRadius: '10px', textDecoration: 'none' }}>
                            <UserIcon size={18} color="var(--secondary)" />
                            <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>PAINEL</span>
                        </Link>
                    ) : (
                        <Link href="/login" className="btn-cyber" style={{ padding: '8px 18px', fontSize: '0.8rem', gap: '8px' }}>
                            <LogIn size={16} /> LOGIN
                        </Link>
                    )
                )}
            </div>
        </header>
    );
};

export default Header;

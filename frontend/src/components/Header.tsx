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
        <header style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            height: 'var(--header-height)',
            background: 'white',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <Link href="/" style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                        DROPMASTERS
                    </Link>
                    <nav style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/shop" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)', textDecoration: 'none' }}>Catálogo</Link>
                        <Link href="/rastreio" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)', textDecoration: 'none' }}>Rastreio</Link>
                        <Link href="/afiliados" style={{ fontSize: '0.9rem', fontWeight: '500', color: 'var(--text-muted)', textDecoration: 'none' }}>Parceiros</Link>
                    </nav>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--foreground)', textDecoration: 'none' }}>
                        <ShoppingCart size={24} strokeWidth={1.5} />
                        {mounted && isHydrated && cartCount > 0 && (
                            <span style={{
                                position: 'absolute',
                                top: '-6px',
                                right: '-10px',
                                background: 'var(--primary)',
                                color: 'white',
                                fontSize: '0.7rem',
                                fontWeight: '700',
                                width: '18px',
                                height: '18px',
                                borderRadius: '50%',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {mounted && (
                        user ? (
                            <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--foreground)' }}>
                                <UserIcon size={22} strokeWidth={1.5} />
                                <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Minha Conta</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="btn-cyber" style={{ padding: '10px 20px', fontSize: '0.85rem', borderRadius: '8px' }}>
                                Entrar
                            </Link>
                        )
                    )}
                </div>
            </div>
        </header>
    );
};

export default Header;

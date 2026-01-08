'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingCart, User as UserIcon, Search, Menu, X, ChevronDown } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';

const Header = () => {
    const { cart, isHydrated } = useCart();
    const { user } = useAuth();
    const [mounted, setMounted] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

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
            background: 'var(--glass-bg)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--glass-border)',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease'
        }}>
            <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '2rem' }}>

                {/* LOGO & CATEGORIES */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <Link href="/" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none', letterSpacing: '-0.04em' }}>
                        DROPMASTERS
                    </Link>

                    <nav className="desktop-only" style={{ display: 'flex', gap: '1.5rem' }}>
                        <Link href="/shop" className="nav-link">Todos os Produtos</Link>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }} className="nav-link">
                            Categorias <ChevronDown size={14} />
                        </div>
                        <Link href="/rastreio" className="nav-link">Rastreio</Link>
                    </nav>
                </div>

                {/* SEARCH BAR */}
                <div style={{ flex: 1, maxWidth: '500px' }} className="desktop-only">
                    <form style={{ position: 'relative' }} onSubmit={(e) => { e.preventDefault(); if (searchQuery) window.location.href = `/shop?q=${searchQuery}`; }}>
                        <input
                            type="text"
                            className="search-input"
                            placeholder="O que você está procurando hoje?"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <button type="submit" style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--secondary)' }}>
                            <Search size={18} />
                        </button>
                    </form>
                </div>

                {/* ACTIONS */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div className="desktop-only" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        {mounted && (
                            user ? (
                                <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', color: 'var(--foreground)' }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--primary-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                                        <UserIcon size={18} />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                        <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600' }}>Olá,</span>
                                        <span style={{ fontSize: '0.8rem', fontWeight: '700' }}>{user.email?.split('@')[0]}</span>
                                    </div>
                                </Link>
                            ) : (
                                <Link href="/login" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--foreground)', textDecoration: 'none' }}>
                                    Entrar
                                </Link>
                            )
                        )}
                    </div>

                    <Link href="/cart" style={{ position: 'relative', display: 'flex', alignItems: 'center', color: 'var(--foreground)', textDecoration: 'none' }}>
                        <div style={{ position: 'relative' }}>
                            <ShoppingCart size={24} strokeWidth={2} />
                            {mounted && isHydrated && cartCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '-8px',
                                    right: '-8px',
                                    background: 'var(--primary)',
                                    color: 'white',
                                    fontSize: '0.65rem',
                                    fontWeight: '800',
                                    minWidth: '18px',
                                    height: '18px',
                                    borderRadius: '50%',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    padding: '0 4px',
                                    border: '2px solid white'
                                }}>
                                    {cartCount}
                                </span>
                            )}
                        </div>
                    </Link>

                    <button
                        className="mobile-only"
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            <style jsx>{`
                @media (max-width: 900px) {
                    .desktop-only { display: none; }
                }
                @media (min-width: 901px) {
                    .mobile-only { display: none; }
                }
            `}</style>
        </header>
    );
};

export default Header;

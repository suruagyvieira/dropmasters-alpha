'use client';

import React from 'react';
import Link from 'next/link';
import Newsletter from './Newsletter';
import { Facebook, Instagram, Twitter, Youtube } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="glass" style={{ marginTop: '80px', padding: '4rem 0 2rem 0', borderRadius: '40px 40px 0 0' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '4rem', marginBottom: '4rem' }}>
                    <div>
                        <Link href="/" style={{ fontSize: '1.5rem', fontWeight: '800', background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent', display: 'block', marginBottom: '1.5rem' }}>
                            DROPMASTERS
                        </Link>
                        <p style={{ marginBottom: '1.5rem' }}>
                            Transformando o ecommerce com automação inteligente e design de alta performance.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div className="glass" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Instagram size={20} /></div>
                            <div className="glass" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Facebook size={20} /></div>
                            <div className="glass" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Twitter size={20} /></div>
                            <div className="glass" style={{ padding: '10px', borderRadius: '50%', cursor: 'pointer' }}><Youtube size={20} /></div>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1.1rem' }}>Links Rápidos</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <li><Link href="/shop" style={{ color: 'var(--text-muted)' }}>Loja</Link></li>
                            <li><Link href="/afiliados" style={{ color: 'var(--text-muted)' }}>Afiliados</Link></li>
                            <li><Link href="/blog" style={{ color: 'var(--text-muted)' }}>Blog</Link></li>
                            <li><Link href="/sobre" style={{ color: 'var(--text-muted)' }}>Sobre Nós</Link></li>
                        </ul>
                    </div>

                    <div>
                        <Newsletter />
                    </div>
                </div>

                <div style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                    <p>© 2026 DropMasters. Todos os direitos reservados.</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/termos">Termos</Link>
                        <Link href="/privacidade">Privacidade</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

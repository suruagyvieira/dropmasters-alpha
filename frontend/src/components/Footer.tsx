'use client';

import React from 'react';
import Link from 'next/link';
import Newsletter from './Newsletter';
import { Facebook, Instagram, Twitter, Youtube, ShieldCheck, Truck, CreditCard, Headphones } from 'lucide-react';

const Footer = () => {
    return (
        <footer style={{ marginTop: '5rem', padding: '5rem 0 3rem 0', background: 'white', borderTop: '1px solid var(--card-border)' }}>
            <div className="container">
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '4rem', marginBottom: '5rem' }}>

                    {/* COLUNA 1: BRAND */}
                    <div>
                        <Link href="/" style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary)', textDecoration: 'none', display: 'block', marginBottom: '1.5rem', letterSpacing: '-0.04em' }}>
                            DROPMASTERS
                        </Link>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '2rem' }}>
                            Sua ponte direta para o melhor do varejo global. Logística inteligente, suporte premium e curadoria de alta performance para clientes exigentes.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[Instagram, Facebook, Twitter, Youtube].map((Icon, i) => (
                                <div key={i} className="flex-center" style={{ width: '40px', height: '40px', borderRadius: '50%', border: '1px solid var(--card-border)', cursor: 'pointer', color: 'var(--secondary)', transition: 'all 0.2s ease' }}>
                                    <Icon size={18} />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* COLUNA 2: SHOP */}
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '800' }}>Categorias</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Eletrônicos', 'Fones de Ouvido', 'Casa Inteligente', 'Wearables', 'Acessórios Gamer'].map((link, i) => (
                                <li key={i}><Link href="/shop" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUNA 3: INSTITUTIONAL */}
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '800' }}>Ajuda & Suporte</h4>
                        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {['Rastrear Pedido', 'Políticas de Envio', 'Trocas e Devoluções', 'Termos de Serviço', 'Fale Conosco'].map((link, i) => (
                                <li key={i}><Link href="/rastreio" style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none' }}>{link}</Link></li>
                            ))}
                        </ul>
                    </div>

                    {/* COLUNA 4: NEWSLETTER */}
                    <div>
                        <h4 style={{ marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '800' }}>Newsletter</h4>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>Fique por dentro das novidades e receba cupons exclusivos.</p>
                        <Newsletter />
                    </div>
                </div>

                {/* TRUST SEALS & PAYMENT */}
                <div style={{ borderTop: '1px solid var(--card-border)', borderBottom: '1px solid var(--card-border)', padding: '2rem 0', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: '700' }}>
                            <ShieldCheck size={20} color="var(--success)" /> SITE BLINDADO
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--secondary)', fontSize: '0.7rem', fontWeight: '700' }}>
                            <Truck size={20} color="var(--primary)" /> FRETE SEGURADO
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-muted)' }}>PAGAMENTO SEGURO via</span>
                        <div style={{ display: 'flex', gap: '10px' }}>
                            <div className="flex-center" style={{ width: '40px', height: '25px', background: '#f8fafc', borderRadius: '4px', border: '1px solid var(--card-border)', fontSize: '0.6rem', fontWeight: '900' }}>PIX</div>
                            <div className="flex-center" style={{ width: '40px', height: '25px', background: '#f8fafc', borderRadius: '4px', border: '1px solid var(--card-border)', fontSize: '0.6rem', fontWeight: '900' }}>VISA</div>
                            <div className="flex-center" style={{ width: '40px', height: '25px', background: '#f8fafc', borderRadius: '4px', border: '1px solid var(--card-border)', fontSize: '0.6rem', fontWeight: '900' }}>MC</div>
                        </div>
                    </div>
                </div>

                {/* COPYRIGHT */}
                <div style={{ paddingTop: '2.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <p>© 2026 DROPMASTERS - Douglas Vieira. Todos os direitos reservados. CNPJ: 00.000.000/0001-00</p>
                    <div style={{ display: 'flex', gap: '2rem' }}>
                        <Link href="/privacidade" style={{ textDecoration: 'none', color: 'inherit' }}>Privacidade</Link>
                        <Link href="/termos" style={{ textDecoration: 'none', color: 'inherit' }}>Termos</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

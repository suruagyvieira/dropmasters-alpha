'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { LogIn, Mail, Lock, ShieldCheck, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { user } = useAuth();

    if (user) {
        router.push('/dashboard');
        return null;
    }

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError('Sistema de autenticação não configurado. Verifique as chaves ANON no Vercel/Render.');
            setLoading(false);
            return;
        }

        const { error } = await supabase.auth.signInWithPassword({ email, password });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            router.push('/dashboard');
        }
    };

    const handleGoogleLogin = async () => {
        if (!supabase) return;
        await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
    };

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
                <div className="glass shadow-premium" style={{ width: '100%', maxWidth: '480px', padding: '3.5rem', background: 'white', borderRadius: '24px' }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                            DROPMASTERS
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>Bem-vindo de volta</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Acesse sua conta para gerenciar seus pedidos.</p>
                    </div>

                    <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>E-mail</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="email"
                                    placeholder="seu@email.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 48px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: '#f1f5f9',
                                        color: 'var(--foreground)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Senha</label>
                                <Link href="/recuperar" style={{ fontSize: '0.75rem', color: 'var(--primary)', fontWeight: '600', textDecoration: 'none' }}>Esqueceu a senha?</Link>
                            </div>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 48px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: '#f1f5f9',
                                        color: 'var(--foreground)',
                                        fontSize: '0.95rem',
                                        outline: 'none',
                                        transition: 'all 0.2s ease'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--accent)', fontSize: '0.85rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-cyber" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} disabled={loading}>
                            {loading ? 'Entrando...' : 'Acessar Conta'} <ChevronRight size={20} />
                        </button>
                    </form>

                    <div style={{ margin: '2.5rem 0', textAlign: 'center', position: 'relative' }}>
                        <div style={{ position: 'absolute', top: '50%', left: 0, right: 0, height: '1px', background: 'var(--card-border)', zIndex: 0 }}></div>
                        <span style={{ position: 'relative', background: 'white', padding: '0 16px', color: 'var(--text-muted)', fontSize: '0.8rem', zIndex: 1 }}>OU</span>
                    </div>

                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            width: '100%',
                            padding: '12px',
                            background: 'white',
                            border: '1px solid var(--card-border)',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            fontSize: '0.95rem',
                            fontWeight: '600',
                            transition: 'all 0.2s ease'
                        }}
                    >
                        <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} height={18} alt="Google" /> Continuar com Google
                    </button>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Não tem uma conta? <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Criar conta grátis</Link>
                    </p>
                </div>
            </div>

            <div className="container" style={{ padding: '2rem 1rem', textAlign: 'center', borderTop: '1px solid var(--card-border)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><ShieldCheck size={14} /> Ambiente Seguro</div>
                    <div>© 2026 DropMasters</div>
                </div>
            </div>
        </div>
    );
}

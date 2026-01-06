'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/context/AuthContext';
import { LogIn, UserPlus, Mail, Lock, ShieldCheck, ArrowRight } from 'lucide-react';
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
            setError('Sistema de autenticação não configurado.');
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
        await supabase.auth.signInWithOAuth({ provider: 'google' });
    };

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div className="glass" style={{ display: 'inline-flex', padding: '12px', borderRadius: '16px', marginBottom: '1.5rem', color: 'var(--primary)' }}>
                        <ShieldCheck size={32} />
                    </div>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Neural Login</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Acesse seu dashboard Quantum 2026.</p>
                </div>

                <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>E-MAIL</label>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.02)' }}>
                            <Mail size={18} color="var(--text-muted)" />
                            <input
                                type="email"
                                placeholder="seu@email.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ background: 'transparent', border: 'none', padding: '12px', color: '#fff', width: '100%', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>SENHA NEURAL</label>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.02)' }}>
                            <Lock size={18} color="var(--text-muted)" />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ background: 'transparent', border: 'none', padding: '12px', color: '#fff', width: '100%', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--accent)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-cyber" style={{ width: '100%', justifyContent: 'center' }} disabled={loading}>
                        {loading ? 'AUTENTICANDO...' : 'INICIALIZAR LOGIN'} <LogIn size={18} />
                    </button>
                </form>

                <div style={{ margin: '2rem 0', textAlign: 'center', position: 'relative' }}>
                    <hr style={{ border: 'none', height: '1px', background: 'var(--glass-border)' }} />
                    <span style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: '#0a0a0f', padding: '0 10px', color: 'var(--text-muted)', fontSize: '0.7rem' }}>OU LOGIN SOCIAL</span>
                </div>

                <button onClick={handleGoogleLogin} className="glass" style={{ width: '100%', padding: '12px', background: 'rgba(255,255,255,0.05)', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '0.9rem' }}>
                    <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" width={18} height={18} alt="Google" /> Continuar com Google
                </button>

                <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Novo na rede? <Link href="/register" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>CRIAR CONTA QUANTUM</Link>
                </p>
            </div>
        </div>
    );
}

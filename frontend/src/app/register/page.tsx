'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Mail, Lock, User, ShieldCheck, ChevronRight, UserPlus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        if (!supabase) {
            setError('Sistema de autenticação não configurado.');
            setLoading(false);
            return;
        }

        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                emailRedirectTo: `${window.location.origin}/login`,
                data: {
                    full_name: name
                }
            }
        });

        if (error) {
            setError(error.message);
            setLoading(false);
        } else {
            setSuccess(true);
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div className="container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    <div className="glass shadow-premium" style={{ width: '100%', maxWidth: '500px', padding: '4rem', textAlign: 'center', background: 'white', borderRadius: '24px' }}>
                        <div style={{ color: 'var(--success)', marginBottom: '2rem' }}>
                            <ShieldCheck size={64} style={{ margin: '0 auto' }} />
                        </div>
                        <h1 style={{ marginBottom: '1.5rem', fontWeight: '800' }}>Conta Criada com Sucesso!</h1>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                            Enviamos um e-mail de confirmação para <strong>{email}</strong>. Por favor, valide seu acesso para ativar sua conta e começar.
                        </p>
                        <Link href="/login" className="btn-cyber" style={{ padding: '16px 40px', textDecoration: 'none' }}>
                            IR PARA LOGIN <ChevronRight size={20} />
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div style={{ background: '#f8fafc', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <div className="container" style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem 1rem' }}>
                <div className="glass shadow-premium" style={{ width: '100%', maxWidth: '480px', padding: '3.5rem', background: 'white', borderRadius: '24px' }}>

                    <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                        <Link href="/" style={{ fontSize: '1.2rem', fontWeight: '900', color: 'var(--primary)', textDecoration: 'none', display: 'inline-block', marginBottom: '2rem' }}>
                            DROPMASTERS
                        </Link>
                        <h1 style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.75rem' }}>Crie sua conta grátis</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>O primeiro passo para sua jornada de sucesso.</p>
                    </div>

                    <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Nome Completo</label>
                            <div style={{ position: 'relative' }}>
                                <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="text"
                                    placeholder="Seu nome"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '12px 16px 12px 48px',
                                        borderRadius: '12px',
                                        border: '1px solid var(--card-border)',
                                        background: '#f1f5f9',
                                        color: 'var(--foreground)',
                                        fontSize: '0.95rem',
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                        </div>

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
                                        outline: 'none'
                                    }}
                                    required
                                />
                            </div>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.8rem', fontWeight: '700', color: 'var(--secondary)' }}>Senha</label>
                            <div style={{ position: 'relative' }}>
                                <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                                <input
                                    type="password"
                                    placeholder="Mínimo 6 caracteres"
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
                                        outline: 'none'
                                    }}
                                    required
                                    minLength={6}
                                />
                            </div>
                        </div>

                        {error && (
                            <div style={{ padding: '12px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: 'var(--accent)', fontSize: '0.85rem', textAlign: 'center' }}>
                                {error}
                            </div>
                        )}

                        <button type="submit" className="btn-cyber" style={{ width: '100%', padding: '16px', fontSize: '1rem' }} disabled={loading}>
                            {loading ? 'Cadastrando...' : 'Criar Minha Conta'} <UserPlus size={20} />
                        </button>

                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: '1.4' }}>
                            Ao criar conta, você concorda com nossos <Link href="/termos" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Termos</Link> e <Link href="/privacidade" style={{ color: 'var(--primary)', textDecoration: 'none' }}>Políticas</Link>.
                        </p>
                    </form>

                    <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                        Já tem acesso? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '700' }}>Fazer Login</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { UserPlus, Mail, Lock, User, ShieldCheck, ArrowLeft } from 'lucide-react';
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
            // Link to creating profile if needed, Supabase triggers can do this also
        }
    };

    if (success) {
        return (
            <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
                <div className="glass" style={{ width: '100%', maxWidth: '500px', padding: '4rem', textAlign: 'center' }}>
                    <div style={{ color: 'var(--secondary)', marginBottom: '2rem' }}>
                        <ShieldCheck size={64} style={{ margin: '0 auto' }} />
                    </div>
                    <h1 style={{ marginBottom: '1.5rem', color: 'var(--foreground)' }}>Perfil Criado com Sucesso!</h1>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem' }}>
                        Enviamos um e-mail de confirmação para <strong>{email}</strong>. Por favor, valide seu acesso para ativar sua conta.
                    </p>
                    <Link href="/login" className="btn-cyber" style={{ display: 'inline-flex' }}>
                        VOLTAR PARA LOGIN
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <div className="glass" style={{ width: '100%', maxWidth: '450px', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{ fontSize: '2rem', marginBottom: '0.5rem', color: 'var(--foreground)' }}>Crie sua Conta</h1>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>Inicie sua jornada nas vendas digitais.</p>
                </div>

                <form onSubmit={handleRegister} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>NOME COMPLETO</label>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.02)' }}>
                            <User size={18} color="var(--text-muted)" />
                            <input
                                type="text"
                                placeholder="Seu nome"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{ background: 'transparent', border: 'none', padding: '12px', color: '#fff', width: '100%', outline: 'none' }}
                                required
                            />
                        </div>
                    </div>

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
                        <label style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-muted)' }}>SENHA</label>
                        <div className="glass" style={{ display: 'flex', alignItems: 'center', padding: '0 1rem', background: 'rgba(255,255,255,0.02)' }}>
                            <Lock size={18} color="var(--text-muted)" />
                            <input
                                type="password"
                                placeholder="Mínimo 6 caracteres"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ background: 'transparent', border: 'none', padding: '12px', color: '#fff', width: '100%', outline: 'none' }}
                                required
                                minLength={6}
                            />
                        </div>
                    </div>

                    {error && <p style={{ color: 'var(--accent)', fontSize: '0.8rem', textAlign: 'center' }}>{error}</p>}

                    <button type="submit" className="btn-cyber" style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }} disabled={loading}>
                        {loading ? 'PROCESSANDO...' : 'CRIAR MINHA CONTA'} <UserPlus size={18} />
                    </button>

                    <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
                        Ao clicar em criar conta, você aceita os termos da DropMasters.
                    </p>
                </form>

                <p style={{ marginTop: '2.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                    Já faz parte? <Link href="/login" style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: '800' }}>FAZER LOGIN</Link>
                </p>
            </div>
        </div>
    );
}

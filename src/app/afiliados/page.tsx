'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';
import { DollarSign, Copy, TrendingUp, Users, Crown, ShieldCheck, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function AffiliateDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [affiliateCode, setAffiliateCode] = useState<string | null>(null);
    const [affiliateLink, setAffiliateLink] = useState<string | null>(null);
    const [stats, setStats] = useState<any>(null);
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (user) {
            // Tenta recuperar stats (que contêm o código se existir)
            // Em uma impl real, teríamos um endpoint /me
            // Aqui vamos simular/tentar gerar se não tiver salvo no localStorage (mock de persistência front)
            const savedCode = localStorage.getItem(`aff_code_${user.id}`);
            if (savedCode) {
                setAffiliateCode(savedCode);
                setAffiliateLink(`${window.location.origin}/shop?ref=${savedCode}`);
                loadStats(savedCode);
            }
            loadLeaderboard();
        }
    }, [user]);

    const loadStats = async (code: string) => {
        try {
            const data = await fetchApi(`/api/v2/affiliate/stats/${code}`);
            if (!data.error) setStats(data);
        } catch (e) { console.error(e); }
    };

    const loadLeaderboard = async () => {
        try {
            const data = await fetchApi('/api/v2/affiliate/leaderboard');
            setLeaderboard(data);
        } catch (e) { console.error(e); }
    };

    const handleGenerateCode = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const res = await fetchApi('/api/v2/affiliate/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    user_id: user.id,
                    base_url: window.location.origin
                })
            });

            if (res.success) {
                setAffiliateCode(res.code);
                setAffiliateLink(res.link);
                localStorage.setItem(`aff_code_${user.id}`, res.code);
                // Inicia stats zerados
                setStats({
                    total_sales: 0,
                    total_commission: 0,
                    commission_rate: res.commission_rate,
                    status: 'ACTIVE'
                });
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const copyLink = () => {
        if (affiliateLink) {
            navigator.clipboard.writeText(affiliateLink);
            alert('Link copiado!');
        }
    };

    if (authLoading) return <div className="container section">Carregando Neural Bridge...</div>;

    if (!user) {
        return (
            <div className="container section" style={{ textAlign: 'center', padding: '6rem 0' }}>
                <h1 className="cyber-glitch" data-text="ACCESS DENIED">ACESSO RESTRITO</h1>
                <p style={{ margin: '2rem 0', color: 'var(--text-muted)' }}>Você precisa ser um membro verificado da rede para acessar o programa de parceiros.</p>
                <Link href="/login" className="btn-cyber" style={{ display: 'inline-flex', textDecoration: 'none' }}>
                    INICIAR LOGIN
                </Link>
            </div>
        );
    }

    return (
        <div className="container section">
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                <div className="glass" style={{ display: 'inline-flex', padding: '10px 20px', borderRadius: '100px', marginBottom: '1.5rem', borderColor: 'var(--accent)', color: 'var(--accent)' }}>
                    <Crown size={18} style={{ marginRight: '10px' }} />
                    <span style={{ fontWeight: '800', fontSize: '0.8rem' }}>AFFILIATE NEURAL BRIDGE v9.8</span>
                </div>
                <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }}>Sua Máquina de Vendas Autônoma</h1>
                <p style={{ maxWidth: '600px', margin: '0 auto', color: 'var(--text-muted)' }}>
                    Receba 10% de comissão em todas as vendas geradas pelo seu link exclusivo. O sistema rastreia e converte para você.
                </p>
            </div>

            {/* Dashboard ou Setup */}
            {!affiliateCode ? (
                <div className="glass" style={{ maxWidth: '500px', margin: '0 auto', padding: '3rem', textAlign: 'center' }}>
                    <ShieldCheck size={48} color="var(--primary)" style={{ marginBottom: '1.5rem', margin: '0 auto', display: 'block' }} />
                    <h2 style={{ marginBottom: '1rem' }}>Ativar Conta de Parceiro</h2>
                    <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>
                        Gere seu identificador único na rede para começar a monetizar seu tráfego imediatamente.
                    </p>
                    <button onClick={handleGenerateCode} disabled={loading} className="btn-cyber" style={{ width: '100%', justifyContent: 'center' }}>
                        {loading ? 'GERANDO...' : 'ATIVAR SISTEMA AGORA'} <ArrowRight size={18} />
                    </button>
                </div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
                    {/* Stats */}
                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                        <div className="glass" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800' }}>TOTAL COMISSÃO</p>
                                    <h3 style={{ fontSize: '2.5rem', color: 'var(--secondary)' }}>
                                        R$ {stats?.total_commission?.toFixed(2) || '0.00'}
                                    </h3>
                                </div>
                                <DollarSign size={24} color="var(--secondary)" />
                            </div>
                        </div>
                        <div className="glass" style={{ padding: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '800' }}>VENDAS TOTAIS</p>
                                    <h3 style={{ fontSize: '2.5rem', color: '#fff' }}>
                                        {stats?.total_sales || 0}
                                    </h3>
                                </div>
                                <TrendingUp size={24} color="#fff" />
                            </div>
                        </div>

                        <div className="glass" style={{ padding: '2rem', background: 'var(--gradient-primary)' }}>
                            <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', fontWeight: '800', marginBottom: '10px' }}>SEU LINK EXCLUSIVO</p>
                            <div style={{ display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '8px' }}>
                                <code style={{ flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', color: '#fff' }}>{affiliateLink}</code>
                                <button onClick={copyLink} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#fff' }}>
                                    <Copy size={18} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Leaderboard */}
                    <div className="glass" style={{ padding: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Users size={20} color="var(--accent)" />
                            <h3 style={{ fontSize: '1.2rem' }}>Top Parceiros</h3>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {leaderboard.length === 0 ? (
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Seja o primeiro a entrar no ranking!</p>
                            ) : (
                                leaderboard.map((item, index) => (
                                    <div key={index} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px', borderBottom: '1px solid var(--glass-border)' }}>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <span style={{ fontWeight: '900', color: index === 0 ? 'var(--primary)' : 'var(--text-muted)' }}>#{index + 1}</span>
                                            <span>{item.code}</span>
                                        </div>
                                        <span style={{ fontWeight: '800', color: 'var(--secondary)' }}>R$ {item.total_commission.toFixed(2)}</span>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

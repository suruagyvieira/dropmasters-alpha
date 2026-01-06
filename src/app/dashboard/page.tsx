'use client';

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { Package, Truck, Clock, CheckCircle, LogOut, ShoppingBag, User as UserIcon, Zap } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
    const { user, signOut, loading: authLoading } = useAuth();
    const router = useRouter();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/login');
        }
    }, [user, authLoading]);

    useEffect(() => {
        if (user) {
            fetchOrders();
        }
    }, [user]);

    const fetchOrders = async () => {
        if (!supabase) {
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from('orders')
            .select('*')
            .eq('user_id', user?.id)
            .order('created_at', { ascending: false });

        if (!error) {
            setOrders(data || []);
        }
        setLoading(false);
    };

    if (authLoading || !user) return (
        <div className="container" style={{ textAlign: 'center', padding: '10rem' }}>
            <div className="animate-pulse" style={{ color: 'var(--secondary)', fontSize: '1.2rem', fontWeight: '800' }}>QUANTUM SYNCING...</div>
        </div>
    );


    // VIP LOGIC ----------------------------------------------------------------
    const totalSpent = orders.reduce((acc, order) => acc + (order.total_amount || 0), 0);
    // Para demo: se não tiver pedidos, simula um valor pra mostrar a UI
    const displaySpent = totalSpent > 0 ? totalSpent : 0;

    let vipTier = 'STARTER';
    let nextTier = 'GOLD';
    let progress = (displaySpent / 500) * 100;

    if (displaySpent >= 500 && displaySpent < 1500) {
        vipTier = 'GOLD';
        nextTier = 'PLATINUM';
        progress = ((displaySpent - 500) / 1000) * 100;
    } else if (displaySpent >= 1500) {
        vipTier = 'PLATINUM';
        nextTier = 'QUANTUM GOD';
        progress = 100;
    }

    const isVip = vipTier !== 'STARTER';

    return (
        <div className="container section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem', flexWrap: 'wrap', gap: '20px' }}>
                <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Neural Dashboard</h1>
                        {isVip && <span className="glass animate-pulse" style={{ background: 'var(--primary)', color: '#fff', fontSize: '0.7rem', fontWeight: '900', padding: '4px 10px' }}>{vipTier} MEMBER</span>}
                    </div>
                    <p style={{ color: 'var(--text-muted)' }}>Bem-vindo de volta, <span style={{ color: '#fff', fontWeight: '800' }}>{user.user_metadata.full_name || user.email}</span></p>
                </div>
                <button onClick={signOut} className="glass" style={{ padding: '12px 24px', display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', borderColor: 'var(--accent)' }}>
                    <LogOut size={18} /> Sair da Rede
                </button>
            </div>

            {/* VIP JOURNEY GAMIFICATION */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '4rem', background: 'linear-gradient(90deg, rgba(0,0,0,0.5) 0%, rgba(13, 13, 13, 0.8) 100%)', border: '1px solid var(--secondary-glow)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <UserIcon size={20} color="var(--secondary)" /> Jornada VIP: Nível {vipTier}
                    </h3>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{nextTier === 'QUANTUM GOD' ? 'NÍVEL MÁXIMO ALCANÇADO' : `Próximo Nível: ${nextTier}`}</span>
                </div>

                <div style={{ width: '100%', height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden', marginBottom: '1rem' }}>
                    <div className="animate-slide-right" style={{ width: `${Math.min(100, Math.max(5, progress))}%`, height: '100%', background: 'var(--gradient-primary)', borderRadius: '10px' }}></div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Você investiu: R$ {displaySpent.toFixed(2)}</span>
                    <span>Meta: {nextTier === 'GOLD' ? 'R$ 500,00' : 'R$ 1.500,00'}</span>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'start' }}>
                {/* Meus Pedidos */}
                <div>
                    <h2 style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '2rem' }}>
                        <Package size={24} color="var(--secondary)" /> Seus Pedidos
                    </h2>

                    {loading ? (
                        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>Carregando histórico neural...</div>
                    ) : orders.length === 0 ? (
                        <div className="glass" style={{ padding: '5rem', textAlign: 'center' }}>
                            <ShoppingBag size={48} color="var(--text-muted)" style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Nenhuma transação detectada.</p>
                            <Link href="/shop" className="btn-cyber" style={{ display: 'inline-flex' }}>SHOP NOW</Link>
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {orders.map((order) => (
                                <div key={order.id} className="glass" style={{ padding: '2rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                        <div>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>ID DO PEDIDO</span>
                                            <span style={{ fontWeight: '800', fontSize: '1rem' }}>#{order.id.slice(0, 8).toUpperCase()}</span>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '800', display: 'block', marginBottom: '4px' }}>STATUS</span>
                                            <span style={{
                                                padding: '4px 12px',
                                                borderRadius: '20px',
                                                fontSize: '0.75rem',
                                                fontWeight: '800',
                                                background: order.status === 'paid' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                                                color: order.status === 'paid' ? '#22c55e' : '#fff',
                                                border: `1px solid ${order.status === 'paid' ? '#22c55e' : 'var(--glass-border)'}`
                                            }}>
                                                {order.status.toUpperCase()}
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--glass-border)', paddingTop: '1.5rem' }}>
                                        <div style={{ display: 'flex', gap: '2rem' }}>
                                            <div>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>DATA</span>
                                                <span style={{ fontSize: '0.85rem' }}>{new Date(order.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <div>
                                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>PAGAMENTO</span>
                                                <span style={{ fontSize: '0.85rem', textTransform: 'uppercase' }}>{order.payment_method}</span>
                                            </div>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'block' }}>VALOR TOTAL</span>
                                            <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--secondary)' }}>R$ {order.total_amount.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    {order.tracking_code && (
                                        <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'rgba(6, 182, 212, 0.05)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <Truck size={16} color="var(--secondary)" />
                                            <span style={{ fontSize: '0.8rem' }}>Rastreio: <strong style={{ color: 'var(--secondary)' }}>{order.tracking_code}</strong></span>
                                        </div>
                                    )}

                                    {/* LÓGICA DE DEVOLUÇÃO / INTERMEDIAÇÃO */}
                                    <div style={{ marginTop: '1.5rem', borderTop: '1px dashed var(--glass-border)', paddingTop: '1.5rem' }}>
                                        {order.status === 'in_resolution' ? (
                                            <div className="glass" style={{ padding: '10px', background: 'rgba(234, 179, 8, 0.1)', borderColor: '#eab308' }}>
                                                <div style={{ fontSize: '0.7rem', fontWeight: '900', color: '#eab308', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={12} /> INTERMEDIAÇÃO EM ANDAMENTO
                                                </div>
                                                <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                                                    Sua solicitação está sendo processada junto ao fornecedor. Aguarde instruções de logística reversa.
                                                </p>
                                            </div>
                                        ) : (
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                                                    {new Date().getTime() - new Date(order.created_at).getTime() < 10 * 24 * 60 * 60 * 1000 ? (
                                                        <span style={{ color: '#22c55e' }}>● Elegível para devolução (7 dias úteis)</span>
                                                    ) : (
                                                        <span style={{ color: 'var(--text-muted)' }}>○ Prazo de devolução expirado</span>
                                                    )}
                                                </div>
                                                {new Date().getTime() - new Date(order.created_at).getTime() < 10 * 24 * 60 * 60 * 1000 && (
                                                    <button
                                                        onClick={async () => {
                                                            if (!confirm('Você deseja abrir uma solicitação de devolução junto ao fornecedor via intermediação?')) return;
                                                            try {
                                                                const res = await fetch('/api/v2/orders/resolution', {
                                                                    method: 'POST',
                                                                    headers: { 'Content-Type': 'application/json' },
                                                                    body: JSON.stringify({
                                                                        order_id: order.id,
                                                                        user_id: user.id,
                                                                        type: 'return',
                                                                        reason: 'Solicitado via Dashboard'
                                                                    })
                                                                });
                                                                const data = await res.json();
                                                                if (data.success) {
                                                                    alert(data.message);
                                                                    fetchOrders();
                                                                } else {
                                                                    alert(data.error);
                                                                }
                                                            } catch (e) {
                                                                alert('Erro ao conectar com a rede de resolução.');
                                                            }
                                                        }}
                                                        className="glass hover-scale"
                                                        style={{ padding: '6px 15px', fontSize: '0.65rem', fontWeight: '800', cursor: 'pointer', borderColor: 'var(--accent)' }}
                                                    >
                                                        SOLICITAR DEVOLUÇÃO
                                                    </button>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}

                        </div>
                    )}
                </div>

                {/* Perfil Lateral & VIP VAULT */}
                <aside>
                    <div className="glass" style={{ padding: '2rem', textAlign: 'center', marginBottom: '2rem' }}>
                        <div className="glass" style={{ display: 'inline-flex', padding: '20px', borderRadius: '50%', marginBottom: '1.5rem', color: 'var(--secondary)', borderColor: isVip ? 'var(--primary)' : 'var(--glass-border)' }}>
                            <UserIcon size={40} />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Perfil Verificado</h3>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '2rem' }}>{user.email}</p>

                        <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                                <Clock size={14} color="var(--secondary)" /> <span>Membro desde 2026</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.8rem' }}>
                                <CheckCircle size={14} color="var(--secondary)" /> <span>Autenticação Biométrica OK</span>
                            </div>
                        </div>
                    </div>

                    {isVip ? (
                        <div className="glass animate-float" style={{ padding: '2rem', background: 'rgba(139, 92, 246, 0.1)', borderColor: 'var(--accent)' }}>
                            <h4 style={{ color: 'var(--accent)', fontWeight: '900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Zap size={18} fill="var(--accent)" /> VIP VAULT OPEN
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Acesso exclusivo a produtos de baixa tiragem desbloqueado.
                            </p>
                            <Link href="/shop?filter=vip" className="btn-cyber" style={{ width: '100%', justifyContent: 'center', fontSize: '0.8rem' }}>ACESSAR COLEÇÃO SECRETA</Link>
                        </div>
                    ) : (
                        <div className="glass" style={{ padding: '2rem', opacity: 0.7 }}>
                            <h4 style={{ color: 'var(--text-muted)', fontWeight: '900', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <LogOut size={18} /> VIP VAULT LOCKED
                            </h4>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                                Faça sua primeira compra acima de R$ 500 para desbloquear.
                            </p>
                        </div>
                    )}
                </aside>
            </div>
        </div>
    );
}

'use client';

import React, { useState } from 'react';
import { Search, Package, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function Rastreio() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;
        setLoading(true);
        setError('');
        setOrder(null);

        try {
            // BACKEND CLIENTE REAL CALL
            const res = await fetchApi(`/api/v2/orders/status/${orderId.trim()}`);
            if (res && res.id) {
                setOrder(res);
            } else {
                setError('Pedido não encontrado ou ID inválido.');
            }
        } catch (e: any) {
            setError(e.message || 'Erro ao localizar pedido. Verifique o ID.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock color="#facc15" />;
            case 'paid': return <CheckCircle color="#22c55e" />;
            case 'shipped': return <Package color="#3b82f6" />;
            default: return <Clock color="#94a3b8" />;
        }
    };

    return (
        <div className="container section">
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Rastrear Pedido</h1>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                Acompanhe o status da sua entrega em tempo real.
            </p>

            <div className="glass" style={{ maxWidth: '600px', margin: '0 auto 4rem auto', padding: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Insira o Código do Pedido (Ex: PED-123...)"
                        className="glass"
                        style={{ flex: 1, padding: '16px', border: '1px solid var(--glass-border)', background: 'transparent', outline: 'none' }}
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <button className="btn-primary" type="submit" disabled={loading}>
                        {loading ? 'Buscando...' : <><Search size={20} /> Rastrear</>}
                    </button>
                </form>
                {error && <p style={{ color: '#ef4444', marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '4px' }}><AlertCircle size={16} /> {error}</p>}
            </div>

            {order && (
                <div className="glass animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pedido: {order.id}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Status atual: <strong style={{ color: 'var(--primary)', textTransform: 'capitalize' }}>{order.status}</strong></p>
                        </div>
                        <div className="glass" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getStatusIcon(order.status)}
                            <span style={{ fontWeight: '700', textTransform: 'uppercase' }}>{order.status}</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed var(--glass-border)' }}>
                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.7rem', top: '0', background: 'var(--background)', padding: '5px' }}>
                                <CheckCircle size={20} color={order.status !== 'pending' ? 'var(--success)' : '#94a3b8'} />
                            </div>
                            <h4 style={{ marginBottom: '4px' }}>Pagamento Confirmado</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {order.status !== 'pending' ? 'Seu pagamento foi confirmado e o pedido está em processamento.' : 'Aguardando confirmação do pagamento.'}
                            </p>
                        </div>

                        <div style={{ marginBottom: '2rem', position: 'relative', opacity: order.status === 'shipped' ? 1 : 0.5 }}>
                            <div style={{ position: 'absolute', left: '-2.7rem', top: '0', background: 'var(--background)', padding: '5px' }}>
                                <Package size={20} color={order.status === 'shipped' ? 'var(--primary)' : '#94a3b8'} />
                            </div>
                            <h4 style={{ marginBottom: '4px' }}>Logística e Envio</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                                {order.tracking_code ? `Objeto postado com código de rastreio: ${order.tracking_code}` : 'Pedido sendo preparado para envio no centro de distribuição.'}
                            </p>
                        </div>

                        <div style={{ opacity: 0.3 }}>
                            <h4 style={{ marginBottom: '4px' }}>Entrega Finalizada</h4>
                            <p style={{ fontSize: '0.9rem' }}>A confirmação de entrega aparecerá automaticamente após a chegada no destino.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

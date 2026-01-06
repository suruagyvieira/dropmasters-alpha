'use client';

import React, { useState } from 'react';
import { Search, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function Rastreio() {
    const [orderId, setOrderId] = useState('');
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId) return;
        setLoading(true);
        try {
            // Em produção, você teria uma rota específica /api/orders/<id>
            const res = await fetchApi('/api/products'); // Mock: apenas para teste de UI
            // Simulação de resultado
            setOrder({
                id: orderId,
                status: 'shipped',
                tracking_code: 'BR123456789CJ',
                updated_at: new Date().toLocaleDateString(),
                items: ['Smartwatch Pro', 'Fone Bluetooth']
            });
        } catch (e) {
            alert('Pedido não encontrado.');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'paid': return <Clock color="var(--accent)" />;
            case 'shipped': return <Package color="var(--primary)" />;
            case 'delivered': return <CheckCircle color="var(--secondary)" />;
            default: return <Clock />;
        }
    };

    return (
        <div className="container section">
            <h1 style={{ textAlign: 'center', marginBottom: '1rem' }}>Rastreie seu Pedido</h1>
            <p style={{ textAlign: 'center', marginBottom: '3rem', color: 'var(--text-muted)' }}>
                Insira o número do seu pedido ou código de rastreio para acompanhar a entrega.
            </p>

            <div className="glass" style={{ maxWidth: '600px', margin: '0 auto 4rem auto', padding: '2rem' }}>
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
                    <input
                        type="text"
                        placeholder="Ex: #ORD-123456"
                        className="glass"
                        style={{ flex: 1, padding: '16px', border: '1px solid var(--glass-border)', background: 'transparent', outline: 'none' }}
                        value={orderId}
                        onChange={(e) => setOrderId(e.target.value)}
                    />
                    <button className="btn-primary" type="submit">
                        <Search size={20} /> Localizar
                    </button>
                </form>
            </div>

            {order && (
                <div className="glass animate-fade-in" style={{ maxWidth: '800px', margin: '0 auto', padding: '3rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                        <div>
                            <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Pedido {order.id}</h2>
                            <p style={{ color: 'var(--text-muted)' }}>Atualizado em: {order.updated_at}</p>
                        </div>
                        <div className="glass" style={{ padding: '12px 20px', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {getStatusIcon(order.status)}
                            <span style={{ fontWeight: '700', textTransform: 'uppercase' }}>{order.status}</span>
                        </div>
                    </div>

                    <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed var(--glass-border)' }}>
                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.7rem', top: '0', background: 'var(--background)', padding: '5px' }}>
                                <CheckCircle size={20} color="var(--secondary)" />
                            </div>
                            <h4 style={{ marginBottom: '4px' }}>Pedido Confirmado</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seu pagamento foi aprovado e o pedido está sendo processado pelo fornecedor.</p>
                        </div>
                        <div style={{ marginBottom: '2rem', position: 'relative' }}>
                            <div style={{ position: 'absolute', left: '-2.7rem', top: '0', background: 'var(--background)', padding: '5px' }}>
                                <Package size={20} color="var(--primary)" />
                            </div>
                            <h4 style={{ marginBottom: '4px' }}>Objeto Postado</h4>
                            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>O fornecedor enviou seu produto. Código de rastreio: <strong style={{ color: 'var(--primary)' }}>{order.tracking_code}</strong></p>
                        </div>
                        <div style={{ opacity: 0.5 }}>
                            <h4 style={{ marginBottom: '4px' }}>Saiu para Entrega</h4>
                            <p style={{ fontSize: '0.9rem' }}>Aguardando atualização da transportadora local.</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

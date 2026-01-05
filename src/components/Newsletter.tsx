'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';

const Newsletter = () => {
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { fetchApi } = await import('@/lib/api');
            await fetchApi('/api/marketing/subscribe', {
                method: 'POST',
                body: JSON.stringify({ email })
            });
            setSubscribed(true);
        } catch (e) {
            console.error('Falha na inscrição:', e);
            alert('Erro ao se inscrever. Tente novamente.');
        }
    };

    if (subscribed) {
        return (
            <div className="glass" style={{ padding: '2rem', textAlign: 'center' }}>
                <h3 style={{ color: 'var(--secondary)', marginBottom: '0.5rem' }}>Obrigado por se inscrever!</h3>
                <p>Você receberá nossas melhores ofertas em breve.</p>
            </div>
        );
    }

    return (
        <div className="glass" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>Fique por dentro das novidades</h3>
            <p style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>Receba ofertas exclusivas e dicas de dropshipping diretamente no seu e-mail.</p>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px' }}>
                <input
                    type="email"
                    placeholder="seu@email.com"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{
                        flex: 1,
                        padding: '12px 16px',
                        borderRadius: '12px',
                        border: '1px solid var(--glass-border)',
                        background: 'rgba(255,255,255,0.05)',
                        color: 'white',
                        outline: 'none'
                    }}
                />
                <button type="submit" className="btn-primary" style={{ padding: '12px' }}>
                    <Send size={20} />
                </button>
            </form>
        </div>
    );
};

export default Newsletter;

'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function SocialProof() {
    const [evidence, setEvidence] = useState<any>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const fetchEvidence = async () => {
            try {
                const data = await fetchApi('/api/v2/evidence');
                setEvidence(data);
                setVisible(true);

                setTimeout(() => setVisible(false), 5000);
            } catch (e) {
                // Ignore silently
            }
        };

        // Mostrar a cada 20-40 segundos
        const timer = setInterval(() => {
            fetchEvidence();
        }, Math.random() * 20000 + 20000);

        // Primeira execução após 5s
        const initial = setTimeout(fetchEvidence, 5000);

        return () => {
            clearInterval(timer);
            clearTimeout(initial);
        };
    }, []);

    if (!evidence) return null;

    return (
        <div className={`glass social-proof-box ${visible ? 'active' : ''}`} style={{
            position: 'fixed',
            bottom: '2rem',
            left: '2rem',
            padding: '1rem 1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
            zIndex: 9999,
            transition: 'all 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: visible ? 'translateX(0)' : 'translateX(-120%)',
            opacity: visible ? 1 : 0,
            background: 'rgba(10, 10, 15, 0.95)',
            border: '1px solid var(--secondary)',
            boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
        }}>
            <div className="glass" style={{ padding: '10px', color: 'var(--secondary)', display: 'flex', alignItems: 'center' }}>
                <ShoppingBag size={20} />
            </div>
            <div>
                <p style={{ fontSize: '0.8rem', fontWeight: '800', margin: 0 }}>
                    {evidence.name} de {evidence.city}
                </p>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
                    Acabou de adquirir <span style={{ color: 'var(--secondary)' }}>{evidence.product}</span>
                </p>
                <p style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)', marginTop: '4px' }}>
                    há {evidence.ago}
                </p>
            </div>
        </div>
    );
}

'use client';

import React, { useState, useEffect, memo } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Cpu, Globe, Zap } from 'lucide-react';

const NeuralSignal = () => {
    const [signal, setSignal] = useState<any>(null);
    const [isVisible, setIsVisible] = useState(false);

    const signals = [
        { text: "AI Detectou alta demanda (Viral) no TikTok.", icon: <TrendingUp size={16} />, color: "var(--secondary)" },
        { text: "Roteamento de Fornecedor CJ-1: Latência Zero.", icon: <Globe size={16} />, color: "var(--success)" },
        { text: "Otimização de Preço: Margem Otimizada (+12%).", icon: <Zap size={16} />, color: "var(--primary)" },
        { text: "Nodo de Repasse Automático: Sincronizado.", icon: <Cpu size={16} />, color: "#fff" },
        { text: "Escassez em escala: Restam poucos 'Earbuds Neural'.", icon: <AlertTriangle size={16} />, color: "var(--accent)" },
    ];

    useEffect(() => {
        const neuralLoop = () => {
            if (document.hidden) return; // Performance: Não processa se não estiver visível

            const random = signals[Math.floor(Math.random() * signals.length)];
            setSignal(random);
            setIsVisible(true);

            // Tempo de exibição: 6 segundos
            setTimeout(() => {
                setIsVisible(false);
            }, 6000);
        };

        // Delay inicial
        const initialTimer = setTimeout(neuralLoop, 10000);

        // Loop a cada 15-25 segundos
        const mainTimer = setInterval(neuralLoop, 20000 + Math.random() * 10000);

        return () => {
            clearTimeout(initialTimer);
            clearInterval(mainTimer);
        };
    }, []);

    if (!signal) return null;

    return (
        <div
            className="glass-premium"
            style={{
                position: 'fixed',
                top: '100px', // Abaixo do Header
                right: '2rem',
                padding: '1rem 1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                zIndex: 2000,
                borderColor: signal.color,
                background: 'rgba(8, 8, 12, 0.98)',
                boxShadow: `0 10px 40px ${signal.color}15, 0 0 2px ${signal.color}`,
                transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
                transform: isVisible ? 'translate3d(0, 0, 0)' : 'translate3d(130%, 0, 0)',
                opacity: isVisible ? 1 : 0,
                pointerEvents: 'none',
                borderLeft: `5px solid ${signal.color}`,
                borderRadius: '12px'
            }}
        >
            <div style={{ color: signal.color, display: 'flex', filter: `drop-shadow(0 0 8px ${signal.color})` }} className="animate-pulse">
                {signal.icon}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                <span style={{ fontSize: '0.6rem', fontWeight: '900', color: signal.color, letterSpacing: '2.5px', textTransform: 'uppercase', opacity: 0.8 }}>SYSTEM SIGNAL active</span>
                <span style={{ fontSize: '0.85rem', fontWeight: '600', color: '#fff', letterSpacing: '-0.01em' }}>{signal.text}</span>
            </div>
        </div>
    );
};

export default memo(NeuralSignal);

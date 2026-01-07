'use client';

import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Bot, Sparkles } from 'lucide-react';
import { fetchApi } from '@/lib/api';

export default function AIChatBot() {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<{ role: 'user' | 'bot', text: string }[]>([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping]);

    // Initial greeting
    useEffect(() => {
        if (isOpen && messages.length === 0) {
            const fetchGreeting = async () => {
                setIsTyping(true);
                try {
                    const res = await fetchApi('/api/v2/support/chat', {
                        method: 'POST',
                        body: JSON.stringify({ query: '', isFirstToken: true })
                    });
                    setMessages([{ role: 'bot', text: res.response }]);
                } catch (e) {
                    setMessages([{ role: 'bot', text: "Quantum Core Alpha online. Como posso acelerar seu rendimento hoje?" }]);
                } finally {
                    setIsTyping(false);
                }
            };
            fetchGreeting();
        }
    }, [isOpen, messages.length]);

    const handleSend = async () => {
        if (!input.trim() || isTyping) return;

        const userMsg = input;
        setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
        setInput('');
        setIsTyping(true);

        try {
            const res = await fetchApi('/api/v2/support/chat', {
                method: 'POST',
                body: JSON.stringify({ query: userMsg })
            });

            setMessages(prev => [...prev, { role: 'bot', text: res.response }]);
        } catch (e) {
            setMessages(prev => [...prev, { role: 'bot', text: "Desculpe, tive um pequeno gap na conexão neural. Pode repetir?" }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div style={{ position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 9999 }}>
            {!isOpen ? (
                <button
                    onClick={() => setIsOpen(true)}
                    className="pulse-ai optimistic"
                    style={{
                        width: '64px', height: '64px', borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                        border: '1px solid rgba(255,255,255,0.2)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 0 30px rgba(139, 92, 246, 0.6)', cursor: 'pointer',
                        backdropFilter: 'blur(10px)',
                        transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageCircle color="#fff" size={32} />
                    <span style={{
                        position: 'absolute', top: 0, right: 0,
                        width: '16px', height: '16px', background: '#22c55e',
                        borderRadius: '50%', border: '2px solid #000'
                    }}></span>
                </button>
            ) : (
                <div className="animate-slide-up" style={{
                    width: '380px',
                    height: '600px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'rgba(5, 5, 10, 0.85)',
                    backdropFilter: 'blur(20px)',
                    WebkitBackdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 40px 100px -20px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.1) inset',
                    borderRadius: '24px',
                    overflow: 'hidden',
                    fontFamily: '"Outfit", sans-serif'
                }}>
                    {/* Header Premium */}
                    <div style={{
                        padding: '1.5rem',
                        background: 'linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 100%)',
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '40px', height: '40px', borderRadius: '12px',
                                background: 'linear-gradient(135deg, var(--primary) 0%, var(--action) 100%)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                boxShadow: '0 0 15px rgba(139, 92, 246, 0.4)'
                            }}>
                                <Bot size={22} color="#fff" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                                <span style={{ fontWeight: '800', color: '#fff', fontSize: '1rem', letterSpacing: '0.5px' }}>QUANTUM CORE</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span className="pulse-ai" style={{ width: '6px', height: '6px', background: '#22c55e', borderRadius: '50%' }}></span>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', fontWeight: '600', letterSpacing: '1px' }}>ONLINE | v2026.4</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{
                                background: 'transparent', border: 'none', cursor: 'pointer', padding: '8px',
                                color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Chat Area - Matrix Style */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1, padding: '1.5rem', overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', gap: '1.2rem',
                            scrollBehavior: 'smooth',
                            backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)'
                        }}
                    >
                        <div style={{
                            fontSize: '0.7rem', color: 'var(--text-muted)', textAlign: 'center',
                            padding: '10px', borderRadius: '12px', background: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.05)', display: 'inline-flex', alignSelf: 'center',
                            alignItems: 'center', gap: '6px', boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
                        }}>
                            <Sparkles size={12} color="var(--action)" />
                            <span>Link Neural Criptografado Estabelecido</span>
                        </div>

                        {messages.map((m, i) => (
                            <div key={i} className="animate-fade-in" style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '14px 18px',
                                borderRadius: m.role === 'user' ? '20px 20px 4px 20px' : '20px 20px 20px 4px',
                                fontSize: '0.9rem', lineHeight: '1.6',
                                background: m.role === 'user'
                                    ? 'linear-gradient(135deg, var(--primary) 0%, #6d28d9 100%)'
                                    : 'rgba(255,255,255,0.05)',
                                color: m.role === 'user' ? '#fff' : 'rgba(255,255,255,0.9)',
                                border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.05)' : 'none',
                                boxShadow: m.role === 'user'
                                    ? '0 10px 30px -10px rgba(139, 92, 246, 0.5)'
                                    : '0 4px 20px rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(5px)'
                            }}>
                                {m.text}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '12px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', border: '1px solid rgba(139, 92, 246, 0.2)', alignSelf: 'flex-start' }}>
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <div className="pulse-ai" style={{ width: '6px', height: '6px', background: 'var(--action)', borderRadius: '50%', animationDelay: '0ms' }}></div>
                                    <div className="pulse-ai" style={{ width: '6px', height: '6px', background: 'var(--action)', borderRadius: '50%', animationDelay: '200ms' }}></div>
                                    <div className="pulse-ai" style={{ width: '6px', height: '6px', background: 'var(--action)', borderRadius: '50%', animationDelay: '400ms' }}></div>
                                </div>
                                <div style={{ fontSize: '0.65rem', color: 'var(--action)', fontFamily: 'monospace', opacity: 0.8 }}>
                                    {['[SYNAPSE_INIT]', '[SCANN_LOGISTICS_HUB]', '[CALC_ROI_MARGIN]', '[SYNTHESIZING_RESPONSE]'][Math.floor(Date.now() / 1000) % 4]}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input Area - Floating Dock */}
                    <div style={{ padding: '1.5rem', background: 'linear-gradient(0deg, rgba(0,0,0,0.4) 0%, transparent 100%)' }}>
                        <div style={{
                            display: 'flex', gap: '10px',
                            background: 'rgba(255,255,255,0.05)',
                            border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: '16px', padding: '8px',
                            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
                            transition: 'border-color 0.2s'
                        }}
                            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
                            onBlur={(e) => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'}
                        >
                            <input
                                type="text"
                                placeholder="Digite seu comando..."
                                value={input}
                                autoFocus
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '10px 14px',
                                    color: '#fff',
                                    fontWeight: '500',
                                    fontSize: '0.95rem',
                                    outline: 'none',
                                    fontFamily: 'inherit'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping}
                                className="btn-cyber"
                                style={{
                                    width: '42px',
                                    height: '42px',
                                    borderRadius: '12px',
                                    padding: 0,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    opacity: input.trim() ? 1 : 0.5,
                                    transform: input.trim() ? 'scale(1)' : 'scale(0.95)',
                                    transition: 'all 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)'
                                }}
                            >
                                <Send size={18} color="#fff" style={{ marginLeft: input.trim() ? '2px' : 0 }} />
                            </button>
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '10px' }}>
                            <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', letterSpacing: '1px', textTransform: 'uppercase' }}>
                                Powered by Apex Neural Link
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

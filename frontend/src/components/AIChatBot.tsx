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
                    className="shadow-premium"
                    style={{
                        width: '60px', height: '60px', borderRadius: '50%',
                        background: 'var(--primary)',
                        border: 'none',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        color: 'white',
                        cursor: 'pointer',
                        transition: 'transform 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                    <MessageCircle size={28} />
                </button>
            ) : (
                <div className="animate-fade-in shadow-premium" style={{
                    width: '360px',
                    height: '550px',
                    display: 'flex',
                    flexDirection: 'column',
                    background: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                    fontFamily: 'var(--font-main)'
                }}>
                    {/* Header */}
                    <div style={{
                        padding: '1.25rem',
                        background: 'var(--primary)',
                        color: 'white',
                        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                    }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '38px', height: '38px', borderRadius: '10px',
                                background: 'rgba(255,255,255,0.2)',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <Bot size={22} color="#fff" />
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '700', fontSize: '0.95rem' }}>Suporte DropMasters</span>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                    <span style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></span>
                                    <span style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.8)', fontWeight: '500' }}>Atendimento Online</span>
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#fff', opacity: 0.7 }}
                        >
                            <X size={20} />
                        </button>
                    </div>

                    {/* Chat Area */}
                    <div
                        ref={scrollRef}
                        style={{
                            flex: 1, padding: '1.25rem', overflowY: 'auto',
                            display: 'flex', flexDirection: 'column', gap: '1rem',
                            background: '#f8fafc'
                        }}
                    >
                        <div style={{
                            fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center',
                            margin: '0.5rem 0', fontWeight: '500'
                        }}>
                            Conectado com sucesso
                        </div>

                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%',
                                padding: '10px 14px',
                                borderRadius: m.role === 'user' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                                fontSize: '0.9rem', lineHeight: '1.5',
                                background: m.role === 'user' ? 'var(--primary)' : '#fff',
                                color: m.role === 'user' ? '#fff' : 'var(--foreground)',
                                border: m.role === 'bot' ? '1px solid #e2e8f0' : 'none',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>
                                {m.text}
                            </div>
                        ))}

                        {isTyping && (
                            <div style={{
                                padding: '10px 14px',
                                background: '#fff',
                                borderRadius: '16px',
                                border: '1px solid #e2e8f0',
                                alignSelf: 'flex-start',
                                display: 'flex',
                                gap: '4px'
                            }}>
                                <div className="pulse-ai" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%' }}></div>
                                <div className="pulse-ai" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animationDelay: '0.2s' }}></div>
                                <div className="pulse-ai" style={{ width: '5px', height: '5px', background: 'var(--text-muted)', borderRadius: '50%', animationDelay: '0.4s' }}></div>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1rem', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                        <div style={{
                            display: 'flex', gap: '8px',
                            background: '#f1f5f9',
                            borderRadius: '12px', padding: '6px'
                        }}>
                            <input
                                type="text"
                                placeholder="Envie sua mensagem..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                                style={{
                                    flex: 1,
                                    background: 'transparent',
                                    border: 'none',
                                    padding: '8px 12px',
                                    color: 'var(--foreground)',
                                    fontSize: '0.9rem',
                                    outline: 'none'
                                }}
                            />
                            <button
                                onClick={handleSend}
                                disabled={isTyping || !input.trim()}
                                style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '8px',
                                    background: input.trim() ? 'var(--primary)' : '#cbd5e1',
                                    border: 'none',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: 'white',
                                    cursor: 'pointer',
                                    transition: 'background 0.2s'
                                }}
                            >
                                <Send size={18} />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

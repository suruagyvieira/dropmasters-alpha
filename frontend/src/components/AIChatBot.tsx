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
                        width: '60px', height: '60px', borderRadius: '50%', background: 'var(--primary)',
                        border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        boxShadow: '0 10px 30px rgba(139, 92, 246, 0.4)', cursor: 'pointer'
                    }}
                >
                    <MessageCircle color="#fff" size={28} />
                </button>
            ) : (
                <div className="glass animate-slide-up neural-glow" style={{
                    width: '350px',
                    height: '500px',
                    display: 'flex',
                    flexDirection: 'column',
                    border: '1px solid var(--primary-glow)',
                    background: 'rgba(10, 10, 15, 0.98)',
                    filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.5))',
                    overflow: 'hidden',
                    borderRadius: '16px'
                }}>
                    {/* Header */}
                    <div style={{ padding: '1.2rem', background: 'var(--primary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Bot size={20} color="#fff" />
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontWeight: '800', color: '#fff', fontSize: '0.9rem', letterSpacing: '1px', lineHeight: '1' }}>QUANTUM CORE</span>
                                <span style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.7)', fontWeight: '400' }}>AGENTIC SUPPORT v2026.4</span>
                            </div>
                        </div>
                        <X color="#fff" size={20} style={{ cursor: 'pointer' }} onClick={() => setIsOpen(false)} />
                    </div>

                    {/* Chat Area */}
                    <div
                        ref={scrollRef}
                        style={{ flex: 1, padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1rem', scrollBehavior: 'smooth' }}
                    >
                        <div className="glass" style={{ padding: '10px', fontSize: '0.7rem', background: 'rgba(255,255,255,0.03)', color: 'var(--text-muted)', textAlign: 'center', borderRadius: '8px', border: '1px dashed rgba(255,255,255,0.1)' }}>
                            <Sparkles size={12} style={{ display: 'inline', marginRight: '5px', verticalAlign: 'middle' }} />
                            A conexão criptografada via rede neural está ativa.
                        </div>

                        {messages.map((m, i) => (
                            <div key={i} style={{
                                alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                                maxWidth: '85%', padding: '12px 16px', borderRadius: '14px',
                                fontSize: '0.85rem', lineHeight: '1.5',
                                background: m.role === 'user' ? 'var(--primary)' : 'rgba(255,255,255,0.07)',
                                color: '#fff',
                                border: m.role === 'bot' ? '1px solid rgba(255,255,255,0.1)' : 'none',
                                boxShadow: m.role === 'user' ? '0 4px 15px rgba(139, 92, 246, 0.2)' : 'none'
                            }}>
                                {m.text}
                            </div>
                        ))}
                        {isTyping && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingLeft: '5px' }}>
                                <div className="pulse-ai" style={{ width: '8px', height: '8px', background: 'var(--accent)', borderRadius: '50%' }}></div>
                                <span style={{ fontSize: '0.7rem', color: 'var(--accent)', fontWeight: '600', letterSpacing: '0.5px' }}>
                                    QUANTUM PROCESSING...
                                </span>
                            </div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div style={{ padding: '1.2rem', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.2)' }}>
                        <input
                            type="text"
                            placeholder="Consultar rede neural..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            style={{
                                flex: 1,
                                background: 'rgba(255,255,255,0.05)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '12px 16px',
                                color: '#fff',
                                fontSize: '0.85rem',
                                outline: 'none'
                            }}
                        />
                        <button
                            onClick={handleSend}
                            disabled={isTyping}
                            style={{
                                width: '45px',
                                height: '45px',
                                borderRadius: '12px',
                                background: 'var(--primary)',
                                border: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                opacity: isTyping ? 0.5 : 1,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Send size={20} color="#fff" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

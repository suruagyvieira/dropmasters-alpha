import React from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';

export default function Contato() {
    return (
        <div className="container section">
            <h1>Contato & Suporte</h1>
            <p style={{ marginBottom: '3rem' }}>Estamos aqui para ajudar com suas dúvidas, pedidos e parcerias.</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    <div className="glass" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
                        <Mail color="var(--primary)" />
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>E-mail</h4>
                            <p>suporte@dropmasters.com.br</p>
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
                        <Phone color="var(--secondary)" />
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>WhatsApp</h4>
                            <p>+55 (11) 99999-9999</p>
                        </div>
                    </div>
                    <div className="glass" style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
                        <MapPin color="var(--accent)" />
                        <div>
                            <h4 style={{ marginBottom: '0.5rem' }}>Endereço</h4>
                            <p>São Paulo, SP - Digital Nomads Hub</p>
                        </div>
                    </div>
                </div>

                <div className="glass" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem' }}>Envie uma mensagem</h3>
                    <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seu Nome</label>
                            <input type="text" className="glass" style={{ padding: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'transparent' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Seu E-mail</label>
                            <input type="email" className="glass" style={{ padding: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'transparent' }} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <label style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Mensagem</label>
                            <textarea rows={4} className="glass" style={{ padding: '12px', border: '1px solid var(--glass-border)', outline: 'none', background: 'transparent', resize: 'none' }}></textarea>
                        </div>
                        <button type="button" className="btn-primary" style={{ justifyContent: 'center' }}>
                            Enviar Mensagem <Send size={18} />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

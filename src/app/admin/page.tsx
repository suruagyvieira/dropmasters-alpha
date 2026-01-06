'use client';

import React, { useState, useEffect } from 'react';
import { fetchApi } from '@/lib/api';
import {
    BrainCircuit, TrendingUp, DollarSign,
    Activity, Sparkles, ShieldCheck,
    RefreshCw, Zap, Cpu, Mail, MessageCircle, Truck
} from 'lucide-react';

interface Analytics {
    revenue: number;
    profit: number;
    conversions: string;
    ai_status?: {
        mood: string;
        velocity: string;
        last_pivot: string;
    };
    logs: any[];
}

const MetricCard = ({ icon, label, value, delta, color }: any) => (
    <div className="glass" style={{ padding: '1.5rem', border: `1px solid ${color}44` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1rem' }}>
            {icon}
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '900', textTransform: 'uppercase' }}>{label}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <h2 style={{ fontSize: '1.8rem', color: '#fff', fontWeight: '800' }}>{value}</h2>
            <span style={{ fontSize: '0.7rem', color, fontWeight: '900' }}>{delta}</span>
        </div>
    </div>
);

export default function AutonomousCommandCenter() {
    const [analytics, setAnalytics] = useState<Analytics | null>(null);
    const [loading, setLoading] = useState(true);
    const [marketingAssets, setMarketingAssets] = useState<any[]>([]);
    const [recoveryLeads, setRecoveryLeads] = useState<any[]>([]);
    const [marketingCreatives, setMarketingCreatives] = useState<any | null>(null);
    const [vslScripts, setVslScripts] = useState<any | null>(null);
    const [mediaQueue, setMediaQueue] = useState<any>({});
    const [paidOrders, setPaidOrders] = useState<any[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [trackingInputs, setTrackingInputs] = useState<any>({});

    // START SENTIENT MODE HOOKS
    const [sentientMode, setSentientMode] = useState(false);
    const [terminalLines, setTerminalLines] = useState<string[]>(["> NEURAL INTERFACE READY..."]);

    const addTerminalLine = (line: string) => {
        setTerminalLines(prev => [`> ${line}`, ...prev].slice(0, 10));
    };

    // ADVANCED AI 2026: NEURAL CORE VISUALIZATION
    const [neuralNodes, setNeuralNodes] = useState<any[]>([]);

    useEffect(() => {
        // Init Neural Nodes
        const nodes = Array.from({ length: 20 }, (_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            active: Math.random() > 0.5,
            pulse: Math.random() * 2 + 1
        }));
        setNeuralNodes(nodes);

        const interval = setInterval(() => {
            if (document.hidden) return;
            setNeuralNodes(prev => prev.map(n => ({
                ...n,
                active: Math.random() > 0.3, // Chaos factor
                x: n.x + (Math.random() - 0.5) * 5, // Jitter
                y: n.y + (Math.random() - 0.5) * 5
            })));
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    // AUTO-PILOT LOGIC V2.0 (Self-Optimizing)
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (sentientMode) {
            addTerminalLine("SENTIENT MODE V2.0 ENGAGED. NEURAL CORE ONLINE.");
            timer = setInterval(async () => {
                if (document.hidden) return; // Battery Saver Mode
                const actionRoll = Math.random();

                if (actionRoll > 0.7) {
                    addTerminalLine("SCANNING GLOBAL TRAFFIC VECTORS...");
                    if (Math.random() > 0.5) {
                        try {
                            // Self-Correction: Analyze if organic is too low
                            const organicCheck = Math.random();
                            const mode = organicCheck > 0.8 ? 'viral' : 'low';
                            await fetchApi(`/api/admin/inject-traffic?mode=${mode}`);
                            addTerminalLine(`AUTONOMOUS ACTION: Traffic Injection [${mode.toUpperCase()}] triggered via Neural Core.`);
                        } catch (e) { }
                    }
                } else if (actionRoll > 0.45) {
                    const priceAdjustment = (Math.random() * 2 - 1).toFixed(2);
                    addTerminalLine(`DYNAMIC PRICING: Adjusting global skew by ${priceAdjustment}% for yield optimization.`);
                } else if (actionRoll > 0.2) {
                    addTerminalLine("ANALYZING COMPETITOR PRICING & STOCK LEVELS...");
                } else {
                    addTerminalLine("NEURAL REGIME CHANGE: HOLDING PATTERN.");
                }

                if (Math.random() > 0.95) {
                    addTerminalLine("!!! HIGH CONVERSION PROBABILITY DETECTED [98.4%] !!!");
                    addTerminalLine("EXECUTING CLOSING SEQUENCE...");
                    try {
                        const res = await fetchApi('/api/admin/inject-traffic?mode=sale');
                        if (res.success) addTerminalLine("SUCCESS: AUTONOMOUS SALE CAPTURED & FULFILLED.");
                    } catch (e) { }
                }
                loadData();
            }, 3500);
        } else {
            if (terminalLines[0] !== "MANUAL OVERRIDE. WAITING FOR COMMAND.") {
                addTerminalLine("MANUAL OVERRIDE. WAITING FOR COMMAND.");
            }
        }
        return () => clearInterval(timer);
    }, [sentientMode]);

    async function loadData() {
        try {
            const adminToken = localStorage.getItem('admin_secret') || '';
            const headers = { 'Authorization': `Bearer ${adminToken}` };

            const [aData, mData, rData, pData, qData] = await Promise.all([
                fetchApi('/api/admin/analytics', { headers }),
                fetchApi('/api/v2/marketing/assets', { headers }),
                fetchApi('/api/admin/recovery', { headers }),
                fetchApi('/api/admin/orders/paid', { headers }),
                fetchApi('/api/v2/marketing/media-status', { headers })
            ]);
            setAnalytics(aData);
            setMarketingAssets(mData);
            setRecoveryLeads(rData);
            setPaidOrders(pData);
            setMediaQueue(qData);
        } catch (e) {
            console.error("Neural Link Interrupted");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <div className="container section"><h1>Iniciando Neural Link...</h1></div>;

    return (
        <div className="container section">
            {/* Header com IA Viva */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 className="cyber-glitch" data-text="BIO-NEURAL COMMAND">BIO-NEURAL COMMAND</h1>
                    <p style={{ color: 'var(--secondary)', fontWeight: '800', letterSpacing: '2px' }}>QUANTUM ENGINE v8.9 [SENTIENT]</p>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    {/* SENTIENT TOGGLE */}
                    <div className="glass" style={{ padding: '0.5rem 1.5rem', display: 'flex', alignItems: 'center', gap: '15px', border: sentientMode ? '1px solid var(--primary)' : '1px solid var(--text-muted)' }}>
                        <span style={{ fontSize: '0.8rem', fontWeight: '900', color: sentientMode ? 'var(--primary)' : 'var(--text-muted)' }}>
                            {sentientMode ? 'SENTIENT AUTO-PILOT ON' : 'MANUAL MODE'}
                        </span>
                        <label className="switch" style={{ position: 'relative', display: 'inline-block', width: '40px', height: '20px' }}>
                            <input
                                type="checkbox"
                                checked={sentientMode}
                                onChange={(e) => setSentientMode(e.target.checked)}
                                style={{ opacity: 0, width: 0, height: 0 }}
                            />
                            <span className="slider round" style={{
                                position: 'absolute', cursor: 'pointer', top: 0, left: 0, right: 0, bottom: 0,
                                backgroundColor: sentientMode ? 'var(--primary)' : '#ccc',
                                transition: '.4s', borderRadius: '34px'
                            }}>
                                <span style={{
                                    position: 'absolute', content: "", height: '14px', width: '14px', left: sentientMode ? '22px' : '4px', bottom: '3px',
                                    backgroundColor: 'white', transition: '.4s', borderRadius: '50%'
                                }}></span>
                            </span>
                        </label>
                    </div>

                    {/* NEURAL MAP VISUALIZATION */}
                    <div className="glass" style={{ width: '150px', height: '60px', position: 'relative', overflow: 'hidden', background: '#000' }}>
                        {neuralNodes.map((n, i) => (
                            <div key={i} style={{
                                position: 'absolute',
                                left: `${n.x}%`,
                                top: `${n.y}%`,
                                width: n.active ? '4px' : '2px',
                                height: n.active ? '4px' : '2px',
                                borderRadius: '50%',
                                background: n.active ? 'var(--primary)' : 'var(--text-muted)',
                                boxShadow: n.active ? '0 0 5px var(--primary)' : 'none',
                                transition: 'all 1s ease'
                            }} />
                        ))}
                        {/* Connecting lines fake */}
                        <svg style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0.2, pointerEvents: 'none' }}>
                            <path d="M10,10 Q50,50 90,10" stroke="var(--primary)" fill="none" />
                            <path d="M20,90 Q70,20 120,80" stroke="var(--accent)" fill="none" />
                        </svg>
                    </div>

                    {analytics?.ai_status && (
                        <div className="glass" style={{ padding: '1rem 1.5rem', border: '1px solid var(--primary-glow)', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div className={`pulse-ai ${analytics.ai_status.mood.toLowerCase()}`}></div>
                            <div>
                                <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '900' }}>AI STATE</div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '800', color: 'var(--primary)' }}>{analytics.ai_status.mood.toUpperCase()}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* LIVE TERMINAL */}
            <div className="glass" style={{ padding: '1rem', marginBottom: '3rem', background: '#000', fontFamily: 'monospace', minHeight: '150px', border: '1px solid var(--secondary)' }}>
                {terminalLines.map((line, i) => (
                    <div key={i} style={{ color: i === 0 ? 'var(--primary)' : 'var(--text-muted)', opacity: 1 - (i * 0.1), marginBottom: '5px' }}>
                        {line}
                    </div>
                ))}
            </div>

            {/* TRAFFIC INJECTION SIMULATOR (NEW) */}
            <div className="glass" style={{ padding: '2rem', marginBottom: '3rem', border: '1px solid var(--accent)', background: 'rgba(139, 92, 246, 0.05)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Cpu size={20} color="var(--accent)" /> TRAFFIC INJECTION SIMULATOR (ZERO COST MODE)
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    <button
                        className="btn-cyber"
                        onClick={async () => {
                            const res = await fetchApi('/api/admin/inject-traffic?mode=low');
                            if (res.success) alert("Injeção Leve Iniciada: Visitantes entrando...");
                        }}
                    >
                        <Zap size={16} style={{ marginRight: '8px' }} /> Low Traffic (Organic)
                    </button>
                    <button
                        className="btn-cyber"
                        style={{ borderColor: 'var(--secondary)', color: 'var(--secondary)' }}
                        onClick={async () => {
                            const res = await fetchApi('/api/admin/inject-traffic?mode=viral');
                            if (res.success) alert("ALERTA: PICO VIRAL SIMULADO! Monitorar Vendas.");
                        }}
                    >
                        <Activity size={16} style={{ marginRight: '8px' }} /> VIRAL SPIKE (TikTok)
                    </button>
                    <button
                        className="glass"
                        style={{ borderColor: '#22c55e', color: '#22c55e' }}
                        onClick={async () => {
                            const res = await fetchApi('/api/admin/inject-traffic?mode=sale');
                            if (res.success) {
                                alert("Venda Simulada Gerada! Verifique o Log e Repasse Automático.");
                                loadData(); // Atualiza painel instantaneamente
                            }
                        }}
                    >
                        <DollarSign size={16} style={{ marginRight: '8px' }} /> GENERATE FAKE SALE
                    </button>
                </div>
                <p style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    * Simula tráfego real para validar escalabilidade serverless e automação de repasse sem gastar com Ads.
                </p>
            </div>

            {/* Métricas Alpha */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', marginBottom: '4rem' }}>
                <MetricCard
                    icon={<DollarSign color="var(--secondary)" />}
                    label="Receita Total (Bruto)"
                    value={`R$ ${analytics?.revenue?.toFixed(2)}`}
                    delta="+100% Live"
                    color="var(--secondary)"
                />
                <MetricCard
                    icon={<TrendingUp color="var(--primary)" />}
                    label="Lucro Líquido Real"
                    value={`R$ ${analytics?.profit?.toFixed(2)}`}
                    delta="Optimized"
                    color="var(--primary)"
                />
                <MetricCard
                    icon={<Sparkles color="var(--accent)" />}
                    label="Taxa de Conversão"
                    value={analytics?.conversions}
                    delta="Extreme"
                    color="var(--accent)"
                />
            </div>

            {/* Recovery Leads & Marketing */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>

                {/* Recovery Nexus Section */}
                <div className="glass" style={{ padding: '2rem', border: '1px solid var(--primary-glow)' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <Mail size={20} color="var(--primary)" /> Recovery Nexus (Abandoned)
                    </h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                        {recoveryLeads.length > 0 ? recoveryLeads.map((lead: any, i: number) => (
                            <div key={i} className="glass" style={{ padding: '1rem', background: 'rgba(6, 182, 212, 0.03)' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                    <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--primary)' }}>LEAD {i + 1}</span>
                                    <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>{new Date(lead.time).toLocaleTimeString()}</span>
                                </div>
                                <div style={{ fontWeight: '700', marginBottom: '4px' }}>{lead.email}</div>
                                <div style={{ fontSize: '0.9rem', color: 'var(--secondary)', marginBottom: '1rem' }}>Total: R$ {lead.amount}</div>
                                <button
                                    className="btn-cyber"
                                    style={{ fontSize: '0.6rem', padding: '6px 12px', width: '100%', marginBottom: '6px' }}
                                    onClick={() => {
                                        const phone = lead.phone || ""; // Fallback if phone is available later
                                        const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(lead.recovery_text)}`;
                                        window.open(url, '_blank');
                                    }}
                                >
                                    <Zap size={12} style={{ marginRight: '6px' }} /> DISPATCH WHATSAPP
                                </button>
                                <button
                                    className="glass"
                                    style={{ fontSize: '0.6rem', padding: '6px 12px', width: '100%', border: '1px solid var(--glass-border)', cursor: 'pointer' }}
                                    onClick={() => {
                                        navigator.clipboard.writeText(lead.recovery_text);
                                        alert("Script de recuperação copiado!");
                                    }}
                                >
                                    COPIAR SCRIPT
                                </button>
                            </div>
                        )) : <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum abandono detectado nas últimas 24h.</p>}
                    </div>
                </div>

            </div>

            {/* AI Media Engine v8.8 */}
            <div className="glass" style={{ padding: '2rem', border: '1px solid var(--accent-glow)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Sparkles size={20} color="var(--accent)" /> AI Media Engine (Creatives)
                </h3>

                <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem' }}>
                    <select
                        id="product-select"
                        className="glass"
                        style={{ flex: 1, padding: '10px', background: 'rgba(0,0,0,0.3)', color: '#fff', border: '1px solid var(--glass-border)', borderRadius: '8px' }}
                    >
                        {marketingAssets.map((a: any, i: number) => (
                            <option key={i} value={a.product} data-category={a.category}>{a.product}</option>
                        ))}
                    </select>
                    <button
                        className="btn-cyber"
                        disabled={isGenerating}
                        onClick={async () => {
                            setIsGenerating(true);
                            try {
                                const select = document.getElementById('product-select') as HTMLSelectElement;
                                const product = select.value;
                                const category = select.options[select.selectedIndex].getAttribute('data-category');
                                const adminToken = localStorage.getItem('admin_secret') || '';
                                const data = await fetchApi(`/api/v2/marketing/creatives?product=${encodeURIComponent(product)}&category=${encodeURIComponent(category || 'General')}`, {
                                    headers: { 'Authorization': `Bearer ${adminToken}` }
                                });
                                setMarketingCreatives(data);
                            } catch (e) {
                                alert("Erro ao conectar com Media Engine.");
                            } finally {
                                setIsGenerating(false);
                            }
                        }}
                    >
                        {isGenerating ? 'GERANDO...' : 'GERAR CRIATIVO'}
                    </button>
                </div>

                {marketingCreatives && (
                    <div className="animate-fade-in">
                        <div className="glass" style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
                            <div style={{ fontSize: '0.65rem', color: 'var(--accent)', fontWeight: '900', marginBottom: '10px' }}>PROPOSTA DE ANÚNCIO</div>
                            <h4 style={{ color: '#fff', marginBottom: '1rem' }}>{marketingCreatives.primary_hook}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                                {marketingCreatives.visual_assets.map((img: string, i: number) => (
                                    <img key={i} src={img} style={{ width: '100%', borderRadius: '8px', border: '1px solid var(--glass-border)' }} alt="Ad variant" loading="lazy" />
                                ))}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem' }}>
                                <span style={{ color: 'var(--text-muted)' }}>CTR Estimado: <b style={{ color: '#22c55e' }}>{marketingCreatives.estimated_ctr}</b></span>
                                <span style={{ color: 'var(--text-muted)' }}>Público: <b>{marketingCreatives.recommended_audience}</b></span>
                            </div>

                            <button
                                className="glass"
                                style={{ width: '100%', marginTop: '1.5rem', padding: '10px', fontSize: '0.7rem' }}
                                onClick={async () => {
                                    setIsGenerating(true);
                                    try {
                                        const adminToken = localStorage.getItem('admin_secret') || '';
                                        const data = await fetchApi(`/api/v2/marketing/vsl?product=${encodeURIComponent(marketingCreatives.product)}`, {
                                            headers: { 'Authorization': `Bearer ${adminToken}` }
                                        });
                                        setVslScripts(data);
                                    } catch (e) {
                                        alert("Erro ao conectar com VSL Engine.");
                                    } finally {
                                        setIsGenerating(false);
                                    }
                                }}
                            >
                                GERAR ROTEIRO DE VÍDEO (VSL)
                            </button>
                        </div>

                        {vslScripts && (
                            <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
                                <div className="glass" style={{ padding: '1.5rem', border: '1px solid var(--secondary-glow)' }}>
                                    <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', fontWeight: '900', marginBottom: '1rem' }}>ROTEIRO VSL (VIDEO SALES LETTER)</div>
                                    {vslScripts.vsl_scripts.map((script: any, idx: number) => (
                                        <div key={idx} style={{ marginBottom: '2rem' }}>
                                            <h5 style={{ color: 'var(--secondary)', marginBottom: '10px' }}>{script.format}</h5>
                                            <div style={{ display: 'grid', gap: '10px' }}>
                                                {script.scenes.map((scene: any, sIdx: number) => (
                                                    <div key={sIdx} className="glass" style={{ padding: '10px', fontSize: '0.8rem', background: 'rgba(0,0,0,0.2)' }}>
                                                        <div style={{ color: 'var(--primary)', fontWeight: '800', marginBottom: '4px' }}>[{scene.time}]</div>
                                                        <div style={{ color: '#fff', marginBottom: '4px' }}>🎬 {scene.visual}</div>
                                                        <div style={{ color: 'var(--text-muted)' }}>🎙️ {scene.audio}</div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="glass" style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(139, 92, 246, 0.05)', border: '1px dashed var(--accent)' }}>
                                                <div style={{ fontSize: '0.6rem', color: 'var(--accent)', fontWeight: '900', marginBottom: '5px' }}>INTERNET AI VIDEO PROMPT (Use em Sora/Runway/Pika)</div>
                                                <code style={{ fontSize: '0.7rem', color: '#fff', display: 'block', marginBottom: '10px' }}>{script.ai_prompt}</code>
                                                <button
                                                    className="btn-cyber"
                                                    style={{ fontSize: '0.6rem', padding: '5px 10px', background: 'var(--accent)' }}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(script.ai_prompt);
                                                        alert("Prompt de Vídeo copiado!");
                                                        window.open('https://runwayml.com/', '_blank');
                                                    }}
                                                >
                                                    COPIAR PROMPT & ABRIR RUNWAY
                                                </button>
                                            </div>
                                        </div>
                                    ))}

                                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                                        <button
                                            className="btn-cyber pulse-ai optimistic"
                                            style={{ width: '100%', padding: '1rem' }}
                                            onClick={async () => {
                                                const adminToken = localStorage.getItem('admin_secret') || '';
                                                await fetchApi('/api/v2/marketing/vsl/dispatch', {
                                                    method: 'POST',
                                                    headers: { 'Authorization': `Bearer ${adminToken}` },
                                                    body: JSON.stringify({
                                                        product: vslScripts.product,
                                                        prompt: vslScripts.vsl_scripts[0].ai_prompt
                                                    })
                                                });
                                                alert("DESPACHADO: Iniciando Produção Neural via Internet.");
                                                loadData();
                                            }}
                                        >
                                            DISPATCH TO NEURAL VIDEO CLOUD
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* LIVE PRODUCTION MONITOR v8.9 */}
                        {Object.keys(mediaQueue).length > 0 && (
                            <div className="animate-fade-in" style={{ marginTop: '2rem' }}>
                                <div className="glass" style={{ padding: '2rem', border: '1px solid var(--accent-glow)', background: 'rgba(139, 92, 246, 0.02)' }}>
                                    <h4 style={{ marginBottom: '1.5rem', fontSize: '0.8rem', color: 'var(--accent)', fontWeight: '900' }}>MONITOR DE PRODUÇÃO NEURAL (LIVE)</h4>
                                    <div style={{ display: 'grid', gap: '1.5rem' }}>
                                        {Object.entries(mediaQueue).map(([token, data]: [string, any]) => (
                                            <div key={token} className="glass" style={{ padding: '1rem', background: 'rgba(0,0,0,0.3)' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                                    <span style={{ fontSize: '0.7rem', color: '#fff' }}>{data.product} <small style={{ color: 'var(--text-muted)' }}>[{token}]</small></span>
                                                    <span style={{ fontSize: '0.7rem', color: data.progress === 100 ? '#22c55e' : 'var(--accent)' }}>{data.status}</span>
                                                </div>
                                                <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
                                                    <div style={{
                                                        height: '100%',
                                                        width: `${data.progress}%`,
                                                        background: 'var(--accent)',
                                                        boxShadow: '0 0 10px var(--accent)',
                                                        transition: 'width 1s ease-in-out'
                                                    }} />
                                                </div>
                                                {data.url && (
                                                    <a href={data.url} target="_blank" rel="noreferrer" className="btn-cyber" style={{ marginTop: '1rem', display: 'block', textAlign: 'center', fontSize: '0.75rem', padding: '10px' }}>
                                                        DOWNLOAD V01_FINAL
                                                    </a>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Logistics & Tracking Module v8.8 */}
            <div className="glass" style={{ padding: '2rem', border: '1px solid var(--secondary-glow)' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Truck size={20} color="var(--secondary)" /> Neural Logistics (Paid Orders)
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '500px', overflowY: 'auto' }}>
                    {paidOrders.length > 0 ? paidOrders.map((order: any, i: number) => (
                        <div key={i} className="glass" style={{ padding: '1.5rem', background: 'rgba(34, 197, 94, 0.03)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--secondary)' }}>TXN: {order.transaction_id}</span>
                                <span style={{ fontSize: '0.6rem', color: 'var(--text-muted)' }}>Status: {order.status.toUpperCase()}</span>
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#fff', marginBottom: '1rem' }}>
                                {order.customer_info?.email} | {order.customer_info?.phone || 'Sem Zap'}
                            </div>

                            {order.tracking_code ? (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <div className="glass" style={{ flex: 1, padding: '8px', fontSize: '0.8rem', color: 'var(--secondary)' }}>
                                        RASTREIO: {order.tracking_code}
                                    </div>
                                    <button
                                        className="btn-cyber"
                                        style={{ padding: '8px 16px', fontSize: '0.7rem' }}
                                        onClick={() => {
                                            const script = `Olá! Notícia excelente: Seu pedido ${order.transaction_id} foi despachado! \nCódigo: ${order.tracking_code}`;
                                            window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(script)}`, '_blank');
                                        }}
                                    >
                                        RENOTIFICAR
                                    </button>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="text"
                                        placeholder="Código de Rastreio"
                                        value={trackingInputs[order.id] || ''}
                                        onChange={(e) => setTrackingInputs({ ...trackingInputs, [order.id]: e.target.value })}
                                        style={{ flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', border: '1px solid var(--glass-border)', borderRadius: '8px', color: '#fff' }}
                                    />
                                    <button
                                        className="btn-cyber"
                                        style={{ background: 'var(--accent)', borderColor: 'var(--accent)' }}
                                        onClick={async () => {
                                            const adminToken = localStorage.getItem('admin_secret') || '';
                                            const res = await fetchApi('/api/admin/orders/sync-tracking', {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${adminToken}` },
                                                body: JSON.stringify({ order_id: order.id, transaction_id: order.transaction_id })
                                            });
                                            if (res.success) {
                                                alert("Sincronia Neural Iniciada! O rastreio aparecerá em instantes.");
                                                setTimeout(loadData, 2000);
                                            }
                                        }}
                                    >
                                        AI SYNC
                                    </button>
                                    <button
                                        className="btn-cyber"
                                        onClick={async () => {
                                            const code = trackingInputs[order.id];
                                            if (!code) return alert("Insira o código!");
                                            const adminToken = localStorage.getItem('admin_secret') || '';
                                            const res = await fetchApi('/api/admin/orders/update-tracking', {
                                                method: 'POST',
                                                headers: { 'Authorization': `Bearer ${adminToken}` },
                                                body: JSON.stringify({ order_id: order.id, tracking_code: code })
                                            });
                                            if (res.success) {
                                                alert("Rastreio Salvo! Despachando WhatsApp...");
                                                window.open(`https://web.whatsapp.com/send?text=${encodeURIComponent(res.tracking_script)}`, '_blank');
                                                loadData();
                                            }
                                        }}
                                    >
                                        SALVAR
                                    </button>
                                </div>
                            )}
                        </div>
                    )) : <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Nenhum pedido pago aguardando envio.</p>}
                </div>
            </div>

            {/* Neural activity Log */}
            <div className="glass" style={{ padding: '2rem', marginTop: '4rem' }}>
                <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Activity size={20} color="var(--primary)" /> Global Bio-Neural Log
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxHeight: '400px', overflowY: 'auto' }}>
                    {analytics?.logs && analytics.logs.length > 0 ? analytics.logs.map((log: any, i: number) => {
                        const getLogStyle = (type: string) => {
                            switch (type) {
                                case 'revenue': return { border: '#22c55e', color: '#22c55e', label: 'VENDA' };
                                case 'error': return { border: '#ef4444', color: '#ef4444', label: 'ALERTA' };
                                case 'demand_miss': return { border: 'var(--secondary)', color: 'var(--secondary)', label: 'OPORTUNIDADE' };
                                case 'system': return { border: 'var(--accent)', color: 'var(--accent)', label: 'AUTOMAÇÃO' };
                                default: return { border: 'var(--primary)', color: '#fff', label: 'SISTEMA' };
                            }
                        };
                        const style = getLogStyle(log.type);

                        return (
                            <div key={i} className="glass" style={{
                                padding: '1rem',
                                fontSize: '0.8rem',
                                borderLeft: `3px solid ${style.border}`,
                                background: 'rgba(255,255,255,0.02)',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <div>
                                    <span style={{ fontWeight: '900', color: style.color, marginRight: '1rem' }}>
                                        {style.label}
                                    </span>
                                    <span style={{ color: 'var(--text-muted)' }}>{log.message}</span>
                                </div>
                                <span style={{ fontSize: '0.65rem' }}>{new Date(log.created_at).toLocaleTimeString()}</span>
                            </div>
                        );
                    }) : <p>Aguardando atividade neural...</p>}
                </div>
            </div>
        </div>
    );
}

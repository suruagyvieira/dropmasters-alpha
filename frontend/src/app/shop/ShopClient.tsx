'use client';

import React, { useState, useEffect, useMemo, useCallback, useTransition } from 'react';
import ProductCard from '@/components/ProductCard';
import { fetchApi } from '@/lib/api';
import { useCart } from '@/context/CartContext';
import type { ShoppingCartItem } from '../../lib/cart-item-types';
// ... (imports remain the same)
import { Zap, BrainCircuit, ShieldCheck, RefreshCw, Star, Clock, TrendingUp, Search, Sparkles, MessageSquare, CheckCircle, X, DollarSign, Globe, MapPin } from 'lucide-react';
import { useSearchParams } from 'next/navigation';

import { Product } from '@/lib/products';

interface Evidence {
    name: string;
    city: string;
    product: string;
    ago: string;
}

export default function ShopClient({ initialProducts }: { initialProducts: Product[] }) {
    const [fullCatalog, setFullCatalog] = useState<Product[]>(initialProducts);
    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [highYieldProducts, setHighYieldProducts] = useState<Product[]>([]);
    const [recommendations, setRecommendations] = useState<Product[]>([]);
    const [evidence, setEvidence] = useState<Evidence | null>(null);
    const [mounted, setMounted] = useState(false);
    const [isConciergeOpen, setIsConciergeOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [sourcingQuery, setSourcingQuery] = useState('');
    const [sourcingResult, setSourcingResult] = useState<any>(null);
    const [isSourcing, setIsSourcing] = useState(false);
    // Novos estados para busca rápida e feedback ao usuário
    const [searchTerm, setSearchTerm] = useState('');
    const [isSearching, setIsSearching] = useState(false);
    const [searchSource, setSearchSource] = useState<'flash' | 'internal' | 'none' | 'local' | null>(null);
    const [searchMessage, setSearchMessage] = useState('');
    const [isPending, startTransition] = useTransition();
    const { addToCart } = useCart();
    const searchParams = useSearchParams();

    useEffect(() => {
        setMounted(true);
        // Only fetch if initialProducts is empty (Build failure or empty DB)
        // This optimizes performance by respecting the SSG data
        if (initialProducts.length === 0) {
            syncRealData();
        }
    }, [initialProducts.length]);

    const syncRealData = async () => {
        try {
            // Fetch everything in one go - Apex Performance
            const data = await fetchApi('/api/v2/products');
            if (Array.isArray(data)) {
                setProducts(data);
                setFullCatalog(data);

                // Extract recommendations from the same data source (save 1 HTTP request)
                const recommendations = data.filter((p: any) => p.is_featured || p.price > 150).slice(0, 4);
                setHighYieldProducts(recommendations);

                setError(null);
            }
        } catch (err) {
            setError("Link Bio-Neural instável");
        }
    };

    // AI Evidence Loop (Social Proof for Conversion)
    useEffect(() => {
        const showEvidence = async () => {
            if (document.hidden) return; // Performance Optimization
            try {
                const data = await fetchApi('/api/v2/evidence');
                setEvidence(data);
                setTimeout(() => setEvidence(null), 5000);
            } catch (e) { }
        };

        showEvidence();
        const timer = setInterval(showEvidence, 15000); // Relaxed for performance
        return () => clearInterval(timer);
    }, []);

    // Critical Performance: Intelligent Polling
    // Critical Performance: Intelligent Polling (Optimized)
    useEffect(() => {
        const fetchUpdates = async () => {
            // Check visibility state directly to pause background processing
            if (document.hidden || document.visibilityState === 'hidden') return;

            try {
                const data = await fetchApi('/api/v2/products');
                if (Array.isArray(data)) {
                    setProducts(data);
                    setFullCatalog(data);
                }
            } catch (e) { }
        };

        // Use a longer interval to reduce load (10 minutes)
        const interval = setInterval(fetchUpdates, 600000);

        // Initial check if window is focused
        const onVisibilityChange = () => {
            if (document.visibilityState === 'visible') {
                fetchUpdates(); // Refresh immediately when user returns
            }
        };

        document.addEventListener('visibilitychange', onVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener('visibilitychange', onVisibilityChange);
        };
    }, []);

    const nameIndex = useMemo(() => {
        const map: Record<string, any> = {};
        fullCatalog.forEach(p => {
            const key = p.name?.toLowerCase();
            if (key) map[key] = p;
        });
        return map;
    }, [fullCatalog]);

    // Busca local antes de disparar API
    useEffect(() => {
        if (!searchTerm) return;
        const term = searchTerm.trim().toLowerCase();
        if (nameIndex[term]) {
            // Produto encontrado localmente – resposta instantânea
            setProducts([nameIndex[term]]);
            setFullCatalog([nameIndex[term]]);
            setSearchSource('local');
            setSearchMessage('🧠 Produto encontrado no catálogo local');
            return;
        }
        // Caso não exista localmente, continua com debounce (mantido abaixo)
    }, [searchTerm, nameIndex]);
    const [geoInfo, setGeoInfo] = useState<{ city: string, region: string } | null>(null);

    // ⚡ FLASH SEARCH: Busca instantânea em fornecedores globais
    useEffect(() => {
        if (!mounted || !searchTerm) {
            if (mounted && !searchTerm) {
                // Return to original state when search is cleared
                setProducts(fullCatalog);
                setSearchSource(null);
                setSearchMessage('');
                setGeoInfo(null);
            }
            return;
        }
        // Se a busca local já encontrou o produto, não dispara a busca global
        if (searchSource === 'local') {
            // Mantém resultados já definidos pela busca local
            return;
        }

        // Debounce reduzido (300ms)
        const delayDebounce = setTimeout(async () => {
            setIsSearching(true);
            setSearchSource(null);
            setSearchMessage('⚡ Buscando na rede global...');
            setGeoInfo(null);

            try {
                const sourcingUrl = `/api/v2/sourcing?q=${encodeURIComponent(searchTerm)}`;
                const response = await fetchApi(sourcingUrl);

                if (response?.products && response.products.length > 0) {
                    setProducts(response.products);
                    setFullCatalog(response.products);
                    setSearchSource('flash');
                    setSearchMessage(`⚡ ${response.products.length} produto(s) disponíveis para venda IMEDIATA`);

                    if (response.user_location) setGeoInfo(response.user_location);
                } else {
                    // Fallback 1: Catalogo Interno
                    const internalUrl = `/api/v2/products?search=${encodeURIComponent(searchTerm)}`;
                    const internalRes = await fetchApi(internalUrl);

                    if (Array.isArray(internalRes) && internalRes.length > 0) {
                        setProducts(internalRes);
                        setSearchSource('internal');
                        setSearchMessage(`${internalRes.length} produto(s) no catálogo`);
                    } else {
                        // FALLBACK 2: PESQUISA ATIVA AGRESSIVA (Python Backend)
                        setSearchMessage('🔍 Não encontrado. Pesquisando fornecedores externos...');
                        // Note: Assuming the Python backend is reachable or proxied. 
                        // If we don't have a direct route, we could create a Next.js proxy route.
                        // For now, let's assume we can call the Python API if configured.
                        const activeSearchUrl = `/api/v2/sourcing/active-search?q=${encodeURIComponent(searchTerm)}`;
                        const activeRes = await fetchApi(activeSearchUrl);

                        if (activeRes?.products && activeRes.products.length > 0) {
                            setProducts(activeRes.products);
                            setSearchSource('flash'); // Treat as flash sourcing
                            setSearchMessage(`🎯 ENCONTRADO EM FORNECEDOR: ${activeRes.products.length} itens localizados!`);
                        } else {
                            setProducts([]);
                            setSearchSource('none');
                            setSearchMessage('Nenhum fornecedor nacional tem este item no momento.');
                        }
                    }
                }
            } catch (err) {
                console.error("Flash Search Error:", err);
                setSearchMessage('Erro na busca. Tente novamente.');
            } finally {
                setIsSearching(false);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [searchTerm, mounted, initialProducts]);

    const handleSourcingRequest = async () => {
        if (!sourcingQuery) return;
        setIsSourcing(true);
        try {
            const result = await fetchApi('/api/v2/sourcing/estimate', {
                method: 'POST',
                body: JSON.stringify({ query: sourcingQuery }),
            });
            setSourcingResult(result);
            setError(null);
        } catch (err) {
            setError("Falha na análise neural de sourcing");
        } finally {
            setIsSourcing(false);
        }
    };

    const handleSourcingPurchase = () => {
        if (!sourcingResult) return;

        const customItem: ShoppingCartItem = {
            id: `custom_${Date.now()}`,
            name: sourcingResult.name,
            price: sourcingResult.estimated_price,
            quantity: 1,
            image: "https://images.unsplash.com/photo-1549463599-242406bd1f43?q=80&w=400&auto=format&fit=crop",
            metadata: {
                is_custom: true,
                location: sourcingResult.location_signal,
                original_link: sourcingQuery
            }
        };

        addToCart(customItem);
        // Feedback visual ou redirecionamento
        setSourcingResult(null);
        setSourcingQuery('');
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return fullCatalog;
        return fullCatalog.filter(p =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [searchTerm, fullCatalog]);

    return (
        <>
            {geoInfo && (
                <div className="glass-premium animate-fade-in" style={{
                    position: 'fixed', top: '100px', right: '20px', zIndex: 999,
                    padding: '8px 15px', display: 'flex', alignItems: 'center', gap: '10px',
                    borderColor: 'var(--primary)', background: 'rgba(0,0,0,0.8)'
                }}>
                    <MapPin size={14} color="var(--primary)" />
                    <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#fff' }}>
                        LOGÍSTICA OTIMIZADA PARA: {geoInfo.city.toUpperCase()} ({geoInfo.region})
                    </span>
                </div>
            )}

            {mounted && evidence && (
                <div className="glass shadow-premium animate-slide-up" style={{
                    position: 'fixed', bottom: '20px', left: '20px', zIndex: 999,
                    padding: '12px 20px', display: 'flex', alignItems: 'center', gap: '15px',
                    borderColor: 'var(--secondary)', background: 'rgba(10, 10, 12, 0.95)'
                }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--secondary-glow)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Zap size={20} color="var(--secondary)" />
                    </div>
                    <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#fff' }}>{evidence.name} de {evidence.city}</div>
                        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Comprou: <span style={{ color: 'var(--secondary)' }}>{evidence.product}</span></div>
                        <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)' }}>há {evidence.ago}</div>
                    </div>
                </div>
            )}

            {/* SEÇÃO DE ALTO RENDIMENTO (IA RECOMMENDS) - FOCO CURTO PRAZO */}
            <div style={{ marginBottom: '4rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{ padding: '8px 15px', background: 'rgba(34, 197, 94, 0.1)', border: '1px solid #22c55e', borderRadius: '100px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Zap size={14} color="#22c55e" />
                            <span style={{ fontSize: '0.65rem', fontWeight: '900', color: '#22c55e' }}>OFERTAS EM DESTAQUE</span>
                        </div>
                    </div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', fontWeight: '800', letterSpacing: '1px' }}>
                        <RefreshCw size={10} className="animate-spin" style={{ marginRight: '5px' }} />
                        ESTOQUE VERIFICADO | ENVIO PARA TODO O BRASIL
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    {(highYieldProducts.length > 0 ? highYieldProducts : products.slice(0, 5)).map((product) => (
                        <div key={product.id} className="glass card-hover" style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', position: 'relative', overflow: 'hidden' }}>
                            <div style={{ height: '120px', overflow: 'hidden', borderRadius: '12px', marginBottom: '1rem' }}>
                                <img src={product.image_url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={product.name} />
                            </div>
                            <h4 style={{ fontSize: '0.85rem', marginBottom: '5px', height: '40px', overflow: 'hidden' }}>{product.name}</h4>

                            {/* NEURAL SCARCITY HOOK */}
                            <div style={{ fontSize: '0.65rem', color: '#ff4d4d', fontWeight: '800', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                <Clock size={10} />
                                ÚLTIMAS {Math.floor(Math.random() * 5) + 2} UNIDADES
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--secondary)' }}>R$ {product.price}</span>
                                <div style={{ fontSize: '0.6rem', color: '#22c55e', fontWeight: '900', background: 'rgba(34, 197, 94, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                                    PRODUTO POPULAR
                                </div>
                            </div>

                            {/* REGIONAL PRIORITY SIGNAL */}
                            {['SP', 'SC'].includes(product.location || '') && (
                                <div style={{ marginTop: '8px', fontSize: '0.6rem', color: 'var(--primary)', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                    <Globe size={10} />
                                    ENVIO PRIORITÁRIO {product.location}
                                </div>
                            )}

                            <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                                <Zap size={14} color="var(--primary)" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>


            <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '3rem', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="glass" style={{ padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BrainCircuit size={18} color="var(--primary)" />
                        <div>
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800' }}>PESQUISA INTELIGENTE</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '800', color: 'var(--foreground)' }}>BUSCA EM TEMPO REAL</div>
                        </div>
                    </div>

                    {/* AUTOMATED SEARCH BAR */}
                    <div className="glass" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px', minWidth: '300px' }}>
                        <Search size={18} color={isSearching ? 'var(--secondary)' : 'var(--text-muted)'} style={{ marginLeft: '10px' }} />
                        <input
                            type="text"
                            placeholder="Buscar produtos (Ex: Smartwatch)..."
                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', outline: 'none' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="glass" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '10px', height: 'fit-content' }}>
                    <div className={isSearching ? "pulse-ai active" : "pulse-ai"} style={{ width: '8px', height: '8px' }}></div>
                    <span style={{ fontSize: '0.7rem', fontWeight: '900', color: 'var(--primary)' }}>
                        {isSearching ? 'PROCESSANDO...' : (searchMessage || 'SISTEMA: PRONTO')}
                    </span>
                </div>
            </div>

            {/* SOURCE INDICATOR APEX */}
            {searchSource && searchTerm && !isSearching && (
                <div
                    className="glass animate-fade-in shadow-premium"
                    style={{
                        marginBottom: '2rem',
                        padding: '1.25rem 2rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: searchSource === 'flash'
                            ? 'linear-gradient(90deg, rgba(139, 92, 246, 0.1) 0%, rgba(34, 197, 94, 0.05) 100%)'
                            : 'rgba(34, 197, 94, 0.05)',
                        borderLeft: `4px solid ${searchSource === 'flash' ? 'var(--primary)' : '#22c55e'}`
                    }}
                >
                    {searchSource === 'flash' && (
                        <>
                            <div className="animate-pulse">
                                <Zap size={24} color="var(--primary)" fill="var(--primary)" />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.9rem', fontWeight: '900', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
                                    <span>🎯 INTELIGÊNCIA APEX: FORNECEDORES ELITE LOCALIZADOS</span>
                                    <span style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', fontWeight: '800' }}>
                                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }} />
                                        ALTA CONFIANÇA (VIBE 90%+)
                                    </span>
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                                    Encontramos as melhores ofertas para <strong>"{searchTerm}"</strong>.
                                    Produtos com garantia de procedência e logística regional priorizada para sua região.
                                </div>
                            </div>
                        </>
                    )}
                    {searchSource === 'internal' && (
                        <>
                            <ShieldCheck size={24} color="#22c55e" />
                            <div>
                                <div style={{ fontSize: '0.85rem', fontWeight: '900', color: '#22c55e', marginBottom: '4px' }}>
                                    ✅ CATÁLOGO OFICIAL DROPMASTERS
                                </div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                                    Itens em estoque virtual com envio imediato e nota fiscal.
                                </div>
                            </div>
                        </>
                    )}
                </div>
            )}

            {/* NEURAL CONCIERGE: BOTÃO FLUTUANTE DE ATENDIMENTO IA */}
            <div
                style={{
                    position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000,
                    cursor: 'pointer', transition: 'transform 0.3s'
                }}
                className="hover-scale"
                onClick={() => setIsConciergeOpen(!isConciergeOpen)}
            >
                <div className="glass shadow-premium animate-pulse" style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%)',
                    border: '2px solid rgba(255,255,255,0.3)',
                    boxShadow: '0 0 30px var(--primary-glow)'
                }}>
                    {isConciergeOpen ? <X size={24} color="#fff" /> : <MessageSquare size={24} color="#fff" />}
                </div>
            </div>

            {/* INTERFACE DO CONCIERGE NEURAL */}
            {isConciergeOpen && (
                <div className="glass animate-slide-up" style={{
                    position: 'fixed', bottom: '100px', right: '30px', zIndex: 1000,
                    width: '380px', maxHeight: '500px', padding: '2rem',
                    background: 'rgba(10, 10, 15, 0.98)', border: '1px solid var(--primary)',
                    display: 'flex', flexDirection: 'column', gap: '1.5rem', overflowY: 'auto'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <BrainCircuit size={30} color="var(--primary)" />
                        <div>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '4px' }}>Assistente de Compras</h3>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Suporte inteligente em tempo real</p>
                        </div>
                    </div>

                    <div className="glass" style={{ padding: '1rem', background: 'rgba(0,0,0,0.02)', fontSize: '0.85rem', lineHeight: '1.6' }}>
                        Olá! Como posso ajudar você a encontrar o produto ideal hoje?
                    </div>

                    <div style={{ position: 'relative' }}>
                        <input
                            type="text"
                            placeholder="Diga-me o que deseja..."
                            className="glass"
                            style={{ width: '100%', padding: '12px 15px', background: 'rgba(0,0,0,0.4)', color: '#fff', border: '1px solid var(--primary)', borderRadius: '12px', fontSize: '0.85rem' }}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <div style={{ position: 'absolute', right: '15px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }}>
                            <BrainCircuit size={16} color="var(--primary)" />
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                        <button
                            className="btn-cyber"
                            style={{ fontSize: '0.75rem', padding: '12px' }}
                            onClick={async () => {
                                setIsSearching(true);
                                const data = await fetchApi('/api/v2/products?recommend=true');
                                if (Array.isArray(data)) setRecommendations(data);
                                setIsSearching(false);
                            }}
                        >
                            <Sparkles size={16} style={{ marginRight: '8px' }} /> Ver Top 5 Itens de Alta Demanda
                        </button>
                    </div>

                    {recommendations.length > 0 && (
                        <div className="animate-fade-in" style={{ marginTop: '1rem' }}>
                            <div style={{ fontSize: '0.65rem', fontWeight: '900', color: 'var(--secondary)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <CheckCircle size={14} /> RECOMENDAÇÕES DE ALTO RENDIMENTO:
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                {recommendations.map((p) => (
                                    <div key={p.id} className="glass" style={{ padding: '8px', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0, 243, 255, 0.05)' }}>
                                        <img src={p.image_url} style={{ width: '40px', height: '40px', borderRadius: '4px', objectFit: 'cover' }} alt="" />
                                        <div style={{ flex: 1 }}>
                                            <div style={{ fontSize: '0.75rem', fontWeight: '700' }}>{p.name}</div>
                                            <div style={{ fontSize: '0.7rem', color: 'var(--secondary)' }}>R$ {p.price}</div>
                                        </div>
                                        <a href={`/lp/${p.name.toLowerCase().replace(/ /g, '-')}`} className="btn-cyber" style={{ padding: '4px 8px', fontSize: '0.6rem' }}>VER LP</a>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {products.length > 0 && (
                <div className="glass shadow-premium" style={{
                    marginBottom: '2.5rem',
                    padding: '1.25rem 2rem',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '1.5rem',
                    border: '1px solid #e2e8f0'
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                        <div style={{
                            width: '40px', height: '40px',
                            background: 'var(--success)',
                            borderRadius: '50%',
                            display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <CheckCircle size={20} color="#fff" />
                        </div>
                        <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>VENDEDOR VERIFICADO</div>
                            <h3 style={{ fontSize: '1rem', fontWeight: '700', margin: 0 }}>
                                Compra Segura & Entrega Rápida
                            </h3>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: '2rem', flex: 1, justifyContent: 'flex-end', flexWrap: 'wrap' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>DESPACHO</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--success)' }}>EM ATÉ 24 HORAS</div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: '600', marginBottom: '2px' }}>GARANTIA</div>
                            <div style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)' }}>7 DIAS PARA DEVOLUÇÃO</div>
                        </div>
                    </div>
                </div>
            )}

            {error && (
                <div className="glass" style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #ef4444', background: '#fef2f2', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={20} />
                    <span style={{ fontSize: '0.85rem', fontWeight: '600' }}>Atenção: {error}</span>
                </div>
            )}

            <div style={{ marginBottom: '2.5rem' }}>
                <h2 style={{ fontSize: '1.75rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <Sparkles size={24} color="var(--primary)" />
                    Produtos em Destaque
                </h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '2rem' }}>
                    Confira as ofertas mais populares e com maior índice de satisfação nesta semana.
                </p>
            </div>

            <div style={{ position: 'relative', minHeight: '400px' }}>
                {isSearching && (
                    <div style={{
                        position: 'absolute', top: 0, left: 0, width: '100%', height: '100%',
                        background: 'rgba(10, 10, 15, 0.7)', zIndex: 50, display: 'flex',
                        alignItems: 'center', justifyContent: 'center', borderRadius: '24px',
                        backdropFilter: 'blur(4px)'
                    }}>
                        <div className="pulse-ai" style={{ width: '40px', height: '40px' }}></div>
                    </div>
                )}

                <div className="grid-main" style={{ opacity: isSearching ? 0.3 : 1, transition: 'opacity 0.3s' }}>
                    {filteredProducts.length > 0 ? (
                        filteredProducts.map((product, index) => (
                            <div key={product.id} style={{ position: 'relative' }}>
                                {/* Badges e Cards existentes */}
                                <div style={{ position: 'absolute', top: '-10px', left: '20px', zIndex: 10, display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                    {product.is_viral && (
                                        <div className="glass animate-glitch" style={{ padding: '4px 12px', fontSize: '0.65rem', fontWeight: '900', color: 'white', background: 'var(--primary)', borderColor: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '4px', boxShadow: '0 0 15px var(--primary-glow)' }}>
                                            <Zap size={10} fill="white" /> VIRAL TREND
                                        </div>
                                    )}
                                    {product.demand_score && (
                                        <div className="glass" style={{ padding: '4px 12px', fontSize: '0.65rem', fontWeight: '900', color: 'var(--secondary)', background: 'rgba(0, 243, 255, 0.1)', borderColor: 'var(--secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                                            <TrendingUp size={10} color="var(--secondary)" /> {product.demand_score}% DEMAND
                                        </div>
                                    )}
                                </div>
                                <ProductCard
                                    id={product.id}
                                    name={product.name}
                                    price={product.price}
                                    description={product.description}
                                    category={product.category}
                                    image={product.image_url}
                                    original_price={product.original_price}
                                    profit_margin={product.profit_margin}
                                    metadata={product.metadata}
                                    priority={index < 4}
                                />
                            </div>
                        ))
                    ) : (
                        !isSearching && (
                            <div className="glass shadow-premium animate-fade-in" style={{ gridColumn: '1/-1', padding: '3rem', textAlign: 'center', background: 'rgba(5,5,10,0.8)', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <div style={{ fontSize: '3.5rem', marginBottom: '1.5rem', animation: 'float 3s ease-in-out infinite' }}>🛰️</div>
                                <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: '#fff' }}>APEX SMART SOURCING</h3>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                                    Não encontrou o que buscava? Nossa IA de intermediação consegue localizar qualquer produto e gerar uma oferta dinâmica para você agora.
                                </p>

                                <div style={{ maxWidth: '600px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div className="glass" style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(0,0,0,0.4)', borderRadius: '16px', border: '1px solid var(--primary)' }}>
                                        <Globe size={20} color="var(--primary)" style={{ marginLeft: '1rem' }} />
                                        <input
                                            type="text"
                                            placeholder="Link do AliExpress ou Descrição do Produto..."
                                            style={{ background: 'transparent', border: 'none', color: '#fff', width: '100%', padding: '12px 10px', outline: 'none', fontSize: '0.9rem' }}
                                            value={sourcingQuery}
                                            onChange={(e) => setSourcingQuery(e.target.value)}
                                        />
                                        <button
                                            className="btn-cyber"
                                            style={{ padding: '10px 25px', borderRadius: '12px' }}
                                            onClick={handleSourcingRequest}
                                            disabled={isSourcing || !sourcingQuery}
                                        >
                                            {isSourcing ? <RefreshCw className="animate-spin" size={18} /> : 'ANALISAR'}
                                        </button>
                                    </div>

                                    {sourcingResult && (
                                        <div className="glass shadow-premium animate-slide-up" style={{ marginTop: '2rem', padding: '2rem', textAlign: 'left', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--secondary)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                                <div>
                                                    <div style={{ fontSize: '0.65rem', color: 'var(--secondary)', fontWeight: '900', letterSpacing: '2px', marginBottom: '5px' }}>OFERTA GERADA PELA IA</div>
                                                    <h4 style={{ fontSize: '1.3rem', fontWeight: '800' }}>{sourcingResult.name}</h4>
                                                </div>
                                                <div className="glass-premium" style={{ padding: '6px 12px', background: 'rgba(34, 197, 94, 0.1)', color: '#22c55e', border: '1px solid #22c55e', borderRadius: '8px', fontSize: '0.7rem', fontWeight: '900' }}>
                                                    VIABILIDADE: 100%
                                                </div>
                                            </div>

                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{sourcingResult.message}</p>

                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                                    <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', textDecoration: 'line-through' }}>R$ {(sourcingResult.estimated_price * 1.8).toFixed(2)}</span>
                                                    <span style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--secondary)' }}>R$ {sourcingResult.estimated_price.toFixed(2)}</span>
                                                </div>
                                                <button
                                                    className="btn-cyber btn-action shadow-secondary"
                                                    style={{ padding: '15px 40px', borderRadius: '16px', fontWeight: '900' }}
                                                    onClick={handleSourcingPurchase}
                                                >
                                                    IMPORTAR & COMPRAR AGORA
                                                </button>
                                            </div>

                                            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '10px' }}>
                                                <div className="glass" style={{ padding: '8px 15px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <Clock size={14} /> ENTREGA EM 7-15 DIAS
                                                </div>
                                                <div className="glass" style={{ padding: '8px 15px', fontSize: '0.65rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                    <ShieldCheck size={14} /> GARANTIA APEX
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

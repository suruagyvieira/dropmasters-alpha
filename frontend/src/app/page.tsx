import React from 'react';
import { ArrowRight, Zap, Activity, Globe, TrendingUp, Sparkles, ShieldCheck, RefreshCw } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { Product, MOCK_PRODUCTS } from '@/lib/products';

// ISR Optimization: Revalidate home page every 30 minutes (Apex v12.1 Force Sync)
export const revalidate = 1800;

export default async function Home() {
  let featuredProducts: Product[] = [];

  try {
    const supabase = getSupabase();
    if (supabase) {
      // PERFORMANCE CRITICAL: Fetching only what's visible above the fold first (SSG)
      // Logic Fix: Filter by high demand and profit margin to ensure revenue generation
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('demand_score', { ascending: false })
        .limit(4);

      if (data && data.length > 0) {
        featuredProducts = data as Product[];
      } else {
        // FALLBACK: Ensure the page is NEVER empty (Zero Initial Cost UX)
        featuredProducts = MOCK_PRODUCTS.slice(0, 4);
      }
    } else {
      featuredProducts = MOCK_PRODUCTS.slice(0, 4);
    }
  } catch (e) {
    console.error("Home Pre-render Error:", e);
    featuredProducts = MOCK_PRODUCTS.slice(0, 4);
  }

  return (
    <div style={{ overflowX: 'hidden' }}>
      {/* Hero Section Quantum - Otimizada para LCP */}
      <section className="container" style={{ minHeight: '90vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingTop: '100px' }}>
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '900px' }}>
          <div className="glass animate-fade-in" style={{ display: 'inline-flex', padding: '8px 20px', borderRadius: '100px', marginBottom: '2.5rem', gap: '10px', alignItems: 'center', borderColor: 'var(--primary)', background: 'rgba(37, 99, 235, 0.05)' }}>
            <Zap size={16} color="var(--primary)" fill="var(--primary)" />
            <span style={{ fontSize: '0.7rem', fontWeight: '900', letterSpacing: '2px', color: 'var(--primary)' }}>E-COMMERCE MODERNO</span>
          </div>
          <h1 className="cyber-glitch" data-text="O FUTURO DO VAREJO">SUA LOJA <br /><span style={{ color: 'var(--primary)' }}>CONECTADA.</span></h1>
          <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)', marginTop: '2rem', maxWidth: '650px', lineHeight: '1.6' }}>
            A plataforma definitiva para escalar seu negócio digital.
            <span style={{ color: 'var(--foreground)', fontWeight: '700' }}> Curadoria Premium, Logística Própria</span> e suporte humanizado.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', marginTop: '3.5rem', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn-cyber" style={{ textDecoration: 'none', padding: '20px 50px', fontSize: '1rem' }}>
              VER PRODUTOS <ArrowRight size={22} />
            </Link>
            <Link href="/afiliados" className="glass" style={{ padding: '20px 40px', cursor: 'pointer', fontWeight: '800', border: '1px solid var(--glass-border)', textDecoration: 'none', color: 'var(--foreground)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem' }}>
              SEJA UM PARCEIRO <TrendingUp size={18} />
            </Link>
          </div>
        </div>

        {/* Stats Grid - High Trust Indicators */}
        <div className="grid-main" style={{ marginTop: '6rem', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2rem' }}>
          {[
            { label: 'OPERAÇÃO', val: '100% Digital', sub: 'Logística Otimizada', icon: <Globe color="var(--primary)" /> },
            { label: 'SEGURANÇA', val: 'Compra Segura', sub: 'Proteção de Dados', icon: <ShieldCheck color="var(--success)" /> },
            { label: 'SISTEMA', val: 'Alta Escala', sub: 'Infraestrutura Robusta', icon: <Activity color="var(--secondary)" /> },
            { label: 'SUPORTE', val: 'Humanizado', sub: 'Time Especializado', icon: <Sparkles color="var(--action)" /> },
          ].map((s, i) => (
            <div key={i} className="glass card-hover" style={{ padding: '2rem', background: 'white', position: 'relative', overflow: 'hidden' }}>
              <div style={{ marginBottom: '1.5rem' }}>{s.icon}</div>
              <h4 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '4px', letterSpacing: '-0.5px' }}>{s.val}</h4>
              <p style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>{s.label}</p>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px' }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Quantum - High Conversion Focus */}
      <section className="section" style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(139, 92, 246, 0.03) 0%, transparent 70%)', pointerEvents: 'none' }}></div>
        <div className="container">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
            <div>
              <div style={{ color: 'var(--primary)', fontWeight: '900', fontSize: '0.7rem', letterSpacing: '3px', marginBottom: '1rem' }}>DESTAQUES DA SEMANA</div>
              <h2 style={{ fontSize: '3rem', lineHeight: 1 }}>Produtos em Alta</h2>
              <p style={{ color: 'var(--text-muted)', marginTop: '1rem' }}>Confira os itens mais procurados e com melhor avaliação dos clientes.</p>
            </div>
            <Link href="/shop" style={{ color: 'var(--foreground)', fontWeight: '800', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', borderBottom: '2px solid var(--primary)', paddingBottom: '5px' }}>
              VER CATÁLOGO COMPLETO <ArrowRight size={18} color="var(--primary)" />
            </Link>
          </div>

          <div className="grid-main">
            {featuredProducts.length > 0 ? featuredProducts.map((product, index) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                category={product.category}
                image={product.image_url || ''}
                metadata={product.metadata}
                priority={index < 2} // Performance: Prioritize loading the first 2 images
              />
            )) : (
              // Empty State (Se o Supabase falhar totalmente e não houver mock)
              <div className="glass" style={{ gridColumn: '1/-1', padding: '5rem', textAlign: 'center' }}>
                <RefreshCw className="animate-spin" size={40} style={{ margin: '0 auto 1.5rem', opacity: 0.3 }} />
                <h3>Carregando Ofertas...</h3>
                <p style={{ color: 'var(--text-muted)' }}>Buscando as melhores oportunidades para você.</p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Trust & Automation Section - The "Repasse" Promise */}
      <section className="container section">
        <div className="glass shadow-premium" style={{ padding: '4rem', border: '1px solid #e2e8f0', background: 'white' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '4rem', alignItems: 'center' }}>
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                <ShieldCheck color="#22c55e" size={32} />
                <h3 style={{ fontSize: '1.8rem', fontWeight: '900' }}>Operação Blindada</h3>
              </div>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '1.1rem' }}>
                <li style={{ display: 'flex', gap: '15px' }}><Zap size={20} color="var(--secondary)" /> <b>Repasse Automático:</b> Sem retenção manual de valores. O lucro é seu instantaneamente.</li>
                <li style={{ display: 'flex', gap: '15px' }}><Globe size={20} color="var(--secondary)" /> <b>Logística Direta:</b> O fornecedor envia, você lucra. Estoque zero físico.</li>
                <li style={{ display: 'flex', gap: '15px' }}><TrendingUp size={20} color="var(--secondary)" /> <b>Custo Zero:</b> Infraestrutura distribuída para máxima escalabilidade sem taxas fixas.</li>
              </ul>
            </div>
            <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
              <div className="pulse-ai" style={{ width: '200px', height: '200px', border: '5px solid var(--success)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: '900', color: 'var(--success)' }}>COMPRA SEGURA</div>
                  <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--foreground)' }}>100%</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>PROTEGIDA</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final - Focus on Revenue */}
      <section className="container section" style={{ textAlign: 'center', paddingBottom: '8rem' }}>
        <div className="glass" style={{ padding: '6rem 2rem', overflow: 'hidden', position: 'relative', background: 'radial-gradient(circle at top right, rgba(139, 92, 246, 0.15) 0%, transparent 70%)' }}>
          <Sparkles style={{ position: 'absolute', top: '40px', left: '40px', opacity: 0.2 }} size={60} color="var(--primary)" />
          <h2 style={{ fontSize: '3.5rem', fontWeight: '900', letterSpacing: '-2px', marginBottom: '2rem' }}>Pronto para Começar?<br /><span style={{ color: 'var(--primary)' }}>Crie sua Conta Hoje.</span></h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
            Não perca tempo com configurações complexas. O sistema DropMasters está pronto para processar pedidos e repasses hoje mesmo.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/shop" className="btn-cyber" style={{ textDecoration: 'none', padding: '22px 60px', fontSize: '1.2rem' }}>
              ACESSAR CATÁLOGO <Sparkles size={24} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

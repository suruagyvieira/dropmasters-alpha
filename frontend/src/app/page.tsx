import React from 'react';
import { ArrowRight, Zap, ShieldCheck, Truck, CreditCard, ChevronRight, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { getSupabase } from '@/lib/supabase';
import Link from 'next/link';
import { Product, MOCK_PRODUCTS } from '@/lib/products';
import Image from 'next/image';

// ISR Optimization: Revalidate home page every 30 minutes
export const revalidate = 1800;

export default async function Home() {
  let featuredProducts: Product[] = [];
  let newArrivals: Product[] = [];

  try {
    const supabase = getSupabase();
    if (supabase) {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('demand_score', { ascending: false })
        .limit(8);

      if (data && data.length > 0) {
        featuredProducts = data.slice(0, 4) as Product[];
        newArrivals = data.slice(4, 8) as Product[];
      } else {
        featuredProducts = MOCK_PRODUCTS.slice(0, 4);
        newArrivals = MOCK_PRODUCTS.slice(4, 8);
      }
    } else {
      featuredProducts = MOCK_PRODUCTS.slice(0, 4);
      newArrivals = MOCK_PRODUCTS.slice(4, 8);
    }
  } catch (e) {
    console.error("Home Pre-render Error:", e);
    featuredProducts = MOCK_PRODUCTS.slice(0, 4);
    newArrivals = MOCK_PRODUCTS.slice(4, 8);
  }

  const categories = [
    { name: 'Eletrônicos', icon: '📱' },
    { name: 'Fones & Áudio', icon: '🎧' },
    { name: 'Casa Inteligente', icon: '🏠' },
    { name: 'Wearables', icon: '⌚' },
    { name: 'Gamer', icon: '🎮' },
    { name: 'Acessórios', icon: '🎒' },
  ];

  return (
    <div style={{ paddingBottom: '4rem' }}>

      {/* 1. HERO BANNER - Professional & High Impact */}
      <section className="container" style={{ paddingTop: 'calc(var(--header-height) + 2rem)' }}>
        <div className="hero-banner shadow-lg">
          <div className="hero-content">
            <div style={{ display: 'inline-flex', padding: '6px 16px', borderRadius: '100px', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' }}>
              PROMOÇÃO DE JANEIRO • ATÉ 40% OFF
            </div>
            <h1 style={{ color: 'white', maxWidth: '600px', fontSize: '3.5rem', marginBottom: '1.5rem' }}>
              Tecnologia de Ponta, <br /><span style={{ color: '#60a5fa' }}>Preço de Fábrica.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '450px', fontSize: '1.1rem', marginBottom: '2.5rem' }}>
              Descubra nossa curadoria de produtos importados com entrega nacional garantida e suporte humanizado.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link href="/shop" className="btn-cyber" style={{ padding: '16px 40px', fontSize: '1rem', background: 'white', color: 'var(--primary)' }}>
                VER PROMOÇÕES <ChevronRight size={20} />
              </Link>
            </div>
          </div>
          <Image
            src="https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=1200"
            alt="Hero Banner"
            layout="fill"
            objectFit="cover"
            style={{ opacity: 0.4, mixBlendMode: 'overlay' }}
            priority
          />
        </div>
      </section>

      {/* 2. TRUSTBAR - Immediate Credibility */}
      <section className="container" style={{ marginTop: '2rem' }}>
        <div className="glass shadow-sm" style={{ padding: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem', textAlign: 'center' }}>
          {[
            { label: 'Entrega Segura', sub: 'Em todo o Brasil', icon: <Truck color="var(--primary)" size={32} /> },
            { label: 'Pagamento Real', sub: 'Pix ou até 12x', icon: <CreditCard color="var(--primary)" size={32} /> },
            { label: 'Garantia Elite', sub: '30 dias de prova', icon: <ShieldCheck color="var(--primary)" size={32} /> },
            { label: 'Suporte VIP', sub: 'Especialistas 24/7', icon: <Zap color="var(--primary)" size={32} /> },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', justifyContent: 'center' }}>
              <div>{item.icon}</div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800', fontSize: '0.9rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. QUICK CATEGORIES */}
      <section className="container" style={{ marginTop: '4rem' }}>
        <div style={{ display: 'flex', gap: '1rem', overflowX: 'auto', paddingBottom: '1rem', scrollbarWidth: 'none' }}>
          {categories.map((cat, i) => (
            <div key={i} className="category-tag flex-center" style={{ gap: '8px', border: '1px solid var(--card-border)' }}>
              <span>{cat.icon}</span>
              <span>{cat.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* 4. BEST SELLERS CAROUSEL */}
      <section className="container" style={{ marginTop: '5rem' }}>
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Mais Vendidos</h2>
            <p style={{ color: 'var(--text-muted)' }}>Os favoritos da nossa comunidade nesta semana.</p>
          </div>
          <Link href="/shop" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontWidth: '700' }}>
            Ver Todos <ChevronRight size={18} />
          </Link>
        </div>

        <div className="carousel-container">
          {featuredProducts.map((product) => (
            <div key={product.id} className="carousel-item">
              <ProductCard
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                category={product.category}
                image={product.image_url || ''}
                metadata={product.metadata}
              />
            </div>
          ))}
        </div>
      </section>

      {/* 5. NEW ARRIVALS GRID */}
      <section className="container" style={{ marginTop: '6rem' }}>
        <div className="flex-between" style={{ marginBottom: '2.5rem' }}>
          <div>
            <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Novidades <span style={{ color: 'var(--primary)', fontSize: '1rem', verticalAlign: 'middle', marginLeft: '10px' }}>RECÉM CHEGADOS</span></h2>
            <p style={{ color: 'var(--text-muted)' }}>Produtos de última geração que acabaram de entrar no catálogo.</p>
          </div>
        </div>

        <div className="grid-main" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))' }}>
          {newArrivals.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              description={product.description}
              category={product.category}
              image={product.image_url || ''}
              metadata={product.metadata}
            />
          ))}
        </div>
      </section>

      {/* 6. TRUST & SOCIAL PROOF */}
      <section className="container" style={{ marginTop: '8rem' }}>
        <div style={{ background: 'var(--primary-light)', padding: '5rem 3rem', borderRadius: '32px', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '1.5rem' }}>
              {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill="#fbbf24" color="#fbbf24" />)}
            </div>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>O que dizem nossos clientes</h2>
            <p style={{ fontSize: '1.2rem', fontStyle: 'italic', color: 'var(--secondary)', marginBottom: '3rem' }}>
              "A transparência no rastreio e a qualidade dos itens me surpreenderam. O atendimento foi impecável e o produto chegou antes do prazo."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px' }}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#ccc', overflow: 'hidden' }}>
                <Image src="https://i.pravatar.cc/150?u=douglas" width={50} height={50} alt="User" />
              </div>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontWeight: '800' }}>Douglas Vieira</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cliente Verificado • São Paulo - SP</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FINAL CTA */}
      <section className="container" style={{ marginTop: '8rem', marginBottom: '4rem' }}>
        <div className="glass shadow-premium" style={{ padding: '5rem', borderRadius: '32px', textAlign: 'center', background: 'var(--primary)', color: 'white' }}>
          <h2 style={{ fontSize: '3rem', color: 'white', marginBottom: '1.5rem' }}>Faça parte da elite do varejo digital</h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', maxWidth: '600px', margin: '0 auto 3rem', fontSize: '1.1rem' }}>
            Milhares de clientes já economizam comprando direto das melhores fontes globais. Receba ofertas exclusivas no seu WhatsApp.
          </p>
          <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <Link href="/shop" className="btn-cyber" style={{ background: 'white', color: 'var(--primary)', padding: '18px 50px', fontSize: '1.1rem' }}>
              COMEÇAR AGORA <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}

-- TABELA DE PRODUTOS (Coração do Catálogo)
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    demand_score INTEGER DEFAULT 50,
    is_viral BOOLEAN DEFAULT FALSE,
    original_price DECIMAL(10,2),
    base_price DECIMAL(10,2) DEFAULT 0.00, -- Novo: Preço de custo para cálculo da IA
    stock INTEGER DEFAULT 10, -- Novo: Controle de Escassez
    metadata JSONB,           -- Novo: Flexibilidade para Fornecedor/Localização
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- INDEXES FOR PERFORMANCE (Critical for 'Estoque Zero' scaling)
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_demand ON products(demand_score DESC);

-- TABELA DE PEDIDOS (Gestão de Vendas e Repasse)
CREATE TABLE IF NOT EXISTS orders (
    id BIGSERIAL PRIMARY KEY,
    transaction_id TEXT UNIQUE NOT NULL,
    user_id TEXT,
    email TEXT,
    phone TEXT,
    total DECIMAL(10,2) NOT NULL,
    items JSONB NOT NULL,
    status TEXT DEFAULT 'pending',
    affiliate_ref TEXT,
    payment_method TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    paid_at TIMESTAMPTZ
);

-- INDEXES FOR SECURITY & LOOKUPS
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id); 
CREATE INDEX IF NOT EXISTS idx_orders_email ON orders(email); 
CREATE INDEX IF NOT EXISTS idx_orders_transaction ON orders(transaction_id);

-- TABELA DE LOGS (Auditoria de IA e Financeira)
CREATE TABLE IF NOT EXISTS logs (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'revenue', 'payout_automation', 'demand_miss', 'error', 'system'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_logs_type ON logs(type);
CREATE INDEX IF NOT EXISTS idx_logs_created_at ON logs(created_at DESC);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS) - PROTEÇÃO BLINDADA 2026
-- ==========================================

-- 1. PRODUTOS: Leitura pública para vender, mas escrita bloqueada.
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public: Read products" ON products;
DROP POLICY IF EXISTS "Admin: Full access" ON products;

CREATE POLICY "Public: Read products" ON products FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admin: Full access" ON products FOR ALL TO authenticated USING (true);

-- 2. PEDIDOS: Público pode CRIAR (checkout), mas NUNCA listar.
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Public: Create order" ON orders;
DROP POLICY IF EXISTS "Admin/Self: Read order" ON orders;

CREATE POLICY "Public: Create order" ON orders FOR INSERT TO public 
WITH CHECK (status = 'pending');

CREATE POLICY "Admin/Self: Read order" ON orders FOR SELECT TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt() ->> 'email' = email);

-- 3. LOGS: Proteção Total de Sistema.
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System: Record logs" ON logs;
DROP POLICY IF EXISTS "Admin: Read logs" ON logs;
DROP POLICY IF EXISTS "Public: Record demand/errors" ON logs;

CREATE POLICY "Admin: Read logs" ON logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "System: Record logs" ON logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Public: Record demand/errors" ON logs FOR INSERT TO public 
WITH CHECK (type IN ('demand_miss', 'error'));

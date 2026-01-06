-- ==========================================
-- RESET TOTAL (CUIDADO: APAGA DADOS)
-- ==========================================
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS logs CASCADE;
-- Clean up potentially related tables from previous versions if they exist to avoid orphans
DROP TABLE IF EXISTS order_items CASCADE; 
DROP TABLE IF EXISTS system_logs CASCADE;

-- TABELA DE PRODUTOS (Coração do Catálogo)
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    description TEXT,
    category TEXT,
    image_url TEXT,
    demand_score INTEGER DEFAULT 50,
    is_viral BOOLEAN DEFAULT FALSE,
    original_price DECIMAL(10,2),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- TABELA DE PEDIDOS (Gestão de Vendas e Repasse)
CREATE TABLE orders (
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

-- TABELA DE LOGS (Auditoria de IA e Financeira)
CREATE TABLE logs (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'revenue', 'payout_automation', 'demand_miss', 'error', 'system'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS) - PROTEÇÃO 2026
-- ==========================================

-- 1. PRODUTOS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Policies are dropped automatically when table is dropped, but good practice to define them anew
CREATE POLICY "Public: Read products" ON products FOR SELECT TO public USING (is_active = true);
CREATE POLICY "Admin: Full access" ON products FOR ALL TO authenticated USING (true);

-- 2. PEDIDOS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public: Create order" ON orders FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Admin/Self: Read order" ON orders FOR SELECT TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt() ->> 'email' = email);

-- 3. LOGS
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admin: Read logs" ON logs FOR SELECT TO authenticated USING (true);
CREATE POLICY "System: Record logs" ON logs FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Public: Record demand/errors" ON logs FOR INSERT TO public WITH CHECK (type IN ('demand_miss', 'error'));

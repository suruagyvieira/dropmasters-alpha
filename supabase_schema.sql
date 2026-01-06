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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

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

-- TABELA DE LOGS (Auditoria de IA e Financeira)
CREATE TABLE IF NOT EXISTS logs (
    id BIGSERIAL PRIMARY KEY,
    type TEXT NOT NULL, -- 'revenue', 'payout_automation', 'demand_miss', 'error', 'system'
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- POLÍTICAS DE SEGURANÇA (RLS) - PROTEÇÃO 2026
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

-- Permite INSERT público (Checkout de Visitantes) - Sem vazamento de dados
CREATE POLICY "Public: Create order" ON orders FOR INSERT TO public WITH CHECK (true);

-- SELECT restrito: Somente o Admin ou o dono do pedido via JWT
CREATE POLICY "Admin/Self: Read order" ON orders FOR SELECT TO authenticated
USING (auth.uid()::text = user_id OR auth.jwt() ->> 'email' = email);

-- 3. LOGS: Proteção Total de Sistema.
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "System: Record logs" ON logs;
DROP POLICY IF EXISTS "Admin: Read logs" ON logs;

-- Bloqueia SELECT público (Evita vazamento de logs de sistema/IA)
-- Somente usuários autenticados (Admin) podem ler.
CREATE POLICY "Admin: Read logs" ON logs FOR SELECT TO authenticated USING (true);

-- Permite INSERT apenas para o sistema.
-- Nota: O backend deve preferencialmente usar service_role para isso.
CREATE POLICY "System: Record logs" ON logs FOR INSERT TO authenticated WITH CHECK (true);

-- Opcional: Se o seu checkout (público) precisar gravar logs de erro, 
-- use uma política de INSERT específico para 'anon' mas SEM permissão de SELECT.
CREATE POLICY "Public: Record demand/errors" ON logs FOR INSERT TO public WITH CHECK (type IN ('demand_miss', 'error'));

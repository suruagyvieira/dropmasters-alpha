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
    created_at TIMESTAMPTZ DEFAULT NOW()
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

-- Habilitar acesso público para leitura (Essential para o modelo Zero Cost)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public read access" ON products FOR SELECT USING (true);

-- Habilitar inserção para público (Necessário para Logs e Pedidos no checkout)
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON orders FOR SELECT USING (true);

ALTER TABLE logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Allow public insert" ON logs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public select" ON logs FOR SELECT USING (true);

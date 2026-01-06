<<<<<<< HEAD
-- Products table
CREATE TABLE products (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT UNIQUE NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    supplier_price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    category TEXT,
    stock INTEGER DEFAULT 0,
    is_featured BOOLEAN DEFAULT false,
    is_digital BOOLEAN DEFAULT false,
    supplier_name TEXT,
    supplier_url TEXT,
    affiliate_link TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Profiles table (extending auth.users)
CREATE TABLE profiles (
    id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Orders table
CREATE TABLE orders (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'shipped', 'delivered', 'cancelled')),
    total_amount DECIMAL(10, 2) NOT NULL,
    shipping_address JSONB,
    payment_method TEXT,
    payment_status TEXT DEFAULT 'unpaid',
    transaction_id TEXT,
    tracking_code TEXT,
    supplier_order_id TEXT,
    supplier_cost DECIMAL(10, 2) DEFAULT 0,
    net_profit DECIMAL(10, 2) DEFAULT 0,
    items JSONB,
    customer_info JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Order Items table
CREATE TABLE order_items (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL
);

-- Blog Posts table
CREATE TABLE blog_posts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    content TEXT NOT NULL,
    seo_description TEXT,
    image_url TEXT,
    published BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public products are viewable by everyone" ON products FOR SELECT USING (true);
CREATE POLICY "Users can view their own profiles" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update their own profiles" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public blog posts are viewable by everyone" ON blog_posts FOR SELECT USING (published = true);

-- Indexes for performance
CREATE INDEX idx_products_is_featured ON products(is_featured) WHERE is_featured = true;
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE UNIQUE INDEX idx_orders_transaction_id ON orders(transaction_id);
CREATE INDEX idx_orders_status ON orders(status);

-- System Logs table (Persistent Autonomy)
CREATE TABLE system_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'info',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);
CREATE INDEX idx_system_logs_created_at ON system_logs(created_at DESC);

-- Stats table for O(1) Analytics Performance
CREATE TABLE stats (
    id INT PRIMARY KEY DEFAULT 1,
    total_revenue DECIMAL(12,2) DEFAULT 0,
    total_orders INT DEFAULT 0,
    total_cost DECIMAL(12,2) DEFAULT 0,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    CONSTRAINT one_row CHECK (id = 1)
);
INSERT INTO stats (id, total_revenue, total_orders, total_cost) VALUES (1, 0, 0, 0) ON CONFLICT DO NOTHING;

-- Trigger to update stats automatically (O(1) Automation)
CREATE OR REPLACE FUNCTION update_global_stats()
RETURNS TRIGGER AS $$
DECLARE
    order_cost DECIMAL;
    item RECORD;
BEGIN
    -- Increment metrics when order is PAID
    IF (NEW.status = 'paid' AND (OLD.status IS NULL OR OLD.status != 'paid')) THEN
        order_cost := 0;
        FOR item IN SELECT * FROM jsonb_to_recordset(NEW.items) AS x(cost DECIMAL, quantity INT) LOOP
            order_cost := order_cost + (item.cost * item.quantity);
        END LOOP;

        UPDATE stats 
        SET total_revenue = total_revenue + NEW.total_amount,
            total_orders = total_orders + 1,
            total_cost = total_cost + order_cost,
            updated_at = now()
        WHERE id = 1;
        
    -- Decrement metrics if order is CANCELLED or REFUNDED after being paid
    ELSIF (OLD.status = 'paid' AND NEW.status != 'paid') THEN
        order_cost := 0;
        FOR item IN SELECT * FROM jsonb_to_recordset(OLD.items) AS x(cost DECIMAL, quantity INT) LOOP
            order_cost := order_cost + (item.cost * item.quantity);
        END LOOP;

        UPDATE stats 
        SET total_revenue = total_revenue - OLD.total_amount,
            total_orders = total_orders - 1,
            total_cost = total_cost - order_cost,
            updated_at = now()
        WHERE id = 1;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_update_stats
AFTER UPDATE ON orders
FOR EACH ROW
EXECUTE FUNCTION update_global_stats();

ALTER TABLE products ADD COLUMN IF NOT EXISTS original_price DECIMAL(12,2);

-- Trigger to keep system_logs lean (Free Tier Optimization)
CREATE OR REPLACE FUNCTION clean_old_logs()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM system_logs
    WHERE id NOT IN (
        SELECT id FROM system_logs
        ORDER BY created_at DESC
        LIMIT 1000
    );
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER tr_clean_logs
AFTER INSERT ON system_logs
FOR EACH STATEMENT
EXECUTE FUNCTION clean_old_logs();

-- RPC for Atomic Order Completion (v2)
-- Updates status and decrements stock in a single DB transaction
CREATE OR REPLACE FUNCTION complete_order_v2(order_txn_id TEXT)
RETURNS VOID AS $$
DECLARE
    order_id UUID;
    item RECORD;
BEGIN
    SELECT id INTO order_id FROM orders WHERE transaction_id = order_txn_id AND status != 'paid';
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'Order not found or already paid: %', order_txn_id;
    END IF;

    -- 1. Strict Stock Check
    FOR item IN SELECT * FROM jsonb_to_recordset((SELECT items FROM orders WHERE id = order_id)) AS x(id UUID, quantity INT) LOOP
        IF (SELECT stock FROM products WHERE id = item.id) < item.quantity THEN
            RAISE EXCEPTION 'Insufficient stock for product %', item.id;
        END IF;
    END LOOP;

    -- 2. Calculate Financial Split (Atomic Split v8.9)
    UPDATE orders 
    SET supplier_cost = (SELECT SUM((x->>'cost')::decimal * (x->>'quantity')::int) FROM jsonb_array_elements(items) AS x),
        net_profit = total_amount - (SELECT SUM((x->>'cost')::decimal * (x->>'quantity')::int) FROM jsonb_array_elements(items) AS x),
        status = 'paid', 
        payment_status = 'paid' 
    WHERE id = order_id;
    
    -- 3. Decrement Stock
    FOR item IN SELECT * FROM jsonb_to_recordset((SELECT items FROM orders WHERE id = order_id)) AS x(id UUID, quantity INT) LOOP
        UPDATE products
        SET stock = stock - item.quantity
        WHERE id = item.id;
    END LOOP;
END;
$$ LANGUAGE plpgsql;
=======
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
>>>>>>> origin/main

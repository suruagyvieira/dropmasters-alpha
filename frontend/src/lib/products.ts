
// "Banco de Dados" em memória para máxima performance e custo zero

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image_url: string;
    description: string;
    demand_spike?: boolean;
    demand_score?: number;
    is_viral?: boolean;
    fast_shipping?: boolean;
    low_stock_warning?: boolean;
    original_price?: number;
    profit_margin?: number;
    stock_model?: string;
    analysis?: any;
    metadata?: any;
    location?: string;
    ai_mood?: string;
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "prod_001",
        name: "Fone Bluetooth Alta Fidelidade",
        price: 89.90,
        category: "Eletrônicos",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
        original_price: 159.90,
        demand_score: 98,
        is_viral: true,
        description: "Cancelamento de ruído ativo para isolamento acústico profissional.",
        metadata: { benefits: ["Som Imersivo", "Bluetooth 5.3", "40h Bateria"] }
    },
    {
        id: "prod_002",
        name: "Smartwatch Ultra Series 2026",
        price: 129.90,
        category: "Wearables",
        image_url: "https://images.unsplash.com/photo-1544117519-31a4b71922bb?w=500&auto=format&fit=crop&q=60",
        original_price: 299.90,
        demand_score: 94,
        low_stock_warning: true,
        description: "Monitoramento de saúde premium com sensor de oxigênio de alta precisão.",
        metadata: { benefits: ["GPS Integrado", "Prova D'água", "Saúde 24h"] }
    },
    {
        id: "prod_003",
        name: "Mochila Executiva Impermeável",
        price: 79.90,
        category: "Acessórios",
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        original_price: 149.90,
        demand_score: 88,
        description: "Segurança e praticidade para transportar seus equipamentos com estilo.",
        metadata: { benefits: ["Porta USB", "Material Resistente", "Garantia Estendida"] }
    },
    {
        id: "prod_004",
        name: "Lâmpada LED RGB Inteligente WiFi",
        price: 39.90,
        category: "Casa Inteligente",
        image_url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop&q=80",
        original_price: 89.90,
        demand_score: 91,
        description: "Transforme qualquer ambiente com 16 milhões de cores via controle de voz.",
        metadata: { benefits: ["Economia 80%", "Timer Auto", "Controle por Voz"] }
    }
];

export function getMockProducts() {
    return MOCK_PRODUCTS;
}

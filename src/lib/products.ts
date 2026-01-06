
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
}

export const MOCK_PRODUCTS: Product[] = [
    {
        id: "prod_001",
        name: "Fone Bluetooth Neural Alpha",
        price: 89.90,
        category: "Eletrônicos",
        image_url: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500&auto=format&fit=crop&q=60",
        original_price: 159.90,
        demand_score: 98,
        is_viral: true,
        description: "Cancelamento de ruído ativo com IA."
    },
    {
        id: "prod_002",
        name: "Smartwatch Vitality 2026",
        price: 129.90,
        category: "Wearables",
        image_url: "https://images.unsplash.com/photo-1544117519-31a4b71922bb?w=500&auto=format&fit=crop&q=60",
        original_price: 299.90,
        demand_score: 94,
        low_stock_warning: true,
        description: "Monitoramento de saúde em tempo real."
    },
    {
        id: "prod_003",
        name: "Mochila Anti-Furto Cyber",
        price: 79.90,
        category: "Acessórios",
        image_url: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60",
        original_price: 149.90,
        demand_score: 88,
        description: "Impermeável e com carregamento USB."
    },
    {
        id: "prod_004",
        name: "Lâmpada LED RGB Wi-Fi Smart",
        price: 39.90,
        category: "Casa Inteligente",
        image_url: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=800&auto=format&fit=crop&q=80",
        original_price: 89.90,
        demand_score: 91,
        description: "Transforme qualquer ambiente com um toque no celular. 16 milhões de cores, controle por voz (Alexa/Google) e agendamento inteligente. Economia de energia de até 80% com tecnologia Bio-LED."
    }
];

export function getMockProducts() {
    return MOCK_PRODUCTS;
}

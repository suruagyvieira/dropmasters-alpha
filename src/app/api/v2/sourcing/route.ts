import { NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

/**
 * ═══════════════════════════════════════════════════════════════════════════════
 * SUPPLIER SOURCING API v1.0 - "GLOBAL SOURCING ENGINE"
 * ═══════════════════════════════════════════════════════════════════════════════
 * Quando o produto não existe no catálogo interno, a IA busca nos fornecedores
 * globais (simulado para Custo Zero) e retorna até 5 opções de alto rendimento.
 * 
 * [ZERO STOCK] | [AUTO PAYOUT] | [COST ZERO] | [SHORT-TERM YIELD]
 * ═══════════════════════════════════════════════════════════════════════════════
 */

// Supplier Product Database (Simulated Global Network - Zero API Cost)
const GLOBAL_SUPPLIERS: Record<string, any[]> = {
    'camera': [
        { id: 'sup_cam_001', name: 'Câmera Digital 4K Ultra HD', price: 289.90, original_price: 599.90, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', category: 'Fotografia', demand_score: 92, supplier: 'TechGlobal CN' },
        { id: 'sup_cam_002', name: 'Mini Câmera WiFi Espiã', price: 89.90, original_price: 189.90, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', category: 'Segurança', demand_score: 88, supplier: 'SecureTech' },
        { id: 'sup_cam_003', name: 'Câmera Action 4K Waterproof', price: 159.90, original_price: 349.90, image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', category: 'Esportes', demand_score: 95, supplier: 'ActionPro' },
        { id: 'sup_cam_004', name: 'Webcam Full HD Streaming', price: 79.90, original_price: 159.90, image_url: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=500', category: 'Informática', demand_score: 90, supplier: 'StreamGear' },
        { id: 'sup_cam_005', name: 'Câmera Instantânea Retrô', price: 129.90, original_price: 249.90, image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', category: 'Fotografia', demand_score: 85, supplier: 'VintageCam' },
    ],
    'drone': [
        { id: 'sup_dro_001', name: 'Drone 4K GPS Dobrável', price: 399.90, original_price: 899.90, image_url: 'https://images.unsplash.com/photo-1507582020474-9a35b7d455d9?w=500', category: 'Drones', demand_score: 96, supplier: 'SkyTech' },
        { id: 'sup_dro_002', name: 'Mini Drone FPV Racing', price: 189.90, original_price: 399.90, image_url: 'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500', category: 'Drones', demand_score: 91, supplier: 'RacerDrone' },
        { id: 'sup_dro_003', name: 'Drone com Câmera 1080p', price: 149.90, original_price: 299.90, image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=500', category: 'Drones', demand_score: 88, supplier: 'AirView' },
    ],
    'relogio': [
        { id: 'sup_rel_001', name: 'Smartwatch Pro Health', price: 199.90, original_price: 449.90, image_url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', category: 'Wearables', demand_score: 94, supplier: 'WatchTech' },
        { id: 'sup_rel_002', name: 'Relógio Digital Militar', price: 89.90, original_price: 189.90, image_url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=500', category: 'Acessórios', demand_score: 87, supplier: 'TacGear' },
        { id: 'sup_rel_003', name: 'Smartwatch Fitness GPS', price: 159.90, original_price: 329.90, image_url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=500', category: 'Wearables', demand_score: 92, supplier: 'FitPro' },
    ],
    'fone': [
        { id: 'sup_fon_001', name: 'Fone TWS Pro ANC', price: 129.90, original_price: 299.90, image_url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=500', category: 'Áudio', demand_score: 96, supplier: 'SoundMaster' },
        { id: 'sup_fon_002', name: 'Headphone Gaming RGB', price: 89.90, original_price: 199.90, image_url: 'https://images.unsplash.com/photo-1599669454699-248893623440?w=500', category: 'Gaming', demand_score: 93, supplier: 'GamerAudio' },
        { id: 'sup_fon_003', name: 'Earbuds Sport Waterproof', price: 69.90, original_price: 149.90, image_url: 'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=500', category: 'Esportes', demand_score: 89, supplier: 'SportSound' },
    ],
    'celular': [
        { id: 'sup_cel_001', name: 'Smartphone 128GB 5G', price: 899.90, original_price: 1899.90, image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500', category: 'Smartphones', demand_score: 98, supplier: 'MobileTech' },
        { id: 'sup_cel_002', name: 'Celular Gamer 256GB', price: 1299.90, original_price: 2499.90, image_url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=500', category: 'Gaming', demand_score: 95, supplier: 'GamePhone' },
    ],
    'notebook': [
        { id: 'sup_not_001', name: 'Notebook Ultra Slim i5', price: 2499.90, original_price: 4999.90, image_url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=500', category: 'Informática', demand_score: 94, supplier: 'LaptopPro' },
        { id: 'sup_not_002', name: 'Notebook Gamer RTX', price: 3999.90, original_price: 7999.90, image_url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=500', category: 'Gaming', demand_score: 97, supplier: 'GameLaptop' },
    ],
    'lampada': [
        { id: 'sup_lamp_001', name: 'Lâmpada Smart RGB WiFi', price: 39.90, original_price: 89.90, image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500', category: 'Casa Inteligente', demand_score: 91, supplier: 'SmartHome' },
        { id: 'sup_lamp_002', name: 'Kit 3 Lâmpadas LED', price: 59.90, original_price: 119.90, image_url: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=500', category: 'Iluminação', demand_score: 86, supplier: 'LightTech' },
    ],
    'maquina': [
        { id: 'sup_maq_001', name: 'Câmera DSLR Profissional', price: 1899.90, original_price: 3999.90, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', category: 'Fotografia', demand_score: 94, supplier: 'PhotoPro' },
        { id: 'sup_maq_002', name: 'Câmera Mirrorless 4K', price: 2499.90, original_price: 4999.90, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', category: 'Fotografia', demand_score: 96, supplier: 'MirrorTech' },
        { id: 'sup_maq_003', name: 'Kit Fotógrafo Iniciante', price: 599.90, original_price: 1199.90, image_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', category: 'Fotografia', demand_score: 90, supplier: 'StarterPhoto' },
    ],
    'fotografica': [
        { id: 'sup_foto_001', name: 'Câmera Digital Compacta', price: 349.90, original_price: 699.90, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', category: 'Fotografia', demand_score: 88, supplier: 'CompactCam' },
        { id: 'sup_foto_002', name: 'Câmera Polaroid Moderna', price: 189.90, original_price: 399.90, image_url: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=500', category: 'Fotografia', demand_score: 92, supplier: 'InstaCam' },
        { id: 'sup_foto_003', name: 'Câmera Bridge Zoom 50x', price: 799.90, original_price: 1599.90, image_url: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500', category: 'Fotografia', demand_score: 85, supplier: 'ZoomPro' },
        { id: 'sup_foto_004', name: 'Kit Câmera + Tripé + Bag', price: 449.90, original_price: 899.90, image_url: 'https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=500', category: 'Fotografia', demand_score: 91, supplier: 'PhotoKit' },
        { id: 'sup_foto_005', name: 'Câmera Vlog 4K Touch', price: 599.90, original_price: 1199.90, image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500', category: 'Vídeo', demand_score: 94, supplier: 'VlogTech' },
    ],
};

// Normalize search term for matching
function normalizeSearch(term: string): string {
    return term.toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Remove acentos
        .replace(/[^a-z0-9\s]/g, '')
        .trim();
}

// Find matching supplier products
function findSupplierProducts(searchTerm: string): any[] {
    const normalized = normalizeSearch(searchTerm);
    const words = normalized.split(' ');

    let results: any[] = [];

    // Search through all supplier categories
    for (const [keyword, products] of Object.entries(GLOBAL_SUPPLIERS)) {
        // Check if any word matches the category keyword
        if (words.some(word => keyword.includes(word) || word.includes(keyword))) {
            results = [...results, ...products];
        }
    }

    // Remove duplicates and limit to 5
    const unique = results.filter((item, index, self) =>
        index === self.findIndex(t => t.id === item.id)
    );

    // Sort by demand_score and return top 5
    return unique
        .sort((a, b) => (b.demand_score || 0) - (a.demand_score || 0))
        .slice(0, 5)
        .map(product => ({
            ...product,
            is_sourced: true,
            profit_margin: 45, // Standard dropshipping margin
            stock_model: 'ZERO_INVENTORY',
            delivery_estimate: '7-15 dias úteis'
        }));
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim();

    if (!query || query.length < 2) {
        return NextResponse.json({
            products: [],
            message: 'Termo de busca muito curto',
            source: 'none'
        });
    }

    const supabase = getSupabase();

    // 1. FIRST: Search internal catalog
    let internalProducts: any[] = [];

    if (supabase) {
        const { data } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
            .eq('is_active', true)
            .limit(5);

        internalProducts = data || [];
    }

    // If we have internal products, return them
    if (internalProducts.length > 0) {
        return NextResponse.json({
            products: internalProducts,
            count: internalProducts.length,
            source: 'internal',
            message: `${internalProducts.length} produto(s) encontrado(s) no catálogo`
        });
    }

    // 2. FALLBACK: Search global suppliers (Zero Cost - Simulated)
    const supplierProducts = findSupplierProducts(query);

    if (supplierProducts.length > 0) {
        // Log the sourcing opportunity
        if (supabase) {
            await supabase.from('logs').insert({
                type: 'sourcing',
                message: `🔍 SOURCING: Busca "${query}" retornou ${supplierProducts.length} produtos de fornecedores globais.`,
                created_at: new Date().toISOString()
            });
        }

        return NextResponse.json({
            products: supplierProducts,
            count: supplierProducts.length,
            source: 'global_suppliers',
            message: `${supplierProducts.length} produto(s) encontrado(s) na rede de fornecedores`
        });
    }

    // 3. Nothing found - Log demand miss
    if (supabase) {
        await supabase.from('logs').insert({
            type: 'demand_miss',
            message: `❌ OPORTUNIDADE: Busca "${query}" sem resultados. Considerar adicionar ao catálogo.`,
            created_at: new Date().toISOString()
        });
    }

    return NextResponse.json({
        products: [],
        count: 0,
        source: 'none',
        message: `Nenhum produto encontrado para "${query}". Nossa IA está aprendendo.`
    });
}

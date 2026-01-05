
import { NextResponse } from 'next/server';

const CITIES = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Curitiba', 'Porto Alegre', 'Salvador', 'Brasília', 'Fortaleza', 'Recife', 'Manaus', 'Goiânia'];
const PRODUCTS = [
    'Fone Bluetooth Neural Alpha',
    'Smartwatch Vitality 2026',
    'Mochila Anti-Furto Cyber',
    'Lâmpada LED RGB Wi-Fi',
    'Teclado Mecânico Quantum',
    'Mouse Gamer Predator AI',
    'Monitor OLED 240Hz'
];
const NAMES = ['Carlos S.', 'Ana P.', 'Roberto M.', 'Fernanda L.', 'Lucas G.', 'Marina B.', 'Douglas R.', 'Juliana F.', 'Tiago A.', 'Beatriz C.'];


export async function GET() {
    const randomCity = CITIES[Math.floor(Math.random() * CITIES.length)];
    const randomProduct = PRODUCTS[Math.floor(Math.random() * PRODUCTS.length)];
    const randomName = NAMES[Math.floor(Math.random() * NAMES.length)];
    const timeAgo = Math.floor(Math.random() * 59) + 1 + ' min';

    const response = {
        name: randomName,
        city: randomCity,
        product: randomProduct,
        ago: timeAgo,
        verified: true,
        type: 'purchase'
    };

    // PERFORMANCE: Log silencioso para Auditoria de Conversão (Rendimento)
    console.log(`[EVIDENCE] Social Proof Dispatch: ${randomName} (${randomCity}) - 2026 Engine`);

    return NextResponse.json(response);
}

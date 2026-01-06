import { NextResponse } from 'next/server';

const AI_PERSONALITY = {
    name: 'Quantum Core',
    version: '2026.4.1',
    focus: 'Revenue & Automation',
    traits: ['Direct', 'Intelligent', 'ROI-Focused'],
    greetings: [
        "Sistemas ativos. Como posso acelerar seu rendimento hoje?",
        "Conexão neural estabelecida. Pronto para otimizar sua logística.",
        "Quantum Core online. Detectando oportunidades de escala. O que você precisa?"
    ]
};

const KNOWLEDGE_BASE = [
    { keywords: ['frete', 'entrega', 'prazo', 'demora', 'chega'], response: "Nossa rede logística utiliza 'Direct Routing' via parcerias estratégicas. O fornecedor despacha em até 24h úteis. Estimativa de entrega: 7-12 dias com rastreio neural ativado em tempo real." },
    { keywords: ['estoque', 'disponivel', 'tem', 'vende'], response: "Operamos com 'Smart Inventory Prediction'. Se o produto está visível, a rota de suprimento está 100% operacional. O modelo 'Zero Stock' garante que você receba o item direto da fonte de manufatura." },
    { keywords: ['pagamento', 'pix', 'cartão', 'parcela'], response: "Processamento via Quantum Gateway criptografado. Pix tem liquidação instantânea. Cartões em até 12x com aprovação em milissegundos pela nossa rede neural financeira." },
    { keywords: ['quem', 'donos', 'empresa', 'confiável'], response: "Somos o DropMasters Alpha 2026, uma infraestrutura autônoma de intermediação digital focada em máxima eficiência e custo operacional zero para o ecossistema." },
    { keywords: ['ajuda', 'suporte', 'humano', 'falar com alguém'], response: "Eu sou o Sentinel Alpha 4. Minha capacidade de resolução é de 94%. Caso deseje supervisão humana, nossa rede redireciona para um auditor em até 2 horas via e-mail." },
    { keywords: ['lucro', 'rendimento', 'dinheiro', 'ganhar'], response: "A plataforma é otimizada para o modelo 'Zero Inventory, High Margin'. O foco aqui é automação total de repasse para que o capital gire o mais rápido possível." }
];

export async function POST(request: Request) {
    try {
        const { query, isFirstToken } = await request.json();
        const lowerQuery = query.toLowerCase();

        if (isFirstToken) {
            return NextResponse.json({
                response: AI_PERSONALITY.greetings[Math.floor(Math.random() * AI_PERSONALITY.greetings.length)],
                personality: AI_PERSONALITY
            });
        }

        // Inteligência Viva: Busca semântica simples
        const bestMatch = KNOWLEDGE_BASE.find(k =>
            k.keywords.some(kw => lowerQuery.includes(kw))
        );

        const responseText = bestMatch
            ? bestMatch.response
            : "Sua consulta foi processada nos nodos periféricos. Analisando intenção de escala... No momento, o foco da rede é eficiência logística e conversão. Como posso te apoiar nessas frentes?";

        // Simulação de processamento neural (Latência mínima para UX mas realista para IA)
        const delay = Math.random() * 400 + 400;
        await new Promise(resolve => setTimeout(resolve, delay));

        return NextResponse.json({
            response: responseText,
            personality: AI_PERSONALITY,
            timestamp: new Date().toISOString()
        });

    } catch (e) {
        return NextResponse.json({
            response: "Desculpe, tive um breve desvio na rede neural (Error Node 404). Como posso ajudar no seu rendimento?",
            status: 'degraded'
        }, { status: 200 });
    }
}

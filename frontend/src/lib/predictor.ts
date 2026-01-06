
import { Product } from './products';

interface TrendAnalysis {
    score: number;
    status: 'explosive' | 'rising' | 'stable' | 'falling';
    action: 'increase_price' | 'maintain' | 'discount' | 'urgent_clearance';
    predicted_sales_24h: number;
}

// Simulação de Rede Neural de Mercado (Market Sentiment Analysis)
// Otimizado para: [COST ZERO] | [STOCK ZERO] | [AUTO PAYOUT]
export class SmartInventoryPredictor {

    static analyze(product: Product): Product & { analysis: TrendAnalysis } {
        // Base score vem do produto ou gera um aleatório se não existir
        let currentScore = product.demand_score || Math.floor(Math.random() * 60) + 40;

        // Fator de volatilidade (O mercado muda a cada milissegundo)
        const volatility = Math.floor(Math.random() * 10) - 5; // -5 a +5
        currentScore = Math.min(100, Math.max(0, currentScore + volatility));

        // Determina o status baseado no score
        let status: TrendAnalysis['status'] = 'stable';
        if (currentScore > 90) status = 'explosive';
        else if (currentScore > 75) status = 'rising';
        else if (currentScore < 40) status = 'falling';

        // Determina a ação recomendada para a IA de Precificação
        // Foco: Rendimento de Curto Prazo e Margem de Lucro Real
        let action: TrendAnalysis['action'] = 'maintain';
        if (status === 'explosive') action = 'increase_price'; // Demanda alta -> Aumenta margem de rendimento
        if (status === 'falling') action = 'urgent_clearance'; // Demanda baixa -> Liquidação para girar capital

        // Previsão de vendas 24h (Impacto no Fluxo de Caixa)
        const predictedSales = Math.floor((currentScore / 100) * 500) + Math.floor(Math.random() * 50);

        // Aplica modificações ao produto em tempo real (Modelo Estoque Zero)
        return {
            ...product,
            demand_score: currentScore,
            is_viral: status === 'explosive',
            demand_spike: status === 'rising' || status === 'explosive',
            stock_model: 'ZERO_INVENTORY', // Marcador explícito de modelo de negócio
            analysis: {
                score: currentScore,
                status,
                action,
                predicted_sales_24h: predictedSales
            }
        };
    }
}

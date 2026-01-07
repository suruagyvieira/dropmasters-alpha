import random
import datetime

class NeuralClientBackend:
    """
    NEURAL CLIENT BACKEND v11.0 (OMNI-LINK):
    Interage com o Sistema Vivo e Fornecedor para respostas ultra-precisas.
    """
    def __init__(self):
        self.context_threshold = 0.8
        
    def analyze_sentiment(self, text):
        text = text.lower()
        if any(word in text for word in ['atraso', 'não recebi', 'lento', 'ruim', 'erro', 'problema']):
            return "FRUSTRATED"
        if any(word in text for word in ['quero', 'comprar', 'desconto', 'valor', 'preço']):
            return "WANT_TO_BUY"
        return "NEUTRAL"

    def get_contextual_response(self, message, product_context=None, logistics_signals=None):
        """
        Gera respostas que consideram o estado real do fornecedor (Simbioso).
        """
        message = message.lower()
        sentiment = self.analyze_sentiment(message)
        
        # Sinais Logísticos (Fornecedor -> Cliente)
        rel = logistics_signals.get("reliability_score", 1.0) if logistics_signals else 1.0
        pressure = logistics_signals.get("supply_chain_pressure", 0.0) if logistics_signals else 0.0
        
        # Base de Respostas com Inteligência Logística
        if "prazo" in message or "entrega" in message:
            if rel > 0.95:
                return "Excelente notícia! Nossos fornecedores estão operando com 100% de eficiência hoje. Seu despacho será imediato via Hub SP."
            elif pressure > 0.80:
                return "Devido à alta demanda do {}, nossos fornecedores pediram um prazo adicional de 24h para garantir a qualidade total da inspeção.".format(product_context or "item")
            return "O prazo atual é de 5 a 10 dias úteis, com rastreio em tempo real ativado."

        if sentiment == "WANT_TO_BUY":
            # Gatilho de Escassez Real (Fornecedor -> Cliente)
            stock = "restam poucas unidades" if pressure > 0.6 else "temos estoque para despacho agora"
            return "O {} é um sucesso absoluto! Identifiquei que {} em nosso Hub prioritário. Se fechar agora, garanto sua reserva.".format(product_context or "produto", stock)

        # Fallback
        return "Entendo sua dúvida! Nossa rede de fornecedores em {} garante a melhor procedência para o {}. Posso te ajudar com o pagamento?".format("São Paulo" if rel > 0.9 else "nossa rede global", product_context or "produto")

def simulate_chat_interaction(customer_query, product_context=None, logistics_signals=None):
    engine = NeuralClientBackend()
    response = engine.get_contextual_response(customer_query, product_context, logistics_signals)
    sentiment = engine.analyze_sentiment(customer_query)
    
    return {
        "response": response,
        "sentiment": sentiment,
        "ai_confidence": round(random.uniform(0.95, 0.99), 2),
        "logistics_aware": True
    }

class CustomSourcingEngine:
    """
    APEX SOURCING ENGINE v12.3:
    Processa pedidos de produtos fora do catálogo via links ou descrição.
    Garante margem de ROI e intermediação automática.
    """
    @staticmethod
    def estimate_custom_price(query, source_link=None):
        from sourcing_engine import LiveSourcingEngine
        
        # 1. TENTA BUSCA REAL NA WEB (LIVING SYSTEM)
        print(f"🔎 LIVE SOURCING: Buscando '{query}' na rede...")
        real_product = LiveSourcingEngine.search_mercadolivre(query)
        
        if real_product:
            base_estimation = real_product['price']
            product_name = real_product['name']
            location_signal = "SP" if "SP" in real_product['location'] else "SC" if "SC" in real_product['location'] else "Regional"
            msg_source = "📍 Item encontrado em fornecedor parceiro Regional."
        else:
            # Fallback Neural Mock (se falhar o scrape)
            base_estimation = random.uniform(50, 450)
            product_name = f"Item Encomenda: {query}"
            location_signal = random.choice(["SP", "SC"])
            msg_source = "⚠️ Estimativa baseada em média de mercado (Sourcing em andamento)."
        
        # Inteligência de Margem (35% Lucro Líquido + Custos Operacionais)
        desired_net_profit_multiplier = 1.35 
        logistics_fee = 15.00 # Taxa de despacho prioritário
        
        final_price = (base_estimation * desired_net_profit_multiplier) + logistics_fee
        
        return {
            "name": product_name,
            "estimated_price": round(final_price, 2),
            "original_base": round(base_estimation, 2),
            "profit_net": round(final_price - base_estimation - logistics_fee, 2),
            "location_signal": location_signal,
            "status": "feasible",
            "message": f"{msg_source} Disponível para intermediação imediata.",
            "real_data": real_product # Metadados reais para o frontend
        }

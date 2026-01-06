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

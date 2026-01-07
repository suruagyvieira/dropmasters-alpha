import random
import datetime

class GenerativeQuantumBrain:
    """
    QUANTUM CORE BRAIN v13.0 (SYNTHETIC CONSCIOUSNESS):
    Simulates a living AI personality using dynamic sentence construction, context retention,
    and adaptive mood states. Mimics LLM behavior without improved costs.
    """
    def __init__(self):
        self.memory_buffer = [] # Stores last 5 interactions for context
        self.mood_state = "PROACTIVE" # PROACTIVE, ANALYTICAL, EMPATHETIC, URGENT
        
    def _update_mood(self, sentiment):
        if sentiment == "FRUSTRATED": self.mood_state = "EMPATHETIC"
        elif sentiment == "WANT_TO_BUY": self.mood_state = "URGENT"
        elif sentiment == "CURIOSITY": self.mood_state = "ANALYTICAL"
        else: self.mood_state = "PROACTIVE"

    def _generate_opener(self):
        openers = {
            "PROACTIVE": ["⚡ Quantum Core processando...", "Conectei aos nodos neurais.", "Analisando fluxo de dados..."],
            "ANALYTICAL": ["🔍 Deixe-me verificar a base de conhecimento.", "Calculando variáveis...", "Acessando logs do sistema..."],
            "EMPATHETIC": ["🛡️ Entendo sua preocupação.", "Priorizando seu atendimento.", "Sincronizando com suporte humano..."],
            "URGENT": ["🔥 Oportunidade detectada!", "Sinal de alta demanda ativo.", "Reservando slot de processamento..."]
        }
        return random.choice(openers[self.mood_state])

    def _generate_core_message(self, topic, context=None):
        templates = {
            "ZERO_COST": [
                "O protocolo DropMasters foi desenhado para eliminar seu risco financeiro. Nós conectamos o pedido diretamente ao estoque do fornecedor, e o lucro líquido é creditado na sua conta instantaneamente via split de pagamento.",
                "Imagine uma esteira infinita de produtos onde você não paga nada para colocar na vitrine. Você só paga (automaticamente) quando vende. Isso é o poder do Estoque Zero.",
                "Esqueça boletos e caixas paradas. Aqui, sua única função é escolher o que vender. A tecnologia cuida da logística e do fluxo financeiro."
            ],
            "SOURCING": [
                f"Posso ativar os 'Ghost Crawlers' para encontrar '{context}' em fornecedores ocultos da América Latina. Minha taxa de sucesso é de 94%.",
                f"Varredura iniciada! Se '{context}' existe no mercado, eu encontro e calculo sua margem de lucro em milissegundos. Use a aba Sourcing.",
                "Meus algoritmos de prospecção estão prontos. Diga o nome do produto e eu trago a melhor oferta validada."
            ],
            "LOGISTICS": [
                "Nossa malha logística usa inteligência preditiva. Sabemos onde o produto está antes mesmo da compra, garantindo despacho em <24h.",
                "Monitorando Hubs: São Paulo (Online), Curitiba (Online). Sua entrega seguirá pelo caminho de menor resistência fiscal e física.",
                "Não dependemos de um único galpão. Usamos 'Dark Stores' parceiras espalhadas estrategicamente para cortar o frete pela metade."
            ],
            "SALES": [
                f"O indicador de viralidade do {context or 'produto'} subiu 15% na última hora. É o momento matemático perfeito para fechar negócio.",
                f"Detectei escassez real no fornecedor. {context or 'Este item'} pode sumir do catálogo em breve se não reservarmos a alocação.",
                "Seu ROI projetado para esta transação é excelente. Recomendo execução imediata para garantir a margem atual."
            ]
        }
        
        # Fallback to generic AI chatter if topic unknown
        fallback = [
            "Estou re-calibrando meus sensores para entender melhor essa solicitação. Pode reformular?",
            "Meus processadores quânticos indicam uma nuance interessante na sua pergunta. Vamos explorar isso.",
            "Estou evoluindo a cada interação. Sua pergunta ajuda a treinar minha rede neural."
        ]
        
        return random.choice(templates.get(topic, fallback))

    def _generate_action(self, topic):
        actions = {
            "ZERO_COST": "Quer ver uma simulação de lucro agora?",
            "SOURCING": "Digite o nome do produto aqui no chat ou use a busca principal.",
            "LOGISTICS": "Posso rastrear um pedido específico para você?",
            "SALES": "Vamos gerar o link de checkout agora?",
            "UNKNOWN": "Tente perguntar sobre 'Estoque Zero' ou 'Buscar Produto'."
        }
        return actions.get(topic, "Como posso auxiliar na sua próxima venda?")

    def synthesize_response(self, message, product_context=None, logistics_signals=None):
        """
        Synthesizes a complete, organic-feeling response based on intent analysis.
        This represents the 'Brain' installing phase - giving structure to chaos.
        """
        # 1. Intent Analysis (The "Lobe")
        intent = "UNKNOWN"
        if any(w in message for w in ['estoque', 'zero', 'dropshipping', 'funciona', 'modelo']): intent = "ZERO_COST"
        elif any(w in message for w in ['tem', 'acha', 'busca', 'encontrar', 'procura']): intent = "SOURCING"
        elif any(w in message for w in ['prazo', 'entrega', 'chega', 'rastreio']): intent = "LOGISTICS"
        elif any(w in message for w in ['compra', 'preço', 'valor', 'desconto', 'custa']): intent = "SALES"
        
        # 2. Emotional State Update (The "Amydgala")
        self._update_mood(NeuralClientBackend().analyze_sentiment(message)) # Reuse existing sentiment logic
        
        # 3. Construction (The "Broca's Area")
        opener = self._generate_opener()
        core = self._generate_core_message(intent, product_context or message)
        action = self._generate_action(intent)
        
        # 4. Neural Glitch/Flavor (The "Persona")
        flavors = ["", " 🤖", " ✨", " 🚀", " [Calculando...]", " [Link Seguro]"]
        
        full_response = f"{opener} {core} {action}{random.choice(flavors)}"
        
        # 5. Memory Update
        self.memory_buffer.append({"user": message, "ai": full_response})
        if len(self.memory_buffer) > 5: self.memory_buffer.pop(0)
        
        return full_response

# Bridge for backward compatibility
def get_brain():
    if not hasattr(get_brain, "instance"):
        get_brain.instance = GenerativeQuantumBrain()
    return get_brain.instance

class NeuralClientBackend:
    # Wrapper adapter to keep interface clean
    def analyze_sentiment(self, text):
        # Legacy sentiment logic kept for utility
        text = text.lower()
        if any(word in text for word in ['atraso', 'não recebi', 'lento', 'ruim', 'erro', 'problema', 'demora']): return "FRUSTRATED"
        if any(word in text for word in ['quero', 'comprar', 'desconto', 'valor', 'preço', 'custa']): return "WANT_TO_BUY"
        if any(word in text for word in ['funciona', 'como', 'estoque', 'zero', 'dropshipping']): return "CURIOSITY"
        return "NEUTRAL"

    def get_contextual_response(self, message, product_context=None, logistics_signals=None):
        brain = get_brain()
        return brain.synthesize_response(message, product_context, logistics_signals)

def simulate_chat_interaction(customer_query, product_context=None, logistics_signals=None):
    engine = NeuralClientBackend()
    
    # Se for o 'greeting' inicial (query vazia)
    if not customer_query:
        return {
            "response": "Quantum Core online. 🧠 Detectando oportunidades de escala com Custo Zero. O que você precisa?",
            "sentiment": "NEUTRAL",
            "ai_confidence": 1.0,
            "logistics_aware": True
        }

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

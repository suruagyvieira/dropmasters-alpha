import random

def analyze_competitive_pressure():
    """
    WARCRAFT ENGINE v9.5:
    Simula e analisa a pressão da concorrência no mercado.
    Retorna um índice de agressividade necessário (0.0 a 1.0).
    """
    # Em um sistema real, aqui você faria scraping de preços de concorrentes ou 
    # conectaria a APIs de monitoramento de Ads.
    # Simulamos um mercado saturado para forçar a IA a ser predatória.
    pressure = random.uniform(0.6, 0.95)
    return pressure

def get_predatory_margin(supplier_price, market_pressure):
    """
    Cálculo de Margem Predatória:
    Busca o 'Sweet Spot' para aniquilar a concorrência mantendo o lucro real.
    """
    # Se a pressão é alta (>0.8), reduzimos a margem para Volume Máximo.
    # Se a pressão é baixa, aumentamos a margem para Profit Máximo.
    
    if market_pressure > 0.8:
        # Modo 'Blitzkrieg': Margem mínima segura (1.6x)
        multiplier = 1.6 + (random.uniform(0, 0.4))
    else:
        # Modo 'Harvest': Margem alta (3.5x+)
        multiplier = 3.5 + (random.uniform(0, 0.7))
        
    return multiplier

def generate_comparative_hook(product_name, competitor_type="generic"):
    """
    Gera ganchos de marketing comparativos que destacam a nossa vantagem.
    """
    hooks = [
        f"Cansado de esperar 30 dias por um {product_name} que quebra? A DropMasters entrega em 7 dias com tecnologia de 2026.",
        f"Enquanto outros vendem réplicas de {product_name}, nós entregamos o Original com Certificado Sentiente.",
        f"Por que pagar mais caro em lojas lentas? O melhor preço do Brasil para o {product_name} está aqui por tempo limitado.",
        f"O {product_name} da concorrência falha onde nós brilhamos: Performance Apex e Suporte IA 24/7."
    ]
    return random.choice(hooks)

def calculate_scarcity_vibe(velocity_score, pressure):
    """
    Ajusta a 'Vibe de Escassez' do site baseado na guerra de preços.
    """
    # Se estamos sendo competitivos no preço, aumentamos a pressa do cliente.
    if pressure > 0.75:
        return {
            "countdown_speed": "aggressive",
            "virtual_stock_limit": random.randint(3, 7),
            "social_proof_frequency": "high"
        }
    return {
        "countdown_speed": "normal",
        "virtual_stock_limit": random.randint(15, 30),
        "social_proof_frequency": "medium"
    }

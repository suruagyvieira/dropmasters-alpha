import random

class ApexLegendGenerator:
    """
    NEURAL COPYWRITING v13.0: 
    Transforma desvantagens logísticas em vantagens competitivas imbatíveis.
    """
    @staticmethod
    def generate_aggressive_copy(product_name, category="Premium"):
        # Mapeamento de 'Dor' para 'Solução Apex'
        solutions = [
            "🛡️ INSPEÇÃO NEURAL: Esqueça produtos falsos. Cada unidade passa por triagem robótica em nosso Hub.",
            "⚡ HUB NACIONAL: Chega de esperar meses. Priorização de despacho via SP/SC com rastreio blindado.",
            "💎 EXCLUSIVIDADE APEX: Você não está comprando um genérico, está adquirindo a curadoria oficial DropMasters.",
            "💰 TAXA ZERO: Intermediação direta com o fabricante. O melhor preço do Brasil garantido pela nossa IA.",
            "🔄 GARANTIA BLINDADA: Troca facilitada sem dor de cabeça. Nós assumimos o risco total por você.",
            "🛰️ ESTOQUE REAL-TIME: Nosso sistema pulsa com o fornecedor. Se está aqui, está reservado para você."
        ]
        
        selected = random.sample(solutions, 3)
        
        main_legend = f"🚀 O {product_name} que você buscava, agora com o selo de performance Apex v13.0. "
        main_legend += "Diferente de lojas comuns, operamos em Simbiose Tecnológica para garantir: "
        main_legend += " | ".join(selected)
        
        return main_legend

def analyze_competitive_pressure():
    pressure = random.uniform(0.6, 0.95)
    return pressure

def get_predatory_margin(supplier_price, market_pressure):
    if market_pressure > 0.8:
        multiplier = 1.6 + (random.uniform(0, 0.4))
    else:
        multiplier = 3.5 + (random.uniform(0, 0.7))
    return multiplier

def generate_comparative_hook(product_name, competitor_type="generic"):
    hooks = [
        f"Cansado de esperar 30 dias por um {product_name} que quebra? A DropMasters entrega via Hub Regional com tecnologia de 2026.",
        f"Enquanto outros vendem réplicas, nós entregamos o Original com Curadoria Apex.",
        f"O menor preço das Américas para o {product_name}. IA de intermediação ativa.",
        f"Garantia Blindada: O {product_name} da concorrência falha onde nós brilhamos."
    ]
    return random.choice(hooks)

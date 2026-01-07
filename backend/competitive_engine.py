import random

class ApexHybridEngine:
    """
    APEX HYBRID ENGINE v14.0:
    Orquestrador Neural de Modelos de Negócio.
    Decide qual motor usar: DROPSHIPPING | MARKETPLACE | AFILIADO | WHITE-LABEL
    """
    @staticmethod
    def select_best_model(product_data, market_pressure):
        price = float(product_data.get('price', 0))
        base = float(product_data.get('base_price', 0)) or (price * 0.5)
        
        # 1. AFILIADO: Se a pressão for absurda e a margem pequena, priorizamos o Afiliado (Custo Zero Real)
        if market_pressure > 0.9 and (price / base) < 1.3:
            return {
                "model": "AFFILIATE",
                "tag": "🌐 REDE GLOBAL",
                "strategy": "Volume de Comissão",
                "risk": "Zero"
            }
            
        # 2. MARKETPLACE: Se o produto for de nicho ou exigir expertise externa
        if "Special" in product_data.get('name', ''):
            return {
                "model": "MARKETPLACE",
                "tag": "🤝 PARCEIRO APEX",
                "strategy": "Comissão de Plataforma",
                "risk": "Baixo"
            }
            
        # 3. WHITE-LABEL: Se a margem for alta (>2.5x), viramos Marca Própria para fidelizar
        if (price / base) > 2.5:
            return {
                "model": "WHITE_LABEL",
                "tag": "💎 EXCLUSIVO APEX",
                "strategy": "Fidelização e Branding",
                "risk": "Médio"
            }
            
        # 4. DROPSHIPPING: Padrão para itens de giro rápido
        return {
            "model": "DROPSHIPPING",
            "tag": "📦 DESPACHO DIRETO",
            "strategy": "Giro Rápido",
            "risk": "Baixo"
        }

class ApexLegendGenerator:
    """
    NEURAL COPYWRITING v13.0: 
    Transforma desvantagens logísticas em vantagens competitivas imbatíveis.
    """
    @staticmethod
    def generate_aggressive_copy(product_name, model_info):
        model = model_info.get('model', 'DROPSHIPPING')
        
        # Soluções específicas por modelo
        model_hooks = {
            "AFFILIATE": "� ACESSO DIRETO: Conectamos você à maior rede de suprimentos global com preço de atacado.",
            "MARKETPLACE": "🤝 CURADORIA PARCEIRA: Item selecionado de nossos vendedores certificados com garantia Apex.",
            "WHITE_LABEL": "💎 LINHA ELITE: Produto premium com especificações exclusivas da marca DropMasters.",
            "DROPSHIPPING": "⚡ HUB PRIORITÁRIO: Logística Apex otimizada para entrega rápida via hub SP/SC."
        }
        
        general_solutions = [
            "🛡️ INSPEÇÃO NEURAL: Cada unidade passa por triagem robótica em nosso Hub.",
            "💰 TAXA ZERO: Intermediação direta para garantir o melhor preço do Brasil.",
            "🔄 GARANTIA BLINDADA: Nós assumimos o risco. Satisfação ou retorno imediato.",
            "🛰️ ESTOQUE REAL-TIME: Sistema em simbiose com o fabricante. Se está aqui, está reservado."
        ]
        
        selected = [model_hooks.get(model)] + random.sample(general_solutions, 2)
        
        main_legend = f"🚀 {product_name} [{model_info.get('tag')}]. "
        main_legend += "Agressividade comercial Apex v14.0 ativada: "
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

import random

class LocalPriorityEngine:
    """
    LOCAL PRIORITY ENGINE v2.0:
    Prioriza fornecedores e hubs regionais para reduzir tempo de entrega e aumentar margem.
    """
    REGIONAL_HUBS = {
        'SP': ['São Paulo', 'Campinas', 'Guarulhos'],
        'SC': ['Florianópolis', 'Joinville', 'Itajaí'],
        'MG': ['Belo Horizonte', 'Contagem'],
        'PR': ['Curitiba', 'Londrina']
    }

    @staticmethod
    def detect_best_route(user_region, product_origin):
        """
        Determina se existe uma rota otimizada local (Same-State or Neighbor-State).
        """
        if not user_region or not product_origin:
            return None
        
        # Simulação de lógica de frete inteligente
        if user_region == product_origin:
            return {
                "type": "SAME_STATE_FUSION",
                "days": "1-2 dias",
                "cost_reduction": 0.40 # 40% menos custo logístico
            }
        
        # Logística Sul-Sudeste (Forte no E-commerce BR)
        if user_region in ['SP', 'SC', 'PR'] and product_origin in ['SP', 'SC', 'PR']:
            return {
                "type": "REGIONAL_CORRIDOR",
                "days": "2-4 dias",
                "cost_reduction": 0.20
            }
            
        return None

class ApexHybridEngine:
    """
    APEX HYBRID ENGINE v15.0 (Zero Stock & Automated Payout):
    Orquestrador Neural de Modelos de Negócio com Foco em Repasse Automático.
    Decide qual motor usar: DROPSHIPPING | MARKETPLACE | AFILIADO | WHITE-LABEL | LOCAL_HUB
    """
    @staticmethod
    def select_best_model(product_data, market_pressure, user_region=None):
        price = float(product_data.get('price', 0))
        base = float(product_data.get('base_price', 0)) or (price * 0.5)
        
        # 0. LOCAL HUB (PRIORIDADE MÁXIMA - Critical logic update)
        # Se for detectado estoque regional virtual, priorizar para entrega rápida
        route = LocalPriorityEngine.detect_best_route(user_region, product_data.get('origin_state', 'SP'))
        if route:
            return {
                "model": "LOCAL_HUB",
                "tag": f"📍 HUB REGIONAL ({route['days']})",
                "strategy": "Logística Acelerada",
                "risk": "Zero",
                "margin_boost": route['cost_reduction']
            }

        # 1. AFILIADO: Se a pressão for absurda e a margem pequena
        # Lógica corrigida: Evitar prejuízo com taxas
        if market_pressure > 0.92 and (price / base) < 1.4:
            return {
                "model": "AFFILIATE",
                "tag": "🌐 REDE GLOBAL",
                "strategy": "Volume de Comissão",
                "risk": "Zero",
                "payout_split": "100% External"
            }
            
        # 2. MARKETPLACE: Se o produto for de nicho
        if "Special" in product_data.get('name', ''):
            return {
                "model": "MARKETPLACE",
                "tag": "🤝 PARCEIRO APEX",
                "strategy": "Comissão de Plataforma",
                "risk": "Baixo",
                "payout_split": "85% Seller / 15% Platform"
            }
            
        # 3. WHITE-LABEL: Se a margem for alta (>2.5x)
        if (price / base) > 2.5:
            return {
                "model": "WHITE_LABEL",
                "tag": "💎 EXCLUSIVO APEX",
                "strategy": "Fidelização e Branding",
                "risk": "Médio",
                "payout_split": "100% Internal"
            }
            
        # 4. DROPSHIPPING: Padrão
        return {
            "model": "DROPSHIPPING",
            "tag": "📦 DESPACHO DIRETO",
            "strategy": "Giro Rápido",
            "risk": "Baixo",
            "payout_split": "Product Cost -> Supplier | Margin -> Platform"
        }

class ApexLegendGenerator:
    """
    NEURAL COPYWRITING v14.0: 
    Adaptativo e Focado em Conversão Local.
    """
    @staticmethod
    def generate_aggressive_copy(product_name, model_info):
        model = model_info.get('model', 'DROPSHIPPING')
        
        model_hooks = {
            "LOCAL_HUB": "🚀 ENTREGA RELÂMPAGO: Identificamos estoque próximo a você. Envio prioritário ativado.",
            "AFFILIATE": "🌐 ACESSO DIRETO: Conectamos você à maior rede de suprimentos global com preço de atacado.",
            "MARKETPLACE": "🤝 CURADORIA PARCEIRA: Item selecionado de nossos vendedores certificados com garantia Apex.",
            "WHITE_LABEL": "💎 LINHA ELITE: Produto premium com especificações exclusivas da marca DropMasters.",
            "DROPSHIPPING": "⚡ HUB PRIORITÁRIO: Logística Apex otimizada para despacho imediato."
        }
        
        general_solutions = [
            "🛡️ INSPEÇÃO NEURAL: Cada unidade passa por triagem robótica em nosso Hub.",
            "💰 TAXA ZERO: Intermediação direta para garantir o melhor preço do Brasil.",
            "🔄 GARANTIA BLINDADA: Nós assumimos o risco. Satisfação ou retorno imediato.",
            "🛰️ ESTOQUE VIRTUAL: Sincronizado em tempo real. Se está aqui, é seu."
        ]
        
        selected_hook = model_hooks.get(model, model_hooks["DROPSHIPPING"])
        selected = [selected_hook] + random.sample(general_solutions, 2)
        
        main_legend = f"🚀 {product_name} [{model_info.get('tag')}]. "
        main_legend += "Oferta Otimizada: "
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
        f"Esqueça os prazos longos. O {product_name} via DropMasters chega antes.",
        f"Originalidade garantida e Rastreio em Tempo Real para seu {product_name}.",
        f"Preço de Fornecedor, Conveniência de Shopping. Apenas aqui.",
        f"Garantia Blindada: O {product_name} que você confia."
    ]
    return random.choice(hooks)


import random
import uuid
import time

# Simulação de dados de afiliados (em produção, viria do Supabase)
AFFILIATE_CACHE = {}

def generate_affiliate_code(user_id: str) -> str:
    """
    Gera um código de afiliado único para o usuário.
    """
    code = f"DROP{uuid.uuid4().hex[:6].upper()}"
    AFFILIATE_CACHE[code] = {
        "user_id": user_id,
        "created_at": time.time(),
        "total_sales": 0,
        "total_commission": 0.0,
        "commission_rate": 0.10  # 10% de comissão padrão
    }
    return code

def validate_affiliate_code(code: str) -> dict:
    """
    Valida se o código de afiliado existe e retorna os dados.
    """
    return AFFILIATE_CACHE.get(code)

def calculate_commission(order_total: float, affiliate_code: str) -> float:
    """
    Calcula a comissão do afiliado baseada no valor do pedido.
    """
    affiliate = AFFILIATE_CACHE.get(affiliate_code)
    if not affiliate:
        return 0.0
    
    commission = order_total * affiliate["commission_rate"]
    
    # Atualiza as estatísticas do afiliado
    AFFILIATE_CACHE[affiliate_code]["total_sales"] += 1
    AFFILIATE_CACHE[affiliate_code]["total_commission"] += commission
    
    return round(commission, 2)

def get_affiliate_stats(affiliate_code: str) -> dict:
    """
    Retorna as estatísticas de performance do afiliado.
    """
    affiliate = AFFILIATE_CACHE.get(affiliate_code)
    if not affiliate:
        return None
    
    return {
        "code": affiliate_code,
        "total_sales": affiliate["total_sales"],
        "total_commission": affiliate["total_commission"],
        "commission_rate": f"{int(affiliate['commission_rate'] * 100)}%",
        "status": "ACTIVE"
    }

def generate_affiliate_link(base_url: str, affiliate_code: str, product_slug: str = None) -> str:
    """
    Gera um link de afiliado rastreável.
    """
    if product_slug:
        return f"{base_url}/lp/{product_slug}?ref={affiliate_code}"
    return f"{base_url}/shop?ref={affiliate_code}"

def get_top_affiliates(limit: int = 5) -> list:
    """
    Retorna os top afiliados por comissão total.
    """
    sorted_affiliates = sorted(
        AFFILIATE_CACHE.items(),
        key=lambda x: x[1]["total_commission"],
        reverse=True
    )[:limit]
    
    return [
        {
            "code": code,
            "total_sales": data["total_sales"],
            "total_commission": data["total_commission"]
        }
        for code, data in sorted_affiliates
    ]

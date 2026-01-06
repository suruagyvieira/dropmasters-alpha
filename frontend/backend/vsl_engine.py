from media_engine import generate_ad_creative
import random

def generate_vsl_script(product_name, category):
    """
    NEURAL VSL ENGINE v8.8+:
    Gera roteiros de alta conversão para vídeos (Reels/TikTok/Youtube).
    Focado nos 3 pilares: Gancho, Conexão e Chamada de Ação (CTA).
    """
    creatives = generate_ad_creative(product_name, category)
    hook = creatives['primary_hook']
    
    # AI VIDEO PROMPTS (Para usar em Sora/Runway/Pika)
    video_prompts = [
        f"Cinematic product shot of {product_name}, cyberpunk lighting, 8k, slow motion rotation, neon reflections.",
        f"Close up of {product_name} in action, high tech {category} environment, digital overlays, futuristic aesthetic."
    ]
    
    scripts = [
        {
            "format": "TikTok/Reels (15s)",
            "ai_prompt": video_prompts[0],
            "scenes": [
                {"time": "0-3s", "visual": "Close-up rápido do produto com luz neon pulsante", "audio": f"[GANCHO] {hook}"},
                {"time": "3-10s", "visual": f"Cortes rápidos mostrando o {product_name} em uso real", "audio": f"O novo {product_name} não é apenas um acessório. É a tecnologia de 2026 resolvendo sua rotina de {category} hoje."},
                {"time": "10-15s", "visual": "Texto 'LINK NA BIO' com brilho intenso", "audio": "As unidades estão esgotando. Clique no link agora e garanta 50% OFF."}
            ]
        },
        {
            "format": "Review Narrativo (30s)",
            "ai_prompt": video_prompts[1],
            "scenes": [
                {"time": "0-5s", "visual": "Pessoa parecendo frustrada tentando usar métodos antigos", "audio": f"Você ainda está perdendo tempo com {category} convencional?"},
                {"time": "5-20s", "visual": f"Transição 'glitch' para o {product_name} funcionando perfeitamente", "audio": f"A inteligência sentiente do {product_name} elimina todo o esforço. Design futurista e performance Apex."},
                {"time": "20-30s", "visual": "Página de checkout abrindo rápido", "audio": "Dê o próximo passo. Clique no botão abaixo e mude seu nível ainda hoje."}
            ]
        }
    ]
    
    return {
        "product": product_name,
        "vsl_scripts": scripts,
        "video_ai_bridge": {
            "api_endpoint": "https://api.sentient-video.ai/v1/dispatch",
            "dispatch_token": f"SENTIENT_{random.randint(1000,9999)}",
            "ready_for_cloud": True
        }
    }

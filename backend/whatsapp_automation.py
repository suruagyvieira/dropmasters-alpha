import os
import random

def generate_payment_whatsapp_message(order_id, product_name, total_amount):
    """
    Gera script de mensagem de confirmação de pagamento (v10.0 Client Focus).
    """
    hooks = [
        "Ótima escolha! Seu pedido já está sendo priorizado. 🚀",
        "Pagamento confirmado! Você acaba de dar um upgrade no seu dia. ✨",
        "Tudo certo! O sistema já reservou sua unidade exclusiva. 🧬"
    ]
    
    return (
        f"*PAGAMENTO RECEBIDO:* Pedido {order_id}\n\n"
        f"{random.choice(hooks)}\n\n"
        f"Confirmamos o valor de *R${total_amount:.2f}* para o *{product_name}*.\n\n"
        "📍 O que acontece agora?\n"
        "1. Triagem Neural (Concluída)\n"
        "2. Preparação no Hub (Iniciada)\n"
        "3. Envio Fast Track (Próximo Passo)\n\n"
        "Te enviaremos o rastreio em breve! 🛰️"
    )

def generate_recovery_whatsapp_message(customer_name, cart_link, product_name):
    """
    RECUPERAÇÃO DE CARRINHO (Revenue Generation Trigger):
    Mensagem de alta conversão para clientes que não finalizaram o checkout.
    """
    hooks = [
        f"Ei {customer_name}, vi que você deixou o seu *{product_name}* reservado, mas não finalizou. Restam apenas 3 unidades no Hub local! 🔥",
        f"Olá {customer_name}! O Sentient Engine liberou um Frete Grátis relâmpago para o seu *{product_name}* por 20 minutos. Aproveita! 🚚",
        f"Notamos uma instabilidade no seu checkout, {customer_name}. Sua unidade do *{product_name}* está salva aqui, mas por pouco tempo. ⏳"
    ]
    
    return (
        f"⚠️ *OPORTUNIDADE PENDENTE*\n\n"
        f"{random.choice(hooks)}\n\n"
        f"🔗 Clique aqui para concluir agora:\n{cart_link}\n\n"
        "Se tiver qualquer dúvida, é só me chamar aqui! 🤖"
    )

def generate_shipping_whatsapp_message(order_id, product_name, tracking_code):
    """
    Gera script de mensagem de aviso de envio.
    """
    return (
        f"*SUA ENCOMENDA ESTÁ A CAMINHO!* 📦\n\n"
        f"O *{product_name}* (Ref: {order_id}) já saiu para entrega.\n\n"
        f"📍 Rastreio: *{tracking_code}*\n"
        "Acompanhe o trajeto aqui: https://www.linkcorreios.com.br/" + tracking_code + "\n\n"
        "Em breve você terá o melhor da tecnologia em suas mãos! 🚀"
    )

def simulate_whatsapp_dispatch(phone, message):
    """
    Simula o despacho de uma mensagem via API.
    Log amigável para monitoramento.
    """
    print(f"[{'WA_LIVE' if os.environ.get('WA_API_KEY') else 'WA_MOCK'}] -> {phone}: {message[:60]}...")
    return True

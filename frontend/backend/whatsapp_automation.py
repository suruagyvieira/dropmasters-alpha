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

def generate_recovery_whatsapp_message(customer_name, cart_link, product_name, level=1, location="SP"):
    """
    RECUPERAÇÃO DE CARRINHO (Revenue Generation Trigger):
    Nível 1: Suporte Amigo
    Nível 2: Escassez Regional
    Nível 3: Oferta Final (ROI Hunter)
    """
    if level == 1:
        return (
            f"Olá *{customer_name}*! Vi aqui que seu pedido do *{product_name}* não foi finalizado. 🧐\n\n"
            "Houve algum problema com o pagamento ou alguma dúvida sobre o frete? Como sou seu consultor pessoal, consigo te ajudar a liberar o envio ainda hoje! 🚀\n\n"
            f"🔗 Concluir pedido:\n{cart_link}"
        )
    elif level == 2:
        units = random.randint(2, 4)
        return (
            f"Oi *{customer_name}*, aviso importante! ⚠️\n\n"
            f"Devido à alta demanda do *{product_name}* em *{location}*, nosso estoque está quase zerado (apenas {units} unidades).\n\n"
            "Como você já tinha mostrado interesse, reservei sua unidade por mais 1 hora. Quer garantir agora? 👇\n\n"
            f"🔗 Link de Reserva:\n{cart_link}"
        )
    else:
        return (
            f"Finalizando os despachos de hoje, *{customer_name}*! 📦\n\n"
            f"Localizei seu pedido pendente e consegui uma liberação especial: se fechar o *{product_name}* nos próximos 15min, libero um *BÔNUS EXCLUSIVO* ou Frete VIP.\n\n"
            "Posso validar seu benefício agora? Me responde com 'SIM'!"
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

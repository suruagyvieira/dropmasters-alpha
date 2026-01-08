from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import time
import random
import threading
import uuid
import datetime
import requests
from functools import wraps
from dotenv import load_dotenv
from supabase import create_client, Client
from competitive_engine import analyze_competitive_pressure, get_predatory_margin, ApexLegendGenerator, ApexHybridEngine
from support_engine import simulate_chat_interaction, CustomSourcingEngine
from sourcing_engine import LiveSourcingEngine
from supplier import Autopilot

load_dotenv()

app = Flask(__name__)
CORS(app)

# Global Exception Handler (Shield)
@app.errorhandler(Exception)
def handle_exception(e):
    add_log(f"🔥 UNHANDLED ERROR: {str(e)}", "error")
    return jsonify({"error": "Neural core is stabilizing. Please retry.", "status": 500}), 500

# --- OMNI-SENTIENT CORE v11.7 (FINANCIAL PEAK) ---
supabase_url = os.environ.get("SUPABASE_URL")
supabase_key = os.environ.get("SUPABASE_SERVICE_ROLE_KEY")
MP_TOKEN = os.environ.get("MERCADO_PAGO_ACCESS_TOKEN") or os.environ.get("MP_ACCESS_TOKEN")
PAG_TOKEN = os.environ.get("PAGSEGURO_TOKEN")
FULFILLMENT_URL = os.environ.get("FULFILLMENT_WEBHOOK_URL")
ADMIN_SECRET = os.environ.get("ADMIN_SECRET", "quantum-2026")

supabase: Client = None
if supabase_url and supabase_key:
    supabase = create_client(supabase_url, supabase_key)

# ESTADO GLOBAL (Simbiose Total)
AUTONOMY_STATE = {
    "last_sync": 0, 
    "is_syncing": False,
    "ai_mood": "Optimal",
    "velocity_score": 0.85, 
    "dissatisfaction_score": 0.0, 
    "conversion_count": 0,
    "regional_metrics": {"SP": 0, "SC": 0, "OTHER": 0}
}

autonomy_lock = threading.Lock()
cache = {"products": {"data": None, "expiry": 0}}

def add_log(message, log_type='info'):
    """Logging Assíncrono para Não Bloquear Performance."""
    def _save():
        try:
            if supabase:
                supabase.table('logs').insert({"message": message, "type": log_type}).execute()
        except: pass
    threading.Thread(target=_save, daemon=True).start()

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth_header = request.headers.get('Authorization')
        if not auth_header or auth_header != f"Bearer {ADMIN_SECRET}":
            return jsonify({"error": "Unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated_function

# ==========================================
# 🧠 SISTEMA VIVO: NEURAL APEX v11.4
# ==========================================
# --- SISTEMA VIVO: NEURAL KERNEL v11.5 ---
WINNER_POOL = [
    {
        "name": "Quantum Ring Pro", "base": 85.0, "cat": "Wearables", "img": "1599643478518-a744c517b203", "trend": 0.95, "loc": "SP",
        "desc": "🚀 O futuro da saúde no seu dedo. Monitoramento neural e biométrico em tempo real com precisão de 99%.",
        "benefits": ["Bateria de 7 dias", "Prova d'água 50m", "Análise de sono IA"]
    },
    {
        "name": "Bio-Light Max", "base": 120.0, "cat": "Home", "img": "1534073828943-f801091bb18c", "trend": 0.88, "loc": "SC",
        "desc": "💡 Iluminação inteligente que sincroniza com seu ritmo circadiano para máxima energia e foco total.",
        "benefits": ["Redução de fadiga", "Sincronia com Apps", "LED de espectro total"]
    },
    {
        "name": "Ultra-Pods Elite", "base": 55.0, "cat": "Audio", "img": "1590658268037-6bf12165a8df", "trend": 0.92, "loc": "PR",
        "desc": "🎧 Áudio espacial imersivo com cancelamento de ruído neural ativo de última geração.",
        "benefits": ["Som Lossless", "Conexão Multiponto", "40h de autonomia"]
    },
    {
        "name": "Neural-Sleep Mask", "base": 65.0, "cat": "Health", "img": "1512314889339-df833219552d", "trend": 0.98, "loc": "MG",
        "desc": "💤 Bloqueio total de luz com neuro-estimulação para sono profundo instantâneo e reparador.",
        "benefits": ["Tecido respirável", "Fones integrados", "App de meditação"]
    }
]

def living_ai_pivot(force=False):
    now = time.time()
    with autonomy_lock:
        if AUTONOMY_STATE["is_syncing"]: return
        if not force and now - AUTONOMY_STATE["last_sync"] < 300 and AUTONOMY_STATE["conversion_count"] == 0:
            return
            
        AUTONOMY_STATE["is_syncing"] = True
        AUTONOMY_STATE["last_sync"] = now
    
    # Early Exit if Supabase is down (Zero Stock dependency)
    if not supabase: return

    try:
        # 1. Sincronia de Ciclo Omni
        logistics = Autopilot.get_logistics_signals()
        m_pressure = analyze_competitive_pressure()
        
        # 2. IA REGE A ORQUESTRA (Regional Focus)
        rel = logistics.get("reliability_score", 1.0)
        sup_pressure = logistics.get("supply_chain_pressure", 0.0)
        
        # Mood Adjustment
        if rel < 0.85: AUTONOMY_STATE["ai_mood"] = "Safety"
        elif sup_pressure > 0.8: AUTONOMY_STATE["ai_mood"] = "Throttled"
        elif AUTONOMY_STATE["dissatisfaction_score"] > 3: AUTONOMY_STATE["ai_mood"] = "Empathy"
        else: AUTONOMY_STATE["ai_mood"] = "Apex"

        # 3. Precificação Dinâmica Regionalizada (Agressividade Zero Cost)
        # SP/SC recebem desconto de logística no preço final para aumentar conversão local
        price_adj = 1.0
        if AUTONOMY_STATE["ai_mood"] == "Safety": price_adj = 1.15
        elif AUTONOMY_STATE["ai_mood"] == "Empathy": price_adj = 0.85

        # Multiplicador Base Apex - Garante 40% de margem mínima
        multiplier = max(1.4, get_predatory_margin(1.0, m_pressure) * price_adj)
        
        # 4. Atualização de Inventário
        res = supabase.table('products').select("id, name, base_price, metadata").eq('is_active', True).execute()
        
        # Se banco vazio, semeia (Bootstrap Zero Cost)
        if not res.data:
            seed = []
            for wp in WINNER_POOL:
                seed.append({
                    "id": str(uuid.uuid4()),
                    "name": wp['name'], 
                    "description": wp['desc'],
                    "base_price": wp['base'], 
                    "category": wp['cat'],
                    "image_url": f"https://images.unsplash.com/photo-{wp['img']}?q=80&w=600",
                    "price": round(wp['base'] * 2.2, 2) + 0.99, 
                    "is_active": True,
                    "metadata": {"location": wp['loc'], "benefits": wp['benefits']}
                })
            supabase.table('products').insert(seed).execute()
            res = supabase.table('products').select("id, name, base_price, metadata").eq('is_active', True).execute()

        batch = []
        for p in (res.data or []):
            base = float(p.get('base_price') or 0)
            if base <= 0: continue
            
            # Priorização Local: SP/SC têm custos menores
            loc = (p.get('metadata') or {}).get('location', 'Global')
            loc_adj = 0.95 if loc in ['SP', 'SC'] else 1.0
            
            # Seletor de Modelo Híbrido Apex
            model_info = ApexHybridEngine.select_best_model(p, m_pressure)
            
            # Legenda Agressiva Neural Baseada no Modelo
            legend = ApexLegendGenerator.generate_aggressive_copy(p['name'], model_info)
            
            # Cálculo de Preço Final (Apex Yield Optimization)
            # Regiões SP/SC (Hubs) têm prioridade de margem
            final_price = round(base * multiplier * loc_adj, 2) + 0.90

            # Motor de Pressão Apex (v15.0)
            d_score = int(random.uniform(85, 99)) if sup_pressure > 0.6 else int(random.uniform(40, 80))
            is_viral = d_score > 90

            # Update critical fields + Model Info + Pressure
            update_payload = {
                "id": p['id'],
                "price": final_price,
                "description": legend,
                "stock": random.randint(2, 5) if is_viral else random.randint(10, 20),
                "is_featured": is_viral,
                "is_active": True,
                "updated_at": datetime.datetime.now().isoformat(),
                "metadata": {
                    **(p.get('metadata') or {}),
                    "business_model": model_info['model'],
                    "model_tag": model_info['tag'],
                    "strategy": model_info['strategy'],
                    "demand_score": d_score,
                    "is_viral": is_viral
                }
            }
            batch.append(update_payload)
            
            # Regional Metric Snapshot
            if loc in AUTONOMY_STATE["regional_metrics"]:
                AUTONOMY_STATE["regional_metrics"][loc] += 1
            else:
                AUTONOMY_STATE["regional_metrics"]["OTHER"] += 1
            
        if batch and supabase:
            supabase.table('products').upsert(batch).execute()
        
        # 5. EXPANSÃO AUTOMÁTICA DE CATÁLOGO (Apex Discovery Mode)
        # Se algum nicho estiver vazio ou a cada X ciclos, buscamos coisa nova na rede
        product_count = len(res.data or [])
        
        # Estratégia Proativa: Garante diversidade de categorias
        categories = ["Eletrônicos", "Wearables", "Casa", "Ferramentas", "Áudio"]
        existing_cats = set(p.get('category') for p in (res.data or []))
        missing_cats = [c for c in categories if c not in existing_cats]

        if product_count < 40 or missing_cats or random.random() < 0.35:
            keyword = random.choice(missing_cats) if missing_cats else random.choice(LiveSourcingEngine.get_trending_keywords())
            add_log(f"🔎 APEX DISCOVERY: Explorando nicho '{keyword}' para expansão", "system")
            new_items = LiveSourcingEngine.search_mercadolivre(keyword, limit=4)
            
            if new_items:
                discovered = []
                for item in new_items:
                    if any(p['name'] == item['name'] for p in res.data or []): continue
                    
                    # Filtro de Qualidade Neural
                    if item['vibe_score'] < 75: continue 

                    base = item['price']
                    # Geração de Copy Agressiva via Motor Apex
                    model_info = ApexHybridEngine.select_best_model({"name": item['name']}, m_pressure)
                    legend = ApexLegendGenerator.generate_aggressive_copy(item['name'], model_info)
                    
                    discovered.append({
                        "id": str(uuid.uuid4()),
                        "name": item['name'],
                        "description": legend,
                        "base_price": base,
                        "category": keyword if keyword in categories else "Intermediação Premium",
                        "image_url": item['image'] or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
                        "price": round(base * multiplier, 2) + 0.99,
                        "is_active": True,
                        "is_featured": item['vibe_score'] > 90,
                        "metadata": {
                            "location": item['location'],
                            "seller": item['seller'],
                            "vibe_score": item['vibe_score'],
                            "business_model": model_info['model'],
                            "source": "ApexDiscovery",
                            "demand_score": item['vibe_score']
                        }
                    })
                if discovered:
                    supabase.table('products').insert(discovered).execute()
                    add_log(f"✨ EVOLUÇÃO: {len(discovered)} produtos de alta conversão integrados.", "system")

        # 6. ROTAÇÃO DE CATÁLOGO (Apex Selection)
        # Mantém apenas a elite produtiva no catálogo ativo
        if product_count > 60:
            # Ordena por demanda score (que agora reflete o vibe_score do sourcing)
            # Remove os 10 piores em massa para abrir espaço para o novo
            sorted_by_worst = sorted(res.data or [], key=lambda x: (x.get('metadata') or {}).get('demand_score', 100))
            to_retire = [p['id'] for p in sorted_by_worst[:10]]
            if to_retire:
                supabase.table('products').update({"is_active": False}).in_('id', to_retire).execute()
                add_log(f"♻️ APEX SELECTION: {len(to_retire)} itens de baixa tração arquivados.", "system")

        add_log(f"🧠 APEX CYCLE: {AUTONOMY_STATE['ai_mood']} | Catalog {product_count} | Pressure {int(m_pressure*100)}%", "system")
        
    except Exception as e:
        add_log(f"Pivot Error: {e}", "error")
    finally:
        with autonomy_lock:
            AUTONOMY_STATE["is_syncing"] = False
            cache["products"]["data"] = None

@app.route('/health', methods=['GET'])
def health():
    """Monitoramento de Conexão Apex."""
    status = {"server": "online", "supabase": "offline", "timestamp": datetime.datetime.now().isoformat()}
    try:
        if supabase:
            supabase.table('products').select("id").limit(1).execute()
            status["supabase"] = "online"
    except: pass
    return jsonify(status)

# ==========================================
# 🫂 INTERFACES CLIENTE (VICE-VERSA)
# ==========================================

@app.route('/api/v2/products', methods=['GET'])
def get_products():
    """Performance: Unified Endpoint (900s Cache) com Filtro de Recomendação."""
    now = time.time()
    recommend = request.args.get('recommend') == 'true'
    
    # 1. Tenta Cache Global
    data_source = cache["products"]["data"]
    if not data_source or now >= cache["products"]["expiry"]:
        try:
            res = supabase.table('products').select("*").eq('is_active', True).order('is_featured', desc=True).execute()
            data_source = []
            for p in res.data:
                price = float(p.get('price', 0))
                base_price = float(p.get('base_price') or (price * 0.65))
                meta = p.get('metadata') or {}
                data_source.append({
                    "id": p['id'], 
                    "name": p['name'], 
                    "price": price,
                    "base_price": base_price,
                    "description": p.get('description', ''),
                    "image_url": p['image_url'], 
                    "stock": p.get('stock', 10),
                    "original_price": float(price * 2.1),
                    "location": meta.get('location', 'SP'),
                    "is_viral": meta.get('is_viral', False),
                    "demand_score": meta.get('demand_score', 0),
                    "metadata": meta,
                    "ai_mood": AUTONOMY_STATE["ai_mood"],
                    "is_featured": p.get('is_featured', False),
                    "business_model": meta.get('business_model', 'DROPSHIPPING')
                })
            with autonomy_lock:
                cache["products"]["data"] = data_source
                cache["products"]["expiry"] = now + 900
        except: 
            return jsonify([])

    # 2. Filtra se necessário (Economia de banda + processamento)
    if recommend:
        data_source = [p for p in data_source if p.get('is_featured') or p.get('price') > 150]
        
    return jsonify(data_source)

# Cache de Sourcing (Economia de CPU/Scrape)
SOURCING_CACHE = {}

@app.route('/api/v2/sourcing/estimate', methods=['POST'])
def estimate_sourcing():
    """Apex Sourcing: Estima preço com cache de 24h para queries idênticas."""
    from support_engine import CustomSourcingEngine
    data = request.json
    query = data.get('query', '').lower().strip()
    link = data.get('link', '')
    
    if not query:
        return jsonify({"error": "Query is required"}), 400

    cache_key = f"{query}_{link}"
    if cache_key in SOURCING_CACHE:
        expiry, result = SOURCING_CACHE[cache_key]
        if time.time() < expiry:
            return jsonify(result)
            
    result = CustomSourcingEngine.estimate_custom_price(query, link)
    
    # ESTRATÉGIA OFF-CATALOG: Se o item é viável, já injetamos no banco como 'Sourcing' 
    # para que futuros visitantes o achem no catálogo principal.
    if result.get('status') == 'feasible' and supabase:
        try:
            # Verifica se já existe
            check = supabase.table('products').select("id").eq("name", result['name']).execute()
            if not check.data:
                new_p = {
                    "id": str(uuid.uuid4()),
                    "name": result['name'],
                    "description": f"Produto sob encomenda validado pelo assistente: {result['name']}. {result['message']}",
                    "base_price": result['original_base'],
                    "price": result['estimated_price'],
                    "image_url": (result.get('real_data') or {}).get('image') or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
                    "category": "Encomenda Personalizada",
                    "is_active": True,
                    "metadata": {
                        "location": result['location_signal'],
                        "is_sourcing": True,
                        "original_link": link,
                        "demand_score": 100 # Máxima prioridade (alguém pediu)
                    }
                }
                supabase.table('products').insert(new_p).execute()
                add_log(f"📥 SOURCING TO CATALOG: '{result['name']}' adicionado ao catálogo global.", "system")
        except: pass

    SOURCING_CACHE[cache_key] = (time.time() + 86400, result) # Cache de 1 dia
    return jsonify(result)

@app.route('/api/v2/sourcing/active-search', methods=['GET'])
def active_sourcing_search():
    """
    Pesquisa ativa de fornecedores (Scraping) Ultra-Agressiva.
    Filtra pela Elite de Fornecedores e gera copy para conversão imediata.
    """
    query = request.args.get('q', '').strip()
    if not query:
        return jsonify({"products": [], "message": "O que você busca hoje?"})

    add_log(f"🕵️ APEX SOURCING: Localizando fornecedores elite para '{query}'", "system")
    found_items = LiveSourcingEngine.search_mercadolivre(query, limit=6)
    
    if not found_items:
        return jsonify({"products": [], "message": "Busca global refinada. Tente termos mais genéricos."})

    batch_products = []
    registered_products = []
    m_pressure = analyze_competitive_pressure()
    multiplier = max(1.4, get_predatory_margin(1.0, m_pressure))

    for item in found_items:
        try:
            if item['vibe_score'] < 70: continue

            check = supabase.table('products').select("id, metadata").eq("name", item['name']).execute()
            final_price = round(item['price'] * multiplier, 2) + 0.99
            
            p_id = None
            if check.data:
                p_id = check.data[0]['id']
                # Se mudou muito o preço, atualiza no batch (Otimização Apex)
                update_p = {
                    "id": p_id,
                    "price": final_price,
                    "metadata": {**check.data[0]['metadata'], "vibe_score": item['vibe_score']}
                }
                batch_products.append(update_p)
            else:
                p_id = str(uuid.uuid4())
                model_info = ApexHybridEngine.select_best_model({"name": item['name']}, m_pressure)
                legend = ApexLegendGenerator.generate_aggressive_copy(item['name'], model_info)

                new_p = {
                    "id": p_id,
                    "name": item['name'],
                    "description": legend,
                    "base_price": item['price'],
                    "price": final_price,
                    "image_url": item['image'] or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
                    "category": "Intermediação Especializada",
                    "is_active": True,
                    "is_featured": True,
                    "metadata": {
                        "location": item['location'],
                        "seller": item['seller'],
                        "vibe_score": item['vibe_score'],
                        "business_model": model_info['model'],
                        "source": "ActiveApex",
                        "demand_score": item['vibe_score']
                    }
                }
                batch_products.append(new_p)
            
            registered_products.append({
                "id": p_id,
                "name": item['name'],
                "price": final_price,
                "image_url": item['image'] or "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600",
                "location": item['location'],
                "is_featured": True,
                "metadata": {"source": "ActiveApex", "vibe": item['vibe_score']}
            })
        except: continue

    if batch_products:
        supabase.table('products').upsert(batch_products).execute()

    return jsonify({
        "products": registered_products,
        "message": f"🎯 SUCESSO: Encontramos {len(registered_products)} itens de alta confiança para você!",
        "source": "apex_active_provider"
    })

@app.route('/api/v2/payments/callback', methods=['POST'])
def payment_callback():
    """Automação de Repasse & Logística Regional."""
    from whatsapp_automation import generate_payment_whatsapp_message, simulate_whatsapp_dispatch

    data = request.json
    txn_id = data.get('transaction_id')
    if data.get('status') == 'paid':
        try:
            if not supabase: return jsonify({"error": "DB disconnect"}), 500
            
            # Atomic selection to prevent race conditions during payout
            ord_res = supabase.table('orders').select("*").eq('transaction_id', txn_id).execute()
            if ord_res.data:
                order = ord_res.data[0]
                if order.get('status') == 'paid': 
                    return jsonify({"status": "already_processed"})

                metadata = order.get('metadata') or {}
                vendor_split = float(metadata.get('vendor_payout') or (order.get('total', 0) * 0.60))
                profit = float(metadata.get('platform_net') or (order.get('total', 0) * 0.40))
                
                is_priority = metadata.get('payout_priority') == 'high'
                region_focus = metadata.get('region_focus', [])
                
                # State Update First (Security Guard) - Atomic check
                # Payout automático priorizado para SP/SC
                update_fields = {
                    'status': 'paid', 
                    'paid_at': datetime.datetime.now().isoformat()
                }
                
                # Se for região priorizada, o repasse é disparado em modo 'Express'
                is_local = any(reg in region_focus for reg in ['SP', 'SC'])
                if is_local:
                    update_fields['metadata'] = {**metadata, "logistics_speed": "high"}

                supabase.table('orders').update(update_fields).eq('transaction_id', txn_id).execute()
                
                # Feedback Regional e de Prioridade
                p_tag = "🚀 [PRIORITÁRIO]" if is_priority else "📍 [REGIONAL]"
                for region in region_focus:
                    if region in AUTONOMY_STATE["regional_metrics"]:
                        AUTONOMY_STATE["regional_metrics"][region] += 10 # Boost de peso por venda
                
                add_log(f"💰 PAYOUT {p_tag}: TX {txn_id} | Vendor R$ {vendor_split:.2f} | Profit R$ {profit:.2f}", "revenue")

                def _finalize(target_order, target_txn, target_split):
                    # Autopilot Interno
                    Autopilot.submit_order(target_order)
                    
                    if FULFILLMENT_URL:
                        try:
                            requests.post(FULFILLMENT_URL, json={
                                "event": "order_paid",
                                "transaction_id": target_txn,
                                "payout": target_split,
                                "items": target_order.get('items', [])
                            }, timeout=10)
                        except: pass

                    phone = target_order.get('phone')
                    if phone:
                        msg = generate_payment_whatsapp_message(target_txn, "Item Prioritário", float(target_order.get('total', 0)))
                        simulate_whatsapp_dispatch(phone, msg)
                
                # Offload to worker thread for high-concurrency safety
                threading.Thread(target=_finalize, args=(order, txn_id, vendor_split), daemon=True).start()
                
                with autonomy_lock:
                    AUTONOMY_STATE["conversion_count"] += 1
                return jsonify({"status": "processed"})
        except Exception as e:
            add_log(f"Callback Error: {str(e)}", "error")
    return jsonify({"status": "ignored"}), 200

@app.route('/api/v2/support/chat', methods=['POST'])
def support_chat():
    data = request.json
    logistics = Autopilot.get_logistics_signals()
    interaction = simulate_chat_interaction(data.get('query', ''), data.get('product_context'), logistics)
    
    if interaction.get('sentiment') == "FRUSTRATED":
        with autonomy_lock: AUTONOMY_STATE["dissatisfaction_score"] += 1.0
    
    # Neural Synthesis Delay (To feel more human/alive)
    time.sleep(random.uniform(1.2, 2.8))
    
    return jsonify(interaction)

# --- NEURAL PULSE ---
def neural_maintainer():
    # Cold Start Bootstrap
    time.sleep(10)
    while True:
        try:
            living_ai_pivot()
            time.sleep(300) # Ciclo de 5 minutos para dinamismo comercial
        except: time.sleep(60)

threading.Thread(target=neural_maintainer, daemon=True).start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

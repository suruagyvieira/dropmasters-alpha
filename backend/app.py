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
from competitive_engine import analyze_competitive_pressure, get_predatory_margin
from support_engine import simulate_chat_interaction, CustomSourcingEngine
from supplier import Autopilot

load_dotenv()

app = Flask(__name__)
CORS(app)

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

def living_ai_pivot():
    with autonomy_lock:
        if AUTONOMY_STATE["is_syncing"]: return
        AUTONOMY_STATE["is_syncing"] = True
    
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

        # 3. Precificação Dinâmica Regionalizada
        price_adj = 1.0
        if AUTONOMY_STATE["ai_mood"] == "Safety": price_adj = 1.2
        elif AUTONOMY_STATE["ai_mood"] == "Empathy": price_adj = 0.9

        multiplier = get_predatory_margin(1.0, m_pressure) * price_adj
        
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
            
            final_price = round(base * multiplier * loc_adj, 2) + 0.99
            
            # Update ONLY critical fields to save I/O
            batch.append({
                "id": p['id'],
                "price": final_price,
                "stock": random.randint(2, 6) if sup_pressure > 0.7 else random.randint(10, 20),
                "updated_at": datetime.datetime.now().isoformat()
            })
            
        if batch and supabase:
            supabase.table('products').upsert(batch).execute()
        
        add_log(f"🧠 APEX CYCLE: Mood {AUTONOMY_STATE['ai_mood']} | Supply {int(rel*100)}% | Pressure {int(sup_pressure*100)}%", "system")
        
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
    """Performance: Global Cache (900s) com Auto-Refresh."""
    now = time.time()
    if cache["products"]["data"] and now < cache["products"]["expiry"]:
        return jsonify(cache["products"]["data"])
    
    try:
        res = supabase.table('products').select("*").eq('is_active', True).order('is_featured', desc=True).execute()
        processed = []
        for p in res.data:
            price = float(p.get('price', 0))
            # Garantia de Intermediador: Calcula margem mínima de 35% caso base_price falte
            base_price = float(p.get('base_price') or (price * 0.65))
            
            processed.append({
                "id": p['id'], 
                "name": p['name'], 
                "price": price,
                "base_price": base_price,
                "description": p.get('description', ''),
                "image_url": p['image_url'], 
                "stock": p.get('stock', 10),
                "original_price": float(price * 2.1),
                "location": (p.get('metadata') or {}).get('location', 'SP'),
                "metadata": p.get('metadata', {}),
                "ai_mood": AUTONOMY_STATE["ai_mood"]
            })
        
        with autonomy_lock:
            cache["products"]["data"] = processed
            cache["products"]["expiry"] = now + 900
        return jsonify(processed)
    except: return jsonify([])

@app.route('/api/v2/sourcing/estimate', methods=['POST'])
def estimate_sourcing():
    """Apex Sourcing: Estima preço de itens fora do catálogo."""
    from support_engine import CustomSourcingEngine
    data = request.json
    query = data.get('query', '')
    link = data.get('link', '')
    
    if not query:
        return jsonify({"error": "Query is required"}), 400
        
    result = CustomSourcingEngine.estimate_custom_price(query, link)
    return jsonify(result)

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
                vendor_split = metadata.get('vendor_payout', 0)
                profit = metadata.get('platform_net', 0)
                
                # State Update First (Security Guard)
                supabase.table('orders').update({
                    'status': 'paid', 'paid_at': datetime.datetime.now().isoformat()
                }).eq('transaction_id', txn_id).execute()
                
                add_log(f"💰 PAYOUT: TX {txn_id} | Vendor R$ {vendor_split} | Profit R$ {profit}", "revenue")

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
    
    return jsonify(interaction)

# --- NEURAL PULSE ---
def neural_maintainer():
    while True:
        try:
            living_ai_pivot()
            time.sleep(1800) 
        except: time.sleep(60)

threading.Thread(target=neural_maintainer, daemon=True).start()

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

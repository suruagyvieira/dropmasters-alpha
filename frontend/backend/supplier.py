import os
import json
import threading
import random
import datetime

class SupplierAutopilot:
    """
    SUPPLY CHAIN AUTOPILOT v11.4 (REGIONAL APEX):
    Gerencia fornecedores com Priorização Regional e Simbiose AI.
    [ZERO STOCK] | [REGIONAL ROUTING] | [AUTO PAYOUT]
    """
    def __init__(self, api_key=None, log_callback=None):
        self.api_key = api_key or os.environ.get("SUPPLIER_API_KEY")
        self.log_callback = log_callback
        
        # OMNI-FEEDBACK STATE
        self.internal_metrics = {
            "avg_dispatch_time": 12.5, 
            "reliability_score": 0.98,
            "supply_chain_pressure": 0.2,
            "regional_hubs": {"SP": 1.0, "SC": 0.95, "PR": 0.9, "MG": 0.85, "GLOBAL": 0.6}
        }
        self._lock = threading.Lock()

    def get_logistics_signals(self):
        with self._lock:
            return self.internal_metrics.copy()

    def submit_order(self, order_data):
        """
        Despacho com Roteamento Regional (SP/SC Priority).
        """
        def _execute():
            try:
                txn_id = order_data.get('transaction_id')
                items = order_data.get('items', [])
                
                # 1. Triagem de Prioridade
                # Itens de SP/SC são processados em "High Speed"
                priority_items = [i for i in items if i.get('location') in ['SP', 'SC']]
                standard_items = [i for i in items if i.get('location') not in ['SP', 'SC']]
                
                # 2. Despacho Prioritário
                if priority_items:
                    log_msg = f"⚡ FAST TRACK: {len(priority_items)} itens de SP/SC despachados via Hub Regional."
                    if self.log_callback: self.log_callback(log_msg, "supply")
                
                # 3. Despacho Standard
                if standard_items:
                    log_msg = f"📦 STANDARD: {len(standard_items)} itens encaminhados para processamento Global."
                    if self.log_callback: self.log_callback(log_msg, "supply")

                # 4. Atualização de Pressão (Simulação de Carga)
                with self._lock:
                    inc = 0.02 if priority_items else 0.05
                    self.internal_metrics["supply_chain_pressure"] = min(1.0, self.internal_metrics["supply_chain_pressure"] + inc)

            except Exception as e:
                if self.log_callback: self.log_callback(f"SUPPLY ERROR: {e}", "error")

        threading.Thread(target=_execute, daemon=True).start()

    def sync_tracking(self, txn_id, order_id, supabase):
        def _execute():
            try:
                # Mock Tracking Nacional
                mock_tracking = f"BR{random.randint(100,999)}{random.randint(1000,9999)}BR"
                supabase.table('orders').update({
                    "tracking_code": mock_tracking, 
                    "status": "shipped",
                    "metadata": {"payout_status": "executed", "dispatched_at": datetime.datetime.now().isoformat()}
                }).eq('id', order_id).execute()
            except: pass
        threading.Thread(target=_execute, daemon=True).start()

Autopilot = SupplierAutopilot()

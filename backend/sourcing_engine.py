import requests
from bs4 import BeautifulSoup
import random
import re

class LiveSourcingEngine:
    """
    APEX SOURCING ENGINE v2.0:
    Inteligência Viva para Descoberta de Fornecedores e Análise de Mercado.
    """
    
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/118.0.0.0 Safari/537.36"
    ]

    @staticmethod
    def _get_headers():
        return {
            "User-Agent": random.choice(LiveSourcingEngine.USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9"
        }

    @staticmethod
    def analyze_market_vibe(title, price, seller_info):
        """Simula análise neural de sentimento e viabilidade de mercado."""
        score = 70 # Base score
        if any(w in title.lower() for w in ['original', 'premium', 'oficial']): score += 15
        if price > 200: score += 10 # Higher ticket usually means better margin ops
        if "MercadoLíder" in seller_info: score += 20
        return min(99, score)

    @staticmethod
    def search_mercadolivre(query, limit=5):
        try:
            formatted_query = query.replace(" ", "-")
            url = f"https://lista.mercadolivre.com.br/{formatted_query}#D[A:{formatted_query}]"
            
            response = requests.get(url, headers=LiveSourcingEngine._get_headers(), timeout=12)
            if response.status_code != 200: return None

            soup = BeautifulSoup(response.text, 'html.parser')
            results = soup.select('li.ui-search-layout__item') or soup.select('div.ui-search-result__wrapper')

            products = []
            for item in results[:limit]:
                try:
                    title_elem = item.select_one('.ui-search-item__title') or item.select_one('.poly-component__title')
                    price_elem = item.select_one('.ui-search-price__part .andes-money-amount__fraction') or item.select_one('.poly-price__current .andes-money-amount__fraction')
                    link_elem = item.select_one('a.ui-search-link') or item.select_one('a.poly-component__title')
                    
                    if not (title_elem and price_elem and link_elem): continue
                    
                    title = title_elem.get_text().strip()
                    price = float(price_elem.get_text().replace('.', '').replace(',', '.'))
                    link = link_elem.get('href')
                    
                    # Seller/Reputation info
                    seller_elem = item.select_one('.ui-search-item__group__element--seller') or item.select_one('.poly-component__seller')
                    seller = seller_elem.get_text().strip() if seller_elem else "Fornecedor Validado"

                    img_elem = item.select_one('img.ui-search-result-image__element') or item.select_one('.poly-component__picture img')
                    image = img_elem.get('src') or img_elem.get('data-src') if img_elem else None
                    
                    loc_elem = item.select_one('.ui-search-item__location') or item.select_one('.poly-component__location')
                    location = loc_elem.get_text().strip() if loc_elem else "SP"

                    # Neural Score Simulation
                    vibe_score = LiveSourcingEngine.analyze_market_vibe(title, price, seller)

                    products.append({
                        "name": title,
                        "price": price,
                        "url": link,
                        "image": image,
                        "location": location,
                        "seller": seller,
                        "vibe_score": vibe_score,
                        "source": "MercadoLivre"
                    })
                except: continue
            
            return sorted(products, key=lambda x: x['vibe_score'], reverse=True)
            
        except Exception as e:
            print(f"Apex Sourcing Error: {e}")
            return None

    @staticmethod
    def get_trending_keywords():
        """Retorna palavras em ascensão baseada em sazonalidade simulada."""
        trends = [
            "Projetor Magcubic 4K", "Smartwatch Ultra 2 Original", 
            "Fone Lenovo LP40 Pro", "Drone DJI Mini 4",
            "Mochila Antifurto Premium", "Aspirador Robô Inteligente"
        ]
        random.shuffle(trends)
        return trends

import requests
from bs4 import BeautifulSoup
import random
import re

class LiveSourcingEngine:
    """
    LIVE SOURCING ENGINE v1.0:
    Real-time web scraping to find products and suppliers without official APIs.
    Focuses on Mercado Livre (BR) for regional priority.
    """
    
    USER_AGENTS = [
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36",
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15",
        "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36"
    ]

    @staticmethod
    def _get_headers():
        return {
            "User-Agent": random.choice(LiveSourcingEngine.USER_AGENTS),
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7"
        }

    @staticmethod
    def search_mercadolivre(query, limit=5):
        """
        Scrapes Mercado Livre search results for the query.
        Returns the best matches.
        """
        try:
            # Format query for URL
            formatted_query = query.replace(" ", "-")
            url = f"https://lista.mercadolivre.com.br/{formatted_query}#D[A:{formatted_query}]"
            
            response = requests.get(url, headers=LiveSourcingEngine._get_headers(), timeout=10)
            if response.status_code != 200:
                print(f"Failed to fetch ML: {response.status_code}")
                return None

            soup = BeautifulSoup(response.text, 'html.parser')
            
            # Select product cards
            results = soup.select('li.ui-search-layout__item')
            if not results:
                results = soup.select('div.ui-search-result__wrapper')

            products = []
            
            for item in results[:limit]: # Limit analysis
                try:
                    # Extract Title
                    title_elem = item.select_one('.ui-search-item__title') or item.select_one('.poly-component__title')
                    if not title_elem: continue
                    title = title_elem.get_text().strip()
                    
                    # Extract Price
                    price_elem = item.select_one('.ui-search-price__part .andes-money-amount__fraction') or item.select_one('.poly-price__current .andes-money-amount__fraction')
                    if not price_elem: continue
                    price = float(price_elem.get_text().replace('.', '').replace(',', '.'))
                    
                    # Extract Link
                    link_elem = item.select_one('a.ui-search-link') or item.select_one('a.poly-component__title')
                    if not link_elem: continue
                    link = link_elem.get('href')
                    
                    # Extract Image
                    img_elem = item.select_one('img.ui-search-result-image__element') or item.select_one('.poly-component__picture')
                    image = img_elem.get('src') if img_elem else None
                    if not image and img_elem:
                        image = img_elem.get('data-src') # Lazy loading check
                    
                    # Extract Location
                    loc_elem = item.select_one('.ui-search-item__location') or item.select_one('.poly-component__location')
                    location = loc_elem.get_text().strip() if loc_elem else "SP"

                    products.append({
                        "name": title,
                        "price": price,
                        "url": link,
                        "image": image,
                        "location": location,
                        "source": "MercadoLivre"
                    })
                except Exception as e:
                    continue
            
            if not products: return None
            
            # Filter and sort
            avg_price = sum(p['price'] for p in products) / len(products)
            valid_products = [p for p in products if p['price'] > avg_price * 0.4]
            
            return sorted(valid_products, key=lambda x: x['price']) # Return sorted list
            
        except Exception as e:
            print(f"Scraping Error: {e}")
            return None

    @staticmethod
    def get_trending_keywords():
        """Simulates discovery of trending e-commerce terms in BR."""
        return [
            "Smartwatch Ultra 9", "Fone Bluetooth Noise Cancelling", 
            "Projetor Portátil 4K", "Massageador Cervical Elétrico",
            "Câmera Segurança Wifi Externa", "Mini Ar Condicionado Portátil"
        ]

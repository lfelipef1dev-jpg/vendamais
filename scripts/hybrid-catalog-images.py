"""Pipeline hibrido de imagens para VendaMais.

Estrategia:
- Hortifruti, Acougue, Padaria -> Openverse (fotos abertas de alimentos frescos)
- Mercearia, Bebidas, Limpeza, Higiene, Bebe, Pet, Congelados, Frios, Laticinios -> Carrefour/Atacadao (packshots reais)
"""
import os, re, json, time, requests
from urllib.parse import quote
from PIL import Image
from io import BytesIO
import unicodedata
from difflib import SequenceMatcher

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
QA_HTML = os.path.join(ROOT, "public", "catalog-qa.html")

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "pt-BR,pt;q=0.9",
}

# Categorias frescas -> Openverse
FRESH_CATEGORIES = {"hortifruti", "acougue", "padaria"}
# Categorias embaladas -> Carrefour/Atacadao
PACKAGED_CATEGORIES = {"mercearia", "bebidas", "limpeza", "higiene", "bebe", "pet", "congelados", "frios", "laticinios"}

# Mapeamento VendaMais -> categorias dos concorrentes
CATEGORY_MAP = {
    "mercearia": ["/Mercearia/"],
    "bebidas": ["/Bebidas/"],
    "limpeza": ["/Limpeza e Lavanderia/", "/Limpeza/"],
    "higiene": ["/Higiene e Perfumaria/", "/Higiene e perfumaria/"],
    "bebe": ["/Bebê e Infantil/", "/Bebê/"],
    "pet": ["/Pet Care/", "/Pet/"],
    "congelados": ["/Congelados/", "/Frios e congelados/"],
    "frios": ["/Frios e Laticínios/", "/Frios e congelados/"],
    "laticinios": ["/Frios e Laticínios/", "/Frios e congelados/"],
}

# Tags em ingles para Openverse
ENGLISH_TAGS = {
    # Hortifruti
    "banana-prata": "banana", "banana-organica": "banana", "maca-gala": "apple",
    "maca-organica": "apple", "tomate-de-mesa": "tomato", "tomate-cereja": "cherry tomato",
    "tomate-organico": "tomato", "alface-americana-1maco": "lettuce",
    "laranja-pera": "orange", "mamao-formosa": "papaya", "uva-rubi": "grapes",
    "morango-fresco-300g": "strawberry", "abacaxi-perola-1unidade": "pineapple",
    "manga-tommy": "mango", "pera-williams": "pear", "melancia": "watermelon",
    "limao-taiti": "lemon", "batata-inglesa": "potato", "cenoura": "carrot",
    "cebola": "onion", "pimentao-verde": "bell pepper", "abobrinha": "zucchini",
    "chuchu": "chayote", "pepino": "cucumber", "couve-1maco": "kale",
    "espinafre-1maco": "spinach", "brocolis-300g": "broccoli", "repolho-verde": "cabbage",
    "alho": "garlic", "gengibre": "ginger", "coentro-1maco": "cilantro",
    "cebolinha-1maco": "chives", "salsinha-1maco": "parsley",
    # Acougue
    "picanha-bovina": "picanha beef raw", "contrafile": "sirloin steak raw beef",
    "maminha": "rump roast beef raw", "alcatra": "rump steak raw beef",
    "acem": "beef stew meat raw", "patinho": "eye of round beef raw",
    "cupim": "beef hump raw", "costela-bovina": "beef ribs raw",
    "linguica-toscana": "sausage raw", "linguica-calabresa": "calabrese sausage raw",
    "barriga-suina": "pork belly raw", "lombo-suino": "pork loin raw",
    "costelinha-suina": "pork ribs raw", "frango-inteiro-caipira": "whole chicken raw",
    "peito-de-frango": "chicken breast raw", "coxa-de-frango": "chicken thigh raw",
    "sobrecoxa-de-frango": "chicken drumstick raw", "asa-de-frango": "chicken wings raw",
    "file-de-frango": "chicken fillet raw", "file-de-tilapia": "tilapia fillet raw fish",
    "file-de-salmao": "salmon fillet raw", "atum-fresco": "tuna fish fresh",
    "sardinha-fresca": "sardines fresh fish", "linguica-de-frango": "chicken sausage raw",
    "hamburguer-bovino-120g-4un480g": "beef burger patty raw", "carne-moida-bovina": "ground beef raw",
    "pernil-suino": "pork leg raw", "bacon-defumado": "bacon strips",
    # Padaria
    "pao-frances": "french bread", "pao-frances-6un": "french bread",
    "pao-de-forma-integral-500g": "whole wheat sandwich bread",
    "pao-de-forma-branco-500g": "white sandwich bread loaf",
    "bolo-de-chocolate-800g": "chocolate cake", "croissant-de-manteiga-60g": "croissant",
    "pao-de-queijo-500g": "cheese bread", "bolo-de-fuba-600g": "corn cake",
    "torta-de-frango-1kg": "chicken pie", "coxinha-6un-6un300g": "coxinha",
    "esfiha-aberta-6un-6un300g": "esfiha", "baguete-200g": "baguette bread",
    "pao-sourdough-400g": "sourdough bread", "croissant-de-chocolate-70g": "chocolate croissant",
    "bolo-de-cenoura-700g": "carrot cake", "pao-de-batata-100g": "potato bread",
    "rosca-doce-300g": "sweet bread roll", "biscoito-polvilho-200g": "tapioca biscuit",
    "torta-de-limao-1kg": "lemon pie", "empada-4un-4un200g": "empada pastry",
    "pao-integral-400g": "whole grain bread", "muffin-de-chocolate-80g": "chocolate muffin",
}

NON_FOOD_KEYWORDS = [
    "faca", "cortador", "dispenser", "porta", "suporte", "molde", "cueiro",
    "sanduicheira", "espremedor", "kit", "refil", "acabamento", "fita",
    "barra de", "colher", "balde", "escorredor", "culos", "brinco",
    "pulseira", "bijuteria", "moda", "acessorio", "brinquedo", "boneco",
    "pelucia", "jogo", "tabuleiro", "livro", "papelaria", "calculadora",
    "tesoura", "caneta", "pendrive", "informatica", "audio", "microfone",
    "instrumento", "movel", "sofa", "armario", "decoracao", "jardim",
    "semente", "fertilizante", "construcao", "soldagem", "epi", "automotivo",
    "oleo para motor", "polidor", "cama", "mesa", "banho", "cobertor",
    "manta", "esporte", "lazer", "embarcacao", "nautico", "industrial",
    "maquina", "despolpadeira", "eletroportateis", "cafeteira",
    "liquidificador", "fritadeira", "grill", "bebedouro", "purificador",
    "drogaria", "dermocosmetico", "saude", "hospitalar", "odontologico",
    "lamina", "refis", "barbeador", "aparelho estetico",
    "desidratad", "seco", "seca", "flocos", "fatias", "conserva",
    "chips", "snack", "barra ", "biscoito", "bolacha", "papa", "papinha",
    "xarope", "emulsi", "sabor ", "aroma", "extrato", "tintura",
    "em po", "em pó", "instantaneo", "instantâneo", "mistura",
    "silicone", "plastico", "plástico", "ferro",
]

os.makedirs(PRODUCT_DIR, exist_ok=True)
os.makedirs(os.path.dirname(MANIFEST), exist_ok=True)

def normalize(text):
    text = unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii")
    return text.lower().strip()

def parse_catalog():
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    pattern = r'\{\s*id:\s*"(?P<id>[^"]+)",\s*slug:\s*"(?P<slug>[^"]+)",\s*name:\s*"(?P<name>[^"]+)",\s*brand:\s*"(?P<brand>[^"]+)",\s*category:\s*"(?P<category>[^"]+)",\s*subcategory:\s*"(?P<subcategory>[^"]+)",\s*image:\s*"(?P<image>[^"]+)"'
    products = []
    for m in re.finditer(pattern, content):
        products.append(m.groupdict())
    return products

def similarity(a, b):
    a = normalize(a)
    b = normalize(b)
    if not a or not b:
        return 0
    base = SequenceMatcher(None, a, b).ratio()
    a_words = set(a.split())
    b_words = set(b.split())
    word_match = len(a_words & b_words) / len(a_words) if a_words else 0
    return (base * 0.4 + word_match * 0.6) * 100

# ============= OPENVERSE (frescos) =============
def search_openverse(query, page_size=15):
    url = f"https://api.openverse.engineering/v1/images/?q={quote(query)}&page_size={page_size}"
    try:
        r = requests.get(url, headers={"User-Agent": "VendaMais/1.0"}, timeout=30)
        if r.status_code == 200:
            return r.json().get("results", [])
    except:
        pass
    return []

def is_good_background(img):
    try:
        img = img.convert("RGB").resize((100, 100), Image.LANCZOS)
        corners = [img.getpixel((5,5)), img.getpixel((94,5)), img.getpixel((5,94)), img.getpixel((94,94))]
        brightness = sum(sum(c) for c in corners) / (4 * 3)
        if brightness < 170:
            return 0
        border = []
        for x in range(100):
            border.append(img.getpixel((x, 0)))
            border.append(img.getpixel((x, 99)))
        for y in range(100):
            border.append(img.getpixel((0, y)))
            border.append(img.getpixel((99, y)))
        rs = [p[0] for p in border]
        gs = [p[1] for p in border]
        bs = [p[2] for p in border]
        def std(v):
            m = sum(v)/len(v)
            return (sum((x-m)**2 for x in v)/len(v))**0.5
        total = std(rs) + std(gs) + std(bs)
        if total < 30: return 10
        if total < 70: return 6
        if total < 120: return 3
        return 1
    except:
        return 0

def process_fresh(product, used_urls=None):
    """Busca foto de produto fresco no Openverse."""
    if used_urls is None:
        used_urls = set()
    
    slug = product["slug"]
    en_tag = ENGLISH_TAGS.get(slug, product["name"])
    
    queries = [
        f"{en_tag} fresh",
        f"{en_tag} isolated white background",
        f"{en_tag} food photography",
        f"{en_tag} raw",
        f"{en_tag} whole",
        f"{en_tag} single",
        product["name"],
        f"{en_tag} variety",
    ]
    queries = list(dict.fromkeys(queries))
    
    best = None
    best_score = 0
    
    for q in queries:
        results = search_openverse(q, page_size=15)
        for item in results:
            img_url = item.get("url", "")
            # Pular imagens já usadas
            if img_url in used_urls:
                continue
            
            title = item.get("title", "").lower()
            tags = [t.get("name", "").lower() for t in item.get("tags", [])]
            all_text = title + " " + " ".join(tags)
            
            # Verificar se a tag esperada está presente
            en_word = en_tag.split()[0]
            if en_word not in all_text:
                continue
            
            # Rejeitar pratos/cozidos
            bad = ["dish", "meal", "salad", "soup", "cooked", "recipe", "restaurant", "plate"]
            if any(b in all_text for b in bad):
                continue
            
            # Score
            score = 20  # base por ter a tag
            if "isolated" in tags or "white" in tags or "background" in tags:
                score += 15
            if "raw" in tags or "fresh" in tags:
                score += 10
            
            w = item.get("width", 0) or 0
            h = item.get("height", 0) or 0
            if w >= 800 and h >= 800:
                score += 10
            elif w >= 600 and h >= 600:
                score += 6
            elif w >= 400 and h >= 400:
                score += 3
            
            lic = item.get("license", "").lower()
            if "by" in lic:
                score += 10
            
            if score > best_score:
                best_score = score
                best = item
        
        if best_score >= 50:
            break
        time.sleep(0.3)
    
    if not best or best_score < 30:
        return None
    
    # Baixar imagem
    img_url = best.get("url", "")
    if not img_url:
        return None
    
    try:
        r = requests.get(img_url, headers={"User-Agent": "VendaMais/1.0"}, timeout=45)
        if r.status_code != 200 or len(r.content) < 3000:
            return None
        img = Image.open(BytesIO(r.content))
    except:
        return None
    
    w, h = img.size
    if w < 300 or h < 300:
        return None
    
    # Processar
    img_rgb = img.convert("RGB")
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    img_sq = img_rgb.crop((left, top, left + s, top + s))
    
    cat_dir = os.path.join(PRODUCT_DIR, product["category"])
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{product['slug']}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=88)
    
    used_urls.add(img_url)
    
    return {
        "sku": product["id"],
        "slug": product["slug"],
        "name": product["name"],
        "category": product["category"],
        "subcategory": product["subcategory"],
        "localPath": f"/images/catalog/products/{product['category']}/{product['slug']}.webp",
        "source": "openverse",
        "sourceUrl": best.get("url", ""),
        "sourceProduct": best.get("title", ""),
        "sourceBrand": best.get("creator", ""),
        "imageUrl": img_url,
        "matchScore": best_score,
        "status": "approved" if best_score >= 40 else "review",
    }

# ============= CARREFOUR/ATACADAO (embalados) =============
def search_vtex(base, query, limit=20, referer=None):
    headers = {**HEADERS}
    if referer:
        headers["Referer"] = referer
    url = f"https://www.{base}/api/catalog_system/pub/products/search/{quote(query)}?_from=0&_to={limit}"
    try:
        r = requests.get(url, headers=headers, timeout=30)
        if r.status_code in (200, 206):
            return r.json()
    except:
        pass
    return []

def is_in_category(product_json, target_cats):
    cats = product_json.get("categories", [])
    for cat in cats:
        for target in target_cats:
            if target in cat:
                return True
    return False

def is_non_food(product_name):
    name_norm = normalize(product_name)
    for kw in NON_FOOD_KEYWORDS:
        if kw in name_norm:
            return True
    return False

def extract_best_image(product_json):
    images = []
    for item in product_json.get("items", []):
        for img in item.get("images", []):
            url = img.get("imageUrl", "")
            if url:
                for size in ["-100x100", "-200x200", "-300x300", "-400x400", "-500x500", "-600x600"]:
                    url = url.replace(size, "-1000x1000")
                images.append(url)
    return images[0] if images else None

def download_image(url, timeout=45):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        if r.status_code == 200 and len(r.content) > 3000:
            ct = r.headers.get("Content-Type", "")
            if "text" in ct or "html" in ct:
                return None
            return r.content
    except:
        pass
    return None

def process_image(img_bytes, product):
    try:
        img = Image.open(BytesIO(img_bytes))
    except:
        return None
    w, h = img.size
    if w < 200 or h < 200:
        return None
    img_rgb = img.convert("RGB")
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    img_sq = img_rgb.crop((left, top, left + s, top + s))
    cat_dir = os.path.join(PRODUCT_DIR, product["category"])
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{product['slug']}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=90)
    return frontend_path

def process_packaged(product):
    """Busca packshot de produto embalado no Carrefour/Atacadao."""
    target_cats = CATEGORY_MAP.get(product["category"], [])
    if not target_cats:
        return None
    
    name = product["name"]
    name = re.sub(r"\b(vendamais|vendamais selecao|vendamais essencial|boa vida|casa limpa|petamigo)\b", "", name, flags=re.IGNORECASE).strip()
    name_clean = re.sub(r"\s+\d+\s*(kg|g|ml|l|gr|un|unid|mc|mç|pacote|caixa)\b.*$", "", name, flags=re.IGNORECASE).strip()
    
    queries = [name, name_clean, f"{name_clean} {product.get('subcategory', '')}".strip()]
    queries = list(dict.fromkeys(queries))
    
    best_match = None
    best_score = 0
    best_source = None
    best_base = None
    
    for q in queries:
        for base, referer in [("carrefour.com.br", "https://www.carrefour.com.br/"), ("atacadao.com.br", "https://www.atacadao.com.br/")]:
            results = search_vtex(base, q, limit=20, referer=referer)
            for p in results:
                if not is_in_category(p, target_cats):
                    continue
                if is_non_food(p.get("productName", "")):
                    continue
                score = similarity(name, p.get("productName", ""))
                if score > best_score:
                    best_score = score
                    best_match = p
                    best_source = "carrefour" if "carrefour" in base else "atacadao"
                    best_base = base
            time.sleep(0.2)
        if best_score >= 60:
            break
    
    if not best_match or best_score < 30:
        return None
    
    img_url = extract_best_image(best_match)
    if not img_url:
        return None
    
    img_bytes = download_image(img_url)
    if not img_bytes:
        return None
    
    frontend_path = process_image(img_bytes, product)
    if not frontend_path:
        return None
    
    return {
        "sku": product["id"],
        "slug": product["slug"],
        "name": product["name"],
        "category": product["category"],
        "subcategory": product["subcategory"],
        "localPath": f"/images/catalog/products/{product['category']}/{product['slug']}.webp",
        "source": best_source,
        "sourceUrl": f"https://www.{best_base}/{best_match.get('linkText', '')}/p",
        "sourceProduct": best_match.get("productName", ""),
        "sourceBrand": best_match.get("brand", ""),
        "imageUrl": img_url,
        "matchScore": round(best_score, 1),
        "status": "approved" if best_score >= 50 else "review",
    }

def process_product(product, used_urls=None):
    cat = product["category"]
    print(f"\n[SKU {product['id']}] {product['name']} [{cat}]")
    
    if cat in FRESH_CATEGORIES:
        result = process_fresh(product, used_urls)
    else:
        result = process_packaged(product)
    
    if result:
        print(f"  OK: {result['source']} (score: {result['matchScore']})")
    else:
        print(f"  Nenhum resultado")
    
    return result

def main(batch_size=None, start=0):
    products = parse_catalog()
    print(f"Total SKUs: {len(products)}")
    
    order = ["hortifruti", "acougue", "padaria", "mercearia", "bebidas", "frios", "laticinios", "congelados", "limpeza", "higiene", "bebe", "pet"]
    products.sort(key=lambda p: (order.index(p["category"]) if p["category"] in order else 99, p["name"]))
    
    manifest = []
    if os.path.exists(MANIFEST):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            try:
                manifest = json.load(f)
            except:
                manifest = []
    
    done_skus = {m["sku"] for m in manifest}
    # Track used URLs to avoid duplicates
    used_urls = set(m.get("imageUrl", "") for m in manifest if m.get("imageUrl"))
    pending = [p for p in products if p["id"] not in done_skus]
    if batch_size:
        pending = pending[start:start + batch_size]
    
    print(f"Para processar: {len(pending)}")
    
    for i, p in enumerate(pending):
        result = process_product(p, used_urls)
        if result:
            manifest.append(result)
        if (i + 1) % 5 == 0:
            with open(MANIFEST, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            build_qa_page(manifest)
            approved = len([m for m in manifest if m["status"] == "approved"])
            print(f"\n--- {i+1}/{len(pending)} | Total: {len(manifest)} | Aprovados: {approved} ---\n")
        time.sleep(0.5)
    
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    build_qa_page(manifest)
    
    approved = [m for m in manifest if m["status"] == "approved"]
    by_source = {}
    by_cat = {}
    for m in manifest:
        by_source[m["source"]] = by_source.get(m["source"], 0) + 1
        by_cat[m["category"]] = by_cat.get(m["category"], 0) + 1
    
    print(f"\n=== RESULTADO ===")
    print(f"Total: {len(manifest)} | Aprovados: {len(approved)}")
    print(f"Por fonte: {by_source}")
    print(f"Por categoria: {by_cat}")

def build_qa_page(manifest):
    html = """<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VendaMais - QA Catalogo</title>
<style>
body{font-family:Arial,sans-serif;background:#f8fafc;margin:0;padding:24px;color:#0f172a;}
.container{max-width:1400px;margin:auto;}
h1{font-size:24px;margin-bottom:8px;}
.stats{display:flex;gap:12px;flex-wrap:wrap;margin:16px 0;}
.stat{background:white;padding:12px 18px;border-radius:10px;box-shadow:0 1px 2px rgba(0,0,0,0.05);font-size:14px;}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:16px;margin-top:20px;}
.card{background:white;border-radius:12px;padding:12px;box-shadow:0 1px 3px rgba(0,0,0,0.1);}
.card img{width:100%;height:180px;object-fit:cover;border-radius:8px;background:#f1f5f9;}
.card h3{font-size:14px;margin:8px 0 4px;}
.card .meta{font-size:12px;color:#64748b;}
.card .source{font-size:11px;color:#0369a1;margin-top:4px;}
.badge{display:inline-block;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:bold;}
.badge-approved{background:#dcfce7;color:#166534;}
.badge-review{background:#fef3c7;color:#92400e;}
</style></head><body><div class="container">
<h1>VendaMais - QA Catalogo de Imagens</h1>
"""
    approved = [m for m in manifest if m["status"] == "approved"]
    review = [m for m in manifest if m["status"] == "review"]
    html += f"""<div class="stats">
<div class="stat"><strong>Total:</strong> {len(manifest)}</div>
<div class="stat" style="color:#15803c"><strong>Aprovados:</strong> {len(approved)}</div>
<div class="stat" style="color:#b45309"><strong>Revisao:</strong> {len(review)}</div>
</div><div class="grid">"""
    for m in manifest:
        html += f"""<div class="card">
<img src="{m['localPath']}" alt="{m['name']}" loading="lazy">
<h3>{m['name']}</h3>
<div class="meta">{m['sku']} - {m['category']}</div>
<div class="meta">Match: {m.get('matchScore', 0)} | Fonte: {m['source']}</div>
<div class="source">{m.get('sourceProduct', '')[:40]}</div>
<span class="badge badge-{m['status']}">{m['status']}</span>
</div>"""
    html += "</div></div></body></html>"
    with open(QA_HTML, "w", encoding="utf-8") as f:
        f.write(html)

if __name__ == "__main__":
    import sys
    batch = int(sys.argv[1]) if len(sys.argv) > 1 else None
    start = int(sys.argv[2]) if len(sys.argv) > 2 else 0
    main(batch, start)

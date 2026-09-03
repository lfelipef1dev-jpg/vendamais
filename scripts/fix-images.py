"""Busca imagens profissionais de alta qualidade para SKUs problematicos.

Estrategia:
1. Openverse com queries MUITO mais especificas (isolated, raw, white background)
2. Wikimedia Commons com queries melhores
3. Foodish API para alimentos especificos
4. Bing Image Search via scraping (apenas descobrir URLs, baixar direto)

Foco: carnes crua, paes brasileiros, produtos de limpeza
"""
import os, re, json, time, requests, hashlib
from urllib.parse import quote
from PIL import Image
from io import BytesIO
import unicodedata
from difflib import SequenceMatcher

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
TO_FIX = os.path.join(ROOT, "data", "to-fix.json")
HD_DIR = os.path.join(ROOT, "assets", "source", "hd-images")

os.makedirs(HD_DIR, exist_ok=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    "Accept": "application/json, text/plain, */*",
}

# Queries MUITO especificas por tipo de produto
SPECIFIC_QUERIES = {
    # Acougue - carne CRUA, nunca cozida
    "picanha-bovina": ["raw picanha beef cut white background", "raw beef rump cap isolated", "picanha raw meat butcher"],
    "contrafile": ["raw sirloin steak isolated white background", "raw beef steak cut white"],
    "maminha": ["raw beef tri-tip isolated white", "raw rump roast beef cut"],
    "alcatra": ["raw rump steak beef isolated white", "raw beef alcatra cut"],
    "acem": ["raw beef stew meat isolated white", "raw beef chunks white background"],
    "patinho": ["raw eye of round beef isolated", "raw beef cut white background"],
    "cupim": ["raw beef hump isolated white", "cupim raw meat brazilian"],
    "costela-bovina": ["raw beef ribs isolated white background", "raw beef rib cut"],
    "linguica-toscana": ["raw sausage isolated white background", "fresh italian sausage raw white"],
    "linguica-calabresa": ["raw calabrese sausage isolated white", "fresh sausage white background"],
    "barriga-suina": ["raw pork belly isolated white background", "pork belly raw meat"],
    "lombo-suino": ["raw pork loin isolated white background", "pork loin raw cut"],
    "costelinha-suina": ["raw pork ribs isolated white background", "pork ribs raw meat"],
    "frango-inteiro-caipira": ["raw whole chicken isolated white background", "whole raw chicken"],
    "peito-de-frango": ["raw chicken breast isolated white background", "chicken breast raw meat"],
    "coxa-de-frango": ["raw chicken thigh isolated white background", "chicken thigh raw meat"],
    "sobrecoxa-de-frango": ["raw chicken drumstick isolated white", "chicken leg raw meat"],
    "asa-de-frango": ["raw chicken wings isolated white background", "chicken wings raw"],
    "file-de-frango": ["raw chicken fillet isolated white background", "chicken fillet raw"],
    "file-de-tilapia": ["raw tilapia fillet isolated white background", "raw fish fillet white"],
    "file-de-salmao": ["raw salmon fillet isolated white background", "fresh salmon fillet raw"],
    "atum-fresco": ["raw tuna fish isolated white background", "fresh tuna steak raw"],
    "sardinha-fresca": ["fresh sardines fish isolated white background", "raw sardines white"],
    "linguica-de-frango": ["raw chicken sausage isolated white", "fresh chicken sausage"],
    "hamburguer-bovino-120g-4un480g": ["raw beef burger patties isolated white", "raw hamburger patty white"],
    "carne-moida-bovina": ["raw ground beef isolated white background", "ground beef raw meat"],
    "pernil-suino": ["raw pork leg isolated white background", "pork ham raw cut"],
    "bacon-defumado": ["bacon strips isolated white background", "raw bacon slices white"],
    
    # Padaria - paes brasileiros especificos
    "pao-frances": ["french bread roll isolated white background", "bread rolls white"],
    "pao-frances-6un": ["french bread rolls isolated white background", "bread rolls pack"],
    "pao-de-forma-integral-500g": ["whole wheat sandwich bread loaf isolated white", "sliced bread loaf white"],
    "pao-de-forma-branco-500g": ["white sandwich bread loaf isolated white background", "sliced bread white"],
    "bolo-de-chocolate-800g": ["chocolate cake isolated white background", "chocolate layer cake"],
    "croissant-de-manteiga-60g": ["butter croissant isolated white background", "croissant pastry white"],
    "pao-de-queijo-500g": ["brazilian cheese bread isolated white", "cheese bread balls pao de queijo"],
    "bolo-de-fuba-600g": ["corn cake isolated white background", "brazilian corn cake"],
    "torta-de-frango-1kg": ["chicken pie isolated white background", "chicken savory pie"],
    "coxinha-6un-6un300g": ["brazilian coxinha isolated white background", "chicken croquette coxinha"],
    "esfiha-aberta-6un-6un300g": ["esfiha open flatbread isolated white", "arabic meat pie"],
    "baguete-200g": ["baguette bread isolated white background", "french baguette white"],
    "pao-sourdough-400g": ["sourdough bread loaf isolated white background", "artisan bread white"],
    "croissant-de-chocolate-70g": ["chocolate croissant isolated white background", "pain au chocolat"],
    "bolo-de-cenoura-700g": ["carrot cake isolated white background", "carrot cake slice white"],
    "pao-de-batata-100g": ["potato bread roll isolated white background", "potato bread bun"],
    "rosca-doce-300g": ["sweet bread ring isolated white background", "sweet bread loaf"],
    "biscoito-polvilho-200g": ["tapioca biscuits isolated white background", "brazilian polvilho biscuit"],
    "torta-de-limao-1kg": ["lemon pie isolated white background", "lemon meringue pie"],
    "empada-4un-4un200g": ["brazilian empada pastry isolated white", "meat pie pastry small"],
    "pao-integral-400g": ["whole grain bread loaf isolated white", "multigrain bread white"],
    "muffin-de-chocolate-80g": ["chocolate muffin isolated white background", "chocolate muffin cupcake"],
    
    # Hortifruti com problemas
    "abacaxi-perola-1unidade": ["fresh pineapple isolated white background", "whole pineapple fruit white"],
    "brocolis-300g": ["fresh broccoli isolated white background", "broccoli head vegetable white"],
    "chuchu": ["fresh chayote isolated white background", "chayote vegetable white"],
    "coentro-1maco": ["fresh cilantro bunch isolated white background", "coriander herbs white"],
    "couve-1maco": ["fresh kale leaves isolated white background", "collard greens white"],
    "espinafre-1maco": ["fresh spinach leaves isolated white background", "spinach bunch white"],
    "salsinha-1maco": ["fresh parsley bunch isolated white background", "parsley herbs white"],
    "tomate-organico": ["fresh tomatoes isolated white background", "red tomatoes white"],
    "tomate-de-mesa": ["fresh tomato isolated white background", "red tomato fruit white"],
    "batata-inglesa": ["fresh potatoes isolated white background", "raw potatoes white"],
    
    # Limpeza
    "papel-higienico-folha-dupla-12un": ["toilet paper pack isolated white background", "toilet paper rolls pack"],
    "papel-higienico-folha-simples-24un": ["toilet paper pack isolated white background", "toilet paper bulk"],
    "papel-toalha-2un": ["paper towels pack isolated white background", "kitchen paper towels"],
    "papel-toalha-6un": ["paper towels multipack isolated white", "paper towel rolls pack"],
    "guardanapo-100un": ["paper napkins pack isolated white background", "napkins package white"],
    "saco-de-lixo-30un": ["trash bags pack isolated white background", "garbage bags pack"],
    "saco-de-lixo-grande-20un": ["large trash bags pack isolated white", "heavy duty garbage bags"],
    "saco-de-lixo-biodegradavel-20un": ["biodegradable trash bags pack white", "eco garbage bags"],
    
    # Higiene
    "lenco-de-mao-6un": ["tissue pack isolated white background", "paper tissues pack white"],
    "oleo-de-banho-200ml": ["bath oil bottle isolated white background", "body oil bottle white"],
    
    # Mercearia
    "cereal-bar-6un-6x25g": ["cereal bars pack isolated white background", "granola bars package"],
    "biscoito-de-polvilho-200g": ["tapioca crackers isolated white background", "cassava starch biscuits"],
    "bolacha-recheada-130g": ["sandwich cookies pack isolated white", "filled cookies package"],
    "extrato-de-tomate-140g": ["tomato paste tube isolated white", "tomato extract can white"],
    
    # Bebe
    "papa-de-cereais-200g": ["baby cereal bowl isolated white background", "infant cereal box"],
    "pote-para-papinha-3un": ["baby food containers isolated white", "baby food storage pots"],
    "oleo-bebe-200ml": ["baby oil bottle isolated white background", "baby care oil bottle"],
    
    # Laticinios
    "leite-em-po-400g": ["milk powder package isolated white background", "powdered milk box white"],
    
    # Congelados
    "vegetais-congelados-500g": ["frozen vegetables pack isolated white", "frozen mixed vegetables bag"],
    "feijoada-pronta-400g": ["feijoada frozen meal isolated white", "brazilian beans stew package"],
    
    # Pet
    "brinquedo-gato-varinha-1un": ["cat wand toy isolated white background", "cat teaser toy white"],
    
    # Duplicatas
    "agua-mineral-6un-6x500ml": ["water bottles pack isolated white background", "mineral water 6 pack"],
    "energetico-zero-350ml": ["energy drink can isolated white background", "sugar free energy drink"],
    "leite-de-aveia-1l": ["oat milk carton isolated white background", "oat milk bottle white"],
    "leite-de-coco-1l": ["coconut milk carton isolated white background", "coconut milk bottle"],
    "suco-de-maca-1l": ["apple juice bottle isolated white background", "apple juice carton"],
    "suco-de-manga-1l": ["mango juice bottle isolated white background", "mango juice carton"],
    "hamburguer-vegano-400g": ["veggie burger patties isolated white", "plant based burger package"],
    "creme-de-leite-caixinha-200g": ["cream carton isolated white background", "cooking cream box"],
    "leite-de-cabra-1l": ["goat milk bottle isolated white background", "goat milk carton"],
    "sabao-em-po-2kg": ["laundry detergent powder bag isolated white", "washing powder package"],
    "petisco-gato-60g": ["cat treats package isolated white background", "cat snack pouch white"],
}

# Palavras que indicam imagem COZIDA/PREPARADA (rejeitar para carnes)
COOKED_KEYWORDS = [
    "cooked", "grilled", "fried", "baked", "roasted", "smoked", "barbecue",
    "bbq", "pan", "oven", "dish", "meal", "recipe", "plate", "served",
    "dinner", "lunch", "restaurant", "kitchen", "sandwich", "soup", "stew",
    "pho", "broth", "curry", "sauce", "gravy", "breaded", "crusted",
    "marinated", "seasoned", "spiced", "chapa", "na chapa",
]

# Palavras que indicam boa imagem de produto
GOOD_KEYWORDS = [
    "isolated", "white background", "studio", "packshot", "raw", "fresh",
    "cut", "whole", "single", "clean",
]

def normalize(text):
    return unicodedata.normalize("NFKD", text).encode("ascii", "ignore").decode("ascii").lower().strip()

def search_openverse(query, page_size=20):
    url = f"https://api.openverse.engineering/v1/images/?q={quote(query)}&page_size={page_size}&license_type=all"
    try:
        r = requests.get(url, headers={"User-Agent": "VendaMais/1.0"}, timeout=30)
        if r.status_code == 200:
            return r.json().get("results", [])
    except:
        pass
    return []

def search_wikimedia(query, limit=10):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&format=json&generator=search&gsrnamespace=6&gsrsearch={quote(query)}&gsrlimit={limit}&prop=imageinfo&iiprop=url|extmetadata|size&iiurlwidth=1200"
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        if r.status_code == 200:
            data = r.json()
            pages = data.get("query", {}).get("pages", {})
            results = []
            for pid, page in pages.items():
                info = page.get("imageinfo", [{}])[0]
                url = info.get("thumburl") or info.get("url", "")
                if url:
                    results.append({
                        "url": url,
                        "title": page.get("title", ""),
                        "width": info.get("width", 0),
                        "height": info.get("height", 0),
                        "license": info.get("extmetadata", {}).get("LicenseShortName", {}).get("value", ""),
                    })
            return results
    except:
        pass
    return []

def is_cooked(item_text):
    text = normalize(item_text)
    for kw in COOKED_KEYWORDS:
        if kw in text:
            return True
    return False

def has_good_background(item_text):
    text = normalize(item_text)
    for kw in GOOD_KEYWORDS:
        if kw in text:
            return True
    return False

def score_candidate(item, query, source="openverse"):
    title = item.get("title", "").lower()
    tags = []
    if source == "openverse":
        tags = [t.get("name", "").lower() for t in item.get("tags", [])]
    all_text = title + " " + " ".join(tags)
    
    # Rejeitar cozido
    if is_cooked(all_text):
        return 0
    
    score = 30  # base
    
    if has_good_background(all_text):
        score += 25
    
    # Query words in title
    query_words = set(normalize(query).split())
    title_words = set(normalize(title).split())
    match_count = len(query_words & title_words)
    score += match_count * 5
    
    # Resolution
    w = item.get("width", 0) or 0
    h = item.get("height", 0) or 0
    if w >= 1000 and h >= 1000:
        score += 15
    elif w >= 800 and h >= 800:
        score += 10
    elif w >= 600 and h >= 600:
        score += 5
    
    # License
    if source == "openverse":
        lic = item.get("license", "").lower()
        if "by" in lic:
            score += 10
    
    return min(score, 100)

def download_image(url, timeout=45):
    try:
        r = requests.get(url, headers=HEADERS, timeout=timeout, allow_redirects=True)
        if r.status_code == 200 and len(r.content) > 5000:
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
        return None, None
    w, h = img.size
    if w < 300 or h < 300:
        return None, None
    
    img_rgb = img.convert("RGB")
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    img_sq = img_rgb.crop((left, top, left + s, top + s))
    
    # Salvar HD
    hd_path = os.path.join(HD_DIR, f"{product['slug']}-{w}x{h}.png")
    img_sq.save(hd_path, "PNG")
    
    # Versao site
    cat_dir = os.path.join(PRODUCT_DIR, product["category"])
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{product['slug']}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=92)
    
    return frontend_path, hd_path

def process_product(product, used_urls):
    slug = product["slug"]
    queries = SPECIFIC_QUERIES.get(slug, [product["name"], f"{product['name']} isolated white background"])
    
    best = None
    best_score = 0
    best_source = None
    best_url = None
    
    for q in queries:
        # Openverse
        results = search_openverse(q, page_size=20)
        for item in results:
            img_url = item.get("url", "")
            if img_url in used_urls:
                continue
            score = score_candidate(item, q, "openverse")
            if score > best_score:
                best_score = score
                best = item
                best_source = "openverse"
                best_url = img_url
        
        # Wikimedia
        if best_score < 60:
            wiki_results = search_wikimedia(q, limit=10)
            for item in wiki_results:
                img_url = item.get("url", "")
                if img_url in used_urls:
                    continue
                # Score simples para wiki
                score = 30
                if not is_cooked(item.get("title", "")):
                    w = item.get("width", 0) or 0
                    h = item.get("height", 0) or 0
                    if w >= 1000 and h >= 1000:
                        score += 15
                    elif w >= 800:
                        score += 10
                    if score > best_score:
                        best_score = score
                        best = item
                        best_source = "wikimedia"
                        best_url = img_url
        
        if best_score >= 70:
            break
        time.sleep(0.3)
    
    if not best or best_score < 40:
        return None
    
    # Baixar
    img_bytes = download_image(best_url)
    if not img_bytes:
        return None
    
    frontend_path, hd_path = process_image(img_bytes, product)
    if not frontend_path:
        return None
    
    used_urls.add(best_url)
    
    return {
        "sku": product["id"],
        "slug": product["slug"],
        "name": product["name"],
        "category": product["category"],
        "subcategory": "",
        "localPath": f"/images/catalog/products/{product['category']}/{product['slug']}.webp",
        "source": best_source,
        "sourceUrl": best_url,
        "sourceProduct": best.get("title", ""),
        "sourceBrand": best.get("creator", "") if best_source == "openverse" else "Wikimedia",
        "imageUrl": best_url,
        "matchScore": best_score,
        "status": "approved" if best_score >= 50 else "review",
    }

def main():
    with open(TO_FIX, "r", encoding="utf-8") as f:
        to_fix = json.load(f)
    
    print(f"SKUs para corrigir: {len(to_fix)}", flush=True)
    
    # Carregar manifest
    manifest = []
    if os.path.exists(MANIFEST):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    
    # URLs ja usadas
    used_urls = set(m.get("imageUrl", "") for m in manifest if m.get("imageUrl"))
    
    # Remover do manifest os SKUs que vamos reprocessar
    fix_slugs = {p["slug"] for p in to_fix}
    manifest = [m for m in manifest if m["slug"] not in fix_slugs]
    
    fixed = 0
    failed = 0
    
    for i, product in enumerate(to_fix):
        print(f"\n[{i+1}/{len(to_fix)}] {product['name']} ({product['category']})", flush=True)
        
        result = process_product(product, used_urls)
        
        if result:
            manifest.append(result)
            print(f"  OK: {result['source']} score={result['matchScore']}", flush=True)
            fixed += 1
        else:
            print(f"  FALHOU - sem imagem adequada", flush=True)
            failed += 1
        
        # Salvar a cada 5
        if (i + 1) % 5 == 0:
            with open(MANIFEST, "w", encoding="utf-8") as f:
                json.dump(manifest, f, indent=2, ensure_ascii=False)
            print(f"  --- Progresso: {fixed} corrigidos, {failed} falharam ---", flush=True)
        
        time.sleep(0.5)
    
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(manifest, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== CONCLUIDO ===", flush=True)
    print(f"Corrigidos: {fixed}/{len(to_fix)}", flush=True)
    print(f"Falharam: {failed}", flush=True)
    print(f"Total manifest: {len(manifest)}", flush=True)

if __name__ == "__main__":
    main()

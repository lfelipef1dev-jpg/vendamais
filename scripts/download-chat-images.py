"""Baixa as 24 imagens dos chats do ChatGPT - abre cada chat e pega a imagem."""
import os, json, asyncio, hashlib, time
from playwright.async_api import async_playwright
from PIL import Image
from io import BytesIO

sys_path = os.path
import sys
sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
HD_DIR = os.path.join(ROOT, "assets", "source", "gpt-images-hd")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
SCREENSHOTS = os.path.join(ROOT, "assets", "screenshots")

os.makedirs(HD_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS, exist_ok=True)

# Os 24 produtos e seus slugs
PRODUTOS = [
    {"name": "Alface Americana", "slug": "alface-americana-1unidade", "category": "hortifruti"},
    {"name": "Brinquedo Mordedor 1un", "slug": "brinquedo-mordedor-1un", "category": "pet"},
    {"name": "Alcatra", "slug": "alcatra", "category": "acougue"},
    {"name": "Picanha Bovina", "slug": "picanha-bovina", "category": "acougue"},
    {"name": "Petisco Gato 60g", "slug": "petisco-gato-60g", "category": "pet"},
    {"name": "Leite de Aveia 1L", "slug": "leite-de-aveia-1l", "category": "bebidas"},
    {"name": "Petisco Cachorro 500g", "slug": "petisco-cachorro-500g", "category": "pet"},
    {"name": "Brinquedo Gato Varinha 1un", "slug": "brinquedo-gato-varinha-1un", "category": "pet"},
    {"name": "Oleo Bebe 200ml", "slug": "oleo-bebe-200ml", "category": "bebe"},
    {"name": "Vegetais Congelados 500g", "slug": "vegetais-congelados-500g", "category": "congelados"},
    {"name": "Extrato de Tomate 140g", "slug": "extrato-de-tomate-140g", "category": "mercearia"},
    {"name": "Bacon Defumado", "slug": "bacon-defumado", "category": "acougue"},
    {"name": "Acem", "slug": "acem", "category": "acougue"},
    {"name": "Pao de Queijo 500g", "slug": "pao-de-queijo-500g", "category": "padaria"},
    {"name": "Bolo de Fuba 600g", "slug": "bolo-de-fuba-600g", "category": "padaria"},
    {"name": "Sardinha Fresca", "slug": "sardinha-fresca", "category": "acougue"},
    {"name": "Pernil Suino", "slug": "pernil-suino", "category": "acougue"},
    {"name": "Hamburguer Bovino 120g 4un", "slug": "hamburguer-bovino-120g-4un480g", "category": "acougue"},
    {"name": "File de Tilapia", "slug": "file-de-tilapia", "category": "acougue"},
    {"name": "Coxa de Frango", "slug": "coxa-de-frango", "category": "acougue"},
    {"name": "Contrafile", "slug": "contrafile", "category": "acougue"},
    {"name": "Papa de Cereais 200g", "slug": "papa-de-cereais-200g", "category": "bebe"},
    {"name": "Saco de Lixo Grande 20un", "slug": "saco-de-lixo-grande-20un", "category": "limpeza"},
    {"name": "Biscoito de Polvilho 200g", "slug": "biscoito-de-polvilho-200g", "category": "mercearia"},
]

def process_image(img_bytes, slug, category):
    try:
        img = Image.open(BytesIO(img_bytes))
    except:
        return None
    w, h = img.size
    print(f"  Resolucao: {w}x{h}", flush=True)
    if w < 200 or h < 200:
        return None
    
    img_rgb = img.convert("RGB")
    s = min(w, h)
    left = (w - s) // 2
    top = (h - s) // 2
    img_sq = img_rgb.crop((left, top, left + s, top + s))
    
    # HD
    hd_path = os.path.join(HD_DIR, f"{slug}-{w}x{h}.png")
    img_sq.save(hd_path, "PNG")
    
    # Site
    cat_dir = os.path.join(PRODUCT_DIR, category)
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{slug}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=92)
    return frontend_path

async def baixar_imagens():
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:9223")
        ctx = b.contexts[0]
        
        page = None
        for pg in ctx.pages:
            if "chatgpt.com" in pg.url:
                page = pg
                break
        
        if not page:
            print("Sem aba ChatGPT", flush=True)
            return
        
        # Ir para pagina principal e pegar lista de chats
        await page.goto("https://chatgpt.com", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(5000)
        
        chat_links = await page.query_selector_all('a[href*="/c/"]')
        urls = []
        for link in chat_links:
            href = await link.get_attribute("href")
            if href and "/c/" in href:
                full = href if href.startswith("http") else f"https://chatgpt.com{href}"
                urls.append(full)
        
        print(f"Total de chats: {len(urls)}", flush=True)
        print(f"Produtos para baixar: {len(PRODUTOS)}", flush=True)
        print("=" * 60, flush=True)
        
        # Carregar manifest
        manifest = []
        if os.path.exists(MANIFEST):
            with open(MANIFEST, "r", encoding="utf-8") as f:
                manifest = json.load(f)
        
        # Hashes ja usados
        used_hashes = set()
        if os.path.exists(HD_DIR):
            for f in os.listdir(HD_DIR):
                if f.endswith(".png"):
                    with open(os.path.join(HD_DIR, f), "rb") as fh:
                        used_hashes.add(hashlib.md5(fh.read()).hexdigest())
        
        baixadas = 0
        
        for i, (url, produto) in enumerate(zip(urls, PRODUTOS)):
            print(f"\n[{i+1}/{len(PRODUTOS)}] {produto['name']} ({produto['category']})", flush=True)
            
            try:
                # Abrir o chat
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(5000)
                
                # Screenshot pra conferir
                ss = os.path.join(SCREENSHOTS, f"chat-{produto['slug']}.png")
                await page.screenshot(path=ss)
                
                # Procurar TODAS as imagens na pagina
                all_imgs = await page.query_selector_all('img')
                candidates = []
                
                for img_el in all_imgs:
                    try:
                        src = await img_el.get_attribute("src")
                        if not src or len(src) < 50:
                            continue
                        # Filtrar avatares/icones
                        if any(x in src.lower() for x in ["avatar", "favicon", "logo", "auth0", "icon", "emoji"]):
                            continue
                        # Verificar tamanho na pagina
                        box = await img_el.bounding_box()
                        if box and box["width"] > 200 and box["height"] > 200:
                            candidates.append((src, box["width"] * box["height"]))
                    except:
                        continue
                
                # Ordenar por maior
                candidates.sort(key=lambda x: x[1], reverse=True)
                
                print(f"  Candidatos: {len(candidates)}", flush=True)
                for src, size in candidates[:3]:
                    print(f"    {size:.0f}px2 - {src[:60]}...", flush=True)
                
                # Baixar a maior imagem que nao seja duplicata
                baixou = False
                for src, _ in candidates:
                    try:
                        response = await ctx.request.get(src, timeout=30000)
                        if response.ok:
                            img_bytes = await response.body()
                            if len(img_bytes) < 5000:
                                continue
                            
                            img_hash = hashlib.md5(img_bytes).hexdigest()
                            if img_hash in used_hashes:
                                print(f"  DUPLICATA - pulando", flush=True)
                                continue
                            
                            used_hashes.add(img_hash)
                            
                            frontend_path = process_image(img_bytes, produto["slug"], produto["category"])
                            if frontend_path:
                                print(f"  OK: {frontend_path}", flush=True)
                                
                                # Atualizar manifest
                                manifest = [m for m in manifest if m["slug"] != produto["slug"]]
                                manifest.append({
                                    "sku": "",
                                    "slug": produto["slug"],
                                    "name": produto["name"],
                                    "category": produto["category"],
                                    "subcategory": "",
                                    "localPath": f"/images/catalog/products/{produto['category']}/{produto['slug']}.webp",
                                    "source": "chatgpt",
                                    "sourceUrl": src,
                                    "sourceProduct": "GPT generated",
                                    "sourceBrand": "OpenAI",
                                    "imageUrl": src,
                                    "matchScore": 100,
                                    "status": "approved",
                                })
                                
                                with open(MANIFEST, "w", encoding="utf-8") as f:
                                    json.dump(manifest, f, indent=2, ensure_ascii=False)
                                
                                baixadas += 1
                                baixou = True
                                break
                    except Exception as e:
                        print(f"  Erro download: {e}", flush=True)
                        continue
                
                if not baixou:
                    print(f"  NAO BAIXOU - sem imagem nova", flush=True)
                
                # Pausa entre chats
                await page.wait_for_timeout(3000)
                
            except Exception as e:
                print(f"  ERRO: {str(e)[:100]}", flush=True)
        
        print(f"\n{'=' * 60}", flush=True)
        print(f"Baixadas: {baixadas}/{len(PRODUTOS)}", flush=True)
        print(f"Total manifest: {len(manifest)}", flush=True)

asyncio.run(baixar_imagens())

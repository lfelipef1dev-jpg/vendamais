"""Gera imagens via ChatGPT para produtos especificos, substituindo entradas existentes."""
import os, re, json, time, asyncio, sys, hashlib
from playwright.async_api import async_playwright
from PIL import Image
from io import BytesIO

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
HD_DIR = os.path.join(ROOT, "assets", "source", "gpt-images-hd")
SCREENSHOTS = os.path.join(ROOT, "assets", "screenshots")

os.makedirs(HD_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS, exist_ok=True)

PROMPT_TEMPLATE = """Generate a high-resolution professional product photo for a Brazilian supermarket e-commerce catalog.

Product: {name}
Category: {category}

Requirements:
- Maximum resolution (1024x1024 or higher)
- Square format (1:1)
- Pure white or very light gray background
- Product centered and well-lit (studio lighting)
- Soft natural shadow
- Ultra high quality, photorealistic, sharp focus
- No text, no watermark, no hands, no people
- No scene, no kitchen, no market background
- Just the product on a clean background

{extra}
"""

MEAT_EXTRA = "Show the raw {name}, not cooked, not prepared. Clean presentation on a neutral surface. Premium quality."
FRESH_EXTRA = "Show fresh/raw {name} as sold in a supermarket. Natural appearance, premium quality, appetizing."
PACKAGED_EXTRA = "Show the packaged product as it appears on a supermarket shelf. Clean packshot style."

def build_prompt(product):
    cat = product.get("category", "")
    name = product.get("name", "")
    if cat == "acougue":
        extra = MEAT_EXTRA.format(name=name)
    elif cat == "hortifruti":
        extra = FRESH_EXTRA.format(name=name)
    elif cat == "padaria":
        extra = "Show the fresh bakery product as sold. Clean, appetizing presentation on light background."
    else:
        extra = PACKAGED_EXTRA
    return PROMPT_TEMPLATE.format(name=name, category=cat, extra=extra)

def process_image(img_bytes, product):
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
    
    # Salvar HD original
    hd_path = os.path.join(HD_DIR, f"{product['slug']}-{w}x{h}.png")
    img_sq.save(hd_path, "PNG")
    print(f"  HD: {hd_path}", flush=True)
    
    # Versao site 400x400 WebP
    cat_dir = os.path.join(PRODUCT_DIR, product["category"])
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{product['slug']}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=92)
    return frontend_path

def hash_bytes(data):
    return hashlib.md5(data).hexdigest()

async def get_image_srcs(page):
    srcs = set()
    all_imgs = await page.query_selector_all('img')
    for img_el in all_imgs:
        try:
            src = await img_el.get_attribute("src")
            if src and len(src) > 50:
                if not any(x in src.lower() for x in ["avatar", "favicon", "logo", "auth0", "icon"]):
                    srcs.add(src)
        except:
            continue
    return srcs

async def find_new_image(page, context, before_srcs, used_hashes):
    """Espera e pega a imagem nova gerada."""
    start = time.time()
    while time.time() - start < 180:
        after_srcs = await get_image_srcs(page)
        new_srcs = after_srcs - before_srcs
        
        if new_srcs:
            print(f"  Imagens novas detectadas: {len(new_srcs)}", flush=True)
            # Pegar a maior
            candidates = []
            for src in new_srcs:
                for img_el in await page.query_selector_all('img'):
                    img_src = await img_el.get_attribute("src")
                    if img_src == src:
                        try:
                            box = await img_el.bounding_box()
                            if box:
                                candidates.append((src, box["width"] * box["height"]))
                        except:
                            pass
                        break
            
            candidates.sort(key=lambda x: x[1], reverse=True)
            
            for src, _ in candidates:
                try:
                    response = await context.request.get(src, timeout=30000)
                    if response.ok:
                        img_bytes = await response.body()
                        if len(img_bytes) < 5000:
                            continue
                        img_hash = hash_bytes(img_bytes)
                        if img_hash in used_hashes:
                            print(f"  Hash duplicado, tentando proxima", flush=True)
                            continue
                        print(f"  Imagem baixada: {len(img_bytes)} bytes", flush=True)
                        return src, img_bytes, img_hash
                except Exception as e:
                    print(f"  Erro download: {e}", flush=True)
                    continue
        
        await asyncio.sleep(3)
    
    return None, None, None

async def wait_generation_complete(page):
    """Espera o botao de gerar sumir."""
    start = time.time()
    while time.time() - start < 180:
        try:
            stop_btns = await page.query_selector_all('[data-testid="stop-button"], button[aria-label="Stop"]')
            if stop_btns and len(stop_btns) > 0:
                await asyncio.sleep(3)
                continue
        except:
            pass
        try:
            streaming = await page.query_selector_all('[class*="streaming"], [class*="loading"], [class*="generating"]')
            visible = 0
            for s in streaming:
                try:
                    if await s.is_visible():
                        visible += 1
                except:
                    pass
            if visible > 0:
                await asyncio.sleep(3)
                continue
        except:
            pass
        return True
    return False

async def generate_for_products(products):
    # Carregar manifest
    manifest = []
    if os.path.exists(MANIFEST):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    
    # Carregar hashes
    used_hashes = set()
    if os.path.exists(HD_DIR):
        for f in os.listdir(HD_DIR):
            if f.endswith(".png"):
                with open(os.path.join(HD_DIR, f), "rb") as fh:
                    used_hashes.add(hash_bytes(fh.read()))
    
    # Hashes dos arquivos atuais
    for m in manifest:
        p = os.path.join(ROOT, "public", m.get("localPath", "").lstrip("/").replace("/", os.sep))
        if os.path.exists(p):
            with open(p, "rb") as f:
                used_hashes.add(hash_bytes(f.read()))
    
    print(f"Produtos para gerar: {len(products)}", flush=True)
    print(f"Hashes ja usados: {len(used_hashes)}", flush=True)
    
    async with async_playwright() as p:
        browser = await p.chromium.connect_over_cdp("http://localhost:9223")
        context = browser.contexts[0]
        
        page = None
        for pg in context.pages:
            if "chatgpt.com" in pg.url:
                page = pg
                break
        
        if not page:
            page = await context.new_page()
            await page.goto("https://chatgpt.com", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(5000)
        
        generated = 0
        for i, product in enumerate(products):
            print(f"\n[{i+1}/{len(products)}] {product['id']} - {product['name']}", flush=True)
            
            prompt = build_prompt(product)
            
            try:
                # Nova conversa
                try:
                    new_chat = await page.query_selector('a[href="/"], button[aria-label="New chat"], a[aria-label="New chat"]')
                    if new_chat:
                        await new_chat.click()
                        await page.wait_for_timeout(3000)
                    else:
                        await page.goto("https://chatgpt.com", wait_until="networkidle", timeout=60000)
                        await page.wait_for_timeout(5000)
                except:
                    await page.goto("https://chatgpt.com", wait_until="networkidle", timeout=60000)
                    await page.wait_for_timeout(5000)
                
                before_srcs = await get_image_srcs(page)
                
                # Encontrar input
                input_el = None
                for sel in ['textarea#prompt-textarea', 'div[contenteditable="true"]', 'textarea[data-id="root"]', 'textarea']:
                    try:
                        input_el = await page.wait_for_selector(sel, timeout=8000)
                        if input_el:
                            vis = await input_el.is_visible()
                            if vis:
                                print(f"  Input: {sel}", flush=True)
                                break
                            input_el = None
                    except:
                        continue
                
                if not input_el:
                    print(f"  Input nao encontrado", flush=True)
                    continue
                
                await input_el.click()
                await page.wait_for_timeout(500)
                await page.keyboard.press("Control+a")
                await page.keyboard.press("Delete")
                await page.wait_for_timeout(300)
                await input_el.type(prompt, delay=10)
                await page.wait_for_timeout(800)
                await page.keyboard.press("Enter")
                print(f"  Prompt enviado. Aguardando geracao...", flush=True)
                
                done = await wait_generation_complete(page)
                if not done:
                    print(f"  TIMEOUT", flush=True)
                    continue
                
                await page.wait_for_timeout(3000)
                
                src, img_bytes, img_hash = await find_new_image(page, context, before_srcs, used_hashes)
                
                if img_bytes:
                    used_hashes.add(img_hash)
                    
                    frontend_path = process_image(img_bytes, product)
                    if frontend_path:
                        print(f"  OK site: {frontend_path}", flush=True)
                        
                        # Remover entrada antiga do manifesto
                        manifest = [m for m in manifest if m["slug"] != product["slug"]]
                        manifest.append({
                            "sku": product["id"],
                            "slug": product["slug"],
                            "name": product["name"],
                            "category": product["category"],
                            "subcategory": product.get("subcategory", ""),
                            "localPath": f"/images/catalog/products/{product['category']}/{product['slug']}.webp",
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
                        
                        generated += 1
                    
                    await page.wait_for_timeout(5000)
            except Exception as e:
                print(f"  ERRO: {str(e)[:100]}", flush=True)
        
        print(f"\nGeradas: {generated}/{len(products)}", flush=True)

if __name__ == "__main__":
    import sys
    if len(sys.argv) < 2:
        print("Uso: python fix-products-chatgpt.py <arquivo.json com lista de produtos>")
        sys.exit(1)
    
    with open(sys.argv[1], "r", encoding="utf-8") as f:
        products = json.load(f)
    
    asyncio.run(generate_for_products(products))

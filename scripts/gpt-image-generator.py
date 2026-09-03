"""Gera imagens via ChatGPT conectando no Chrome ja logado via CDP."""
import os, re, json, time, asyncio, sys
from playwright.async_api import async_playwright
from PIL import Image
from io import BytesIO

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
MISSING = os.path.join(ROOT, "data", "missing-skus.json")
DOWNLOAD_DIR = os.path.join(ROOT, "assets", "source", "gpt-images")
HD_DIR = os.path.join(ROOT, "assets", "source", "gpt-images-hd")
SCREENSHOTS = os.path.join(ROOT, "assets", "screenshots")

os.makedirs(DOWNLOAD_DIR, exist_ok=True)
os.makedirs(HD_DIR, exist_ok=True)
os.makedirs(SCREENSHOTS, exist_ok=True)

PROMPT_TEMPLATE = """Generate a high-resolution professional product photo for a Brazilian supermarket e-commerce catalog.

Product: {name}
Category: {category}

Requirements:
- Maximum resolution (1024x1024)
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

FRESH_EXTRA = "Show the fresh/raw product exactly as sold in a supermarket. Natural appearance, premium quality."
PACKAGED_EXTRA = "Show the packaged product as it appears on a supermarket shelf. Clean packshot style."
MEAT_EXTRA = "Show the raw meat cut, not cooked, not prepared. Clean presentation on a neutral surface."

def build_prompt(product):
    cat = product.get("category", "")
    if cat == "hortifruti":
        extra = FRESH_EXTRA
    elif cat == "acougue":
        extra = MEAT_EXTRA
    elif cat == "padaria":
        extra = "Show the fresh bakery product as sold. Clean, appetizing presentation."
    else:
        extra = PACKAGED_EXTRA
    return PROMPT_TEMPLATE.format(name=product["name"], category=cat, extra=extra)

def process_image(img_bytes, product):
    try:
        img = Image.open(BytesIO(img_bytes))
    except:
        return None
    w, h = img.size
    print(f"  Resolucao: {w}x{h}", flush=True)
    if w < 200 or h < 200:
        print(f"  REJEITADA: baixa resolucao", flush=True)
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

async def generate_images():
    with open(MISSING, "r", encoding="utf-8") as f:
        missing = json.load(f)
    missing = [p for p in missing if p.get("id")]
    print(f"SKUs para gerar: {len(missing)}", flush=True)
    
    manifest = []
    if os.path.exists(MANIFEST):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    
    async with async_playwright() as p:
        print("Conectando Chrome (porta 9223)...", flush=True)
        browser = await p.chromium.connect_over_cdp("http://localhost:9223")
        print("Conectado!", flush=True)
        
        context = browser.contexts[0]
        
        # Achar aba ChatGPT
        page = None
        for pg in context.pages:
            if "chatgpt.com" in pg.url:
                page = pg
                print(f"Aba ChatGPT: {pg.url}", flush=True)
                break
        
        if not page:
            print("Abrindo nova aba ChatGPT...", flush=True)
            page = await context.new_page()
            await page.goto("https://chatgpt.com", wait_until="domcontentloaded", timeout=30000)
            await page.wait_for_timeout(5000)
        
        print(f"\nIniciando geracao de {len(missing)} imagens...", flush=True)
        
        generated = 0
        for i, product in enumerate(missing):
            print(f"\n[{i+1}/{len(missing)}] {product['name']} ({product['category']})", flush=True)
            
            prompt = build_prompt(product)
            
            try:
                # Nova conversa
                if i > 0:
                    await page.goto("https://chatgpt.com", wait_until="domcontentloaded", timeout=30000)
                    await page.wait_for_timeout(3000)
                
                # Encontrar input
                input_el = None
                for sel in ['textarea#prompt-textarea', 'textarea[data-id="root"]', 'div[contenteditable="true"]', 'textarea']:
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
                    ss = os.path.join(SCREENSHOTS, f"no-input-{i}.png")
                    await page.screenshot(path=ss)
                    print(f"  Sem input. Screenshot: {ss}", flush=True)
                    continue
                
                # Digitar e enviar
                await input_el.click()
                await page.wait_for_timeout(300)
                await page.keyboard.press("Control+a")
                await page.keyboard.press("Delete")
                await page.wait_for_timeout(200)
                await input_el.type(prompt, delay=10)
                await page.wait_for_timeout(500)
                await page.keyboard.press("Enter")
                print(f"  Prompt enviado!", flush=True)
                
                # Aguardar imagem (ate 120s)
                img_found = False
                for attempt in range(24):
                    await page.wait_for_timeout(5000)
                    
                    # Tentar varios seletores de imagem gerada
                    all_imgs = await page.query_selector_all('img')
                    for img_el in all_imgs:
                        src = await img_el.get_attribute("src")
                        if not src:
                            continue
                        # Filtrar imagens geradas (nao avatares/icones)
                        if any(x in src for x in ["oaiusercontent", "files.oai", "openai.com", "oai", "generated"]):
                            if "avatar" in src or "favicon" in src or "logo" in src:
                                continue
                            w = await img_el.get_attribute("width")
                            if w and int(w) < 100:
                                continue
                            print(f"  Imagem encontrada: {src[:80]}...", flush=True)
                            
                            try:
                                response = await context.request.get(src, timeout=30000)
                                if response.ok:
                                    img_bytes = await response.body()
                                    
                                    if len(img_bytes) < 5000:
                                        print(f"  Imagem muito pequena ({len(img_bytes)} bytes), ignorando", flush=True)
                                        continue
                                    
                                    orig_path = os.path.join(DOWNLOAD_DIR, f"{product['slug']}.png")
                                    with open(orig_path, "wb") as f:
                                        f.write(img_bytes)
                                    
                                    frontend_path = process_image(img_bytes, product)
                                    if frontend_path:
                                        print(f"  OK site: {frontend_path}", flush=True)
                                        
                                        manifest.append({
                                            "sku": product["id"],
                                            "slug": product["slug"],
                                            "name": product["name"],
                                            "category": product["category"],
                                            "subcategory": "",
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
                                        img_found = True
                                        break
                            except Exception as e:
                                print(f"  Erro download: {e}", flush=True)
                    
                    if img_found:
                        break
                    
                    # Debug: no primeiro timeout, listar todas as imagens
                    if attempt == 3:
                        print(f"  DEBUG - Imagens na pagina:", flush=True)
                        for img_el in all_imgs[:10]:
                            s = await img_el.get_attribute("src")
                            if s:
                                print(f"    {s[:100]}", flush=True)
                            
                            try:
                                response = await context.request.get(src, timeout=30000)
                                if response.ok:
                                    img_bytes = await response.body()
                                    
                                    orig_path = os.path.join(DOWNLOAD_DIR, f"{product['slug']}.png")
                                    with open(orig_path, "wb") as f:
                                        f.write(img_bytes)
                                    
                                    frontend_path = process_image(img_bytes, product)
                                    if frontend_path:
                                        print(f"  OK site: {frontend_path}", flush=True)
                                        
                                        manifest.append({
                                            "sku": product["id"],
                                            "slug": product["slug"],
                                            "name": product["name"],
                                            "category": product["category"],
                                            "subcategory": "",
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
                                        img_found = True
                                        break
                            except Exception as e:
                                print(f"  Erro download: {e}", flush=True)
                    
                    if attempt % 4 == 0:
                        print(f"  Aguardando... ({(attempt+1)*5}s)", flush=True)
                
                if not img_found:
                    ss = os.path.join(SCREENSHOTS, f"timeout-{product['slug']}.png")
                    await page.screenshot(path=ss)
                    print(f"  TIMEOUT. Screenshot: {ss}", flush=True)
                
                await page.wait_for_timeout(2000)
                
            except Exception as e:
                print(f"  ERRO: {e}", flush=True)
        
        print(f"\n=== CONCLUIDO ===", flush=True)
        print(f"Geradas: {generated}/{len(missing)}", flush=True)
        print(f"Total manifest: {len(manifest)}", flush=True)

if __name__ == "__main__":
    asyncio.run(generate_images())

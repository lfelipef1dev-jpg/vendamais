"""Gera TODOS os produtos pendentes via ChatGPT, com retry e resume."""
import os, re, json, time, asyncio, sys, hashlib
from playwright.async_api import async_playwright
from PIL import Image
from io import BytesIO

sys.stdout.reconfigure(encoding='utf-8', errors='replace')

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
HD_DIR = os.path.join(ROOT, "assets", "source", "gpt-images-hd")
PROGRESS = os.path.join(ROOT, "data", "gpt-progress.json")

os.makedirs(HD_DIR, exist_ok=True)

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

def build_prompt(product):
    cat = product.get("category", "")
    name = product.get("name", "")
    if cat == "acougue":
        extra = f"Show the raw {name}, not cooked, not prepared. Clean presentation on a neutral surface. Premium quality."
    elif cat == "hortifruti":
        extra = f"Show fresh/raw {name} as sold in a supermarket. Natural appearance, premium quality, appetizing."
    elif cat == "padaria":
        extra = "Show the fresh bakery product as sold. Clean, appetizing presentation on light background."
    else:
        extra = "Show the packaged product as it appears on a supermarket shelf. Clean packshot style."
    return PROMPT_TEMPLATE.format(name=name, category=cat, extra=extra)

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
    
    hd_path = os.path.join(HD_DIR, f"{product['slug']}-{w}x{h}.png")
    img_sq.save(hd_path, "PNG")
    
    cat_dir = os.path.join(PRODUCT_DIR, product["category"])
    os.makedirs(cat_dir, exist_ok=True)
    frontend_path = os.path.join(cat_dir, f"{product['slug']}.webp")
    img_sq.resize((400, 400), Image.LANCZOS).save(frontend_path, "WEBP", quality=92)
    return frontend_path

def hash_bytes(data):
    return hashlib.md5(data).hexdigest()

def load_progress():
    if os.path.exists(PROGRESS):
        with open(PROGRESS, "r", encoding="utf-8") as f:
            return json.load(f)
    return {"done": [], "failed": []}

def save_progress(prog):
    with open(PROGRESS, "w", encoding="utf-8") as f:
        json.dump(prog, f, indent=2, ensure_ascii=False)

async def get_image_srcs(page):
    srcs = set()
    for img_el in await page.query_selector_all('img'):
        try:
            src = await img_el.get_attribute("src")
            if src and len(src) > 50:
                if not any(x in src.lower() for x in ["avatar", "favicon", "logo", "auth0", "icon"]):
                    srcs.add(src)
        except:
            continue
    return srcs

async def connect_with_retry():
    for attempt in range(5):
        try:
            p = await async_playwright().start()
            browser = await p.chromium.connect_over_cdp("http://localhost:9223")
            return p, browser
        except Exception as e:
            print(f"  Tentativa {attempt+1} falhou: {str(e)[:80]}", flush=True)
            if attempt < 4:
                await asyncio.sleep(10)
    return None, None

async def generate_all():
    # Carregar lista completa
    with open(os.path.join(ROOT, "data", "all-to-fix.json"), "r", encoding="utf-8") as f:
        all_fix = json.load(f)
    with open(os.path.join(ROOT, "data", "acougue-still-fix.json"), "r", encoding="utf-8") as f:
        acougue_fix = json.load(f)
    
    to_generate = acougue_fix + all_fix
    
    # Carregar progresso
    prog = load_progress()
    done_slugs = set(prog["done"])
    
    # Filtrar os que ainda nao foram
    pending = [p for p in to_generate if p["slug"] not in done_slugs]
    print(f"Total: {len(to_generate)} | Ja done: {len(done_slugs)} | Pendentes: {len(pending)}", flush=True)
    
    # Carregar manifest
    manifest = []
    if os.path.exists(MANIFEST):
        with open(MANIFEST, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    
    # Hashes
    used_hashes = set()
    if os.path.exists(HD_DIR):
        for f in os.listdir(HD_DIR):
            if f.endswith(".png"):
                with open(os.path.join(HD_DIR, f), "rb") as fh:
                    used_hashes.add(hash_bytes(fh.read()))
    
    p, browser = await connect_with_retry()
    if not browser:
        print("NAO CONECTOU", flush=True)
        return
    
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
    
    for i, product in enumerate(pending):
        print(f"\n[{i+1}/{len(pending)}] {product['id']} - {product['name']} ({product['category']})", flush=True)
        
        success = False
        for attempt in range(3):
            try:
                # Nova conversa
                try:
                    new_chat = await page.query_selector('a[href="/"], button[aria-label="New chat"]')
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
                
                input_el = None
                for sel in ['textarea#prompt-textarea', 'div[contenteditable="true"]', 'textarea']:
                    try:
                        input_el = await page.wait_for_selector(sel, timeout=8000)
                        if input_el and await input_el.is_visible():
                            break
                        input_el = None
                    except:
                        continue
                
                if not input_el:
                    print(f"  Sem input (tentativa {attempt+1})", flush=True)
                    continue
                
                await input_el.click()
                await page.wait_for_timeout(500)
                await page.keyboard.press("Control+a")
                await page.keyboard.press("Delete")
                await page.wait_for_timeout(500)
                
                prompt = build_prompt(product)
                # COLAR o prompt inteiro de uma vez via clipboard
                await page.evaluate(f'() => navigator.clipboard.writeText({json.dumps(prompt)})')
                await page.wait_for_timeout(300)
                await page.keyboard.press("Control+v")
                await page.wait_for_timeout(1500)
                
                # Confirmar que o texto colou
                typed_text = await input_el.inner_text() if input_el else ""
                if not typed_text or len(typed_text) < 20:
                    # Fallback: fill
                    try:
                        await input_el.fill(prompt)
                        await page.wait_for_timeout(1000)
                    except:
                        await input_el.type(prompt, delay=5)
                        await page.wait_for_timeout(1000)
                
                print(f"  Prompt colado ({len(prompt)} chars). Enviando...", flush=True)
                await page.keyboard.press("Enter")
                print(f"  Prompt enviado!", flush=True)
                
                # Esperar geracao
                start = time.time()
                while time.time() - start < 180:
                    try:
                        stop = await page.query_selector_all('[data-testid="stop-button"], button[aria-label="Stop"]')
                        if stop:
                            await asyncio.sleep(3)
                            continue
                    except:
                        pass
                    try:
                        streaming = await page.query_selector_all('[class*="streaming"], [class*="loading"]')
                        vis = 0
                        for s in streaming:
                            try:
                                if await s.is_visible(): vis += 1
                            except: pass
                        if vis > 0:
                            await asyncio.sleep(3)
                            continue
                    except:
                        pass
                    break
                
                await page.wait_for_timeout(3000)
                
                # Pegar imagem nova
                after_srcs = await get_image_srcs(page)
                new_srcs = after_srcs - before_srcs
                
                if not new_srcs:
                    print(f"  Sem imagem nova (tentativa {attempt+1})", flush=True)
                    continue
                
                # Pegar maior
                candidates = []
                for src in new_srcs:
                    for img_el in await page.query_selector_all('img'):
                        if await img_el.get_attribute("src") == src:
                            try:
                                box = await img_el.bounding_box()
                                if box:
                                    candidates.append((src, box["width"] * box["height"]))
                            except: pass
                            break
                
                candidates.sort(key=lambda x: x[1], reverse=True)
                
                for src, _ in candidates:
                    try:
                        resp = await context.request.get(src, timeout=30000)
                        if resp.ok:
                            img_bytes = await resp.body()
                            if len(img_bytes) < 5000: continue
                            img_hash = hash_bytes(img_bytes)
                            if img_hash in used_hashes: continue
                            
                            used_hashes.add(img_hash)
                            frontend = process_image(img_bytes, product)
                            if frontend:
                                print(f"  OK: {frontend}", flush=True)
                                
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
                                
                                prog["done"].append(product["slug"])
                                save_progress(prog)
                                success = True
                                break
                    except Exception as e:
                        print(f"  Erro download: {str(e)[:60]}", flush=True)
                        continue
                
                if success:
                    break
                
            except Exception as e:
                print(f"  Erro (tentativa {attempt+1}): {str(e)[:80]}", flush=True)
                # Reconectar se necessario
                if "connect" in str(e).lower() or "closed" in str(e).lower():
                    print("  Reconectando...", flush=True)
                    try:
                        await p.stop()
                    except: pass
                    await asyncio.sleep(10)
                    p, browser = await connect_with_retry()
                    if not browser:
                        print("  Falhou reconexao", flush=True)
                        break
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
            
            await asyncio.sleep(5)
        
        if not success:
            prog["failed"].append(product["slug"])
            save_progress(prog)
            print(f"  FALHOU apos 3 tentativas", flush=True)
        
        # Pausa de 120s entre produtos para nao sobrecarregar
        if i < len(pending) - 1:
            print(f"  Pausa de 120s antes do proximo...", flush=True)
            await asyncio.sleep(120)
    
    print(f"\n=== CONCLUIDO ===", flush=True)
    print(f"Gerados: {len(prog['done'])}", flush=True)
    print(f"Falharam: {len(prog['failed'])}", flush=True)
    if prog["failed"]:
        print(f"Falhas: {prog['failed']}", flush=True)
    
    try:
        await p.stop()
    except: pass

if __name__ == "__main__":
    asyncio.run(generate_all())

"""Pega o texto COMPLETO de cada chat para identificar produtos."""
import asyncio, re
from playwright.async_api import async_playwright

async def audit():
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:9223")
        ctx = b.contexts[0]
        
        page = None
        for pg in ctx.pages:
            if "chatgpt.com" in pg.url:
                page = pg
                break
        
        if not page:
            print("Sem aba ChatGPT")
            return
        
        await page.goto("https://chatgpt.com", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(5000)
        
        chat_links = await page.query_selector_all('a[href*="/c/"]')
        urls = []
        for link in chat_links:
            href = await link.get_attribute("href")
            if href and "/c/" in href:
                full = href if href.startswith("http") else f"https://chatgpt.com{href}"
                urls.append(full)
        
        print(f"Total de conversas: {len(urls)}", flush=True)
        print("=" * 80, flush=True)
        
        all_products = []
        
        for i, url in enumerate(urls):
            try:
                await page.goto(url, wait_until="domcontentloaded", timeout=30000)
                await page.wait_for_timeout(3000)
                
                # Pegar TODO o texto da pagina
                full_text = await page.inner_text("body")
                
                # Buscar todos os "Product: XXX" no texto
                products = re.findall(r'Product:\s*(.+?)(?:\\n|Category:|\n)', full_text)
                
                # Contar imagens (qualquer img grande)
                imgs = await page.query_selector_all('img')
                img_count = 0
                for img in imgs:
                    src = await img.get_attribute("src") or ""
                    if any(x in src for x in ["oaiusercontent", "files.oai", "cdn.oai"]):
                        img_count += 1
                
                if products:
                    print(f"\nCHAT [{i+1}] - {img_count} imagens:", flush=True)
                    for prod in products:
                        prod = prod.strip()
                        print(f"  -> {prod}", flush=True)
                        all_products.append(prod)
                else:
                    # Pegar primeira linha nao vazia
                    lines = [l.strip() for l in full_text.split("\n") if l.strip()]
                    first = lines[0][:80] if lines else "(vazio)"
                    print(f"\nCHAT [{i+1}] - {img_count} imgs - {first}", flush=True)
                
            except Exception as e:
                print(f"\nCHAT [{i+1}] ERRO: {str(e)[:80]}", flush=True)
        
        # Resumo
        print(f"\n{'=' * 80}", flush=True)
        from collections import Counter
        counts = Counter(all_products)
        print(f"Total de produtos gerados: {len(all_products)}", flush=True)
        print(f"Produtos unicos: {len(counts)}", flush=True)
        
        dupes = {k: v for k, v in counts.items() if v > 1}
        print(f"\nDUPLICATAS (gerado mais de 1 vez):", flush=True)
        for name, count in sorted(dupes.items(), key=lambda x: -x[1]):
            print(f"  {count}x - {name}", flush=True)
        
        print(f"\nTodos os produtos unicos gerados:", flush=True)
        for name in sorted(counts.keys()):
            print(f"  {counts[name]}x - {name}", flush=True)

asyncio.run(audit())

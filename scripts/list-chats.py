"""Lista todos os chats/conversas do ChatGPT via CDP."""
import asyncio
from playwright.async_api import async_playwright

async def list_chats():
    async with async_playwright() as p:
        b = await p.chromium.connect_over_cdp("http://localhost:9223")
        ctx = b.contexts[0]
        
        # Achar aba ChatGPT
        page = None
        for pg in ctx.pages:
            if "chatgpt.com" in pg.url:
                page = pg
                break
        
        if not page:
            print("Sem aba ChatGPT")
            return
        
        print(f"URL atual: {page.url}", flush=True)
        
        # Ir para a pagina principal
        await page.goto("https://chatgpt.com", wait_until="networkidle", timeout=60000)
        await page.wait_for_timeout(5000)
        
        # Pegar a lista de conversas na sidebar
        chats = await page.query_selector_all('a[href*="/c/"]')
        print(f"\nTotal de conversas na sidebar: {len(chats)}", flush=True)
        
        for i, chat in enumerate(chats[:50]):
            try:
                href = await chat.get_attribute("href")
                txt = await chat.text_content()
                txt = txt.strip()[:80] if txt else "(sem titulo)"
                print(f"  [{i+1}] {txt}", flush=True)
            except:
                pass

asyncio.run(list_chats())

"""Gera paginas QA por categoria - parser correto."""
import os, re, json

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")

with open(CATALOG, "r", encoding="utf-8") as f:
    content = f.read()

# Parser correto: pega cada objeto { ... } dentro de products: Product[] = [ ... ]
start = content.find("export const products: Product[] = [")
end = content.find("];", start) + 2
products_block = content[start:end]

products = []
# Regex que captura campos na ordem exata do catalog.ts
pattern = r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"[^"]+",\s*category:\s*"([^"]+)",\s*subcategory:\s*"([^"]+)",\s*image:\s*"([^"]+)"'
for m in re.finditer(pattern, products_block, re.DOTALL):
    pid, slug, name, cat, subcat, img = m.groups()
    products.append({"id": pid, "slug": slug, "name": name, "category": cat, "subcategory": subcat, "image": img})

print(f"Produtos parseados: {len(products)}")

# Carregar manifest
manifest = {}
manifest_path = os.path.join(ROOT, "data", "catalog-image-manifest.json")
if os.path.exists(manifest_path):
    with open(manifest_path, "r", encoding="utf-8") as f:
        for m in json.load(f):
            manifest[m["slug"]] = m

from collections import defaultdict
by_cat = defaultdict(list)
for p in products:
    by_cat[p["category"]].append(p)

# Pagina principal
html = """<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VendaMais - QA Catalogo</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
h1 { color: #333; }
.cats { display: flex; flex-wrap: wrap; gap: 10px; margin: 20px 0; }
.cat-link { display: inline-block; padding: 15px 25px; background: #2563eb; color: white; text-decoration: none; border-radius: 8px; font-size: 16px; font-weight: bold; }
.cat-link:hover { background: #1d4ed8; }
</style></head>
<body>
<h1>VendaMais - QA Catalogo de Imagens</h1>
<p>Selecione uma categoria:</p>
<div class="cats">
"""
for cat in sorted(by_cat.keys()):
    html += f'<a class="cat-link" href="qa-{cat}.html">{cat.upper()}<br><small>{len(by_cat[cat])} produtos</small></a>\n'
html += "</div></body></html>"

with open(os.path.join(ROOT, "public", "catalog-qa.html"), "w", encoding="utf-8") as f:
    f.write(html)

for cat, prods in by_cat.items():
    html = f"""<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>QA - {cat.upper()}</title>
<style>
body {{ font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }}
h1 {{ color: #333; }}
.back {{ margin-bottom: 20px; }}
.back a {{ color: #2563eb; text-decoration: none; font-weight: bold; }}
.grid {{ display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 15px; }}
.card {{ background: white; border-radius: 8px; padding: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }}
.card img {{ width: 100%; height: 180px; object-fit: contain; background: #f9f9f9; border-radius: 4px; }}
.card .code {{ font-weight: bold; color: #2563eb; font-size: 14px; }}
.card .name {{ font-size: 13px; color: #333; margin: 4px 0; }}
.card .source {{ font-size: 11px; color: #666; }}
</style></head>
<body>
<h1>QA - {cat.upper()} ({len(prods)} produtos)</h1>
<div class="back"><a href="catalog-qa.html">&larr; Voltar</a></div>
<div class="grid">
"""
    for p in sorted(prods, key=lambda x: x["id"]):
        m = manifest.get(p["slug"], {})
        fonte = m.get("source", "?")
        html += f"""<div class="card" id="{p['id']}">
<img src="{p['image']}" loading="lazy" alt="{p['name']}" onerror="this.style.display='none'; this.parentElement.innerHTML += '<div style=\\'height:180px;background:#f3f4f6;display:flex;align-items:center;justify-content:center;color:#999\\'>SEM IMAGEM</div>'">
<div class="code">{p['id']}</div>
<div class="name">{p['name']}</div>
<div class="source">Fonte: {fonte}</div>
</div>
"""
    html += "</div></body></html>"
    with open(os.path.join(ROOT, "public", f"qa-{cat}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"Geradas {len(by_cat)} paginas de QA")

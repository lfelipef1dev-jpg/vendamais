"""Cria lista de TODAS as suspeitas (openverse com score baixo) para gerar no ChatGPT."""
import os, re, json
from difflib import SequenceMatcher

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"

with open(os.path.join(ROOT, "src", "lib", "catalog.ts"), "r", encoding="utf-8") as f:
    content = f.read()

start = content.find("export const products: Product[] = [")
end = content.find("];", start) + 2
block = content[start:end]

pattern = r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"[^"]+",\s*category:\s*"([^"]+)",\s*subcategory:\s*"([^"]+)",\s*image:\s*"([^"]+)"'
products = []
for m in re.finditer(pattern, block, re.DOTALL):
    pid, slug, name, cat, subcat, img = m.groups()
    products.append({"id": pid, "slug": slug, "name": name, "category": cat, "subcategory": subcat})

with open(os.path.join(ROOT, "data", "catalog-image-manifest.json"), "r", encoding="utf-8") as f:
    manifest = json.load(f)
m_by_slug = {x["slug"]: x for x in manifest}

def normalize(t):
    return re.sub(r'[^a-z0-9]', '', (t or "").lower())

def sim(a, b):
    a, b = normalize(a), normalize(b)
    if not a or not b: return 0
    if a in b or b in a: return 100
    return SequenceMatcher(None, a, b).ratio() * 100

# Filtrar: openverse com score < 40, excluindo açougue (já tratado)
to_fix = []
for p in products:
    m = m_by_slug.get(p["slug"])
    if not m: continue
    if m.get("source") != "openverse": continue
    if p["category"] == "acougue": continue  # já tratando
    score = sim(p["name"], m.get("sourceProduct", ""))
    if score < 40:
        to_fix.append(p)
        print(f"{p['id']:6} {p['category']:12} {p['name']:30} score={score:.0f}% src={m.get('sourceProduct','')[:50]}")

print(f"\nTotal para gerar: {len(to_fix)}")
with open(os.path.join(ROOT, "data", "all-to-fix.json"), "w", encoding="utf-8") as f:
    json.dump(to_fix, f, indent=2, ensure_ascii=False)
print("Salvo em data/all-to-fix.json")

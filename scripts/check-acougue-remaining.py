"""Verifica o que ainda falta no açougue."""
import os, re, json
ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
with open(os.path.join(ROOT, "src", "lib", "catalog.ts"), "r", encoding="utf-8") as f:
    content = f.read()
pattern = r'\{\s*id:\s*"(a0(?:3[6-9]|[4-9][0-9]|6[0-3]))",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"[^"]+",\s*category:\s*"acougue",\s*subcategory:\s*"([^"]+)",\s*image:\s*"([^"]+)"'
products = []
for m in re.finditer(pattern, content, re.DOTALL):
    pid, slug, name, subcat, img = m.groups()
    products.append({"id": pid, "slug": slug, "name": name, "category": "acougue", "subcategory": subcat})

with open(os.path.join(ROOT, "data", "catalog-image-manifest.json"), "r", encoding="utf-8") as f:
    manifest = json.load(f)
m_by_slug = {x["slug"]: x for x in manifest}

still_openverse = []
for p in products:
    src = m_by_slug.get(p["slug"], {}).get("source", "?")
    if src == "openverse":
        still_openverse.append(p)
        print(f"AINDA OPENVERSE: {p['id']} {p['name']}")

if not still_openverse:
    print("AÇOUGUE 100% CHATGPT!")
else:
    with open(os.path.join(ROOT, "data", "acougue-still-fix.json"), "w", encoding="utf-8") as f:
        json.dump(still_openverse, f, indent=2, ensure_ascii=False)
    print(f"\nFaltando: {len(still_openverse)}")

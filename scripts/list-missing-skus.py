"""Lista SKUs que ainda tem imagem antiga (Unsplash ou placeholder)."""
import re, json

content = open('src/lib/catalog.ts', 'r', encoding='utf-8').read()
manifest = json.load(open('data/catalog-image-manifest.json', 'r', encoding='utf-8'))
done_slugs = {m['slug'] for m in manifest}

# Parse mais simples - pegar slug e image
pattern = r'slug:\s*"([^"]+)",.*?image:\s*"([^"]+)"'
matches = re.findall(pattern, content, re.DOTALL)

missing = []
for slug, img in matches:
    if slug not in done_slugs:
        missing.append({"slug": slug, "old_image": img})

# Também pegar nome e categoria
pattern2 = r'id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?category:\s*"([^"]+)"'
all_products = {m[1]: {"id": m[0], "name": m[2], "category": m[3]} for m in re.findall(pattern2, content, re.DOTALL)}

for item in missing:
    info = all_products.get(item["slug"], {})
    item["id"] = info.get("id", "")
    item["name"] = info.get("name", "")
    item["category"] = info.get("category", "")

print(f"SKUs sem imagem nova: {len(missing)}")
print()
from collections import defaultdict
by_cat = defaultdict(list)
for p in missing:
    by_cat[p['category']].append(p)

for cat in sorted(by_cat.keys()):
    print(f"=== {cat} ({len(by_cat[cat])}) ===")
    for p in by_cat[cat]:
        print(f"  {p['id']:6} {p['slug']:40} {p['name']}")

with open('data/missing-skus.json', 'w', encoding='utf-8') as f:
    json.dump(missing, f, indent=2, ensure_ascii=False)
print(f"\nLista salva: data/missing-skus.json")

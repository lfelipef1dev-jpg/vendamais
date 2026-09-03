"""Identifica SKUs sem imagem nova ou com imagem potencialmente errada."""
import os, re, json, hashlib
from collections import defaultdict

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")

# Carregar manifest
with open(MANIFEST, "r", encoding="utf-8") as f:
    manifest = json.load(f)

manifest_slugs = {m["slug"] for m in manifest}

# Parse catalog
content = open(CATALOG, "r", encoding="utf-8").read()
pattern = r'id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",.*?category:\s*"([^"]+)",.*?image:\s*"([^"]+)"'
all_products = []
for m in re.finditer(pattern, content, re.DOTALL):
    all_products.append({
        "id": m.group(1),
        "slug": m.group(2),
        "name": m.group(3),
        "category": m.group(4),
        "image": m.group(5),
    })

# 1. SKUs sem imagem nova (ainda com Unsplash ou placeholder antigo)
sem_imagem = []
for p in all_products:
    if p["slug"] not in manifest_slugs:
        sem_imagem.append(p)

# 2. Duplicatas (mesmo hash)
file_hashes = defaultdict(list)
for r, _, files in os.walk(PRODUCT_DIR):
    for f in files:
        if not f.endswith(".webp"):
            continue
        path = os.path.join(r, f)
        with open(path, "rb") as fh:
            h = hashlib.md5(fh.read()).hexdigest()
        rel = "/" + os.path.relpath(path, os.path.join(ROOT, "public")).replace("\\", "/")
        file_hashes[h].append(rel)

dupes = {h: paths for h, paths in file_hashes.items() if len(paths) > 1}

# Mapear duplicatas para slugs
dupe_slugs = {}
for h, paths in dupes.items():
    for p in paths:
        slug = os.path.basename(p).replace(".webp", "")
        dupe_slugs[slug] = {"path": p, "group": h[:8], "total": len(paths)}

# 3. Imagens muito pequenas (possivelmente erradas)
small_images = []
for m in manifest:
    path = os.path.join(ROOT, m["localPath"].lstrip("/"))
    if os.path.exists(path):
        size = os.path.getsize(path)
        if size < 5000:  # menos de 5KB = suspeito
            small_images.append((m, size))

# 4. SKUs com score muito baixo (match ruim)
low_score = []
for m in manifest:
    score = m.get("matchScore", 100)
    if score < 50:
        low_score.append(m)

# 5. SKUs em revisao (nao aprovados)
review = [m for m in manifest if m["status"] == "review"]

print("=" * 60)
print("RELATORIO DE PROBLEMAS")
print("=" * 60)

print(f"\n1. SEM IMAGEM NOVA (ainda com placeholder/Unsplash): {len(sem_imagem)}")
by_cat = defaultdict(list)
for p in sem_imagem:
    by_cat[p["category"]].append(p)
for cat in sorted(by_cat.keys()):
    print(f"\n   {cat} ({len(by_cat[cat])}):")
    for p in by_cat[cat]:
        print(f"     {p['id']:6} {p['slug']:40} {p['name']}")

print(f"\n2. DUPLICATAS (mesma imagem para SKUs diferentes): {len(dupes)} grupos")
for h, paths in dupes.items():
    slugs = [os.path.basename(p).replace(".webp", "") for p in paths]
    print(f"   Grupo {h[:8]}: {slugs}")

print(f"\n3. IMAGENS MUITO PEQUENAS (<5KB, suspeitas): {len(small_images)}")
for m, size in small_images:
    print(f"   {m['sku']:6} {m['slug']:40} {size} bytes")

print(f"\n4. MATCH SCORE BAIXO (<50, possivel errado): {len(low_score)}")
for m in low_score:
    print(f"   {m['sku']:6} {m['slug']:40} score={m['matchScore']}  fonte={m['source']}  produto={m.get('sourceProduct','')[:40]}")

print(f"\n5. EM REVISAO (nao aprovados): {len(review)}")
for m in review:
    print(f"   {m['sku']:6} {m['slug']:40} score={m['matchScore']}  fonte={m['source']}")

# Resumo
total_problemas = len(sem_imagem) + sum(len(p) - 1 for p in dupes.values()) + len(small_images) + len(low_score) + len(review)
print(f"\n{'=' * 60}")
print(f"TOTAL DE PROBLEMAS: {total_problemas}")
print(f"  Sem imagem: {len(sem_imagem)}")
print(f"  Duplicatas: {sum(len(p) - 1 for p in dupes.values())} SKUs")
print(f"  Imagens pequenas: {len(small_images)}")
print(f"  Score baixo: {len(low_score)}")
print(f"  Em revisao: {len(review)}")
print(f"{'=' * 60}")

# Salvar lista para ChatGPT
to_generate = []
for p in sem_imagem:
    to_generate.append({"id": p["id"], "slug": p["slug"], "name": p["name"], "category": p["category"]})
# Adicionar duplicatas
for slug, info in dupe_slugs.items():
    for p in all_products:
        if p["slug"] == slug and slug not in [t["slug"] for t in to_generate]:
            to_generate.append({"id": p["id"], "slug": p["slug"], "name": p["name"], "category": p["category"]})
# Adicionar score baixo
for m in low_score:
    if m["slug"] not in [t["slug"] for t in to_generate]:
        to_generate.append({"id": m["sku"], "slug": m["slug"], "name": m["name"], "category": m["category"]})

with open(os.path.join(ROOT, "data", "to-fix.json"), "w", encoding="utf-8") as f:
    json.dump(to_generate, f, indent=2, ensure_ascii=False)
print(f"\nLista para corrigir salva: data/to-fix.json ({len(to_generate)} SKUs)")

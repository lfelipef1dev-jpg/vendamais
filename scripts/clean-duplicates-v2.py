"""Remove duplicatas verificando os arquivos fisicos e remove do manifest."""
import os, json, hashlib

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
PRODUCT_DIR = os.path.join(ROOT, "public", "images", "catalog", "products")

with open(MANIFEST, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Calcular hash de cada arquivo fisico
file_hashes = {}
for r, _, files in os.walk(PRODUCT_DIR):
    for f in files:
        if not f.endswith(".webp"):
            continue
        path = os.path.join(r, f)
        with open(path, "rb") as fh:
            h = hashlib.md5(fh.read()).hexdigest()
        rel = "/" + os.path.relpath(path, os.path.join(ROOT, "public")).replace("\\", "/")
        file_hashes[rel] = h

# Agrupar por hash
by_hash = {}
for path, h in file_hashes.items():
    by_hash.setdefault(h, []).append(path)

# Encontrar duplicatas
dupes = {h: paths for h, paths in by_hash.items() if len(paths) > 1}
print(f"Total arquivos: {len(file_hashes)}")
print(f"Duplicatas: {len(dupes)}")

# Para cada grupo de duplicatas, manter o primeiro e remover os outros do manifest
to_remove_skus = set()
for h, paths in dupes.items():
    print(f"\n  Hash {h[:8]}:")
    keep = paths[0]
    for p in paths:
        print(f"    {p}")
    # Remover do manifest os que nao sao o primeiro
    for p in paths[1:]:
        for m in manifest:
            if m["localPath"] == p:
                print(f"    REMOVER: {m['sku']} {m['name']}")
                to_remove_skus.add(m["sku"])

# Remover do manifest
manifest_clean = [m for m in manifest if m["sku"] not in to_remove_skus]
print(f"\nRemovidos: {len(to_remove_skus)} SKUs")
print(f"Manifest: {len(manifest)} -> {len(manifest_clean)}")

with open(MANIFEST, "w", encoding="utf-8") as f:
    json.dump(manifest_clean, f, indent=2, ensure_ascii=False)

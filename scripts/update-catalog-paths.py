"""Atualiza catalog.ts para usar as novas imagens do manifest."""
import os, re, json

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")

with open(MANIFEST, "r", encoding="utf-8") as f:
    manifest = json.load(f)

# Criar mapa slug -> localPath
image_map = {m["slug"]: m["localPath"] for m in manifest}

with open(CATALOG, "r", encoding="utf-8") as f:
    content = f.read()

# Substituir cada image: "..." pelo novo caminho
updated = 0
for slug, path in image_map.items():
    # Procurar por slug: "slug", ... image: "old_path"
    pattern = rf'(slug:\s*"{re.escape(slug)}",.*?image:\s*")[^"]*(")'
    new_content, n = re.subn(pattern, rf'\g<1>{path}\g<2>', content, flags=re.DOTALL)
    if n > 0:
        content = new_content
        updated += n

with open(CATALOG, "w", encoding="utf-8") as f:
    f.write(content)

print(f"Catalogo atualado: {updated} imagens atualizadas")
print(f"Total no manifest: {len(manifest)}")

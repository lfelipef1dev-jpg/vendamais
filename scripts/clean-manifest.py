"""Limpa manifesto: remove duplicatas, entradas sem produto, mantem a mais recente."""
import os, json

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")

def parse_catalog_slugs():
    import re
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    slugs = set()
    pattern = r'slug:\s*"([^"]+)"'
    for m in re.finditer(pattern, content):
        slugs.add(m.group(1))
    return slugs

def main():
    with open(MANIFEST, "r", encoding="utf-8") as f:
        manifest = json.load(f)
    
    catalog_slugs = parse_catalog_slugs()
    print(f"Slugs no catalogo: {len(catalog_slugs)}")
    print(f"Entradas no manifesto: {len(manifest)}")
    
    # Agrupar por slug
    by_slug = {}
    for m in manifest:
        slug = m.get("slug")
        if not slug:
            continue
        if slug not in by_slug:
            by_slug[slug] = []
        by_slug[slug].append(m)
    
    # Manter apenas uma entrada por slug: preferir chatgpt, depois carrefour/atacadao, depois openverse
    source_priority = {"chatgpt": 0, "atacadao": 1, "carrefour": 2, "openverse": 3, "wikimedia": 4, "google": 5}
    
    cleaned = []
    removed = []
    duplicates = {}
    
    for slug, entries in by_slug.items():
        if slug not in catalog_slugs:
            removed.extend(entries)
            continue
        
        if len(entries) > 1:
            duplicates[slug] = len(entries)
            # Ordenar: status approved, depois por prioridade de fonte
            entries.sort(key=lambda x: (
                0 if x.get("status") == "approved" else 1,
                source_priority.get(x.get("source"), 99),
            ))
            cleaned.append(entries[0])
            removed.extend(entries[1:])
        else:
            cleaned.append(entries[0])
    
    # Ordenar por id/slug
    cleaned.sort(key=lambda x: x.get("slug", ""))
    
    with open(MANIFEST, "w", encoding="utf-8") as f:
        json.dump(cleaned, f, indent=2, ensure_ascii=False)
    
    print(f"\nManifesto limpo: {len(cleaned)} entradas")
    print(f"Removidas: {len(removed)}")
    print(f"Duplicatas resolvidas: {len(duplicates)}")
    if duplicates:
        print("\nSlug com duplicatas:")
        for slug, count in list(duplicates.items())[:10]:
            print(f"  {slug}: {count} entradas -> 1")

if __name__ == "__main__":
    main()

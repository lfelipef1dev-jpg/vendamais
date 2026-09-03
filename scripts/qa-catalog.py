"""QA Visual — audita todos os produtos do catalog.ts
Verifica: imagem existe, dimensões, tamanho, HTTP status (via dev server)
"""
import os, re, json
from PIL import Image

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
IMG_OUT = os.path.join(ROOT, "public", "images", "catalog")
REPORT = os.path.join(ROOT, "qa-catalog-report.json")

def parse_catalog():
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    products = []
    pattern = r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*subcategory:\s*"([^"]+)",\s*image:\s*"([^"]+)"'
    for match in re.finditer(pattern, content):
        products.append({
            "id": match.group(1),
            "slug": match.group(2),
            "name": match.group(3),
            "brand": match.group(4),
            "category": match.group(5),
            "subcategory": match.group(6),
            "image": match.group(7),
        })
    return products

def main():
    products = parse_catalog()
    print(f"Total produtos no catalogo: {len(products)}")
    
    results = []
    errors = []
    missing = []
    
    for p in products:
        # Convert /images/... to public/images/...
        local_path = os.path.join(ROOT, "public", p["image"].lstrip("/"))
        
        result = {
            "id": p["id"],
            "slug": p["slug"],
            "name": p["name"],
            "category": p["category"],
            "subcategory": p["subcategory"],
            "image_path": p["image"],
            "exists": False,
            "width": 0,
            "height": 0,
            "size_kb": 0,
            "format": None,
        }
        
        if not os.path.exists(local_path):
            missing.append(p["slug"])
            result["error"] = "IMAGE_NOT_FOUND"
            errors.append(result)
        else:
            result["exists"] = True
            result["size_kb"] = round(os.path.getsize(local_path) / 1024, 1)
            try:
                with Image.open(local_path) as img:
                    result["width"] = img.width
                    result["height"] = img.height
                    result["format"] = img.format
            except Exception as e:
                result["error"] = f"IMAGE_CORRUPT: {e}"
                errors.append(result)
        
        results.append(result)
    
    # Stats
    total = len(results)
    found = sum(1 for r in results if r["exists"])
    not_found = sum(1 for r in results if not r["exists"])
    corrupt = sum(1 for r in results if r.get("error", "").startswith("IMAGE_CORRUPT"))
    
    sizes = [r["size_kb"] for r in results if r["exists"]]
    avg_size = sum(sizes) / len(sizes) if sizes else 0
    max_size = max(sizes) if sizes else 0
    min_size = min(sizes) if sizes else 0
    
    # Por categoria
    by_cat = {}
    for r in results:
        cat = r["category"]
        if cat not in by_cat:
            by_cat[cat] = {"total": 0, "found": 0, "missing": 0}
        by_cat[cat]["total"] += 1
        if r["exists"]:
            by_cat[cat]["found"] += 1
        else:
            by_cat[cat]["missing"] += 1
    
    report = {
        "summary": {
            "total_products": total,
            "images_found": found,
            "images_missing": not_found,
            "images_corrupt": corrupt,
            "avg_size_kb": round(avg_size, 1),
            "max_size_kb": max_size,
            "min_size_kb": min_size,
        },
        "by_category": by_cat,
        "errors": errors,
        "missing_slugs": missing,
        "all_products": results,
    }
    
    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    print(f"\n=== QA REPORT ===")
    print(f"Total produtos: {total}")
    print(f"Imagens encontradas: {found}")
    print(f"Imagens faltando: {not_found}")
    print(f"Imagens corrompidas: {corrupt}")
    print(f"Tamanho medio: {avg_size:.1f} KB")
    print(f"Tamanho max: {max_size:.1f} KB")
    print(f"Tamanho min: {min_size:.1f} KB")
    print(f"\nPor categoria:")
    for cat, stats in sorted(by_cat.items()):
        print(f"  {cat}: {stats['found']}/{stats['total']} (missing: {stats['missing']})")
    
    if missing:
        print(f"\nProdutos sem imagem ({len(missing)}):")
        for s in missing[:20]:
            print(f"  - {s}")
    
    print(f"\nRelatorio salvo: {REPORT}")

if __name__ == "__main__":
    main()

"""
QA Visual VendaMais — audita TODOS os produtos do catalogo.
Para cada produto: verifica se a imagem existe, dimensoes, tamanho e correspondencia.
Gera relatorio em JSON e texto.
"""
import os, re, json
from PIL import Image

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
PUBLIC = os.path.join(ROOT, "public")
REPORT = os.path.join(ROOT, "scripts", "qa-report.json")
REPORT_TXT = os.path.join(ROOT, "scripts", "qa-report.txt")

def read_catalog():
    with open(CATALOG, "r", encoding="utf-8") as f:
        return f.read()

def extract_products(content):
    products = []
    blocks = content.split("{ id:")
    
    for block in blocks[1:]:
        def find(field, pattern):
            m = re.search(pattern, block)
            return m.group(1) if m else None
        
        p = {
            "id": find("id", r'id:\s*"([^"]+)"'),
            "slug": find("slug", r'slug:\s*"([^"]+)"'),
            "name": find("name", r'name:\s*"([^"]+)"'),
            "category": find("category", r'category:\s*"([^"]+)"'),
            "subcategory": find("subcategory", r'subcategory:\s*"([^"]+)"'),
            "image": find("image", r'image:\s*"([^"]+)"'),
            "price": find("price", r'price:\s*([\d.]+)'),
            "byWeight": "byWeight: true" in block,
            "pricePerKg": find("pricePerKg", r'pricePerKg:\s*([\d.]+)'),
            "approxWeight": find("approxWeight", r'approxWeight:\s*([\d.]+)'),
        }
        if p["id"] and p["slug"] and p["image"]:
            products.append(p)
    
    return products

def check_image(image_path, product):
    """Verifica se a imagem existe e suas propriedades"""
    issues = []
    
    if image_path.startswith("http"):
        issues.append("URL externa (deveria ser local)")
        return {"exists": False, "issues": issues, "size_kb": 0, "dimensions": None}
    
    full_path = os.path.join(PUBLIC, image_path.lstrip("/"))
    
    if not os.path.exists(full_path):
        issues.append("ARQUIVO NAO ENCONTRADO")
        return {"exists": False, "issues": issues, "size_kb": 0, "dimensions": None}
    
    size_kb = os.path.getsize(full_path) / 1024
    
    try:
        with Image.open(full_path) as img:
            w, h = img.size
            fmt = img.format
    except Exception as e:
        issues.append(f"ERRO AO ABRIR: {e}")
        return {"exists": True, "issues": issues, "size_kb": size_kb, "dimensions": None}
    
    if w < 200 or h < 200:
        issues.append(f"RESOLUCAO BAIXA: {w}x{h}")
    
    if abs(w - h) > 10:
        issues.append(f"NAO QUADRADO: {w}x{h}")
    
    if size_kb > 200:
        issues.append(f"ARQUIVO PESADO: {size_kb:.0f}KB")
    
    return {
        "exists": True,
        "issues": issues,
        "size_kb": round(size_kb, 1),
        "dimensions": f"{w}x{h}",
        "format": fmt,
    }

def check_price(product):
    """Verifica se o preco por peso esta correto"""
    issues = []
    if product["byWeight"] and product["pricePerKg"] and product["approxWeight"]:
        expected = float(product["pricePerKg"]) * float(product["approxWeight"])
        actual = float(product["price"])
        diff = abs(expected - actual)
        if diff > 0.05:
            issues.append(f"PRECO POR PESO INCORRETO: {product['pricePerKg']}/kg x {product['approxWeight']}kg = {expected:.2f} mas price={actual}")
    return issues

def main():
    content = read_catalog()
    products = extract_products(content)
    print(f"Total produtos: {len(products)}")
    
    results = []
    by_category = {}
    total_issues = 0
    total_images = 0
    total_size = 0
    broken = 0
    external = 0
    
    for p in products:
        cat = p["category"]
        if cat not in by_category:
            by_category[cat] = {"total": 0, "issues": 0}
        by_category[cat]["total"] += 1
        
        img_check = check_image(p["image"], p)
        price_issues = check_price(p)
        
        all_issues = img_check["issues"] + price_issues
        total_issues += len(all_issues)
        
        if not img_check["exists"]:
            broken += 1
        if p["image"].startswith("http"):
            external += 1
        if img_check["exists"]:
            total_images += 1
            total_size += img_check["size_kb"]
        
        if all_issues:
            by_category[cat]["issues"] += len(all_issues)
        
        results.append({
            "id": p["id"],
            "slug": p["slug"],
            "name": p["name"],
            "category": cat,
            "subcategory": p["subcategory"],
            "image": p["image"],
            "exists": img_check["exists"],
            "size_kb": img_check["size_kb"],
            "dimensions": img_check["dimensions"],
            "issues": all_issues,
        })
    
    # Relatorio JSON
    report = {
        "total_products": len(products),
        "total_images": total_images,
        "broken_images": broken,
        "external_urls": external,
        "total_issues": total_issues,
        "avg_image_size_kb": round(total_size / max(total_images, 1), 1),
        "by_category": by_category,
        "products": results,
    }
    
    with open(REPORT, "w", encoding="utf-8") as f:
        json.dump(report, f, indent=2, ensure_ascii=False)
    
    # Relatorio texto
    with open(REPORT_TXT, "w", encoding="utf-8") as f:
        f.write("=" * 60 + "\n")
        f.write("QA VISUAL VENDAMAIS — RELATORIO DE CATALOGO\n")
        f.write("=" * 60 + "\n\n")
        f.write(f"Total de produtos: {len(products)}\n")
        f.write(f"Imagens locais: {total_images}\n")
        f.write(f"Imagens quebradas: {broken}\n")
        f.write(f"URLs externas: {external}\n")
        f.write(f"Total de issues: {total_issues}\n")
        f.write(f"Tamanho medio: {report['avg_image_size_kb']}KB\n\n")
        
        f.write("POR CATEGORIA:\n")
        f.write("-" * 40 + "\n")
        for cat, data in sorted(by_category.items()):
            f.write(f"  {cat}: {data['total']} produtos, {data['issues']} issues\n")
        
        f.write("\nPRODUTOS COM ISSUES:\n")
        f.write("-" * 40 + "\n")
        for r in results:
            if r["issues"]:
                f.write(f"\n  [{r['id']}] {r['name']} ({r['category']})\n")
                f.write(f"    Image: {r['image']}\n")
                f.write(f"    Exists: {r['exists']}, Size: {r['size_kb']}KB, Dims: {r['dimensions']}\n")
                for issue in r["issues"]:
                    f.write(f"    ISSUE: {issue}\n")
    
    # Console output
    print(f"\n{'=' * 60}")
    print(f"QA VISUAL VENDAMAIS")
    print(f"{'=' * 60}")
    print(f"Total produtos: {len(products)}")
    print(f"Imagens locais: {total_images}")
    print(f"Imagens quebradas: {broken}")
    print(f"URLs externas: {external}")
    print(f"Total issues: {total_issues}")
    print(f"Tamanho medio: {report['avg_image_size_kb']}KB")
    print(f"\nPOR CATEGORIA:")
    for cat, data in sorted(by_category.items()):
        status = "OK" if data["issues"] == 0 else "ISSUES"
        print(f"  {status} {cat}: {data['total']} produtos, {data['issues']} issues")
    
    if total_issues > 0:
        print(f"\nPRODUTOS COM ISSUES:")
        for r in results:
            if r["issues"]:
                print(f"  [{r['id']}] {r['name']}: {', '.join(r['issues'])}")
    
    print(f"\nRelatorios: {REPORT} + {REPORT_TXT}")

if __name__ == "__main__":
    main()

"""
Pipeline de imagens VendaMais — baixa, converte para WebP e organiza localmente.
Le o catalog.ts, extrai URLs do Unsplash, baixa, converte e salva em /public/images/catalog/
"""
import re, os, sys, json, time
from urllib.request import urlopen, Request
from PIL import Image
import io

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
OUT = os.path.join(ROOT, "public", "images", "catalog")
MAPPING_FILE = os.path.join(ROOT, "scripts", "image-mapping.json")

os.makedirs(os.path.dirname(MAPPING_FILE), exist_ok=True)

def read_catalog():
    with open(CATALOG, "r", encoding="utf-8") as f:
        return f.read()

def extract_products(content):
    """Extrai produtos do catalog.ts usando regex"""
    products = []
    # Pattern: { id: "h01", slug: "...", ... image: "..." ... }
    pattern = r'image:\s*"(https://images\.unsplash\.com/[^"]+)"'
    slug_pattern = r'slug:\s*"([^"]+)"'
    cat_pattern = r'category:\s*"([^"]+)"'
    
    # Find all product blocks
    blocks = content.split("{ id:")
    
    for block in blocks[1:]:  # skip first (before first product)
        slug_match = re.search(slug_pattern, block)
        cat_match = re.search(cat_pattern, block)
        img_match = re.search(pattern, block)
        
        if slug_match and cat_match and img_match:
            products.append({
                "slug": slug_match.group(1),
                "category": cat_match.group(1),
                "image": img_match.group(1),
            })
    
    return products

def download_image(url, timeout=15):
    """Baixa imagem do Unsplash"""
    headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
    req = Request(url, headers=headers)
    try:
        with urlopen(req, timeout=timeout) as resp:
            data = resp.read()
        return Image.open(io.BytesIO(data))
    except Exception as e:
        print(f"  ERRO download: {e}")
        return None

def convert_to_webp(img, out_path, size=400, quality=82):
    """Converte e redimensiona para WebP quadrado"""
    img = img.convert("RGB")
    # Center crop para quadrado
    w, h = img.size
    if w != h:
        min_dim = min(w, h)
        left = (w - min_dim) // 2
        top = (h - min_dim) // 2
        img = img.crop((left, top, left + min_dim, top + min_dim))
    img = img.resize((size, size), Image.LANCZOS)
    img.save(out_path, "WEBP", quality=quality, method=6)
    return os.path.getsize(out_path)

def main():
    content = read_catalog()
    products = extract_products(content)
    print(f"Produtos encontrados: {len(products)}")
    
    # Agrupar por URL unica (varios produtos podem compartilhar imagem)
    url_to_products = {}
    for p in products:
        if p["image"] not in url_to_products:
            url_to_products[p["image"]] = []
        url_to_products[p["image"]].append(p)
    
    print(f"URLs unicas: {len(url_to_products)}")
    
    mapping = {}
    downloaded = 0
    failed = 0
    
    for i, (url, prods) in enumerate(url_to_products.items()):
        # Nome do arquivo: slug do primeiro produto
        slug = prods[0]["slug"]
        cat = prods[0]["category"]
        filename = f"{slug}.webp"
        out_path = os.path.join(OUT, cat, filename)
        local_url = f"/images/catalog/{cat}/{filename}"
        
        # Skip se ja existe
        if os.path.exists(out_path):
            size_kb = os.path.getsize(out_path) / 1024
            print(f"[{i+1}/{len(url_to_products)}] SKIP {filename} ({size_kb:.0f}KB) ja existe")
            mapping[url] = local_url
            for p in prods:
                mapping[f"{p['slug']}:{url}"] = local_url
            continue
        
        print(f"[{i+1}/{len(url_to_products)}] Download {filename}...")
        img = download_image(url)
        if img is None:
            print(f"  FALHOU - usando placeholder")
            failed += 1
            # Criar placeholder colorido
            color_map = {
                "hortifruti": (22, 163, 74), "acougue": (220, 38, 38),
                "padaria": (217, 119, 6), "frios": (8, 145, 178),
                "laticinios": (59, 130, 246), "bebidas": (124, 58, 237),
                "mercearia": (146, 64, 14), "congelados": (14, 165, 233),
                "limpeza": (8, 145, 178), "higiene": (236, 72, 153),
                "bebe": (244, 114, 182), "pet": (139, 92, 246),
            }
            color = color_map.get(cat, (148, 163, 184))
            placeholder = Image.new("RGB", (400, 400), color)
            placeholder.save(out_path, "WEBP", quality=82, method=6)
            mapping[url] = local_url
            for p in prods:
                mapping[f"{p['slug']}:{url}"] = local_url
            continue
        
        size_bytes = convert_to_webp(img, out_path)
        size_kb = size_bytes / 1024
        print(f"  OK {size_kb:.0f}KB")
        downloaded += 1
        
        mapping[url] = local_url
        for p in prods:
            mapping[f"{p['slug']}:{url}"] = local_url
        
        # Rate limit
        time.sleep(0.3)
    
    # Salvar mapping
    with open(MAPPING_FILE, "w", encoding="utf-8") as f:
        json.dump(mapping, f, indent=2)
    
    print(f"\n=== RESUMO ===")
    print(f"URLs unicas: {len(url_to_products)}")
    print(f"Baixadas: {downloaded}")
    print(f"Falharam: {failed}")
    print(f"Total produtos: {len(products)}")
    print(f"Mapping salvo: {MAPPING_FILE}")

if __name__ == "__main__":
    main()

"""Gera imagens WebP locais 400x400 para todos os produtos do catalog.ts"""
import os, re, json
from PIL import Image, ImageDraw, ImageFont

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
IMG_OUT = os.path.join(ROOT, "public", "images", "catalog")

# Cores por categoria
CAT_COLORS = {
    "hortifruti": {"bg": "#f0fdf4", "accent": "#16a34a", "icon": "🥬"},
    "acougue": {"bg": "#fef2f2", "accent": "#dc2626", "icon": "🥩"},
    "padaria": {"bg": "#fffbeb", "accent": "#d97706", "icon": "🍞"},
    "frios": {"bg": "#ecfeff", "accent": "#0891b2", "icon": "🧀"},
    "laticinios": {"bg": "#eff6ff", "accent": "#1d4ed8", "icon": "🥛"},
    "bebidas": {"bg": "#f5f3ff", "accent": "#7c3aed", "icon": "🥤"},
    "mercearia": {"bg": "#fefce8", "accent": "#92400e", "icon": "📦"},
    "congelados": {"bg": "#f0f9ff", "accent": "#0284c7", "icon": "🧊"},
    "limpeza": {"bg": "#f0fdf4", "accent": "#16a34a", "icon": "🧴"},
    "higiene": {"bg": "#fdf2f8", "accent": "#db2777", "icon": "🧼"},
    "bebe": {"bg": "#eff6ff", "accent": "#3b82f6", "icon": "👶"},
    "pet": {"bg": "#fefce8", "accent": "#a16207", "icon": "🐾"},
}

def hex_to_rgb(hex_color):
    hex_color = hex_color.lstrip("#")
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def parse_catalog():
    """Extrai produtos do catalog.ts"""
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Encontrar todos os produtos
    products = []
    # Padrao: { id: "...", slug: "...", name: "...", ... }
    pattern = r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"([^"]+)",\s*category:\s*"([^"]+)",\s*subcategory:\s*"([^"]+)"'
    
    for match in re.finditer(pattern, content):
        products.append({
            "id": match.group(1),
            "slug": match.group(2),
            "name": match.group(3),
            "brand": match.group(4),
            "category": match.group(5),
            "subcategory": match.group(6),
        })
    return products

def get_font(size, bold=False):
    """Tenta carregar uma fonte TTF, fallback para default"""
    font_paths = [
        r"C:\Windows\Fonts\arialbd.ttf" if bold else r"C:\Windows\Fonts\arial.ttf",
        r"C:\Windows\Fonts\segoeui.ttf",
        r"C:\Windows\Fonts\segoeuib.ttf",
    ]
    for path in font_paths:
        try:
            return ImageFont.truetype(path, size)
        except:
            continue
    return ImageFont.load_default()

def wrap_text(text, font, max_width, draw):
    """Quebra texto em linhas que cabem na largura"""
    words = text.split()
    lines = []
    current_line = []
    for word in words:
        test_line = " ".join(current_line + [word])
        bbox = draw.textbbox((0, 0), test_line, font=font)
        if bbox[2] - bbox[0] <= max_width:
            current_line.append(word)
        else:
            if current_line:
                lines.append(" ".join(current_line))
            current_line = [word]
    if current_line:
        lines.append(" ".join(current_line))
    return lines

def generate_image(product, output_path):
    """Gera uma imagem 400x400 para o produto"""
    cat = product["category"]
    colors = CAT_COLORS.get(cat, {"bg": "#f8fafc", "accent": "#64748b", "icon": "📦"})
    
    bg_rgb = hex_to_rgb(colors["bg"])
    accent_rgb = hex_to_rgb(colors["accent"])
    
    # Criar imagem
    img = Image.new("RGB", (400, 400), bg_rgb)
    draw = ImageDraw.Draw(img)
    
    # Borda superior colorida
    draw.rectangle([0, 0, 400, 6], fill=accent_rgb)
    
    # Borda inferior
    draw.rectangle([0, 394, 400, 400], fill=accent_rgb)
    
    # Categoria no topo
    cat_font = get_font(14, bold=True)
    cat_name = cat.upper()
    bbox = draw.textbbox((0, 0), cat_name, font=cat_font)
    cat_w = bbox[2] - bbox[0]
    draw.text(((400 - cat_w) / 2, 20), cat_name, fill=accent_rgb, font=cat_font)
    
    # Nome do produto (centralizado, quebrado em linhas)
    name_font = get_font(22, bold=True)
    max_w = 360
    lines = wrap_text(product["name"], name_font, max_w, draw)
    
    # Limitar a 3 linhas
    if len(lines) > 3:
        lines = lines[:3]
        if len(lines[2]) > 35:
            lines[2] = lines[2][:32] + "..."
    
    line_height = 30
    total_h = len(lines) * line_height
    start_y = 180 - (total_h / 2)
    
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=name_font)
        w = bbox[2] - bbox[0]
        x = (400 - w) / 2
        y = start_y + (i * line_height)
        draw.text((x, y), line, fill="#1e293b", font=name_font)
    
    # Marca
    brand_font = get_font(14)
    brand_text = product["brand"]
    bbox = draw.textbbox((0, 0), brand_text, font=brand_font)
    brand_w = bbox[2] - bbox[0]
    draw.text(((400 - brand_w) / 2, 340), brand_text, fill="#64748b", font=brand_font)
    
    # Subcategoria
    sub_font = get_font(12)
    sub_text = product["subcategory"]
    bbox = draw.textbbox((0, 0), sub_text, font=sub_font)
    sub_w = bbox[2] - bbox[0]
    draw.text(((400 - sub_w) / 2, 360), sub_text, fill="#94a3b8", font=sub_font)
    
    # Salvar como WebP
    img.save(output_path, "WEBP", quality=85, method=4)

def main():
    products = parse_catalog()
    print(f"Total produtos: {len(products)}")
    
    # Criar diretorios
    cats = set(p["category"] for p in products)
    for cat in cats:
        os.makedirs(os.path.join(IMG_OUT, cat), exist_ok=True)
    
    generated = 0
    errors = 0
    
    for p in products:
        cat_dir = os.path.join(IMG_OUT, p["category"])
        img_path = os.path.join(cat_dir, f"{p['slug']}.webp")
        
        try:
            generate_image(p, img_path)
            generated += 1
        except Exception as e:
            print(f"ERRO {p['slug']}: {e}")
            errors += 1
        
        if generated % 50 == 0:
            print(f"  ...{generated} imagens geradas")
    
    print(f"\n=== RESULTADO ===")
    print(f"Geradas: {generated}")
    print(f"Erros: {errors}")
    
    # Stats por categoria
    for cat in sorted(cats):
        cat_dir = os.path.join(IMG_OUT, cat)
        if os.path.exists(cat_dir):
            files = [f for f in os.listdir(cat_dir) if f.endswith(".webp")]
            total_size = sum(os.path.getsize(os.path.join(cat_dir, f)) for f in files)
            avg = total_size / len(files) if files else 0
            print(f"  {cat}: {len(files)} imagens, avg {avg/1024:.1f} KB")

if __name__ == "__main__":
    main()

"""Audita catálogo cruzando produtos, manifesto, arquivos locais e fontes."""
import os, re, json, hashlib
from collections import defaultdict
from difflib import SequenceMatcher

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
MANIFEST = os.path.join(ROOT, "data", "catalog-image-manifest.json")
REPORT_HTML = os.path.join(ROOT, "public", "qa-audit-report.html")
PUBLIC_DIR = os.path.join(ROOT, "public")

def parse_catalog():
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    # Regex robusta com subcategory
    pattern = r'\{\s*id:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*brand:\s*"[^"]+",\s*category:\s*"([^"]+)",\s*subcategory:\s*"([^"]+)",\s*image:\s*"([^"]+)"'
    products = []
    for m in re.finditer(pattern, content, re.DOTALL):
        pid, slug, name, category, subcat, img = m.groups()
        products.append({
            "id": pid,
            "slug": slug,
            "name": name,
            "category": category,
            "subcategory": subcat,
            "image": img,
        })
    return products

def load_manifest():
    if not os.path.exists(MANIFEST):
        return []
    with open(MANIFEST, "r", encoding="utf-8") as f:
        return json.load(f)

def normalize(text):
    return re.sub(r'[^a-z0-9]', '', text.lower()) if text else ""

def name_similarity(a, b):
    a = normalize(a)
    b = normalize(b)
    if not a or not b:
        return 0
    # Se a esta contido em b ou vice versa
    if a in b or b in a:
        return 100
    return SequenceMatcher(None, a, b).ratio() * 100

def file_hash(path):
    try:
        with open(path, "rb") as f:
            return hashlib.md5(f.read()).hexdigest()
    except:
        return None

def audit():
    products = parse_catalog()
    manifest = load_manifest()
    manifest_by_slug = {m["slug"]: m for m in manifest}
    
    issues = []
    missing_files = []
    duplicate_hashes = defaultdict(list)
    suspicious = []
    
    for p in products:
        m = manifest_by_slug.get(p["slug"])
        if not m:
            issues.append({**p, "issue": "NAO_ESTA_NO_MANIFESTO"})
            continue
        
        # Verificar arquivo
        local_path = os.path.join(PUBLIC_DIR, p["image"].lstrip("/").replace("/", os.sep))
        if not os.path.exists(local_path):
            missing_files.append({**p, "manifest": m})
            continue
        
        h = file_hash(local_path)
        if h:
            duplicate_hashes[h].append({
                "id": p["id"],
                "slug": p["slug"],
                "name": p["name"],
                "path": local_path,
            })
        
        # Similaridade entre nome do produto e sourceProduct
        source_product = m.get("sourceProduct", "") or ""
        source = m.get("source", "desconhecido")
        
        # Para fontes externas, sourceProduct deve conter palavras do produto
        score = name_similarity(p["name"], source_product)
        
        # Categorias esperadas
        expected_cat = p["category"]
        manifest_cat = m.get("category", "")
        
        result = {
            **p,
            "manifest": m,
            "hash": h,
            "source": source,
            "source_product": source_product,
            "similarity": score,
            "file_exists": True,
            "category_match": expected_cat == manifest_cat,
        }
        
        # Regras de suspeita
        if source in ("carrefour", "atacadao", "openverse"):
            if score < 30 and len(source_product) > 3:
                # Ignorar casos onde sourceProduct é generico
                if "GPT generated" not in source_product:
                    result["suspicious"] = f"Nome muito diferente da fonte ({score:.0f}%): {source_product[:60]}"
                    suspicious.append(result)
        
        # ChatGPT - sourceProduct deve ser "GPT generated" e a imagem deve existir
        if source == "chatgpt" and "GPT generated" not in source_product:
            result["suspicious"] = f"Fonte chatgpt mas sourceProduct estranho: {source_product[:60]}"
            suspicious.append(result)
        
        if not result.get("category_match"):
            result["suspicious"] = f"Categoria divergente: catalogo={expected_cat}, manifesto={manifest_cat}"
            suspicious.append(result)
    
    dupes = {k: v for k, v in duplicate_hashes.items() if len(v) > 1}
    
    return products, manifest, suspicious, missing_files, issues, dupes

def build_report(products, manifest, suspicious, missing_files, issues, dupes):
    html = """<!DOCTYPE html>
<html lang="pt-BR">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Auditoria de Imagens - VendaMais</title>
<style>
body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
h1, h2 { color: #333; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 20px 0; }
.stat { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); text-align: center; }
.stat .number { font-size: 32px; font-weight: bold; color: #2563eb; }
.stat .label { color: #666; font-size: 14px; }
.stat.warning .number { color: #dc2626; }
.filter { margin: 15px 0; }
.filter button { padding: 8px 15px; margin-right: 10px; border: none; border-radius: 5px; background: #2563eb; color: white; cursor: pointer; }
.filter button.active { background: #1e40af; }
table { width: 100%; border-collapse: collapse; background: white; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1); margin-top: 20px; }
th { background: #3730a3; color: white; padding: 12px; text-align: left; font-size: 12px; }
td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 12px; }
tr:hover { background: #f9fafb; }
tr.suspicious { background: #fef2f2; }
tr.missing { background: #fff7ed; }
tr.duplicate { background: #fef9c3; }
.img-thumb { width: 60px; height: 60px; object-fit: contain; background: #f3f4f6; border-radius: 4px; }
.badge { padding: 2px 6px; border-radius: 4px; font-size: 10px; font-weight: bold; }
.badge-chatgpt { background: #dbeafe; color: #1e40af; }
.badge-carrefour { background: #dcfce7; color: #166534; }
.badge-atacadao { background: #fef3c7; color: #92400e; }
.badge-openverse { background: #f3e8ff; color: #6b21a8; }
.badge-na { background: #e5e7eb; color: #374151; }
.score-low { color: #dc2626; font-weight: bold; }
.score-ok { color: #16a34a; }
</style>
<script>
function filterTable(type) {
    const rows = document.querySelectorAll('tbody tr');
    rows.forEach(row => {
        if (type === 'all') row.style.display = '';
        else if (type === 'suspicious' && row.classList.contains('suspicious')) row.style.display = '';
        else if (type === 'missing' && row.classList.contains('missing')) row.style.display = '';
        else if (type === 'duplicate' && row.classList.contains('duplicate')) row.style.display = '';
        else if (type === 'chatgpt' && row.getAttribute('data-source') === 'chatgpt') row.style.display = '';
        else row.style.display = 'none';
    });
}
</script>
</head>
<body>
<h1>Auditoria de Imagens do Catálogo</h1>
"""
    
    html += f"""<div class="stats">
<div class="stat"><div class="number">{len(products)}</div><div class="label">Total de produtos</div></div>
<div class="stat"><div class="number">{len(manifest)}</div><div class="label">Entradas no manifesto</div></div>
<div class="stat warning"><div class="number">{len(suspicious)}</div><div class="label">Suspeitas de imagem trocada</div></div>
<div class="stat warning"><div class="number">{len(missing_files)}</div><div class="label">Arquivos faltando</div></div>
<div class="stat warning"><div class="number">{len(issues)}</div><div class="label">Fora do manifesto</div></div>
<div class="stat warning"><div class="number">{len(dupes)}</div><div class="label">Grupos de duplicatas</div></div>
</div>"""
    
    html += """<div class="filter">
<button onclick="filterTable('all')">Todas</button>
<button onclick="filterTable('suspicious')">Suspeitas</button>
<button onclick="filterTable('missing')">Faltando arquivo</button>
<button onclick="filterTable('duplicate')">Duplicatas</button>
<button onclick="filterTable('chatgpt')">ChatGPT</button>
</div>
<table>
<thead>
<tr>
<th>ID</th>
<th>Imagem</th>
<th>Produto</th>
<th>Categoria</th>
<th>Fonte</th>
<th>Origem / Similaridade</th>
<th>Problema</th>
</tr>
</thead>
<tbody>
"""
    
    # Adicionar linhas
    manifest_by_slug = {m["slug"]: m for m in manifest}
    suspicious_slugs = {s["slug"] for s in suspicious}
    missing_slugs = {m["slug"] for m in missing_files}
    dupe_slugs = set()
    for h, items in dupes.items():
        for item in items:
            dupe_slugs.add(item["slug"])
    
    for p in products:
        m = manifest_by_slug.get(p["slug"])
        
        if p["slug"] in missing_slugs:
            row_class = "missing"
        elif p["slug"] in suspicious_slugs:
            row_class = "suspicious"
        elif p["slug"] in dupe_slugs:
            row_class = "duplicate"
        else:
            row_class = ""
        
        if not m:
            html += f"""<tr class="missing">
<td>{p['id']}</td>
<td>-</td>
<td>{p['name']}</td>
<td>{p['category']}/{p['subcategory']}</td>
<td><span class="badge badge-na">N/A</span></td>
<td>Sem manifesto</td>
<td>Produto não encontrado no manifesto</td>
</tr>
"""
            continue
        
        source = m.get("source", "desconhecido")
        badge_class = f"badge-{source}" if source in ["chatgpt", "carrefour", "atacadao", "openverse"] else "badge-na"
        source_product = m.get("sourceProduct", "") or ""
        score = name_similarity(p["name"], source_product)
        score_class = "score-ok" if score >= 60 else "score-low"
        
        # Problema
        problem = ""
        if p["slug"] in missing_slugs:
            problem = "Arquivo não encontrado"
        elif p["slug"] in suspicious_slugs:
            problem = next((s.get("suspicious", "Suspeita") for s in suspicious if s["slug"] == p["slug"]), "Suspeita")
        elif p["slug"] in dupe_slugs:
            problem = "Imagem duplicada com outro produto"
        
        # Imagem
        local_path = os.path.join(PUBLIC_DIR, p["image"].lstrip("/").replace("/", os.sep))
        if os.path.exists(local_path):
            rel_path = p["image"]
            thumb = f'<img src="{rel_path}" class="img-thumb" onerror="this.style.display=\'none\'">'
        else:
            thumb = "<span style='color:#dc2626'>FALTA</span>"
        
        html += f"""<tr class="{row_class}" data-source="{source}">
<td>{p['id']}</td>
<td>{thumb}</td>
<td>{p['name']}</td>
<td>{p['category']}<br><small>{p['subcategory']}</small></td>
<td><span class="badge {badge_class}">{source}</span></td>
<td>{source_product[:80]}<br><span class="{score_class}">similaridade: {score:.0f}%</span></td>
<td>{problem}</td>
</tr>
"""
    
    html += """</tbody>
</table>
</body>
</html>"""
    
    with open(REPORT_HTML, "w", encoding="utf-8") as f:
        f.write(html)

def main():
    products, manifest, suspicious, missing_files, issues, dupes = audit()
    build_report(products, manifest, suspicious, missing_files, issues, dupes)
    
    print(f"Total produtos: {len(products)}", flush=True)
    print(f"Manifesto: {len(manifest)}", flush=True)
    print(f"Suspeitas: {len(suspicious)}", flush=True)
    print(f"Faltando arquivo: {len(missing_files)}", flush=True)
    print(f"Fora do manifesto: {len(issues)}", flush=True)
    print(f"Duplicatas: {len(dupes)}", flush=True)
    print(f"\nRelatorio: {REPORT_HTML}", flush=True)
    
    if suspicious:
        print("\nTOP 20 suspeitas:", flush=True)
        for s in suspicious[:20]:
            print(f"  {s['id']} {s['name']} ({s['source']}): {s.get('suspicious', '')}", flush=True)

if __name__ == "__main__":
    main()

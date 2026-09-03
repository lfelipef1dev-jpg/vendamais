"""
Atualiza catalog.ts para usar paths de imagens locais em vez de URLs do Unsplash.
Le o image-mapping.json e substitui as URLs no catalog.ts.
"""
import json, os, re

ROOT = r"C:\PROJETOS\EXPOSTACKER\vendamais"
CATALOG = os.path.join(ROOT, "src", "lib", "catalog.ts")
MAPPING_FILE = os.path.join(ROOT, "scripts", "image-mapping.json")

def main():
    with open(MAPPING_FILE, "r", encoding="utf-8") as f:
        mapping = json.load(f)
    
    with open(CATALOG, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Substituir cada URL Unsplash pelo path local
    replacements = 0
    for url, local_path in mapping.items():
        if url.startswith("http"):
            if url in content:
                content = content.replace(url, local_path)
                replacements += 1
    
    with open(CATALOG, "w", encoding="utf-8") as f:
        f.write(content)
    
    print(f"Replacements: {replacements}")
    print(f"Catalog atualizado: {CATALOG}")

if __name__ == "__main__":
    main()

import json
from collections import Counter

m = json.load(open('data/catalog-image-manifest.json', 'r', encoding='utf-8'))
print(f'Total: {len(m)}')
print(f'Aprovados: {len([x for x in m if x["status"] == "approved"])}')
print(f'Revisao: {len([x for x in m if x["status"] == "review"])}')
sources = Counter(x['source'] for x in m)
cats = Counter(x['category'] for x in m)
print(f'Fontes: {dict(sources)}')
print(f'Categorias: {dict(cats)}')

# SKUs sem imagem
import re
content = open('src/lib/catalog.ts', 'r', encoding='utf-8').read()
pattern = r'\{id:\s*"([^"]+)",.*?slug:\s*"([^"]+)",.*?name:\s*"([^"]+)",.*?category:\s*"([^"]+)"'
all_skus = {m[0] for m in re.findall(pattern, content)}
done_skus = {x['sku'] for x in m}
missing = all_skus - done_skus
print(f'\nSKUs sem imagem: {len(missing)}')
for sku in sorted(missing)[:20]:
    print(f'  {sku}')

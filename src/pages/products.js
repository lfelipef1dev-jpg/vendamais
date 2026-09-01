/* VendaMais — PLP (Product Listing Pages) renderer
   Gera produtos.html, categoria-{slug}.html, ofertas.html,
   lancamentos.html, mais-vendidos.html e busca.html. */

/* ---------- Helpers internos ---------- */

const PRICE_RANGES = [
  { label: 'Ate R$ 100', min: 0, max: 100 },
  { label: 'R$ 100 — R$ 300', min: 100, max: 300 },
  { label: 'R$ 300 — R$ 500', min: 300, max: 500 },
  { label: 'R$ 500 — R$ 1.000', min: 500, max: 1000 },
  { label: 'Acima de R$ 1.000', min: 1000, max: Infinity }
];

const RATINGS = [
  { label: '4 estrelas ou mais', value: 4 },
  { label: '3 estrelas ou mais', value: 3 },
  { label: '2 estrelas ou mais', value: 2 }
];

function uniqueTags(products) {
  const set = new Set();
  products.forEach(p => (p.tags || []).forEach(t => set.add(t)));
  return Array.from(set).sort();
}

function priceFilterHTML(T) {
  const opts = PRICE_RANGES.map((r, i) =>
    `<label class="filter-option"><input type="checkbox" name="price" value="${r.min}-${r.max === Infinity ? 'max' : r.max}" data-filter="price"> ${T.escapeHtml(r.label)}</label>`
  ).join('');
  return `<div class="filter-group">
    <h4>Preco</h4>
    ${opts}
  </div>`;
}

function brandFilterHTML(T, products) {
  const tags = uniqueTags(products).slice(0, 12);
  if (!tags.length) return '';
  const chips = tags.map(t =>
    `<label class="filter-option"><input type="checkbox" name="brand" value="${T.escapeHtml(t)}" data-filter="brand"> ${T.escapeHtml(t)}</label>`
  ).join('');
  return `<div class="filter-group">
    <h4>Marca</h4>
    ${chips}
  </div>`;
}

function ratingFilterHTML(T) {
  const opts = RATINGS.map(r =>
    `<label class="filter-option"><input type="checkbox" name="rating" value="${r.value}" data-filter="rating"> ${T.escapeHtml(r.label)}</label>`
  ).join('');
  return `<div class="filter-group">
    <h4>Avaliacao</h4>
    ${opts}
  </div>`;
}

function availabilityFilterHTML(T) {
  return `<div class="filter-group">
    <h4>Disponibilidade</h4>
    <label class="filter-option"><input type="checkbox" name="avail" value="in-stock" data-filter="avail"> Em estoque</label>
    <label class="filter-option"><input type="checkbox" name="avail" value="free-shipping" data-filter="avail"> Frete gratis</label>
  </div>`;
}

function categoryFilterHTML(T, categories) {
  if (!categories || !categories.length) return '';
  const opts = categories.map(c =>
    `<label class="filter-option"><input type="checkbox" name="category" value="${T.escapeHtml(c.id)}" data-filter="category"> ${T.escapeHtml(c.name)}</label>`
  ).join('');
  return `<div class="filter-group">
    <h4>Categoria</h4>
    ${opts}
  </div>`;
}

function filtersSidebar(T, products, categories, showCategoryFilter) {
  const groups = [
    priceFilterHTML(T),
    brandFilterHTML(T, products),
    ratingFilterHTML(T),
    availabilityFilterHTML(T),
    showCategoryFilter ? categoryFilterHTML(T, categories) : ''
  ].filter(Boolean).join('\n');

  return `<aside class="plp-filters" id="plp-filters" aria-label="Filtros">
    <div class="plp-filters-head" style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">
      <h3 style="font-size:var(--fs-base)">${T.ICONS.filter} Filtros</h3>
      <button type="button" class="btn btn-ghost btn-sm" id="clear-filters">Limpar</button>
    </div>
    ${groups}
  </aside>`;
}

function toolbar(T, count) {
  return `<div class="plp-toolbar">
    <span class="plp-count" id="plp-count">${count} produto${count === 1 ? '' : 's'}</span>
    <div class="plp-controls">
      <label for="sort-select" class="sr-only">Ordenar por</label>
      <select id="sort-select" class="search-input" style="width:auto" aria-label="Ordenar por">
        <option value="relevance">Mais relevantes</option>
        <option value="price-asc">Menor preco</option>
        <option value="price-desc">Maior preco</option>
        <option value="rating">Melhor avaliados</option>
        <option value="newest">Lancamentos</option>
      </select>
      <div class="view-toggle" role="group" aria-label="Visualizacao">
        <button type="button" class="active" data-view="grid" aria-label="Visualizar em grade">${T.ICONS.grid}</button>
        <button type="button" data-view="list" aria-label="Visualizar em lista">${T.ICONS.list}</button>
      </div>
    </div>
  </div>`;
}

function productGrid(T, products) {
  const cards = products.map(p => T.renderProductCard(p)).join('');
  return `<div class="plp-grid" id="plp-grid">${cards}</div>`;
}

function emptyState(message) {
  return `<div class="empty-state" style="text-align:center;padding:var(--space-10) 0">
    <p style="font-size:var(--fs-lg);color:var(--text-muted)">${message}</p>
    <a href="produtos.html" class="btn btn-primary">Ver todos os produtos</a>
  </div>`;
}

/* ---------- PLP page builder ---------- */

function buildPLP(opts) {
  const { T, store, data, title, description, canonical, active, products, breadcrumb, showCategoryFilter, noindex, heading } = opts;
  const categories = data.categories || [];
  const count = products.length;

  const content = `${breadcrumb}
<div class="container section-sm">
  <div style="margin-bottom:var(--space-4)">
    <h1 style="font-size:var(--fs-3xl)">${T.escapeHtml(heading || title)}</h1>
    ${description ? '<p style="color:var(--text-secondary);max-width:700px">' + T.escapeHtml(description) + '</p>' : ''}
  </div>
  <div class="plp-layout">
    ${filtersSidebar(T, products, categories, showCategoryFilter)}
    <div class="plp-content">
      ${toolbar(T, count)}
      ${count > 0 ? productGrid(T, products) : emptyState('Nenhum produto encontrado nesta selecao.')}
    </div>
  </div>
</div>`;

  return T.renderLayout({
    store,
    data,
    title,
    description,
    canonical,
    active,
    content,
    noindex
  });
}

/* ---------- Busca page ---------- */

function buildSearch(opts) {
  const { T, store, data } = opts;
  const categories = data.categories || [];

  const content = `${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Busca' }])}
<div class="container section">
  <div style="max-width:700px;margin:0 auto var(--space-6);text-align:center">
    <h1 style="font-size:var(--fs-3xl);margin-bottom:var(--space-2)">Buscar produtos</h1>
    <p style="color:var(--text-secondary)">Digite um termo ou use os filtros para encontrar o que precisa.</p>
  </div>
  <form role="search" action="busca.html" method="get" class="search-form" style="max-width:600px;margin:0 auto var(--space-6);display:flex;gap:var(--space-2)">
    <input type="search" name="q" placeholder="Buscar por produto, categoria ou tag..." aria-label="Termo de busca" class="search-input" id="search-input" autocomplete="off">
    <button type="submit" class="btn btn-primary" aria-label="Buscar">${T.ICONS.search} Buscar</button>
  </form>
  <div id="search-results" class="grid grid-auto" aria-live="polite"></div>
  <div id="search-empty" hidden style="text-align:center;padding:var(--space-8) 0">
    <p style="font-size:var(--fs-lg);color:var(--text-muted)">Nenhum resultado. Tente outro termo.</p>
  </div>
</div>`;

  return T.renderLayout({
    store,
    data,
    title: 'Busca',
    description: 'Busque produtos na loja ' + store.name + '.',
    canonical: '/busca.html',
    active: '',
    content,
    noindex: true
  });
}

/* ---------- Render ---------- */

function render(data, T) {
  const store = data.store;
  const categories = data.categories || [];
  const products = data.products || [];
  const pages = [];

  // produtos.html — todos os produtos
  pages.push({
    filename: 'produtos.html',
    slug: 'produtos',
    noindex: false,
    html: buildPLP({
      T, store, data,
      title: 'Produtos',
      description: 'Todos os produtos da ' + store.name + ' — tecnologia, casa, moda e acessorios.',
      canonical: '/produtos.html',
      active: 'produtos',
      products,
      breadcrumb: T.renderBreadcrumb([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Produtos' }
      ]),
      showCategoryFilter: true,
      heading: 'Todos os produtos'
    })
  });

  // categoria-{slug}.html — por categoria
  categories.forEach(cat => {
    const catProducts = products.filter(p => p.category === cat.id);
    pages.push({
      filename: 'categoria-' + cat.slug + '.html',
      slug: 'categoria-' + cat.slug,
      noindex: false,
      html: buildPLP({
        T, store, data,
        title: cat.name,
        description: cat.description,
        canonical: '/categoria-' + cat.slug + '.html',
        active: 'categorias',
        products: catProducts,
        breadcrumb: T.renderBreadcrumb([
          { label: 'Inicio', href: 'index.html' },
          { label: 'Produtos', href: 'produtos.html' },
          { label: cat.name }
        ]),
        showCategoryFilter: false,
        heading: cat.name
      })
    });
  });

  // ofertas.html
  const offers = products.filter(p => p.isOffer);
  pages.push({
    filename: 'ofertas.html',
    slug: 'ofertas',
    noindex: false,
    html: buildPLP({
      T, store, data,
      title: 'Ofertas',
      description: 'Produtos em promocao com desconto na ' + store.name + '.',
      canonical: '/ofertas.html',
      active: 'ofertas',
      products: offers,
      breadcrumb: T.renderBreadcrumb([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Ofertas' }
      ]),
      showCategoryFilter: false,
      heading: 'Ofertas'
    })
  });

  // lancamentos.html
  const launches = products.filter(p => p.isNew);
  pages.push({
    filename: 'lancamentos.html',
    slug: 'lancamentos',
    noindex: false,
    html: buildPLP({
      T, store, data,
      title: 'Lancamentos',
      description: 'Novidades que acabaram de chegar na ' + store.name + '.',
      canonical: '/lancamentos.html',
      active: 'lancamentos',
      products: launches,
      breadcrumb: T.renderBreadcrumb([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Lancamentos' }
      ]),
      showCategoryFilter: false,
      heading: 'Lancamentos'
    })
  });

  // mais-vendidos.html
  const bestsellers = products.filter(p => p.badge === 'bestseller');
  pages.push({
    filename: 'mais-vendidos.html',
    slug: 'mais-vendidos',
    noindex: false,
    html: buildPLP({
      T, store, data,
      title: 'Mais vendidos',
      description: 'Os produtos mais vendidos da ' + store.name + '.',
      canonical: '/mais-vendidos.html',
      active: '',
      products: bestsellers,
      breadcrumb: T.renderBreadcrumb([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Mais vendidos' }
      ]),
      showCategoryFilter: false,
      heading: 'Mais vendidos'
    })
  });

  // busca.html — noindex
  pages.push({
    filename: 'busca.html',
    slug: 'busca',
    noindex: true,
    html: buildSearch({ T, store, data })
  });

  return pages;
}

module.exports = { render };

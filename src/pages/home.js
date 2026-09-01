/* VendaMais — Home page renderer
   Gera index.html com hero, categorias, mais vendidos, ofertas,
   compre por necessidade, lancamentos, beneficios, recentes e newsletter. */

/* ---------- Helpers internos ---------- */

function heroSection(T, store) {
  return `<section class="hero">
  <div class="container hero-inner">
    <div class="hero-content">
      <h1>Tecnologia, casa e lifestyle em <span>um so lugar</span></h1>
      <p>${T.escapeHtml(store.tagline)}. Curtas, fones, relogios, moda e mais — com PIX, cartao e frete gratis acima de R$ 200.</p>
      <div class="hero-cta">
        <a href="produtos.html" class="btn btn-primary btn-lg">${T.ICONS.cart} Ver produtos</a>
        <a href="ofertas.html" class="btn btn-secondary btn-lg">${T.ICONS.tag} Ofertas</a>
      </div>
    </div>
    <div class="hero-image">
      <img src="hero-home.jpg" alt="${T.escapeHtml(store.name)} — tecnologia, casa e lifestyle" width="800" height="600" loading="eager" fetchpriority="high">
    </div>
  </div>
</section>`;
}

function categoriesSection(T, categories) {
  const cards = categories.slice(0, 4).map(c => {
    const icon = T.ICONS[c.icon] || T.ICONS.package;
    return `<a href="categoria-${c.slug}.html" class="category-card" data-cat="${c.slug}">
      <span class="category-card-icon">${icon}</span>
      <h3>${T.escapeHtml(c.name)}</h3>
      <p>${T.escapeHtml(c.description)}</p>
    </a>`;
  }).join('');

  return `<section class="section">
  <div class="container">
    <div class="section-header">
      <h2>Categorias</h2>
      <p>Navegue por categoria e encontre o que precisa</p>
    </div>
    <div class="category-grid">${cards}</div>
  </div>
</section>`;
}

function productRail(T, title, description, products, viewAllHref, limit) {
  const items = (limit ? products.slice(0, limit) : products).map(p => T.renderProductCard(p)).join('');
  return `<section class="section">
  <div class="container">
    <div class="section-header" style="display:flex;justify-content:space-between;align-items:flex-end;text-align:left;flex-wrap:wrap;gap:var(--space-2)">
      <div>
        <h2>${T.escapeHtml(title)}</h2>
        ${description ? '<p>' + T.escapeHtml(description) + '</p>' : ''}
      </div>
      ${viewAllHref ? '<a href="' + viewAllHref + '" class="btn btn-ghost btn-sm">Ver todos ' + T.ICONS.arrow + '</a>' : ''}
    </div>
    <div class="grid grid-auto">${items}</div>
  </div>
</section>`;
}

function promoBanner(T) {
  return `<section class="section-sm">
  <div class="container">
    <div class="promo-banner">
      <h2>Ofertas da semana — ate 40% OFF</h2>
      <p>Selecao de produtos com desconto por tempo limitado. Aproveite enquanto durar.</p>
      <a href="ofertas.html" class="btn btn-lg">Ver ofertas ${T.ICONS.arrow}</a>
    </div>
  </div>
</section>`;
}

function needsSection(T) {
  const needs = [
    { slug: 'home-office', label: 'Home office', icon: T.ICONS.device },
    { slug: 'viagem', label: 'Viagem', icon: T.ICONS.bag },
    { slug: 'fitness', label: 'Fitness', icon: T.ICONS.shirt },
    { slug: 'casa-inteligente', label: 'Casa inteligente', icon: T.ICONS.home },
    { slug: 'presentes', label: 'Presentes', icon: T.ICONS.tag }
  ];
  const cards = needs.map(n =>
    `<a href="busca.html?need=${n.slug}" class="need-card">
      <div class="need-card-icon">${n.icon}</div>
      ${T.escapeHtml(n.label)}
    </a>`
  ).join('');

  return `<section class="section">
  <div class="container">
    <div class="section-header">
      <h2>Compre por necessidade</h2>
      <p>Atalhos para encontrar produtos para cada momento</p>
    </div>
    <div class="need-grid">${cards}</div>
  </div>
</section>`;
}

function benefitsSection(T, benefits) {
  const cards = (benefits || []).slice(0, 4).map(b => {
    const icon = T.ICONS[b.icon] || T.ICONS.shield;
    return `<div class="benefit-card">
      <span class="benefit-icon">${icon}</span>
      <div>
        <h4>${T.escapeHtml(b.title)}</h4>
        <p>${T.escapeHtml(b.desc)}</p>
      </div>
    </div>`;
  }).join('');

  return `<section class="section-sm">
  <div class="container">
    <div class="benefits-grid">${cards}</div>
  </div>
</section>`;
}

function recentSection() {
  return `<section class="section" id="recent-section" hidden>
  <div class="container">
    <div class="section-header">
      <h2>Vistos recentemente</h2>
      <p>Continue de onde parou</p>
    </div>
    <div id="recent-products" class="grid grid-auto"></div>
  </div>
</section>`;
}

function newsletterSection() {
  return `<section class="section">
  <div class="container">
    <div class="newsletter">
      <h2>Receba ofertas exclusivas</h2>
      <p>Cadastre seu e-mail e seja o primeiro a saber de promocoes e lancamentos.</p>
      <form class="newsletter-form" id="newsletter-form" novalidate>
        <input type="email" name="email" placeholder="Seu melhor e-mail" aria-label="E-mail" class="search-input" required>
        <button type="submit" class="btn btn-primary">Assinar</button>
      </form>
      <p class="form-feedback" id="newsletter-feedback" role="status" hidden></p>
    </div>
  </div>
</section>`;
}

/* ---------- Render ---------- */

function render(data, T) {
  const store = data.store;
  const categories = data.categories || [];
  const products = data.products || [];

  const bestsellers = products.filter(p => p.badge === 'bestseller');
  const offers = products.filter(p => p.isOffer).slice(0, 8);
  const launches = products.filter(p => p.isNew);

  const content = [
    heroSection(T, store),
    categoriesSection(T, categories),
    productRail(T, 'Mais vendidos', 'Os queridinhos da nossa comunidade', bestsellers, 'mais-vendidos.html', 8),
    promoBanner(T),
    productRail(T, 'Ofertas', 'Produtos em promocao agora', offers, 'ofertas.html', 8),
    needsSection(T),
    productRail(T, 'Lancamentos', 'Novidades que acabaram de chegar', launches, 'lancamentos.html', 8),
    benefitsSection(T, store.benefits),
    recentSection(),
    newsletterSection()
  ].join('\n');

  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': store.url + '/#website',
        'url': store.url + '/',
        'name': store.name,
        'description': store.description,
        'inLanguage': 'pt-BR',
        'publisher': { '@id': store.url + '/#organization' }
      },
      {
        '@type': 'Organization',
        '@id': store.url + '/#organization',
        'name': store.name,
        'url': store.url,
        'description': store.description,
        'email': store.contact && store.contact.email,
        'telephone': store.contact && store.contact.phone,
        'address': store.contact ? {
          '@type': 'PostalAddress',
          'streetAddress': store.contact.address
        } : undefined,
        'sameAs': store.social ? [store.social.instagram, store.social.facebook].filter(Boolean) : []
      }
    ]
  };

  const html = T.renderLayout({
    store,
    data,
    title: null,
    description: store.description,
    canonical: '/',
    active: 'home',
    content,
    structuredData
  });

  return [{
    filename: 'index.html',
    slug: 'index',
    noindex: false,
    html
  }];
}

module.exports = { render };

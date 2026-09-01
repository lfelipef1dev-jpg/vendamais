/* VendaMais — PDP (Product Detail Page)
   Gera uma pagina estatica por produto: produto-{slug}.html */

function categoryName(data, categoryId) {
  const cat = (data.categories || []).find(c => c.id === categoryId || c.slug === categoryId);
  return cat ? cat.name : categoryId;
}

function categorySlug(data, categoryId) {
  const cat = (data.categories || []).find(c => c.id === categoryId || c.slug === categoryId);
  return cat ? cat.slug : categoryId;
}

function findProduct(data, id) {
  return (data.products || []).find(p => p.id === id);
}

function buildGallery(product, T) {
  const images = product.images && product.images.length ? product.images : ['placeholder.jpg'];
  const mainImg = images[0];
  const thumbs = images.map((img, i) =>
    '<button type="button" class="pdp-thumb' + (i === 0 ? ' active' : '') + '" data-img="' + T.escapeHtml(img) + '" aria-label="Imagem ' + (i + 1) + '">' +
      '<img src="' + T.escapeHtml(img) + '" alt="' + T.escapeHtml(product.name) + ' — foto ' + (i + 1) + '" width="72" height="72" loading="lazy">' +
    '</button>'
  ).join('');

  return '<div class="pdp-gallery">' +
    '<div class="pdp-gallery-main">' +
      '<img src="' + T.escapeHtml(mainImg) + '" alt="' + T.escapeHtml(product.name) + '" id="pdp-main-img" width="600" height="600">' +
    '</div>' +
    '<div class="pdp-gallery-thumbs">' + thumbs + '</div>' +
  '</div>';
}

function buildPrice(product, T) {
  const parts = [];
  if (product.originalPrice && product.originalPrice > product.price) {
    parts.push('<span class="price-original">' + T.formatPrice(product.originalPrice) + '</span>');
  }
  parts.push('<span class="price-current">' + T.formatPrice(product.price) + '</span>');
  if (product.pixPrice) {
    parts.push('<span class="price-pix">' + T.ICONS.pix + ' PIX: ' + T.formatPrice(product.pixPrice) + '</span>');
  }
  if (product.installments) {
    parts.push('<span class="price-installments">' + T.escapeHtml(product.installments) + ' sem juros</span>');
  }
  return '<div class="pdp-price">' + parts.join('') + '</div>';
}

function buildVariations(product, T) {
  const variations = product.variations || {};
  const groups = Object.keys(variations);
  if (!groups.length) return '';

  const html = groups.map(name => {
    const options = variations[name] || [];
    const btns = options.map((opt, i) =>
      '<button type="button" class="pdp-variation-btn' + (i === 0 ? ' selected' : '') + '" data-variation="' + T.escapeHtml(name) + '" data-value="' + T.escapeHtml(opt) + '">' + T.escapeHtml(opt) + '</button>'
    ).join('');
    return '<div class="pdp-variations">' +
      '<div class="pdp-variation-label">' + T.escapeHtml(name) + '</div>' +
      '<div class="pdp-variation-options">' + btns + '</div>' +
    '</div>';
  }).join('');

  return html;
}

function buildQty(T) {
  return '<div class="pdp-qty">' +
    '<button type="button" class="pdp-qty-btn" id="pdp-qty-minus" aria-label="Diminuir quantidade">' + T.ICONS.minus + '</button>' +
    '<input type="number" class="pdp-qty-input" id="pdp-qty" value="1" min="1" max="99" inputmode="numeric" aria-label="Quantidade">' +
    '<button type="button" class="pdp-qty-btn" id="pdp-qty-plus" aria-label="Aumentar quantidade">' + T.ICONS.plus + '</button>' +
  '</div>';
}

function buildCEP(T) {
  return '<div class="pdp-cep">' +
    '<input type="text" class="input" id="pdp-cep-input" placeholder="Digite seu CEP" inputmode="numeric" maxlength="9" aria-label="CEP para calculo de frete">' +
    '<button type="button" class="btn btn-secondary" id="pdp-cep-btn">Calcular</button>' +
  '</div>' +
  '<div class="pdp-cep-result" id="pdp-cep-result"></div>';
}

function buildCTAs(product, T) {
  return '<div class="pdp-cta">' +
    '<button type="button" class="btn btn-primary btn-lg" data-product-id="' + product.id + '" onclick="VendaMais.buyNow(\'' + product.id + '\')">' + T.ICONS.cart + ' Comprar agora</button>' +
    '<button type="button" class="btn btn-secondary btn-lg" data-product-id="' + product.id + '" onclick="VendaMais.addToCart(\'' + product.id + '\')">' + T.ICONS.bag + ' Adicionar ao carrinho</button>' +
  '</div>' +
  '<button type="button" class="btn btn-ghost" id="pdp-fav-btn" data-product-id="' + product.id + '" onclick="VendaMais.toggleFavorite(\'' + product.id + '\')">' + T.ICONS.heart + ' Favoritar</button>';
}

function buildTabs(product, T) {
  const specsHTML = (product.specs && product.specs.length)
    ? '<div class="pdp-specs">' + product.specs.map(s =>
        '<div class="pdp-spec-row"><span>' + T.escapeHtml(s.label) + '</span><span>' + T.escapeHtml(s.value) + '</span></div>'
      ).join('') + '</div>'
    : '<p>Sem especificacoes cadastradas.</p>';

  const inBoxHTML = (product.inBox && product.inBox.length)
    ? '<ul>' + product.inBox.map(item => '<li>' + T.escapeHtml(item) + '</li>').join('') + '</ul>'
    : '<p>Conteudo nao informado.</p>';

  const warrantyHTML = product.warranty
    ? '<p>' + T.escapeHtml(product.warranty) + '</p>'
    : '<p>Garantia nao informada.</p>';

  const faqHTML = (product.faq && product.faq.length)
    ? product.faq.map(item =>
        '<div class="faq-item">' +
          '<button type="button" class="faq-question">' + T.escapeHtml(item.q) + T.ICONS.chevronDown + '</button>' +
          '<div class="faq-answer"><p>' + T.escapeHtml(item.a) + '</p></div>' +
        '</div>'
      ).join('')
    : '<p>Sem perguntas frequentes cadastradas.</p>';

  return '<div class="pdp-tabs">' +
    '<div class="tabs" role="tablist">' +
      '<button type="button" class="tab active" role="tab" data-tab="descricao">Descricao</button>' +
      '<button type="button" class="tab" role="tab" data-tab="especificacoes">Especificacoes</button>' +
      '<button type="button" class="tab" role="tab" data-tab="inbox">O que vem na caixa</button>' +
      '<button type="button" class="tab" role="tab" data-tab="garantia">Garantia</button>' +
      '<button type="button" class="tab" role="tab" data-tab="faq">FAQ</button>' +
    '</div>' +
    '<div class="pdp-tab-content" id="tab-descricao"><p>' + T.escapeHtml(product.description || product.shortDesc || '') + '</p></div>' +
    '<div class="pdp-tab-content" id="tab-especificacoes" hidden>' + specsHTML + '</div>' +
    '<div class="pdp-tab-content" id="tab-inbox" hidden>' + inBoxHTML + '</div>' +
    '<div class="pdp-tab-content" id="tab-garantia" hidden>' + warrantyHTML + '</div>' +
    '<div class="pdp-tab-content" id="tab-faq" hidden>' + faqHTML + '</div>' +
  '</div>';
}

function buildRelated(product, data, T) {
  const relatedIds = product.related || [];
  const related = relatedIds.map(id => findProduct(data, id)).filter(Boolean);
  if (!related.length) return '';

  const cards = related.map(p => T.renderProductCard(p)).join('');
  return '<section class="pdp-related">' +
    '<h2 class="section-title">Produtos relacionados</h2>' +
    '<div class="plp-grid">' + cards + '</div>' +
  '</section>';
}

function buildStructuredData(product, data, T) {
  const store = data.store;
  const catSlug = categorySlug(data, product.category);
  const images = (product.images || []).map(img => store.url + '/' + img);
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    'name': product.name,
    'image': images,
    'description': product.description || product.shortDesc || '',
    'sku': product.sku || product.id,
    'brand': { '@type': 'Brand', 'name': store.name },
    'category': categoryName(data, product.category),
    'offers': {
      '@type': 'Offer',
      'url': store.url.replace(/\/$/,'') + '/produto-' + product.slug,
      'priceCurrency': 'BRL',
      'price': Number(product.price).toFixed(2),
      'priceValidUntil': '2026-12-31',
      'availability': product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      'itemCondition': 'https://schema.org/NewCondition',
      'seller': { '@type': 'Organization', 'name': store.name }
    }
  };
}

function renderProductPage(product, data, T) {
  const store = data.store;
  const catName = categoryName(data, product.category);
  const catSlug = categorySlug(data, product.category);

  const breadcrumb = T.renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: 'Produtos', href: 'produtos.html' },
    { label: catName, href: 'categoria-' + catSlug + '.html' },
    { label: product.name }
  ]);

  const gallery = buildGallery(product, T);
  const rating = '<div class="pdp-rating">' +
    T.starsHTML(product.rating) +
    '<span class="review-count">(' + product.reviewCount + ' avaliacoes)</span>' +
    '<span class="badge badge-status confirmed">Demo</span>' +
  '</div>';

  const info = '<div class="pdp-info">' +
    '<h1>' + T.escapeHtml(product.name) + '</h1>' +
    rating +
    buildPrice(product, T) +
    buildVariations(product, T) +
    buildQty(T) +
    buildCEP(T) +
    buildCTAs(product, T) +
  '</div>';

  const sticky = '<div class="pdp-sticky-mobile">' +
    '<span class="price-current">' + T.formatPrice(product.price) + '</span>' +
    '<button type="button" class="btn btn-primary" data-product-id="' + product.id + '" onclick="VendaMais.buyNow(\'' + product.id + '\')">Comprar</button>' +
  '</div>';

  const content = '<div class="container">' +
    breadcrumb +
    '<div class="pdp-layout">' +
      gallery +
      info +
    '</div>' +
    buildTabs(product, T) +
    buildRelated(product, data, T) +
    sticky +
  '</div>';

  const html = T.renderLayout({
    store: store,
    data: data,
    title: product.name + ' — Comprar com PIX e Cartao',
    description: (product.shortDesc || product.description || '').substring(0, 155),
    canonical: '/produto-' + product.slug + '.html',
    ogType: 'product',
    active: 'produtos',
    structuredData: [buildStructuredData(product, data, T), T.renderBreadcrumbSchema([
      { label: 'Home', href: 'index.html' },
      { label: 'Produtos', href: 'produtos.html' },
      { label: catName, href: 'categoria-' + catSlug + '.html' },
      { label: product.name }
    ], store.url)],
    content: content
  });

  return { filename: 'produto-' + product.slug + '.html', slug: 'produto-' + product.slug, noindex: false, html: html };
}

function render(data, T) {
  const products = data.products || [];
  return products.map(p => renderProductPage(p, data, T));
}

module.exports = { render };

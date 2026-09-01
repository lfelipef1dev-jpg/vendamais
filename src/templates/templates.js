/* VendaMais — Templates compartilhados
   Head, header, footer, icones, helpers */

const ICONS = {
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
  heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
  user: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>',
  truck: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/><path d="M15 18H9"/><path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/><circle cx="17" cy="18" r="2"/><circle cx="7" cy="18" r="2"/></svg>',
  shield: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10"/></svg>',
  refresh: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M3 21v-5h5"/></svg>',
  pix: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 2 2 12l10 10 10-10z"/><path d="M7 7l5 5 5-5"/><path d="M7 17l5-5 5 5"/></svg>',
  card: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/></svg>',
  check: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>',
  arrow: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="m12 5 7 7-7 7"/></svg>',
  star: '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  starOutline: '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
  device: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="14" height="20" x="5" y="2" rx="2" ry="2"/><path d="M12 18h.01"/></svg>',
  home: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>',
  shirt: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>',
  bag: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>',
  grid: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/></svg>',
  list: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" x2="21" y1="6" y2="6"/><line x1="8" x2="21" y1="12" y2="12"/><line x1="8" x2="21" y1="18" y2="18"/><line x1="3" x2="3.01" y1="6" y2="6"/><line x1="3" x2="3.01" y1="12" y2="12"/><line x1="3" x2="3.01" y1="18" y2="18"/></svg>',
  menu: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/></svg>',
  close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>',
  chevronRight: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>',
  chevronDown: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>',
  package: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m7.5 4.27 9 5.15"/><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  chart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 3v18h18"/><path d="M18 17V9"/><path d="M13 17V5"/><path d="M8 17v-3"/></svg>',
  settings: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>',
  tag: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12.586 2.586A2 2 0 0 0 11.172 2H4a2 2 0 0 0-2 2v7.172a2 2 0 0 0 .586 1.414l8.704 8.704a2.426 2.426 0 0 0 3.42 0l6.58-6.58a2.426 2.426 0 0 0 0-3.42z"/><circle cx="7.5" cy="7.5" r=".5" fill="currentColor"/></svg>',
  users: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>',
  box: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z"/><path d="m3.3 7 8.7 5 8.7-5"/><path d="M12 22V12"/></svg>',
  dashboard: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="7" height="9" x="3" y="3" rx="1"/><rect width="7" height="5" x="14" y="3" rx="1"/><rect width="7" height="9" x="14" y="12" rx="1"/><rect width="7" height="5" x="3" y="16" rx="1"/></svg>',
  logout: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" x2="9" y1="12" y2="12"/></svg>',
  mapPin: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>',
  phone: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-10 5L2 7"/></svg>',
  clock: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  filter: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',
  trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',
  plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/><path d="M12 5v14"/></svg>',
  minus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14"/></svg>',
  eye: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>'
};

/* ---------- Helpers ---------- */
function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function formatPrice(value) {
  return 'R$ ' + Number(value).toFixed(2).replace('.', ',');
}

function starsHTML(rating) {
  let html = '<span class="stars" aria-label="Avaliacao demonstrativa ' + rating + ' de 5">';
  for (let i = 1; i <= 5; i++) {
    html += i <= Math.round(rating) ? ICONS.star : ICONS.starOutline;
  }
  html += '</span>';
  return html;
}

function discountPct(price, original) {
  if (!original || original <= price) return 0;
  return Math.round((1 - price / original) * 100);
}

function badgeHTML(product) {
  if (!product.badge) return '';
  const labels = {
    bestseller: 'Mais Vendido',
    'frete-gratis': 'Frete Gratis',
    desconto: '-' + discountPct(product.price, product.originalPrice) + '%'
  };
  return '<span class="badge badge-' + product.badge + '">' + (labels[product.badge] || '') + '</span>';
}

/* ---------- Head ---------- */
function renderHead(opts) {
  const store = opts.store;
  const title = opts.title ? opts.title + ' | ' + store.name : store.name + ' — ' + store.tagline;
  const desc = opts.description || store.description;
  const canonical = store.url.replace(/\/$/, '') + (opts.canonical && opts.canonical !== '/' ? opts.canonical.replace(/\.html$/, '') : '');
  const noindex = opts.noindex ? '<meta name="robots" content="noindex, nofollow">' : '<meta name="robots" content="index, follow">';
  const ogType = opts.ogType || 'website';
  const cssFiles = (opts.cssFiles || ['base.css', 'components.css', 'pages.css']).map(f => '<link rel="stylesheet" href="styles/' + f + '">').join('\n  ');
  const structuredData = opts.structuredData ? (Array.isArray(opts.structuredData) ? opts.structuredData : [opts.structuredData]).map(s => '<script type="application/ld+json">' + JSON.stringify(s) + '</script>').join('\n  ') : '';

  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(desc)}">
  ${noindex}
  <link rel="canonical" href="${canonical}">
  <meta name="theme-color" content="#0F172A">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(desc)}">
  <meta property="og:type" content="${ogType}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="${store.name}">
  <meta property="og:locale" content="pt_BR">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeHtml(title)}">
  <meta name="twitter:description" content="${escapeHtml(desc)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="preload" href="fonts/inter-400-latin.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preload" href="fonts/inter-700-latin.woff2" as="font" type="font/woff2" crossorigin>
  ${cssFiles}
  <link rel="icon" type="image/svg+xml" href="favicon.svg">
  ${structuredData}
</head>`;
}

/* ---------- Announcement bar ---------- */
function renderAnnouncement(store) {
  return `<div class="announcement-bar" role="banner">
  <div class="container">${escapeHtml(store.announcement)}</div>
</div>`;
}

/* ---------- Header ---------- */
function renderHeader(store, categories, opts) {
  opts = opts || {};
  const activeNav = opts.active || '';
  const navLinks = [
    { href: 'index.html', label: 'Inicio', key: 'home' },
    { href: 'produtos.html', label: 'Produtos', key: 'produtos' },
    { href: 'ofertas.html', label: 'Ofertas', key: 'ofertas' },
    { href: 'lancamentos.html', label: 'Lancamentos', key: 'lancamentos' },
    { href: 'sobre.html', label: 'Sobre', key: 'sobre' }
  ].map(l => `<li><a href="${l.href}" class="${activeNav === l.key ? 'active' : ''}">${l.label}</a></li>`).join('');

  const catLinks = categories.map(c =>
    `<li><a href="categoria-${c.slug}.html">${c.name}</a></li>`
  ).join('');

  return `<header class="header" role="banner">
  <div class="container header-inner">
    <a href="index.html" class="logo" aria-label="${store.name} — Inicio">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
      <span>${store.name}</span>
    </a>
    <div class="header-search">
      <form role="search" action="busca.html" method="get" class="search-form">
        <input type="search" name="q" placeholder="Buscar produtos..." aria-label="Buscar produtos" class="search-input" autocomplete="off">
        <button type="submit" class="search-btn" aria-label="Buscar">${ICONS.search}</button>
      </form>
    </div>
    <nav class="header-actions" aria-label="Acoes do usuario">
      <a href="conta.html" class="header-icon-btn" aria-label="Minha conta">${ICONS.user}<span class="hide-mobile">Conta</span></a>
      <a href="favoritos.html" class="header-icon-btn" aria-label="Favoritos">${ICONS.heart}<span class="hide-mobile">Favoritos</span><span class="cart-count" id="fav-count" style="display:none">0</span></a>
      <button class="header-icon-btn cart-toggle" aria-label="Carrinho" id="cart-toggle">${ICONS.cart}<span class="hide-mobile">Carrinho</span><span class="cart-count" id="cart-count" style="display:none">0</span></button>
      <button class="header-mobile-toggle" aria-label="Menu" aria-expanded="false" aria-controls="mobile-nav">${ICONS.menu}</button>
    </nav>
  </div>
  <nav class="header-nav" aria-label="Categorias">
    <div class="container">
      <ul class="nav-list">${navLinks}<li class="nav-dropdown"><a href="produtos.html" class="${activeNav === 'categorias' ? 'active' : ''}">Categorias ${ICONS.chevronDown}</a><ul class="dropdown-menu">${catLinks}</ul></li></ul>
    </div>
  </nav>
</header>
<div class="mobile-nav" id="mobile-nav" hidden>
  <button class="mobile-nav-close" aria-label="Fechar menu">${ICONS.close}</button>
  <ul>
    <li><a href="index.html">Inicio</a></li>
    <li><a href="produtos.html">Produtos</a></li>
    <li><a href="ofertas.html">Ofertas</a></li>
    <li><a href="lancamentos.html">Lancamentos</a></li>
    ${categories.map(c => '<li><a href="categoria-' + c.slug + '.html">' + c.name + '</a></li>').join('')}
    <li><a href="sobre.html">Sobre</a></li>
    <li><a href="conta.html">Minha conta</a></li>
    <li><a href="favoritos.html">Favoritos</a></li>
  </ul>
</div>
<div class="cart-drawer" id="cart-drawer" hidden>
  <div class="cart-drawer-head">
    <h2>Carrinho</h2>
    <button class="cart-drawer-close" aria-label="Fechar carrinho">${ICONS.close}</button>
  </div>
  <div class="cart-drawer-body" id="cart-drawer-body"></div>
  <div class="cart-drawer-foot" id="cart-drawer-foot"></div>
</div>
<div class="overlay" id="overlay" hidden></div>`;
}

/* ---------- Footer ---------- */
function renderFooter(store) {
  return `<footer class="footer" role="contentinfo">
  <div class="container footer-grid">
    <div class="footer-col">
      <div class="footer-logo">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        <span>${store.name}</span>
      </div>
      <p class="footer-tagline">${escapeHtml(store.tagline)}</p>
      <p class="footer-disclaimer">${escapeHtml(store.demoDisclaimer)}</p>
    </div>
    <div class="footer-col">
      <h3>Loja</h3>
      <ul>
        <li><a href="produtos.html">Todos os produtos</a></li>
        <li><a href="ofertas.html">Ofertas</a></li>
        <li><a href="lancamentos.html">Lancamentos</a></li>
        <li><a href="mais-vendidos.html">Mais vendidos</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Ajuda</h3>
      <ul>
        <li><a href="entrega.html">Entrega</a></li>
        <li><a href="trocas-devolucoes.html">Trocas e devolucoes</a></li>
        <li><a href="pagamentos.html">Pagamentos</a></li>
        <li><a href="faq.html">FAQ</a></li>
        <li><a href="contato.html">Contato</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Institucional</h3>
      <ul>
        <li><a href="sobre.html">Sobre nos</a></li>
        <li><a href="privacidade.html">Privacidade</a></li>
        <li><a href="termos.html">Termos de uso</a></li>
      </ul>
    </div>
    <div class="footer-col">
      <h3>Contato</h3>
      <ul>
        <li>${ICONS.phone} ${store.contact.phone}</li>
        <li>${ICONS.mail} ${store.contact.email}</li>
        <li>${ICONS.mapPin} ${store.contact.address}</li>
      </ul>
    </div>
  </div>
  <div class="footer-bottom">
    <div class="container">
      <p>&copy; 2026 ${store.name} — Demonstracao. Dados ficticios. Nao utilizar para compras reais.</p>
    </div>
  </div>
</footer>`;
}

/* ---------- Layout completo ---------- */
function renderLayout(opts) {
  const store = opts.store;
  const data = opts.data;
  const head = renderHead(opts);
  const announcement = renderAnnouncement(store);
  const header = renderHeader(store, data.categories || [], opts);
  const footer = renderFooter(store);
  const jsFiles = (opts.jsFiles || ['app.js']).map(f => '<script src="scripts/' + f + '" defer></script>').join('\n  ');
  const dataScript = '<script>window.VENDAMAIS_PRODUCTS = ' + JSON.stringify(data.products || []).replace(/</g, '\\u003c') + '; window.VENDAMAIS_CATEGORIES = ' + JSON.stringify(data.categories || []).replace(/</g, '\\u003c') + '; window.VENDAMAIS_ORDERS = ' + JSON.stringify(data.orders || []).replace(/</g, '\\u003c') + ';</script>';

  return `${head}
<body>
  <a href="#conteudo" class="skip-link">Pular para o conteudo</a>
  ${announcement}
  ${header}
  <main id="conteudo" role="main">
    ${opts.content}
  </main>
  ${footer}
  ${opts.scripts || ''}
  ${dataScript}
  ${jsFiles}
</body>
</html>`;
}

/* ---------- Breadcrumb ---------- */
function renderBreadcrumb(items) {
  const list = items.map((item, i) => {
    const isLast = i === items.length - 1;
    return '<li' + (isLast ? ' aria-current="page"' : '') + '>' +
      (item.href && !isLast ? '<a href="' + item.href + '">' + escapeHtml(item.label) + '</a>' : escapeHtml(item.label)) +
      '</li>';
  }).join('');
  return '<nav class="breadcrumb" aria-label="Navegacao"><ol class="breadcrumb-list">' + list + '</ol></nav>';
}

/* ---------- BreadcrumbList schema (JSON-LD) ---------- */
function renderBreadcrumbSchema(items, storeUrl) {
  const base = storeUrl.replace(/\/$/, '');
  const itemListElement = items.map((item, i) => {
    const url = item.href ? base + '/' + item.href.replace(/^https?:\/\/[^/]+/, '').replace(/\.html$/, '') : '';
    return {
      '@type': 'ListItem',
      position: i + 1,
      name: item.label,
      ...(url ? { item: url } : {})
    };
  });
  return { '@type': 'BreadcrumbList', itemListElement };
}

/* ---------- Product card ---------- */
function renderProductCard(p) {
  const href = 'produto-' + p.slug + '.html';
  const img = p.images && p.images[0] ? p.images[0] : 'placeholder.jpg';
  const discount = discountPct(p.price, p.originalPrice);
  return `<article class="product-card">
  <a href="${href}" class="product-card-link">
    <div class="product-card-img">
      <img src="${img}" alt="${escapeHtml(p.name)}" width="300" height="300" loading="lazy" decoding="async">
      ${badgeHTML(p)}
      <button class="product-card-fav" aria-label="Favoritar" data-product-id="${p.id}" onclick="event.preventDefault();event.stopPropagation();VendaMais.toggleFavorite('${p.id}')">${ICONS.heart}</button>
    </div>
    <div class="product-card-info">
      <h3 class="product-card-name">${escapeHtml(p.name)}</h3>
      <div class="product-card-rating">${starsHTML(p.rating)} <span class="review-count">(${p.reviewCount})</span></div>
      <div class="product-card-price">
        ${p.originalPrice ? '<span class="price-original">' + formatPrice(p.originalPrice) + '</span>' : ''}
        <span class="price-current">${formatPrice(p.price)}</span>
        ${p.installments ? '<span class="price-installments">' + p.installments + '</span>' : ''}
      </div>
    </div>
  </a>
  <button class="btn btn-primary btn-sm btn-block product-card-add" data-product-id="${p.id}" onclick="VendaMais.addToCart('${p.id}')">${ICONS.cart} Adicionar</button>
</article>`;
}

module.exports = {
  ICONS,
  escapeHtml,
  formatPrice,
  starsHTML,
  discountPct,
  badgeHTML,
  renderHead,
  renderAnnouncement,
  renderHeader,
  renderFooter,
  renderLayout,
  renderBreadcrumb,
  renderBreadcrumbSchema,
  renderProductCard
};

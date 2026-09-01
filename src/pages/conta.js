/* VendaMais — Paginas da conta do cliente
   Login, dashboard, pedidos, pedido detalhe, favoritos,
   enderecos, dados pessoais e rastreio.
   Ambiente demonstrativo — dados ficticios. */

const STATUS_LABELS = {
  placed: 'Pedido realizado',
  paid: 'Pagamento aprovado',
  separating: 'Separando produtos',
  in_transit: 'Em transporte',
  out_for_delivery: 'Saiu para entrega',
  delivered: 'Entregue',
  cancelled: 'Cancelado'
};

function statusLabel(status) {
  return STATUS_LABELS[status] || status;
}

function initials(name) {
  if (!name) return '?';
  const parts = name.trim().split(/\s+/);
  return (parts[0][0] + (parts[1] ? parts[1][0] : '')).toUpperCase();
}

/* ---------- Sidebar compartilhado ---------- */
function contaSidebar(user, active) {
  const menu = [
    { href: 'conta.html', label: 'Visao geral', icon: 'dashboard', key: 'conta' },
    { href: 'conta-pedidos.html', label: 'Pedidos', icon: 'package', key: 'pedidos' },
    { href: 'favoritos.html', label: 'Favoritos', icon: 'heart', key: 'favoritos' },
    { href: 'conta-enderecos.html', label: 'Enderecos', icon: 'mapPin', key: 'enderecos' },
    { href: 'conta-dados.html', label: 'Meus dados', icon: 'user', key: 'dados' },
    { href: 'rastreio.html', label: 'Rastreio', icon: 'truck', key: 'rastreio' },
    { href: 'index.html', label: 'Sair', icon: 'logout', key: 'sair' }
  ];
  const items = menu.map(m =>
    '<li><a href="' + m.href + '" class="' + (active === m.key ? 'active' : '') + '">' + (ICONS_REF[m.icon] || '') + '<span>' + m.label + '</span></a></li>'
  ).join('');
  return '<aside class="conta-sidebar">' +
    '<div class="conta-user">' +
      '<div class="conta-user-avatar" aria-hidden="true">' + initials(user.name) + '</div>' +
      '<h3>' + escapeHtml_REF(user.name) + '</h3>' +
      '<p class="text-muted">' + escapeHtml_REF(user.email) + '</p>' +
    '</div>' +
    '<nav aria-label="Menu da conta"><ul class="conta-menu">' + items + '</ul></nav>' +
  '</aside>';
}

/* ---------- KPI card ---------- */
function contaCard(num, label) {
  return '<div class="conta-card"><div class="conta-card-num">' + num + '</div><div class="conta-card-label">' + label + '</div></div>';
}

/* ---------- Order row (lista) ---------- */
function orderRow(order) {
  return '<article class="card card-hover" style="margin-bottom:var(--space-3)">' +
    '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-3)">' +
      '<div>' +
        '<h3 style="font-size:var(--fs-base);margin-bottom:var(--space-1)">' +
          '<a href="conta-pedido.html">Pedido #' + escapeHtml_REF(order.id) + '</a>' +
        '</h3>' +
        '<p class="text-muted" style="font-size:var(--fs-xs)">' + escapeHtml_REF(order.date) + ' &middot; ' + order.items.length + ' item(ns) &middot; ' + formatPrice_REF(order.total) + '</p>' +
      '</div>' +
      '<div style="display:flex;align-items:center;gap:var(--space-3)">' +
        '<span class="badge-status ' + order.status + '">' + statusLabel(order.status) + '</span>' +
        '<a href="conta-pedido.html" class="btn btn-secondary btn-sm">Ver pedido</a>' +
      '</div>' +
    '</div>' +
  '</article>';
}

/* ---------- Timeline item ---------- */
function timelineItem(entry, state) {
  return '<div class="order-timeline-item">' +
    '<div class="order-timeline-dot ' + state + '" aria-hidden="true">' +
      (state === 'done' ? ICONS_REF.check : '') +
    '</div>' +
    '<div class="order-timeline-content">' +
      '<h4>' + escapeHtml_REF(entry.label) + '</h4>' +
      '<p>' + (entry.date ? escapeHtml_REF(entry.date) : 'Pendente') + '</p>' +
    '</div>' +
  '</div>';
}

/* ---------- Tracking step ---------- */
function trackingStep(step, isLast) {
  const state = step.done ? 'done' : (isLast ? 'current' : 'pending');
  return '<div class="tracking-step">' +
    '<div class="tracking-step-icon ' + state + '" aria-hidden="true">' +
      (step.done ? ICONS_REF.check : ICONS_REF.package) +
    '</div>' +
    '<div style="flex:1">' +
      '<p style="font-weight:600">' + escapeHtml_REF(step.label) + '</p>' +
      '<p class="text-muted" style="font-size:var(--fs-xs)">' + (step.date ? escapeHtml_REF(step.date) : 'Aguardando') + '</p>' +
    '</div>' +
  '</div>';
}

/* ---------- Layout wrapper ---------- */
function contaPage(opts) {
  const content = T_REF.renderBreadcrumb(opts.breadcrumb) +
    '<div class="conta-layout">' +
      contaSidebar(opts.user, opts.active) +
      '<div class="conta-main">' + opts.main + '</div>' +
    '</div>';
  return T_REF.renderLayout({
    store: opts.store,
    data: opts.data,
    title: opts.title,
    description: opts.description,
    canonical: opts.canonical,
    noindex: true,
    content: content
  });
}

/* ---------- Variaveis de modulo (setadas em render) ---------- */
var T_REF, ICONS_REF, escapeHtml_REF, formatPrice_REF;

/* ---------- Render principal ---------- */
function render(data, T) {
  T_REF = T;
  ICONS_REF = T.ICONS;
  escapeHtml_REF = T.escapeHtml;
  formatPrice_REF = T.formatPrice;

  const store = data.store;
  const user = data.customers[0];
  const orders = data.orders || [];
  const userOrders = orders.filter(o => o.customerId === user.id);
  const recentOrders = userOrders.slice(0, 3);
  const addresses = user.addresses || [];

  const pages = [];

  /* ===== login.html ===== */
  pages.push({
    filename: 'login.html',
    slug: 'login',
    noindex: true,
    html: T.renderLayout({
      store: store,
      data: data,
      title: 'Entrar',
      description: 'Acesse sua conta VendaMais (demonstracao).',
      canonical: '/login.html',
      noindex: true,
      content: T.renderBreadcrumb([
        { label: 'Inicio', href: 'index.html' },
        { label: 'Entrar' }
      ]) +
      '<section class="section-sm"><div class="container">' +
        '<div class="login-card card">' +
          '<span class="demo-badge">' + ICONS_REF.shield + ' Ambiente demonstrativo</span>' +
          '<h1 style="margin-top:var(--space-4)">Entrar na conta</h1>' +
          '<p>Use qualquer e-mail e senha para acessar a demo.</p>' +
          '<form id="login-form" novalidate>' +
            '<div class="field">' +
              '<label class="label" for="login-email">E-mail</label>' +
              '<input class="input" type="email" id="login-email" name="email" placeholder="seu@email.com" autocomplete="email" required>' +
            '</div>' +
            '<div class="field">' +
              '<label class="label" for="login-password">Senha</label>' +
              '<input class="input" type="password" id="login-password" name="password" placeholder="Digite qualquer senha" autocomplete="current-password" required>' +
            '</div>' +
            '<button type="submit" class="btn btn-primary btn-block btn-lg">Entrar</button>' +
          '</form>' +
          '<p style="text-align:center;margin-top:var(--space-4);font-size:var(--fs-sm)" class="text-muted">' +
            'Nao tem conta? <a href="conta.html">Acesse como demo</a>' +
          '</p>' +
        '</div>' +
      '</div></section>'
    })
  });

  /* ===== conta.html (dashboard) ===== */
  pages.push({
    filename: 'conta.html',
    slug: 'conta',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'conta',
      title: 'Minha conta',
      description: 'Dashboard da conta demonstrativa VendaMais.',
      canonical: '/conta.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta' }
      ],
      main:
        '<h1 style="margin-bottom:var(--space-4)">Ola, ' + escapeHtml_REF(user.name.split(' ')[0]) + '!</h1>' +
        '<span class="demo-badge" style="margin-bottom:var(--space-4)">' + ICONS_REF.shield + ' Conta demonstrativa</span>' +
        '<div class="conta-cards">' +
          contaCard(user.orders, 'Pedidos') +
          contaCard(5, 'Favoritos') +
          contaCard(addresses.length, 'Enderecos') +
        '</div>' +
        '<section style="margin-bottom:var(--space-6)">' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">' +
            '<h2 style="font-size:var(--fs-lg)">Pedidos recentes</h2>' +
            '<a href="conta-pedidos.html" class="btn btn-ghost btn-sm">Ver todos</a>' +
          '</div>' +
          (recentOrders.length ? recentOrders.map(orderRow).join('') :
            '<p class="text-muted">Nenhum pedido ainda.</p>') +
        '</section>' +
        '<section>' +
          '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-3)">' +
            '<h2 style="font-size:var(--fs-lg)">Favoritos recentes</h2>' +
            '<a href="favoritos.html" class="btn btn-ghost btn-sm">Ver todos</a>' +
          '</div>' +
          '<div id="favorites-grid" class="grid grid-auto" data-favorites-preview="5">' +
            '<p class="text-muted">Carregando favoritos...</p>' +
          '</div>' +
        '</section>'
    })
  });

  /* ===== conta-pedidos.html ===== */
  pages.push({
    filename: 'conta-pedidos.html',
    slug: 'conta-pedidos',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'pedidos',
      title: 'Meus pedidos',
      description: 'Historico de pedidos da conta demonstrativa.',
      canonical: '/conta-pedidos.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Pedidos' }
      ],
      main:
        '<h1 style="margin-bottom:var(--space-4)">Meus pedidos</h1>' +
        (userOrders.length ?
          userOrders.map(orderRow).join('') :
          '<p class="text-muted">Voce ainda nao fez nenhum pedido.</p>')
    })
  });

  /* ===== conta-pedido.html (detalhe do primeiro pedido) ===== */
  const detailOrder = userOrders[0] || orders[0];
  const timeline = detailOrder.timeline || [];
  const lastDoneIdx = timeline.reduce((acc, entry, i) => {
    const isLast = i === timeline.length - 1;
    if (isLast) return acc;
    return i;
  }, -1);

  const timelineHTML = timeline.map((entry, i) => {
    let state = 'pending';
    if (i < lastDoneIdx) state = 'done';
    else if (i === lastDoneIdx) state = 'current';
    return timelineItem(entry, state);
  }).join('');

  const addr = detailOrder.shippingAddress || {};
  const itemsHTML = detailOrder.items.map(item =>
    '<div style="display:flex;gap:var(--space-3);align-items:center;padding:var(--space-3) 0;border-bottom:1px solid var(--border)">' +
      '<img src="' + escapeHtml_REF(item.image) + '" alt="" width="56" height="56" style="border-radius:var(--radius-md);object-fit:cover" loading="lazy">' +
      '<div style="flex:1">' +
        '<p style="font-weight:600">' + escapeHtml_REF(item.name) + '</p>' +
        '<p class="text-muted" style="font-size:var(--fs-xs)">Qtd: ' + item.qty + '</p>' +
      '</div>' +
      '<span style="font-weight:600">' + formatPrice_REF(item.price * item.qty) + '</span>' +
    '</div>'
  ).join('');

  pages.push({
    filename: 'conta-pedido.html',
    slug: 'conta-pedido',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'pedidos',
      title: 'Pedido ' + detailOrder.id,
      description: 'Detalhes do pedido demonstrativo ' + detailOrder.id + '.',
      canonical: '/conta-pedido.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Pedidos', href: 'conta-pedidos.html' },
        { label: 'Pedido ' + detailOrder.id }
      ],
      main:
        '<div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:var(--space-3);margin-bottom:var(--space-4)">' +
          '<h1>Pedido #' + escapeHtml_REF(detailOrder.id) + '</h1>' +
          '<span class="badge-status ' + detailOrder.status + '">' + statusLabel(detailOrder.status) + '</span>' +
        '</div>' +
        '<div class="card" style="margin-bottom:var(--space-4)">' +
          '<div class="grid grid-2">' +
            '<div><p class="text-muted" style="font-size:var(--fs-xs)">Data</p><p style="font-weight:600">' + escapeHtml_REF(detailOrder.date) + ' ' + escapeHtml_REF(detailOrder.time) + '</p></div>' +
            '<div><p class="text-muted" style="font-size:var(--fs-xs)">Pagamento</p><p style="font-weight:600">' + (detailOrder.payment === 'pix' ? 'PIX' : 'Cartao') + ' &middot; ' + statusLabel(detailOrder.paymentStatus) + '</p></div>' +
            '<div><p class="text-muted" style="font-size:var(--fs-xs)">Envio</p><p style="font-weight:600">' + (detailOrder.shippingMethod === 'express' ? 'Expressa' : 'Normal') + '</p></div>' +
            '<div><p class="text-muted" style="font-size:var(--fs-xs)">Total</p><p style="font-weight:600">' + formatPrice_REF(detailOrder.total) + '</p></div>' +
          '</div>' +
        '</div>' +
        '<h2 style="font-size:var(--fs-lg);margin-bottom:var(--space-3)">Status do pedido</h2>' +
        '<div class="order-timeline">' + timelineHTML + '</div>' +
        '<h2 style="font-size:var(--fs-lg);margin-bottom:var(--space-3)">Itens</h2>' +
        '<div style="margin-bottom:var(--space-6)">' + itemsHTML + '</div>' +
        '<div class="grid grid-2" style="margin-bottom:var(--space-6)">' +
          '<div class="card">' +
            '<h3 style="font-size:var(--fs-base);margin-bottom:var(--space-2)">Endereco de entrega</h3>' +
            '<p style="font-size:var(--fs-sm)">' +
              escapeHtml_REF(addr.street) + ', ' + escapeHtml_REF(addr.number) + (addr.complement ? ' - ' + escapeHtml_REF(addr.complement) : '') + '<br>' +
              escapeHtml_REF(addr.district) + ' - ' + escapeHtml_REF(addr.city) + '/' + escapeHtml_REF(addr.state) + '<br>' +
              'CEP ' + escapeHtml_REF(addr.cep) +
            '</p>' +
          '</div>' +
          '<div class="card">' +
            '<h3 style="font-size:var(--fs-base);margin-bottom:var(--space-2)">Pagamento</h3>' +
            '<p style="font-size:var(--fs-sm)">' +
              (detailOrder.payment === 'pix' ? 'PIX' : 'Cartao de credito') + '<br>' +
              'Status: <span class="badge-status ' + detailOrder.paymentStatus + '">' + statusLabel(detailOrder.paymentStatus) + '</span><br>' +
              (detailOrder.coupon ? 'Cupom: ' + escapeHtml_REF(detailOrder.coupon) + '<br>' : '') +
              'Total: ' + formatPrice_REF(detailOrder.total) +
            '</p>' +
          '</div>' +
        '</div>' +
        '<a href="rastreio.html" class="btn btn-primary">' + ICONS_REF.truck + ' Rastrear entrega</a>'
    })
  });

  /* ===== favoritos.html ===== */
  pages.push({
    filename: 'favoritos.html',
    slug: 'favoritos',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'favoritos',
      title: 'Favoritos',
      description: 'Lista de produtos favoritos da conta demonstrativa.',
      canonical: '/favoritos.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Favoritos' }
      ],
      main:
        '<h1 style="margin-bottom:var(--space-4)">Meus favoritos</h1>' +
        '<div id="favorites-grid" class="grid grid-auto">' +
          '<p class="text-muted">Carregando favoritos...</p>' +
        '</div>'
    })
  });

  /* ===== conta-enderecos.html ===== */
  const addrCards = addresses.map(a =>
    '<div class="card">' +
      '<div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:var(--space-2)">' +
        '<h3 style="font-size:var(--fs-base)">' + escapeHtml_REF(a.label) + '</h3>' +
        '<span class="badge badge-frete-gratis">Demo</span>' +
      '</div>' +
      '<p style="font-size:var(--fs-sm)" class="text-muted">' +
        escapeHtml_REF(a.street) + ', ' + escapeHtml_REF(a.number) + (a.complement ? ' - ' + escapeHtml_REF(a.complement) : '') + '<br>' +
        escapeHtml_REF(a.district) + ' - ' + escapeHtml_REF(a.city) + '/' + escapeHtml_REF(a.state) + '<br>' +
        'CEP ' + escapeHtml_REF(a.cep) +
      '</p>' +
    '</div>'
  ).join('');

  pages.push({
    filename: 'conta-enderecos.html',
    slug: 'conta-enderecos',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'enderecos',
      title: 'Meus enderecos',
      description: 'Enderecos cadastrados na conta demonstrativa.',
      canonical: '/conta-enderecos.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Enderecos' }
      ],
      main:
        '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:var(--space-4)">' +
          '<h1>Meus enderecos</h1>' +
          '<button type="button" class="btn btn-secondary btn-sm" disabled>' + ICONS_REF.plus + ' Adicionar (demo)</button>' +
        '</div>' +
        '<div class="grid grid-2">' + addrCards + '</div>'
    })
  });

  /* ===== conta-dados.html ===== */
  pages.push({
    filename: 'conta-dados.html',
    slug: 'conta-dados',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'dados',
      title: 'Meus dados',
      description: 'Dados pessoais da conta demonstrativa.',
      canonical: '/conta-dados.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Meus dados' }
      ],
      main:
        '<h1 style="margin-bottom:var(--space-4)">Meus dados</h1>' +
        '<span class="demo-badge" style="margin-bottom:var(--space-4)">' + ICONS_REF.shield + ' Formulario demonstrativo</span>' +
        '<form id="profile-form" novalidate>' +
          '<div class="form-grid-2">' +
            '<div class="field">' +
              '<label class="label" for="profile-name">Nome completo</label>' +
              '<input class="input" type="text" id="profile-name" name="name" value="' + escapeHtml_REF(user.name) + '" autocomplete="name">' +
            '</div>' +
            '<div class="field">' +
              '<label class="label" for="profile-email">E-mail</label>' +
              '<input class="input" type="email" id="profile-email" name="email" value="' + escapeHtml_REF(user.email) + '" autocomplete="email">' +
            '</div>' +
            '<div class="field">' +
              '<label class="label" for="profile-phone">Telefone</label>' +
              '<input class="input" type="tel" id="profile-phone" name="phone" value="' + escapeHtml_REF(user.phone) + '" autocomplete="tel">' +
            '</div>' +
            '<div class="field">' +
              '<label class="label" for="profile-cpf">CPF</label>' +
              '<input class="input" type="text" id="profile-cpf" name="cpf" value="' + escapeHtml_REF(user.cpf) + '" autocomplete="off">' +
            '</div>' +
            '<div class="field">' +
              '<label class="label" for="profile-birth">Data de nascimento</label>' +
              '<input class="input" type="date" id="profile-birth" name="birthDate" value="' + escapeHtml_REF(user.birthDate) + '">' +
            '</div>' +
          '</div>' +
          '<button type="submit" class="btn btn-primary">Salvar alteracoes</button>' +
        '</form>'
    })
  });

  /* ===== rastreio.html ===== */
  const trackOrder = userOrders[0] || orders[0];
  const trackSteps = trackOrder.tracking || [];
  const trackHTML = trackSteps.map((s, i) => trackingStep(s, i === trackSteps.length - 1)).join('');

  pages.push({
    filename: 'rastreio.html',
    slug: 'rastreio',
    noindex: true,
    html: contaPage({
      store: store,
      data: data,
      user: user,
      active: 'rastreio',
      title: 'Rastrear entrega',
      description: 'Rastreamento de pedidos demonstrativo.',
      canonical: '/rastreio.html',
      breadcrumb: [
        { label: 'Inicio', href: 'index.html' },
        { label: 'Minha conta', href: 'conta.html' },
        { label: 'Rastreio' }
      ],
      main:
        '<h1 style="margin-bottom:var(--space-4)">Rastrear entrega</h1>' +
        '<form id="tracking-form" novalidate>' +
          '<div class="field" style="display:flex;gap:var(--space-3);flex-wrap:wrap">' +
            '<input class="input" type="text" id="tracking-number" name="orderNumber" placeholder="Numero do pedido (ex: ' + escapeHtml_REF(trackOrder.id) + ')" value="' + escapeHtml_REF(trackOrder.id) + '" style="flex:1;min-width:240px">' +
            '<button type="submit" class="btn btn-primary">' + ICONS_REF.search + ' Rastrear</button>' +
          '</div>' +
        '</form>' +
        '<div class="tracking-result" id="tracking-result">' +
          '<p style="font-weight:600;margin-bottom:var(--space-2)">Pedido #' + escapeHtml_REF(trackOrder.id) + '</p>' +
          '<p class="text-muted" style="font-size:var(--fs-sm);margin-bottom:var(--space-3)">' +
            (trackOrder.shippingMethod === 'express' ? 'Entrega expressa' : 'Entrega normal') + ' &middot; ' +
            escapeHtml_REF(trackOrder.shippingAddress.city) + '/' + escapeHtml_REF(trackOrder.shippingAddress.state) +
          '</p>' +
          trackHTML +
        '</div>'
    })
  });

  return pages;
}

module.exports = { render };

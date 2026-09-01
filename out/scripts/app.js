/* VendaMais 2.0 — Client-side app
   Estado em localStorage. Sem backend. */
(function () {
  'use strict';

  var PRODUCTS = window.VENDAMAIS_PRODUCTS || [];
  var CATEGORIES = window.VENDAMAIS_CATEGORIES || [];
  var COUPONS = [
    { code: 'EXPO10', type: 'percent', value: 10, minValue: 0 },
    { code: 'FRETEGRATIS', type: 'shipping', value: 0, minValue: 0 },
    { code: 'BEMVINDO15', type: 'percent', value: 15, minValue: 100 }
  ];

  /* ========== Storage helpers ========== */
  function get(key, def) {
    try { var v = localStorage.getItem(key); return v ? JSON.parse(v) : def; }
    catch (e) { return def; }
  }
  function set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) {} }

  /* ========== Toast ========== */
  function showToast(msg, type) {
    var c = document.querySelector('.toast-container');
    if (!c) { c = document.createElement('div'); c.className = 'toast-container'; document.body.appendChild(c); }
    var t = document.createElement('div');
    t.className = 'toast ' + (type || 'info');
    t.textContent = msg;
    c.appendChild(t);
    setTimeout(function () { t.style.opacity = '0'; setTimeout(function () { t.remove(); }, 300); }, 3000);
  }

  /* ========== Cart ========== */
  function getCart() { return get('vendamais_cart', []); }
  function saveCart(cart) { set('vendamais_cart', cart); updateCounts(); }
  function getCartTotal() {
    return getCart().reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  }
  function addToCart(productId, variation, qty) {
    qty = qty || 1;
    var p = findProduct(productId);
    if (!p) return;
    var cart = getCart();
    var key = productId + '|' + JSON.stringify(variation || {});
    var existing = cart.find(function (i) { return i.key === key; });
    if (existing) { existing.qty += qty; }
    else {
      cart.push({
        key: key, productId: productId, name: p.name, price: p.price,
        image: p.images && p.images[0] || '', variation: variation || {},
        qty: qty, slug: p.slug, freteGratis: p.freteGratis
      });
    }
    saveCart(cart);
    showToast('Produto adicionado ao carrinho', 'success');
    openCartDrawer();
    renderCart();
  }
  function removeFromCart(key) {
    var cart = getCart().filter(function (i) { return i.key !== key; });
    saveCart(cart); renderCart();
  }
  function updateQty(key, qty) {
    var cart = getCart();
    var item = cart.find(function (i) { return i.key === key; });
    if (item) { item.qty = Math.max(1, qty); saveCart(cart); renderCart(); }
  }
  function clearCart() { set('vendamais_cart', []); updateCounts(); }

  function applyCoupon(code) {
    code = (code || '').toUpperCase().trim();
    var coupon = COUPONS.find(function (c) { return c.code === code; });
    if (!coupon) { showToast('Cupom invalido', 'error'); return null; }
    var total = getCartTotal();
    if (total < coupon.minValue) { showToast('Valor minimo nao atingido', 'error'); return null; }
    var discount = 0;
    if (coupon.type === 'percent') discount = total * coupon.value / 100;
    set('vendamais_coupon', { code: code, discount: discount, type: coupon.type });
    showToast('Cupom aplicado: ' + code, 'success');
    renderCart();
    return { code: code, discount: discount, type: coupon.type };
  }

  function renderCart() {
    var cart = getCart();
    var drawerBody = document.getElementById('cart-drawer-body');
    var drawerFoot = document.getElementById('cart-drawer-foot');
    var cartPage = document.getElementById('cart-items');
    var coupon = get('vendamais_coupon', null);
    var subtotal = getCartTotal();
    var discount = coupon ? coupon.discount : 0;
    var shipping = calculateShippingCost(subtotal);
    var total = subtotal - discount + shipping;

    var itemsHTML = cart.length === 0 ?
      '<div class="empty-state"><div class="empty-state-icon">' + icon('cart') + '</div><h3>Seu carrinho esta vazio</h3><p>Explore nossos produtos e comece a comprar.</p><a href="produtos.html" class="btn btn-primary">Explorar produtos</a></div>' :
      cart.map(function (i) {
        var varStr = Object.keys(i.variation).map(function (k) { return k + ': ' + i.variation[k]; }).join(', ');
        return '<div class="cart-item">' +
          '<div class="cart-item-img"><img src="' + i.image + '" alt="' + esc(i.name) + '" width="80" height="80" loading="lazy"></div>' +
          '<div class="cart-item-info"><h4>' + esc(i.name) + '</h4>' +
          (varStr ? '<div class="cart-item-variation">' + esc(varStr) + '</div>' : '') +
          '<div class="cart-item-price">' + formatPrice(i.price) + '</div>' +
          '<div class="cart-item-actions">' +
          '<div class="pdp-qty"><button class="pdp-qty-btn" onclick="VendaMais.updateQty(\'' + i.key.replace(/'/g, "\\'") + '\',' + (i.qty - 1) + ')">' + icon('minus') + '</button>' +
          '<input class="pdp-qty-input" type="text" value="' + i.qty + '" readonly>' +
          '<button class="pdp-qty-btn" onclick="VendaMais.updateQty(\'' + i.key.replace(/'/g, "\\'") + '\',' + (i.qty + 1) + ')">' + icon('plus') + '</button></div>' +
          '<button class="link-btn link-btn-danger" onclick="VendaMais.removeFromCart(\'' + i.key.replace(/'/g, "\\'") + '\')">' + icon('trash') + ' Remover</button>' +
          '</div></div></div>';
      }).join('');

    if (drawerBody) drawerBody.innerHTML = itemsHTML;
    if (cartPage) cartPage.innerHTML = itemsHTML;

    var summaryHTML = cart.length > 0 ?
      '<div class="cart-summary-row"><span>Subtotal</span><span>' + formatPrice(subtotal) + '</span></div>' +
      (discount > 0 ? '<div class="cart-summary-row"><span>Desconto (' + (coupon ? coupon.code : '') + ')</span><span>- ' + formatPrice(discount) + '</span></div>' : '') +
      '<div class="cart-summary-row"><span>Frete</span><span>' + (shipping === 0 ? 'Gratis' : formatPrice(shipping)) + '</span></div>' +
      '<div class="cart-summary-row total"><span>Total</span><span>' + formatPrice(total) + '</span></div>' +
      '<a href="checkout.html" class="btn btn-primary btn-block">Finalizar compra</a>' : '';

    if (drawerFoot) drawerFoot.innerHTML = summaryHTML;

    var summaryPage = document.getElementById('cart-summary-content');
    if (summaryPage) summaryPage.innerHTML = summaryHTML;
  }

  function calculateShippingCost(subtotal) {
    if (subtotal >= 200) return 0;
    return 19.90;
  }

  /* ========== Cart drawer ========== */
  function openCartDrawer() {
    var d = document.getElementById('cart-drawer');
    var o = document.getElementById('overlay');
    if (d) { d.hidden = false; }
    if (o) { o.hidden = false; }
    document.body.style.overflow = 'hidden';
  }
  function closeCartDrawer() {
    var d = document.getElementById('cart-drawer');
    var o = document.getElementById('overlay');
    if (d) d.hidden = true;
    if (o) o.hidden = true;
    document.body.style.overflow = '';
  }

  /* ========== Favorites ========== */
  function getFavorites() { return get('vendamais_favorites', []); }
  function isFavorite(id) { return getFavorites().indexOf(id) !== -1; }
  function toggleFavorite(productId) {
    var favs = getFavorites();
    var idx = favs.indexOf(productId);
    if (idx === -1) { favs.push(productId); showToast('Adicionado aos favoritos', 'success'); }
    else { favs.splice(idx, 1); showToast('Removido dos favoritos', 'info'); }
    set('vendamais_favorites', favs);
    updateCounts();
    document.querySelectorAll('[data-product-id="' + productId + '"].product-card-fav').forEach(function (b) {
      b.classList.toggle('active', idx === -1);
    });
    renderFavorites();
  }
  function renderFavorites() {
    var grid = document.getElementById('favorites-grid');
    if (!grid) return;
    var favs = getFavorites();
    if (favs.length === 0) {
      grid.innerHTML = '<div class="empty-state"><div class="empty-state-icon">' + icon('heart') + '</div><h3>Voce ainda nao salvou produtos</h3><p>Clique no coracao nos produtos para salva-los aqui.</p><a href="produtos.html" class="btn btn-primary">Explorar produtos</a></div>';
      return;
    }
    var items = favs.map(function (id) { return findProduct(id); }).filter(Boolean);
    grid.innerHTML = '<div class="grid grid-auto">' + items.map(productCardHTML).join('') + '</div>';
  }

  /* ========== Recently viewed ========== */
  function addRecent(productId) {
    var recent = get('vendamais_recent', []);
    recent = recent.filter(function (id) { return id !== productId; });
    recent.unshift(productId);
    if (recent.length > 8) recent = recent.slice(0, 8);
    set('vendamais_recent', recent);
  }
  function renderRecent() {
    var el = document.getElementById('recent-products');
    if (!el) return;
    var recent = get('vendamais_recent', []);
    if (recent.length === 0) { el.innerHTML = ''; return; }
    var items = recent.map(function (id) { return findProduct(id); }).filter(Boolean).slice(0, 4);
    if (items.length === 0) { el.innerHTML = ''; return; }
    el.innerHTML = '<section class="section"><div class="container"><div class="section-header"><h2>Vistos recentemente</h2></div><div class="grid grid-auto">' + items.map(productCardHTML).join('') + '</div></div></section>';
  }

  /* ========== Compare ========== */
  function getCompare() { return get('vendamais_compare', []); }
  function addToCompare(productId) {
    var cmp = getCompare();
    if (cmp.indexOf(productId) !== -1) { showToast('Produto ja esta na comparacao', 'info'); return; }
    if (cmp.length >= 3) { showToast('Maximo de 3 produtos para comparar', 'error'); return; }
    cmp.push(productId);
    set('vendamais_compare', cmp);
    showToast('Produto adicionado para comparacao', 'success');
    renderCompareBar();
  }
  function removeFromCompare(productId) {
    var cmp = getCompare().filter(function (id) { return id !== productId; });
    set('vendamais_compare', cmp);
    renderCompareBar();
  }
  function renderCompareBar() {
    var bar = document.getElementById('compare-bar');
    if (!bar) return;
    var cmp = getCompare();
    if (cmp.length === 0) { bar.style.display = 'none'; return; }
    bar.style.display = 'flex';
    var items = cmp.map(function (id) { var p = findProduct(id); return p ? p : null; }).filter(Boolean);
    bar.innerHTML = '<div style="display:flex;gap:12px;align-items:center;flex:1;overflow-x:auto">' +
      items.map(function (p) {
        return '<div style="display:flex;gap:8px;align-items:center"><img src="' + (p.images && p.images[0] || '') + '" width="40" height="40" style="border-radius:8px;object-fit:cover"><span style="font-size:.875rem">' + esc(p.name) + '</span><button onclick="VendaMais.removeFromCompare(\'' + p.id + '\')" class="link-btn">' + icon('close') + '</button></div>';
      }).join('') +
      '</div><a href="comparar.html" class="btn btn-primary btn-sm">Comparar (' + cmp.length + ')</a>';
  }

  /* ========== Search autocomplete ========== */
  function initSearch() {
    var inputs = document.querySelectorAll('.search-input');
    inputs.forEach(function (input) {
      var dropdown = null;
      input.addEventListener('keyup', function () {
        var q = input.value.trim().toLowerCase();
        if (dropdown) dropdown.remove();
        if (q.length < 2) return;
        var prodMatches = PRODUCTS.filter(function (p) { return p.name.toLowerCase().indexOf(q) !== -1; }).slice(0, 5);
        var catMatches = CATEGORIES.filter(function (c) { return c.name.toLowerCase().indexOf(q) !== -1; }).slice(0, 2);
        if (prodMatches.length === 0 && catMatches.length === 0) return;
        dropdown = document.createElement('div');
        dropdown.className = 'search-dropdown';
        dropdown.style.cssText = 'position:absolute;top:100%;left:0;right:0;background:var(--surface);border:1px solid var(--border);border-radius:0 0 12px 12px;padding:8px;z-index:200;box-shadow:0 12px 32px rgba(0,0,0,.4)';
        var html = '';
        if (prodMatches.length) {
          html += '<div style="font-size:.75rem;color:var(--text-muted);padding:4px 8px;text-transform:uppercase">Produtos</div>';
          html += prodMatches.map(function (p) {
            return '<a href="produto-' + p.slug + '.html" style="display:flex;gap:8px;padding:8px;border-radius:8px;align-items:center;color:var(--text);font-size:.875rem" onmouseover="this.style.background=\'var(--elevated)\'" onmouseout="this.style.background=\'\'"><img src="' + (p.images && p.images[0] || '') + '" width="32" height="32" style="border-radius:6px;object-fit:cover">' + esc(p.name) + ' — ' + formatPrice(p.price) + '</a>';
          }).join('');
        }
        if (catMatches.length) {
          html += '<div style="font-size:.75rem;color:var(--text-muted);padding:4px 8px;margin-top:4px;text-transform:uppercase">Categorias</div>';
          html += catMatches.map(function (c) {
            return '<a href="categoria-' + c.slug + '.html" style="display:block;padding:8px;border-radius:8px;color:var(--text);font-size:.875rem" onmouseover="this.style.background=\'var(--elevated)\'" onmouseout="this.style.background=\'\'">' + esc(c.name) + '</a>';
          }).join('');
        }
        dropdown.innerHTML = html;
        input.parentElement.style.position = 'relative';
        input.parentElement.appendChild(dropdown);
      });
      input.addEventListener('blur', function () { setTimeout(function () { if (dropdown) dropdown.remove(); }, 200); });
    });
  }

  /* ========== CEP / Freight ========== */
  function calculateShipping(cep) {
    var result = document.querySelector('.pdp-cep-result');
    if (!cep || cep.replace(/\D/g, '').length !== 8) {
      if (result) result.textContent = 'CEP invalido. Digite 8 digitos.';
      return;
    }
    if (result) {
      result.innerHTML = '<div style="display:flex;flex-direction:column;gap:4px">' +
        '<div style="display:flex;justify-content:space-between"><span>Normal (3-5 dias)</span><strong>Gratis</strong></div>' +
        '<div style="display:flex;justify-content:space-between"><span>Expressa (1-2 dias)</span><strong>' + formatPrice(19.90) + '</strong></div>' +
        '</div>';
    }
  }

  /* ========== Checkout ========== */
  var checkoutStep = 1;
  function nextStep() {
    if (checkoutStep < 4) { checkoutStep++; updateCheckoutStep(); }
  }
  function prevStep() {
    if (checkoutStep > 1) { checkoutStep--; updateCheckoutStep(); }
  }
  function updateCheckoutStep() {
    document.querySelectorAll('.checkout-step').forEach(function (s, i) {
      s.classList.toggle('active', i + 1 === checkoutStep);
      s.classList.toggle('done', i + 1 < checkoutStep);
    });
    document.querySelectorAll('.checkout-panel').forEach(function (p, i) {
      p.style.display = i + 1 === checkoutStep ? 'block' : 'none';
    });
    document.querySelectorAll('.checkout-nav').forEach(function (n) {
      n.style.display = checkoutStep === 4 ? 'none' : 'flex';
    });
  }

  function simulatePixPayment() {
    var btn = document.getElementById('pix-simulate');
    if (btn) { btn.disabled = true; btn.textContent = 'Processando...'; }
    setTimeout(function () {
      createOrderFromCheckout('pix', 'approved');
      window.location.href = 'pedido-confirmado.html';
    }, 2000);
  }

  function simulateCard(approved) {
    var btn = document.getElementById('card-simulate');
    if (btn) { btn.disabled = true; btn.textContent = 'Processando...'; }
    setTimeout(function () {
      if (approved) {
        createOrderFromCheckout('card', 'approved');
        window.location.href = 'pedido-confirmado.html';
      } else {
        showToast('Pagamento recusado (simulacao)', 'error');
        if (btn) { btn.disabled = false; btn.textContent = 'Simular pagamento'; }
      }
    }, 2000);
  }

  function createOrderFromCheckout(payment, paymentStatus) {
    var cart = getCart();
    var coupon = get('vendamais_coupon', null);
    var subtotal = getCartTotal();
    var discount = coupon ? coupon.discount : 0;
    var shipping = calculateShippingCost(subtotal);
    var total = subtotal - discount + shipping;
    var orderNum = 'VM-2026-' + Math.floor(10000 + Math.random() * 90000);
    var order = {
      id: orderNum, date: new Date().toISOString().split('T')[0], time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      items: cart, subtotal: subtotal, discount: discount, shipping: shipping, total: total,
      coupon: coupon ? coupon.code : null, payment: payment, paymentStatus: paymentStatus,
      status: 'paid', customer: { name: 'Mariana Demonstracao', email: 'mariana@demo.vendamais.com.br' },
      shippingAddress: { cep: '01310-100', street: 'Av. Paulista', number: '1000', city: 'Sao Paulo', state: 'SP' },
      timeline: [
        { status: 'placed', label: 'Pedido realizado', date: new Date().toLocaleString('pt-BR') },
        { status: 'paid', label: 'Pagamento aprovado', date: new Date().toLocaleString('pt-BR') }
      ]
    };
    var orders = get('vendamais_orders', []);
    orders.unshift(order);
    set('vendamais_orders', orders);
    set('vendamais_last_order', order);
    clearCart();
    set('vendamais_coupon', null);
  }

  /* ========== PIX timer ========== */
  var pixTimerInterval = null;
  function startPixTimer() {
    var el = document.getElementById('pix-timer');
    if (!el) return;
    var seconds = 30 * 60;
    pixTimerInterval = setInterval(function () {
      seconds--;
      if (seconds <= 0) { clearInterval(pixTimerInterval); el.textContent = '00:00'; return; }
      var m = Math.floor(seconds / 60);
      var s = seconds % 60;
      el.textContent = (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
    }, 1000);
  }

  /* ========== Account ========== */
  function demoLogin(email) {
    var session = { name: 'Mariana Demonstracao', email: email || 'mariana@demo.vendamais.com.br', id: 'c01' };
    set('vendamais_session', session);
    window.location.href = 'conta.html';
  }
  function logout() {
    localStorage.removeItem('vendamais_session');
    window.location.href = 'index.html';
  }
  function getSession() { return get('vendamais_session', null); }

  function renderAccountOrders() {
    var el = document.getElementById('account-orders');
    if (!el) return;
    var demoOrders = window.VENDAMAIS_ORDERS || [];
    var userOrders = get('vendamais_orders', []);
    var all = userOrders.concat(demoOrders).slice(0, 5);
    if (all.length === 0) {
      el.innerHTML = '<div class="empty-state"><h3>Nenhum pedido por aqui</h3><p>Seus pedidos apareceram aqui.</p><a href="produtos.html" class="btn btn-primary">Explorar produtos</a></div>';
      return;
    }
    el.innerHTML = all.map(function (o) {
      return '<div class="card card-hover" style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px">' +
        '<div><strong>' + o.id + '</strong><br><span class="text-sm text-muted">' + (o.date || '') + '</span></div>' +
        '<div><strong>' + formatPrice(o.total) + '</strong><br><span class="badge-status ' + (o.status || 'paid') + '">' + statusLabel(o.status) + '</span></div>' +
        '<a href="conta-pedido.html" class="btn btn-secondary btn-sm">Ver pedido</a></div></div>';
    }).join('');
  }

  function statusLabel(s) {
    var labels = { placed: 'Realizado', paid: 'Pago', separating: 'Separando', in_transit: 'Em transporte', out_for_delivery: 'Saiu para entrega', delivered: 'Entregue', cancelled: 'Cancelado', confirmed: 'Confirmado' };
    return labels[s] || s || 'Pago';
  }

  /* ========== Admin ========== */
  function adminLogin() {
    var pw = document.getElementById('admin-password');
    if (pw && pw.value === 'admin') {
      set('vendamais_admin', true);
      document.getElementById('admin-login-gate').style.display = 'none';
      document.getElementById('admin-content').style.display = 'block';
    } else {
      showToast('Senha incorreta (demo: admin)', 'error');
    }
  }
  function showAdminSection(id) {
    document.querySelectorAll('.admin-section').forEach(function (s) { s.style.display = 'none'; });
    var el = document.getElementById('admin-' + id);
    if (el) el.style.display = 'block';
    document.querySelectorAll('.admin-menu a').forEach(function (a) { a.classList.remove('active'); });
    var link = document.querySelector('.admin-menu a[href="#' + id + '"]');
    if (link) link.classList.add('active');
  }

  /* ========== Newsletter ========== */
  function initNewsletter() {
    var form = document.getElementById('newsletter-form');
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        showToast('Inscricao demonstrativa realizada', 'success');
        form.reset();
      });
    }
  }

  /* ========== FAQ accordion ========== */
  function initFAQ() {
    document.querySelectorAll('.faq-question').forEach(function (q) {
      q.addEventListener('click', function () {
        q.parentElement.classList.toggle('open');
      });
    });
  }

  /* ========== PDP gallery ========== */
  function initGallery() {
    var thumbs = document.querySelectorAll('.pdp-thumb');
    var main = document.getElementById('pdp-main-img');
    thumbs.forEach(function (t) {
      t.addEventListener('click', function () {
        thumbs.forEach(function (x) { x.classList.remove('active'); });
        t.classList.add('active');
        if (main) { main.src = t.dataset.img || (t.querySelector('img') ? t.querySelector('img').src : ''); }
      });
    });
  }

  /* ========== PDP variations ========== */
  function initVariations() {
    document.querySelectorAll('.pdp-variation-btn').forEach(function (b) {
      b.addEventListener('click', function () {
        var siblings = b.parentElement.querySelectorAll('.pdp-variation-btn');
        siblings.forEach(function (s) { s.classList.remove('selected'); });
        b.classList.add('selected');
      });
    });
  }

  /* ========== Helpers ========== */
  function findProduct(id) {
    return PRODUCTS.find(function (p) { return p.id === id; });
  }
  function esc(s) {
    if (!s) return '';
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }
  function formatPrice(v) { return 'R$ ' + Number(v).toFixed(2).replace('.', ','); }
  function icon(name) {
    var icons = {
      cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/></svg>',
      heart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>',
      minus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14"/></svg>',
      plus: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M5 12h14M12 5v14"/></svg>',
      trash: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6"/></svg>',
      close: '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6 6 18M6 6l12 12"/></svg>'
    };
    return icons[name] || '';
  }
  function productCardHTML(p) {
    var href = 'produto-' + p.slug + '.html';
    var img = p.images && p.images[0] ? p.images[0] : '';
    return '<article class="product-card"><a href="' + href + '" class="product-card-link">' +
      '<div class="product-card-img"><img src="' + img + '" alt="' + esc(p.name) + '" width="300" height="300" loading="lazy">' +
      '<button class="product-card-fav" onclick="event.preventDefault();event.stopPropagation();VendaMais.toggleFavorite(\'' + p.id + '\')">' + icon('heart') + '</button></div>' +
      '<div class="product-card-info"><h3 class="product-card-name">' + esc(p.name) + '</h3>' +
      '<div class="product-card-rating">' + formatPrice(p.price) + '</div></div></a>' +
      '<button class="btn btn-primary btn-sm btn-block product-card-add" onclick="VendaMais.addToCart(\'' + p.id + '\')">' + icon('cart') + ' Adicionar</button></article>';
  }

  /* ========== Update counts ========== */
  function updateCounts() {
    var cartCount = getCart().reduce(function (s, i) { return s + i.qty; }, 0);
    var favCount = getFavorites().length;
    var cc = document.getElementById('cart-count');
    var fc = document.getElementById('fav-count');
    if (cc) { cc.textContent = cartCount; cc.style.display = cartCount > 0 ? 'flex' : 'none'; }
    if (fc) { fc.textContent = favCount; fc.style.display = favCount > 0 ? 'flex' : 'none'; }
  }

  /* ========== Init ========== */
  function init() {
    updateCounts();
    renderCart();
    renderFavorites();
    renderRecent();
    renderCompareBar();
    initSearch();
    initNewsletter();
    initFAQ();
    initGallery();
    initVariations();
    renderAccountOrders();

    var cartToggle = document.getElementById('cart-toggle');
    if (cartToggle) cartToggle.addEventListener('click', openCartDrawer);
    var cartClose = document.querySelector('.cart-drawer-close');
    if (cartClose) cartClose.addEventListener('click', closeCartDrawer);
    var overlay = document.getElementById('overlay');
    if (overlay) overlay.addEventListener('click', function () { closeCartDrawer(); closeMobileNav(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeCartDrawer(); closeMobileNav(); } });

    var mobileToggle = document.querySelector('.header-mobile-toggle');
    if (mobileToggle) mobileToggle.addEventListener('click', function () {
      var nav = document.getElementById('mobile-nav');
      var o = document.getElementById('overlay');
      if (nav) nav.hidden = false;
      if (o) o.hidden = false;
      document.body.style.overflow = 'hidden';
    });
    function closeMobileNav() {
      var nav = document.getElementById('mobile-nav');
      var o = document.getElementById('overlay');
      if (nav) nav.hidden = true;
      if (o) o.hidden = true;
      document.body.style.overflow = '';
    }
    var mobileClose = document.querySelector('.mobile-nav-close');
    if (mobileClose) mobileClose.addEventListener('click', closeMobileNav);

    var cepBtn = document.getElementById('cep-calc');
    if (cepBtn) cepBtn.addEventListener('click', function () {
      var input = document.getElementById('cep-input');
      calculateShipping(input ? input.value : '');
    });

    var checkoutNext = document.getElementById('checkout-next');
    if (checkoutNext) checkoutNext.addEventListener('click', nextStep);
    var checkoutPrev = document.getElementById('checkout-prev');
    if (checkoutPrev) checkoutPrev.addEventListener('click', prevStep);

    var pixSim = document.getElementById('pix-simulate');
    if (pixSim) { pixSim.addEventListener('click', simulatePixPayment); startPixTimer(); }
    var cardSim = document.getElementById('card-simulate');
    if (cardSim) cardSim.addEventListener('click', function () { simulateCard(true); });
    var cardDecline = document.getElementById('card-decline');
    if (cardDecline) cardDecline.addEventListener('click', function () { simulateCard(false); });

    var loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var email = loginForm.querySelector('input[type="email"]');
      demoLogin(email ? email.value : '');
    });

    var adminLoginForm = document.getElementById('admin-login-form');
    if (adminLoginForm) adminLoginForm.addEventListener('submit', function (e) {
      e.preventDefault(); adminLogin();
    });

    var couponBtn = document.getElementById('coupon-apply');
    if (couponBtn) couponBtn.addEventListener('click', function () {
      var input = document.getElementById('coupon-input');
      applyCoupon(input ? input.value : '');
    });

    document.querySelectorAll('[data-add-to-cart]').forEach(function (b) {
      b.addEventListener('click', function () { addToCart(b.dataset.addToCart); });
    });
  }

  function buyNow(productId) {
    addToCart(productId);
    window.location.href = 'checkout.html';
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.VendaMais = {
    addToCart: addToCart, removeFromCart: removeFromCart, updateQty: updateQty,
    getCart: getCart, getCartTotal: getCartTotal, clearCart: clearCart,
    applyCoupon: applyCoupon, renderCart: renderCart,
    toggleFavorite: toggleFavorite, getFavorites: getFavorites, isFavorite: isFavorite,
    addRecent: addRecent, calculateShipping: calculateShipping,
    nextStep: nextStep, prevStep: prevStep,
    simulatePixPayment: simulatePixPayment, simulateCard: simulateCard,
    demoLogin: demoLogin, logout: logout, getSession: getSession,
    adminLogin: adminLogin, showAdminSection: showAdminSection,
    addToCompare: addToCompare, removeFromCompare: removeFromCompare,
    showToast: showToast, getCompare: getCompare, buyNow: buyNow
  };
})();

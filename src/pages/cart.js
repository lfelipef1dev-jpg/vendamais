/* VendaMais — Carrinho
   Gera carrinho.html (pagina estatica, itens populados por app.js) */

function render(data, T) {
  const store = data.store;

  const breadcrumb = T.renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: 'Carrinho' }
  ]);

  const emptyState = '<div class="empty-state" id="cart-empty">' +
    '<div class="empty-state-icon">' + T.ICONS.cart + '</div>' +
    '<h3>Seu carrinho esta vazio</h3>' +
    '<p>Adicione produtos para continuar com a compra.</p>' +
    '<a href="produtos.html" class="btn btn-primary">' + T.ICONS.arrow + ' Explorar produtos</a>' +
  '</div>';

  const itemsContainer = '<div id="cart-items">' + emptyState + '</div>';

  const summary = '<aside class="cart-summary">' +
    '<h3>Resumo do pedido</h3>' +
    '<div class="cart-coupon">' +
      '<input type="text" class="input" id="cart-coupon-input" placeholder="Cupom de desconto" aria-label="Cupom de desconto">' +
      '<button type="button" class="btn btn-secondary" id="cart-coupon-btn">Aplicar</button>' +
    '</div>' +
    '<div class="cart-summary-row"><span>Subtotal</span><span id="cart-subtotal">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row"><span>Frete</span><span id="cart-shipping">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row"><span>Desconto</span><span id="cart-discount">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row total"><span>Total</span><span id="cart-total">' + T.formatPrice(0) + '</span></div>' +
    '<a href="checkout.html" class="btn btn-primary btn-block btn-lg" id="cart-checkout-btn">' + T.ICONS.arrow + ' Continuar para pagamento</a>' +
    '<a href="produtos.html" class="btn btn-ghost btn-block">Continuar comprando</a>' +
  '</aside>';

  const content = '<div class="container">' +
    breadcrumb +
    '<h1>Carrinho</h1>' +
    '<div class="cart-layout">' +
      '<div>' + itemsContainer + '</div>' +
      summary +
    '</div>' +
  '</div>';

  const html = T.renderLayout({
    store: store,
    data: data,
    title: 'Carrinho',
    description: 'Carrinho de compras — ' + store.name,
    canonical: '/carrinho.html',
    noindex: true,
    active: '',
    structuredData: T.renderBreadcrumbSchema([{ label: 'Home', href: 'index.html' }, { label: 'Carrinho' }], store.url),
    content: content
  });

  return [{ filename: 'carrinho.html', slug: 'carrinho', noindex: true, html: html }];
}

module.exports = { render: render };

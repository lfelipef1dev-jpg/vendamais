/* VendaMais — Checkout + Confirmacao
   Gera checkout.html e pedido-confirmado.html */

function buildStepsBar(T) {
  const steps = [
    { num: 1, label: 'Identificacao' },
    { num: 2, label: 'Entrega' },
    { num: 3, label: 'Pagamento' },
    { num: 4, label: 'Revisao' }
  ];
  const items = steps.map(s =>
    '<div class="checkout-step' + (s.num === 1 ? ' active' : '') + '" data-step="' + s.num + '">' +
      '<span class="checkout-step-num">' + s.num + '</span>' +
      '<span>' + s.label + '</span>' +
    '</div>'
  ).join('');
  return '<div class="checkout-steps" role="tablist" aria-label="Etapas do checkout">' + items + '</div>';
}

function buildStep1(T) {
  return '<div class="checkout-content" id="step-1">' +
    '<h2>Identificacao</h2>' +
    '<div class="field">' +
      '<label class="label" for="ck-name">Nome completo</label>' +
      '<input type="text" class="input" id="ck-name" placeholder="Seu nome completo" autocomplete="name">' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-cpf">CPF <span class="badge badge-status confirmed">Demo</span></label>' +
      '<input type="text" class="input" id="ck-cpf" placeholder="000.000.000-00" inputmode="numeric" maxlength="14" autocomplete="cpf">' +
    '</div>' +
    '<div class="form-grid-2">' +
      '<div class="field">' +
        '<label class="label" for="ck-email">E-mail</label>' +
        '<input type="email" class="input" id="ck-email" placeholder="seu@email.com" autocomplete="email">' +
      '</div>' +
      '<div class="field">' +
        '<label class="label" for="ck-phone">Telefone</label>' +
        '<input type="tel" class="input" id="ck-phone" placeholder="(00) 00000-0000" inputmode="tel" autocomplete="tel">' +
      '</div>' +
    '</div>' +
  '</div>';
}

function buildStep2(data, T) {
  const shippingMethods = data.store.shippingMethods || [];
  const shippingCards = shippingMethods.map((m, i) =>
    '<label class="card card-hover" style="display:flex;align-items:center;gap:var(--space-3);margin-bottom:var(--space-3);cursor:pointer;">' +
      '<input type="radio" name="shipping" value="' + m.id + '"' + (i === 0 ? ' checked' : '') + ' style="width:18px;height:18px;accent-color:var(--accent);">' +
      '<div style="flex:1;">' +
        '<strong>' + T.escapeHtml(m.name) + '</strong>' +
        '<div style="font-size:var(--fs-xs);color:var(--text-muted);">' + T.escapeHtml(m.description) + '</div>' +
      '</div>' +
      '<span class="cart-item-price">' + (m.price === 0 ? 'Gratis' : T.formatPrice(m.price)) + '</span>' +
    '</label>'
  ).join('');

  return '<div class="checkout-content" id="step-2" hidden>' +
    '<h2>Entrega</h2>' +
    '<div class="form-grid-2">' +
      '<div class="field">' +
        '<label class="label" for="ck-cep">CEP</label>' +
        '<input type="text" class="input" id="ck-cep" placeholder="00000-000" inputmode="numeric" maxlength="9" autocomplete="postal-code">' +
      '</div>' +
      '<div class="field">' +
        '<label class="label" for="ck-number">Numero</label>' +
        '<input type="text" class="input" id="ck-number" placeholder="123" inputmode="numeric" autocomplete="address-line2">' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-address">Endereco</label>' +
      '<input type="text" class="input" id="ck-address" placeholder="Rua, avenida..." autocomplete="address-line1">' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-complement">Complemento</label>' +
      '<input type="text" class="input" id="ck-complement" placeholder="Apto, bloco... (opcional)" autocomplete="address-line2">' +
    '</div>' +
    '<div class="form-grid-2">' +
      '<div class="field">' +
        '<label class="label" for="ck-district">Bairro</label>' +
        '<input type="text" class="input" id="ck-district" placeholder="Seu bairro">' +
      '</div>' +
      '<div class="field">' +
        '<label class="label" for="ck-city">Cidade</label>' +
        '<input type="text" class="input" id="ck-city" placeholder="Sua cidade" autocomplete="address-level2">' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-state">Estado</label>' +
      '<select class="select" id="ck-state" autocomplete="address-level1">' +
        '<option value="">Selecione...</option>' +
        '<option value="AC">Acre</option><option value="AL">Alagoas</option><option value="AP">Amapa</option>' +
        '<option value="AM">Amazonas</option><option value="BA">Bahia</option><option value="CE">Ceara</option>' +
        '<option value="DF">Distrito Federal</option><option value="ES">Espirito Santo</option>' +
        '<option value="GO">Goias</option><option value="MA">Maranhao</option><option value="MT">Mato Grosso</option>' +
        '<option value="MS">Mato Grosso do Sul</option><option value="MG">Minas Gerais</option>' +
        '<option value="PA">Para</option><option value="PB">Paraiba</option><option value="PR">Parana</option>' +
        '<option value="PE">Pernambuco</option><option value="PI">Piaui</option><option value="RJ">Rio de Janeiro</option>' +
        '<option value="RN">Rio Grande do Norte</option><option value="RS">Rio Grande do Sul</option>' +
        '<option value="RO">Rondonia</option><option value="RR">Roraima</option><option value="SC">Santa Catarina</option>' +
        '<option value="SP">Sao Paulo</option><option value="SE">Sergipe</option><option value="TO">Tocantins</option>' +
      '</select>' +
    '</div>' +
    '<h3 style="margin-top:var(--space-6);margin-bottom:var(--space-3);">Forma de envio</h3>' +
    shippingCards +
  '</div>';
}

function buildStep3(T) {
  const qrPlaceholder = '<svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">' +
    '<rect width="100" height="100" fill="white"/>' +
    '<rect x="5" y="5" width="25" height="25" fill="black"/>' +
    '<rect x="10" y="10" width="15" height="15" fill="white"/>' +
    '<rect x="13" y="13" width="9" height="9" fill="black"/>' +
    '<rect x="70" y="5" width="25" height="25" fill="black"/>' +
    '<rect x="75" y="10" width="15" height="15" fill="white"/>' +
    '<rect x="78" y="13" width="9" height="9" fill="black"/>' +
    '<rect x="5" y="70" width="25" height="25" fill="black"/>' +
    '<rect x="10" y="75" width="15" height="15" fill="white"/>' +
    '<rect x="13" y="78" width="9" height="9" fill="black"/>' +
    '<rect x="40" y="5" width="8" height="8" fill="black"/><rect x="52" y="5" width="8" height="8" fill="black"/>' +
    '<rect x="40" y="17" width="8" height="8" fill="black"/><rect x="60" y="17" width="8" height="8" fill="black"/>' +
    '<rect x="5" y="40" width="8" height="8" fill="black"/><rect x="17" y="40" width="8" height="8" fill="black"/>' +
    '<rect x="29" y="40" width="8" height="8" fill="black"/><rect x="40" y="40" width="8" height="8" fill="black"/>' +
    '<rect x="52" y="40" width="8" height="8" fill="black"/><rect x="64" y="40" width="8" height="8" fill="black"/>' +
    '<rect x="76" y="40" width="8" height="8" fill="black"/><rect x="88" y="40" width="8" height="8" fill="black"/>' +
    '<rect x="40" y="52" width="8" height="8" fill="black"/><rect x="52" y="52" width="8" height="8" fill="black"/>' +
    '<rect x="64" y="52" width="8" height="8" fill="black"/><rect x="76" y="52" width="8" height="8" fill="black"/>' +
    '<rect x="40" y="64" width="8" height="8" fill="black"/><rect x="52" y="64" width="8" height="8" fill="black"/>' +
    '<rect x="64" y="64" width="8" height="8" fill="black"/><rect x="76" y="64" width="8" height="8" fill="black"/>' +
    '<rect x="88" y="64" width="8" height="8" fill="black"/>' +
    '<rect x="40" y="76" width="8" height="8" fill="black"/><rect x="52" y="76" width="8" height="8" fill="black"/>' +
    '<rect x="64" y="76" width="8" height="8" fill="black"/><rect x="76" y="76" width="8" height="8" fill="black"/>' +
    '<rect x="40" y="88" width="8" height="8" fill="black"/><rect x="52" y="88" width="8" height="8" fill="black"/>' +
    '<rect x="64" y="88" width="8" height="8" fill="black"/><rect x="76" y="88" width="8" height="8" fill="black"/>' +
    '<rect x="88" y="88" width="8" height="8" fill="black"/>' +
  '</svg>';

  const pixTab = '<div class="pix-box">' +
    '<h3>' + T.ICONS.pix + ' Pague com PIX</h3>' +
    '<div class="pix-qr">' + qrPlaceholder + '</div>' +
    '<div class="pix-code" id="pix-code">00020126580014BR.GOV.BCB.PIX0136vendamais-demo-qr-code-5204000053039865802BR5913VendaMais Demo6009Sao Paulo62070503***6304A1B2</div>' +
    '<button type="button" class="btn btn-ghost btn-sm btn-block" onclick="navigator.clipboard.writeText(document.getElementById(\'pix-code\').textContent)">Copiar codigo PIX</button>' +
    '<div class="pix-timer" id="pix-timer">30:00</div>' +
    '<button type="button" class="btn btn-success btn-block" id="pix-simulate-btn">Simular pagamento</button>' +
  '</div>';

  const cardTab = '<div>' +
    '<div class="card-visual" id="card-visual">' +
      '<div class="card-visual-brand">VISA</div>' +
      '<div class="card-visual-number" id="card-visual-number">**** **** **** ****</div>' +
      '<div style="display:flex;justify-content:space-between;">' +
        '<div class="card-visual-name" id="card-visual-name">NOME DO TITULAR</div>' +
        '<div class="card-visual-exp" id="card-visual-exp">MM/AA</div>' +
      '</div>' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-card-number">Numero do cartao</label>' +
      '<input type="text" class="input" id="ck-card-number" placeholder="0000 0000 0000 0000" inputmode="numeric" maxlength="19" autocomplete="cc-number">' +
    '</div>' +
    '<div class="field">' +
      '<label class="label" for="ck-card-name">Nome impresso no cartao</label>' +
      '<input type="text" class="input" id="ck-card-name" placeholder="Como impresso no cartao" autocomplete="cc-name">' +
    '</div>' +
    '<div class="form-grid-2">' +
      '<div class="field">' +
        '<label class="label" for="ck-card-exp">Validade</label>' +
        '<input type="text" class="input" id="ck-card-exp" placeholder="MM/AA" inputmode="numeric" maxlength="5" autocomplete="cc-exp">' +
      '</div>' +
      '<div class="field">' +
        '<label class="label" for="ck-card-cvv">CVV</label>' +
        '<input type="text" class="input" id="ck-card-cvv" placeholder="123" inputmode="numeric" maxlength="4" autocomplete="cc-csc">' +
      '</div>' +
    '</div>' +
    '<div style="display:flex;gap:var(--space-3);flex-wrap:wrap;">' +
      '<button type="button" class="btn btn-success" id="card-approve-btn">Simular aprovacao</button>' +
      '<button type="button" class="btn btn-danger" id="card-reject-btn">Simular recusa</button>' +
    '</div>' +
  '</div>';

  return '<div class="checkout-content" id="step-3" hidden>' +
    '<h2>Pagamento</h2>' +
    '<div class="tabs" role="tablist">' +
      '<button type="button" class="tab active" role="tab" data-pay-tab="pix">' + T.ICONS.pix + ' PIX</button>' +
      '<button type="button" class="tab" role="tab" data-pay-tab="card">' + T.ICONS.card + ' Cartao</button>' +
    '</div>' +
    '<div id="pay-pix">' + pixTab + '</div>' +
    '<div id="pay-card" hidden>' + cardTab + '</div>' +
  '</div>';
}

function buildStep4(T) {
  return '<div class="checkout-content" id="step-4" hidden>' +
    '<h2>Revisao do pedido</h2>' +
    '<div class="card" style="margin-bottom:var(--space-4);">' +
      '<h3>Dados do comprador</h3>' +
      '<div id="review-customer" style="font-size:var(--fs-sm);color:var(--text-secondary);"></div>' +
    '</div>' +
    '<div class="card" style="margin-bottom:var(--space-4);">' +
      '<h3>Endereco de entrega</h3>' +
      '<div id="review-address" style="font-size:var(--fs-sm);color:var(--text-secondary);"></div>' +
    '</div>' +
    '<div class="card" style="margin-bottom:var(--space-4);">' +
      '<h3>Itens do pedido</h3>' +
      '<div id="review-items"></div>' +
    '</div>' +
    '<button type="button" class="btn btn-primary btn-lg btn-block" id="checkout-finish-btn">' + T.ICONS.check + ' Finalizar pedido</button>' +
  '</div>';
}

function buildNav(T) {
  return '<div style="display:flex;justify-content:space-between;gap:var(--space-3);margin-top:var(--space-6);">' +
    '<button type="button" class="btn btn-ghost" id="ck-prev" style="visibility:hidden;">' + T.ICONS.arrow.replace('m12 5 7 7-7 7', 'm19 12-7-7-7 7') + ' Voltar</button>' +
    '<button type="button" class="btn btn-primary" id="ck-next">Continuar ' + T.ICONS.arrow + '</button>' +
  '</div>';
}

function buildCheckoutSummary(T) {
  return '<aside class="checkout-summary">' +
    '<h3>Resumo do pedido</h3>' +
    '<div id="checkout-items-list" style="margin-bottom:var(--space-3);font-size:var(--fs-sm);"></div>' +
    '<div class="cart-summary-row"><span>Subtotal</span><span id="ck-subtotal">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row"><span>Frete</span><span id="ck-shipping">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row"><span>Desconto</span><span id="ck-discount">' + T.formatPrice(0) + '</span></div>' +
    '<div class="cart-summary-row total"><span>Total</span><span id="ck-total">' + T.formatPrice(0) + '</span></div>' +
  '</aside>';
}

function renderCheckout(data, T) {
  const store = data.store;

  const breadcrumb = T.renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: 'Carrinho', href: 'carrinho.html' },
    { label: 'Checkout' }
  ]);

  const content = '<div class="container">' +
    breadcrumb +
    '<h1>Finalizar compra</h1>' +
    '<div class="checkout-layout">' +
      '<div>' +
        buildStepsBar(T) +
        buildStep1(T) +
        buildStep2(data, T) +
        buildStep3(T) +
        buildStep4(T) +
        buildNav(T) +
      '</div>' +
      buildCheckoutSummary(T) +
    '</div>' +
  '</div>';

  const html = T.renderLayout({
    store: store,
    data: data,
    title: 'Checkout',
    description: 'Finalizacao de compra — ' + store.name,
    canonical: '/checkout.html',
    noindex: true,
    active: '',
    content: content
  });

  return { filename: 'checkout.html', html: html };
}

function renderConfirmation(data, T) {
  const store = data.store;

  const breadcrumb = T.renderBreadcrumb([
    { label: 'Home', href: 'index.html' },
    { label: 'Carrinho', href: 'carrinho.html' },
    { label: 'Checkout', href: 'checkout.html' },
    { label: 'Confirmacao' }
  ]);

  const successIcon = '<div class="confirmation-icon">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>' +
  '</div>';

  const orderInfo = '<div class="confirmation-order">' +
    '<div class="cart-summary-row"><span>Numero do pedido</span><strong id="conf-order-id">VM-DEMO-0000</strong></div>' +
    '<div class="cart-summary-row"><span>Data</span><span id="conf-date">' + new Date().toLocaleDateString('pt-BR') + '</span></div>' +
    '<div class="cart-summary-row"><span>Pagamento</span><span id="conf-payment">PIX (simulado)</span></div>' +
    '<div class="cart-summary-row"><span>Status</span><span class="badge badge-status confirmed">Confirmado</span></div>' +
    '<div class="cart-summary-row total"><span>Total</span><span id="conf-total">' + T.formatPrice(0) + '</span></div>' +
    '<div style="margin-top:var(--space-4);">' +
      '<h4 style="font-size:var(--fs-sm);margin-bottom:var(--space-2);">Itens</h4>' +
      '<div id="conf-items" style="font-size:var(--fs-sm);color:var(--text-secondary);"></div>' +
    '</div>' +
  '</div>';

  const buttons = '<div style="display:flex;gap:var(--space-3);flex-wrap:wrap;justify-content:center;">' +
    '<a href="conta-pedido.html" class="btn btn-primary btn-lg">' + T.ICONS.package + ' Acompanhar pedido</a>' +
    '<a href="index.html" class="btn btn-secondary btn-lg">Continuar comprando</a>' +
  '</div>';

  const disclaimer = '<p style="font-size:var(--fs-xs);color:var(--text-muted);margin-top:var(--space-6);">' +
    T.escapeHtml(store.demoDisclaimer) +
  '</p>';

  const content = '<div class="container">' +
    breadcrumb +
    '<div class="confirmation">' +
      successIcon +
      '<h1>Pedido confirmado!</h1>' +
      '<p>Obrigado pela sua compra. Seu pedido foi processado com sucesso.</p>' +
      orderInfo +
      buttons +
      disclaimer +
    '</div>' +
  '</div>';

  const html = T.renderLayout({
    store: store,
    data: data,
    title: 'Pedido confirmado',
    description: 'Confirmacao de pedido — ' + store.name,
    canonical: '/pedido-confirmado.html',
    noindex: true,
    active: '',
    content: content
  });

  return { filename: 'pedido-confirmado.html', html: html };
}

function render(data, T) {
  return [
    renderCheckout(data, T),
    renderConfirmation(data, T)
  ];
}

module.exports = { render };

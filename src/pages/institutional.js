/* VendaMais — Institutional pages renderer */
module.exports = {
  render(data, T) {
    const { store, categories } = data;
    const pages = [];

    /* === sobre.html === */
    pages.push({
      filename: 'sobre.html', slug: 'sobre', noindex: false,
      html: T.renderLayout({
        store, data, active: 'sobre', canonical: '/sobre.html',
        title: 'Sobre a VendaMais — Plataforma de E-commerce', description: 'Conheca a VendaMais: plataforma de e-commerce demonstrativa com checkout, conta e admin.',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Sobre nos' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Sobre nos' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Sobre a ${T.escapeHtml(store.name)}</h1>
          <p class="text-lg text-secondary mb-6">${T.escapeHtml(store.tagline)}</p>
          <p class="mb-4">${T.escapeHtml(store.description)}</p>
          <h2 class="mb-3">Nossa missao</h2>
          <p class="mb-4 text-secondary">Demonstrar que e possivel construir uma experiencia de e-commerce completa, profissional e acessivel, sem comprometer a qualidade tecnica ou a etica de comunicacao.</p>
          <h2 class="mb-3">Valores</h2>
          <ul style="list-style:disc;padding-left:24px" class="mb-6">
            <li class="mb-2">Transparencia: todo dado e demonstrativo</li>
            <li class="mb-2">Qualidade tecnica: arquitetura limpa e performatica</li>
            <li class="mb-2">Acessibilidade: WCAG 2.2 AA</li>
            <li class="mb-2">Honestidade: sem metricas falsas ou claims inventados</li>
          </ul>
          <div class="demo-badge">${T.ICONS.shield} ${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === entrega.html === */
    pages.push({
      filename: 'entrega.html', slug: 'entrega', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/entrega.html',
        title: 'Entrega e Prazos — Frete Gratis acima de R$ 200', description: 'Modalidades de entrega: normal 3-5 dias, expressa 1-2 dias. Frete gratis acima de R$ 200 (demo).',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Entrega' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Entrega' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Entrega</h1>
          <p class="mb-6 text-secondary">Todas as informacoes abaixo sao demonstrativas. Nao ha operacao logistica real.</p>
          <div class="card mb-4"><h3 class="mb-2">Entrega Normal</h3><p class="text-secondary">Prazo: 3-5 dias uteis (demonstrativo)</p><p class="text-secondary">Custo: Gratis acima de R$ 200,00 · R$ 19,90 abaixo</p></div>
          <div class="card mb-4"><h3 class="mb-2">Entrega Expressa</h3><p class="text-secondary">Prazo: 1-2 dias uteis (demonstrativo)</p><p class="text-secondary">Custo: R$ 19,90 · Gratis acima de R$ 500,00</p></div>
          <div class="card mb-4"><h3 class="mb-2">Rastreamento</h3><p class="text-secondary">Acompanhe seu pedido em <a href="rastreio.html">rastreio.html</a></p></div>
          <div class="demo-badge">${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === trocas-devolucoes.html === */
    pages.push({
      filename: 'trocas-devolucoes.html', slug: 'trocas-devolucoes', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/trocas-devolucoes.html',
        title: 'Trocas e Devolucoes — 30 dias para trocar', description: 'Politica de trocas e devolucoes em 30 dias. Produto original, embalagem intacta (demo).',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Trocas e Devolucoes' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Trocas e Devolucoes' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Trocas e Devolucoes</h1>
          <p class="mb-6 text-secondary">Politica demonstrativa — nao ha operacao real de troca ou devolucao.</p>
          <h2 class="mb-3">Prazo</h2><p class="mb-4 text-secondary">30 dias corridos a partir da data de entrega (demonstrativa).</p>
          <h2 class="mb-3">Condicoes</h2><ul style="list-style:disc;padding-left:24px" class="mb-4"><li class="mb-2">Produto em estado original</li><li class="mb-2">Embalagem intacta</li><li class="mb-2">Acessorios inclusos</li></ul>
          <h2 class="mb-3">Como solicitar</h2><p class="mb-6 text-secondary">Acesse sua conta em <a href="conta.html">conta.html</a> e abra uma solicitacao (demo).</p>
          <div class="demo-badge">${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === pagamentos.html === */
    pages.push({
      filename: 'pagamentos.html', slug: 'pagamentos', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/pagamentos.html',
        title: 'Pagamentos — PIX com 5% OFF e Cartao em 12x', description: 'PIX com 5% de desconto e cartao de credito em ate 12x sem juros. Pagamentos simulados (demo).',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Pagamentos' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Pagamentos' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Pagamentos</h1>
          <p class="mb-6 text-secondary">Todas as transacoes sao simuladas. Nenhum pagamento real e processado.</p>
          <div class="card mb-4"><h3 class="mb-2">${T.ICONS.pix} PIX</h3><p class="text-secondary">5% de desconto · Pagamento instantaneo (simulado)</p><p class="text-secondary">QR Code e codigo copia e cola demonstrativos</p></div>
          <div class="card mb-4"><h3 class="mb-2">${T.ICONS.card} Cartao de Credito</h3><p class="text-secondary">Ate 12x sem juros (simulado)</p><p class="text-secondary">Aprovacao e recusa simuladas para demonstracao de estados</p></div>
          <div class="demo-badge">${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === faq.html === */
    const faqs = [
      { q: 'Como funciona o frete gratis?', a: 'Frete gratis em compras acima de R$ 200,00 (demonstrativo).' },
      { q: 'Quanto tempo leva a entrega?', a: 'Normal: 3-5 dias uteis. Expressa: 1-2 dias uteis. Prazos demonstrativos.' },
      { q: 'Como rastrear meu pedido?', a: 'Acesse a pagina de rastreio em rastreio.html e digite o numero do seu pedido.' },
      { q: 'Quais formas de pagamento?', a: 'PIX com 5% de desconto e cartao de credito em ate 12x. Ambos simulados.' },
      { q: 'Posso trocar ou devolver?', a: 'Sim, em ate 30 dias. Veja trocas-devolucoes.html. Politica demonstrativa.' },
      { q: 'Este site e real?', a: 'Nao. E um ambiente demonstrativo para apresentar uma plataforma de e-commerce.' },
      { q: 'Como usar cupons?', a: 'No carrinho de compras, digite o codigo do cupom no campo apropriado. Ex: EXPO10.' },
      { q: 'Os dados sao reais?', a: 'Nao. Todos os produtos, clientes, pedidos, avaliacoes e metricas sao ficticios.' }
    ];
    pages.push({
      filename: 'faq.html', slug: 'faq', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/faq.html',
        title: 'Perguntas Frequentes — Frete, PIX, Trocas e Mais', description: 'Respostas sobre frete gratis, prazos de entrega, formas de pagamento, trocas e dados demonstrativos.',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'FAQ' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'FAQ' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:24px">Perguntas Frequentes</h1>
          ${faqs.map(f => `<div class="faq-item"><button class="faq-question">${T.escapeHtml(f.q)}${T.ICONS.chevronDown}</button><div class="faq-answer"><p>${T.escapeHtml(f.a)}</p></div></div>`).join('')}
        </div></section>`
      })
    });

    /* === contato.html === */
    pages.push({
      filename: 'contato.html', slug: 'contato', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/contato.html',
        title: 'Contato — Fale com a VendaMais (Demo)', description: 'Formulario de contato e informacoes da VendaMais. Ambiente demonstrativo, sem envio real.',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Contato' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Contato' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Contato</h1>
          <p class="mb-6 text-secondary">Formulario demonstrativo — nenhuma mensagem e realmente enviada.</p>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px" class="contato-grid">
            <div class="card">
              <h3 class="mb-4">Envie sua mensagem</h3>
              <form id="newsletter-form">
                <div class="field"><label class="label">Nome</label><input class="input" required></div>
                <div class="field"><label class="label">E-mail</label><input class="input" type="email" required></div>
                <div class="field"><label class="label">Assunto</label><input class="input" required></div>
                <div class="field"><label class="label">Mensagem</label><textarea class="textarea" rows="4" required></textarea></div>
                <button type="submit" class="btn btn-primary btn-block">Enviar mensagem</button>
              </form>
            </div>
            <div>
              <div class="card mb-4"><h3>${T.ICONS.phone} Telefone</h3><p class="text-secondary">${store.contact.phone}</p></div>
              <div class="card mb-4"><h3>${T.ICONS.mail} E-mail</h3><p class="text-secondary">${store.contact.email}</p></div>
              <div class="card"><h3>${T.ICONS.mapPin} Endereco</h3><p class="text-secondary">${T.escapeHtml(store.contact.address)}</p></div>
            </div>
          </div>
        </div></section>
        <style>@media(max-width:768px){.contato-grid{grid-template-columns:1fr}}</style>`
      })
    });

    /* === privacidade.html === */
    pages.push({
      filename: 'privacidade.html', slug: 'privacidade', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/privacidade.html',
        title: 'Politica de Privacidade e LGPD — VendaMais', description: 'Politica de privacidade em conformidade com a LGPD. Nenhum dado pessoal real e coletado (demo).',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Privacidade' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Privacidade' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Politica de Privacidade</h1>
          <p class="mb-4 text-secondary">A VendaMais e um ambiente demonstrativo. Nenhum dado pessoal real e coletado, armazenado ou processado.</p>
          <h2 class="mb-3">LGPD</h2><p class="mb-4 text-secondary">Em conformidade com a Lei Geral de Protecao de Dados (Lei 13.709/2018), informamos que todos os dados exibidos nesta plataforma sao ficticios.</p>
          <h2 class="mb-3">Cookies</h2><p class="mb-4 text-secondary">Utilizamos apenas cookies essenciais para o funcionamento da experiencia demonstrativa (localStorage para carrinho e favoritos).</p>
          <h2 class="mb-3">Dados pessoais</h2><p class="mb-6 text-secondary">Nenhum dado pessoal real e solicitado ou armazenado. Formularios sao demonstrativos.</p>
          <div class="demo-badge">${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === termos.html === */
    pages.push({
      filename: 'termos.html', slug: 'termos', noindex: false,
      html: T.renderLayout({
        store, data, canonical: '/termos.html',
        title: 'Termos de Uso — Plataforma Demonstrativa', description: 'Termos de uso da VendaMais. Site demonstrativo, sem transacoes comerciais reais.',
        structuredData: T.renderBreadcrumbSchema([{ label: 'Inicio', href: 'index.html' }, { label: 'Termos de Uso' }], store.url),
        content: `
        ${T.renderBreadcrumb([{ label: 'Inicio', href: 'index.html' }, { label: 'Termos de Uso' }])}
        <section class="section"><div class="container-narrow">
          <h1 style="font-size:var(--fs-3xl);margin-bottom:16px">Termos de Uso</h1>
          <p class="mb-4 text-secondary">Este site e uma plataforma demonstrativa. Nao ha transacoes comerciais reais.</p>
          <h2 class="mb-3">Aceitacao</h2><p class="mb-4 text-secondary">Ao acessar esta plataforma, voce entende que todos os produtos, precos, pedidos e avaliacoes sao ficticios.</p>
          <h2 class="mb-3">Uso permitido</h2><p class="mb-4 text-secondary">A plataforma pode ser usada para avaliacao tecnica, estudo de UX e demonstracao de produto.</p>
          <h2 class="mb-3">Limitacao</h2><p class="mb-6 text-secondary">Nao e possivel realizar compras reais. Nenhum pagamento e processado.</p>
          <div class="demo-badge">${T.escapeHtml(store.demoDisclaimer)}</div>
        </div></section>`
      })
    });

    /* === 404.html === */
    pages.push({
      filename: '404.html', slug: '404', noindex: true,
      html: T.renderLayout({
        store, data, canonical: '/404.html',
        title: '404 - Pagina nao encontrada', description: 'Pagina nao encontrada.',
        content: `
        <section class="error-404">
          <h1>404</h1>
          <h2>Ops, esse produto saiu da prateleira.</h2>
          <p class="mb-6">A pagina que voce procura nao existe ou foi movida.</p>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap">
            <a href="index.html" class="btn btn-primary">Voltar a loja</a>
            <a href="produtos.html" class="btn btn-secondary">Ver produtos</a>
          </div>
          <div style="margin-top:32px">
            <p class="text-muted mb-2">Categorias:</p>
            <div style="display:flex;gap:8px;justify-content:center;flex-wrap:wrap">
              ${categories.map(c => `<a href="categoria-${c.slug}.html" class="btn btn-ghost btn-sm">${c.name}</a>`).join('')}
            </div>
          </div>
        </section>`
      })
    });

    return pages;
  }
};

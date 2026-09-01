/* VendaMais — Admin page renderer */
module.exports = {
  render(data, T) {
    const { store, products, customers, orders, coupons, analytics } = data;
    const I = T.ICONS;

    const kpiCards = [
      { label: 'Pedidos hoje', value: analytics.kpis.ordersToday, change: '+12%', dir: 'up' },
      { label: 'Receita (demo)', value: T.formatPrice(analytics.kpis.revenue), change: '+8%', dir: 'up' },
      { label: 'Ticket medio (demo)', value: T.formatPrice(analytics.kpis.avgTicket), change: '+3%', dir: 'up' },
      { label: 'Conversao (demo)', value: analytics.kpis.conversion + '%', change: '-0.2%', dir: 'down' }
    ].map(k => `<div class="admin-kpi"><div class="admin-kpi-label">${k.label}</div><div class="admin-kpi-value">${k.value}</div><div class="admin-kpi-change ${k.dir}">${k.change}</div></div>`).join('');

    const revenueBars = analytics.revenue30d.map((v, i) => {
      const max = Math.max(...analytics.revenue30d);
      const h = Math.round(v / max * 100);
      return `<div class="chart-bar-item" style="height:${h}%" data-value="${i + 1}"></div>`;
    }).join('');

    const ordersByStatus = Object.entries(analytics.ordersByStatus).map(([s, n]) =>
      `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>${s.replace(/_/g, ' ')}</span><span class="badge-status ${s}">${n}</span></div>`
    ).join('');

    const abandonedCarts = analytics.abandonedCarts.map(c =>
      `<div style="display:flex;justify-content:space-between;align-items:center;padding:12px 0;border-bottom:1px solid var(--border)"><div><strong>${c.customer}</strong><br><span class="text-xs text-muted">${c.timeAgo} atrás · ${T.formatPrice(c.value)}</span></div><button class="btn btn-secondary btn-sm" onclick="VendaMais.showToast('Recuperacao simulada (demo)','info')">Simular recuperacao</button></div>`
    ).join('');

    const ordersTable = orders.map(o => `
      <tr>
        <td><strong>${o.id}</strong></td>
        <td>${o.customerName}</td>
        <td>${o.date}</td>
        <td>${o.payment === 'pix' ? 'PIX' : 'Cartao'}</td>
        <td>${T.formatPrice(o.total)}</td>
        <td><span class="badge-status ${o.status}">${o.status.replace(/_/g,' ')}</span></td>
        <td><button class="link-btn" onclick="VendaMais.showToast('Detalhes do pedido (demo)','info')">Ver</button></td>
      </tr>`).join('');

    const productsTable = products.map(p => `
      <tr>
        <td>${p.sku}</td>
        <td>${T.escapeHtml(p.name)}</td>
        <td>${p.category}</td>
        <td>${T.formatPrice(p.price)}</td>
        <td>${p.stock}</td>
        <td><span class="badge-status ${p.stock === 0 ? 'cancelled' : p.stock < p.minStock ? 'separating' : 'delivered'}">${p.stock === 0 ? 'Esgotado' : p.stock < p.minStock ? 'Baixo' : 'Normal'}</span></td>
        <td><button class="link-btn" onclick="VendaMais.showToast('Edicao de produto (demo)','info')">Editar</button></td>
      </tr>`).join('');

    const stockTable = products.map(p => `
      <tr>
        <td>${p.sku}</td>
        <td>${T.escapeHtml(p.name)}</td>
        <td>${p.stock}</td>
        <td>${Math.round(p.stock * 0.1)}</td>
        <td>${p.minStock}</td>
        <td><span class="badge-status ${p.stock === 0 ? 'cancelled' : p.stock < p.minStock ? 'separating' : 'delivered'}">${p.stock === 0 ? 'Esgotado' : p.stock < p.minStock ? 'Baixo' : 'Normal'}</span></td>
      </tr>`).join('');

    const customersTable = customers.map(c => `
      <tr>
        <td>${T.escapeHtml(c.name)}</td>
        <td>${c.orders}</td>
        <td>${T.formatPrice(c.totalSpent)}</td>
        <td>${c.lastOrder}</td>
        <td><span class="badge-status ${c.status === 'vip' ? 'delivered' : c.status === 'novo' ? 'separating' : 'paid'}">${c.status}</span></td>
      </tr>`).join('');

    const couponsTable = coupons.map(c => `
      <tr>
        <td><strong>${c.code}</strong></td>
        <td>${c.type}</td>
        <td>${c.type === 'percent' ? c.value + '%' : c.type === 'fixed' ? T.formatPrice(c.value) : 'Gratis'}</td>
        <td>${T.escapeHtml(c.description)}</td>
        <td>${c.uses}</td>
        <td><span class="badge-status ${c.active ? 'delivered' : 'cancelled'}">${c.active ? 'Ativo' : 'Inativo'}</span></td>
        <td>${c.expiresAt}</td>
      </tr>`).join('');

    const funnelMax = analytics.funnel.visits;
    const funnel = [
      { label: 'Visitas', value: analytics.funnel.visits },
      { label: 'Visualizaram produto', value: analytics.funnel.productViews },
      { label: 'Adicionaram ao carrinho', value: analytics.funnel.addToCart },
      { label: 'Iniciaram checkout', value: analytics.funnel.checkoutStart },
      { label: 'Pedidos simulados', value: analytics.funnel.ordersCompleted }
    ].map(f => {
      const pct = Math.round(f.value / funnelMax * 100);
      return `<div class="funnel-step"><div class="funnel-label">${f.label}</div><div class="funnel-bar" style="width:${pct}%">${f.value}</div></div>`;
    }).join('');

    const topProducts = analytics.topProducts.map((p, i) =>
      `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid var(--border)"><span>${i + 1}. ${T.escapeHtml(p.name)}</span><span><strong>${p.sales}</strong> vendas · ${p.views} views</span></div>`
    ).join('');

    const trafficSources = analytics.trafficSources.map(t => {
      return `<div style="margin-bottom:12px"><div style="display:flex;justify-content:space-between;font-size:.875rem;margin-bottom:4px"><span>${t.source}</span><strong>${t.visits}</strong></div><div style="height:8px;background:var(--bg);border-radius:4px;overflow:hidden"><div style="height:100%;width:${t.pct}%;background:var(--accent);border-radius:4px"></div></div></div>`;
    }).join('');

    const content = `
<div class="admin-login-gate" id="admin-login-gate" style="display:flex;align-items:center;justify-content:center;min-height:100vh;background:var(--bg)">
  <div class="card" style="max-width:400px;width:90%;text-align:center">
    <div style="margin-bottom:16px">${I.dashboard}</div>
    <h1 style="font-size:1.5rem;margin-bottom:8px">VendaMais Admin</h1>
    <p class="text-muted text-sm mb-6">Ambiente demonstrativo — senha: admin</p>
    <form id="admin-login-form">
      <div class="field"><input type="password" class="input" id="admin-password" placeholder="Senha" aria-label="Senha"></div>
      <button type="submit" class="btn btn-primary btn-block btn-lg">Entrar</button>
    </form>
  </div>
</div>
<div id="admin-content" style="display:none">
  <div class="admin-topbar" style="background:var(--surface);border-bottom:1px solid var(--border);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100">
    <div style="display:flex;align-items:center;gap:12px"><strong>VendaMais Admin</strong><span class="demo-badge">DEMO</span></div>
    <a href="index.html" class="btn btn-ghost btn-sm">Sair</a>
  </div>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3>Menu</h3>
      <ul class="admin-menu">
        <li><a href="#dashboard" class="active" onclick="VendaMais.showAdminSection('dashboard')">${I.dashboard} Dashboard</a></li>
        <li><a href="#pedidos" onclick="VendaMais.showAdminSection('pedidos')">${I.package} Pedidos</a></li>
        <li><a href="#produtos" onclick="VendaMais.showAdminSection('produtos')">${I.box} Produtos</a></li>
        <li><a href="#estoque" onclick="VendaMais.showAdminSection('estoque')">${I.tag} Estoque</a></li>
        <li><a href="#clientes" onclick="VendaMais.showAdminSection('clientes')">${I.users} Clientes</a></li>
        <li><a href="#cupons" onclick="VendaMais.showAdminSection('cupons')">${I.tag} Cupons</a></li>
        <li><a href="#analytics" onclick="VendaMais.showAdminSection('analytics')">${I.chart} Analytics</a></li>
        <li><a href="#configuracoes" onclick="VendaMais.showAdminSection('configuracoes')">${I.settings} Configuracoes</a></li>
      </ul>
    </aside>
    <main class="admin-content">
      <section id="admin-dashboard" class="admin-section">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Dashboard</h2>
        <div class="admin-kpi-grid">${kpiCards}</div>
        <div class="admin-chart"><h3>Receita — ultimos 30 dias (demo)</h3><div class="chart-bar">${revenueBars}</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="admin-chart"><h3>Pedidos por status</h3>${ordersByStatus}</div>
          <div class="admin-chart"><h3>Carrinhos abandonados</h3>${abandonedCarts}</div>
        </div>
      </section>
      <section id="admin-pedidos" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Pedidos</h2>
        <div class="table-wrap"><table class="table"><thead><tr><th>Pedido</th><th>Cliente</th><th>Data</th><th>Pagamento</th><th>Total</th><th>Status</th><th>Acoes</th></tr></thead><tbody>${ordersTable}</tbody></table></div>
      </section>
      <section id="admin-produtos" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Produtos</h2>
        <div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Nome</th><th>Categoria</th><th>Preco</th><th>Estoque</th><th>Status</th><th>Acoes</th></tr></thead><tbody>${productsTable}</tbody></table></div>
      </section>
      <section id="admin-estoque" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Estoque</h2>
        <div class="admin-kpi-grid" style="margin-bottom:24px">
          <div class="admin-kpi"><div class="admin-kpi-label">Total unidades</div><div class="admin-kpi-value">${products.reduce((s, p) => s + p.stock, 0)}</div></div>
          <div class="admin-kpi"><div class="admin-kpi-label">Estoque baixo</div><div class="admin-kpi-value">${products.filter(p => p.stock < p.minStock && p.stock > 0).length}</div></div>
          <div class="admin-kpi"><div class="admin-kpi-label">Esgotados</div><div class="admin-kpi-value">${products.filter(p => p.stock === 0).length}</div></div>
        </div>
        <div class="table-wrap"><table class="table"><thead><tr><th>SKU</th><th>Produto</th><th>Disponivel</th><th>Reservado</th><th>Minimo</th><th>Status</th></tr></thead><tbody>${stockTable}</tbody></table></div>
      </section>
      <section id="admin-clientes" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Clientes</h2>
        <div class="table-wrap"><table class="table"><thead><tr><th>Nome</th><th>Pedidos</th><th>Total gasto</th><th>Ultima compra</th><th>Status</th></tr></thead><tbody>${customersTable}</tbody></table></div>
      </section>
      <section id="admin-cupons" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Cupons</h2>
        <div class="table-wrap"><table class="table"><thead><tr><th>Codigo</th><th>Tipo</th><th>Valor</th><th>Descricao</th><th>Usos</th><th>Status</th><th>Validade</th></tr></thead><tbody>${couponsTable}</tbody></table></div>
      </section>
      <section id="admin-analytics" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Analytics</h2>
        <div class="admin-chart"><h3>Funil de conversao (demo)</h3><div class="admin-funnel">${funnel}</div></div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
          <div class="admin-chart"><h3>Produtos mais vistos</h3>${topProducts}</div>
          <div class="admin-chart"><h3>Origem de trafego</h3>${trafficSources}</div>
        </div>
      </section>
      <section id="admin-configuracoes" class="admin-section" style="display:none">
        <h2 style="font-size:1.5rem;margin-bottom:24px">Configuracoes</h2>
        <div class="card" style="max-width:600px">
          <div class="field"><label class="label">Nome da loja</label><input class="input" value="${T.escapeHtml(store.name)}"></div>
          <div class="field"><label class="label">E-mail de contato</label><input class="input" value="${store.contact.email}"></div>
          <div class="field"><label class="label">Telefone</label><input class="input" value="${store.contact.phone}"></div>
          <div class="field"><label class="label">Frete gratis acima de</label><input class="input" value="R$ 200,00"></div>
          <button class="btn btn-primary" onclick="VendaMais.showToast('Configuracoes salvas (demo)','success')">Salvar</button>
        </div>
      </section>
    </main>
  </div>
</div>`;

    return [{
      filename: 'admin.html',
      slug: 'admin',
      noindex: true,
      html: `<!DOCTYPE html><html lang="pt-BR"><head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0">
<title>VendaMais Admin | ${store.name}</title>
<meta name="robots" content="noindex,nofollow">
<link rel="stylesheet" href="styles/base.css"><link rel="stylesheet" href="styles/components.css"><link rel="stylesheet" href="styles/pages.css">
<link rel="icon" type="image/svg+xml" href="favicon.svg">
</head><body>${content}<script src="scripts/app.js" defer></script></body></html>`
    }];
  }
};

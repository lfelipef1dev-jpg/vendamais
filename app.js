// === VendaMais — E-commerce Demo ===
(function () {
  'use strict';

  const UNSPLASH = 'https://images.unsplash.com/photo-';

  const produtos = [
    { id: 1, nome: 'Fone Bluetooth Pro X1', categoria: 'eletronicos', desc: 'Headphone premium com cancelamento ativo de ruído (ANC), drivers de 40mm para áudio Hi-Res, bateria de 40 horas e Bluetooth 5.3.', preco: 299.90, original: 459.90, imagem: UNSPLASH + '1505740420928-5e560c06d30e?w=500&h=400&fit=crop', avaliacao: 4.8, avaliacoes: 124, badge: 'destaque', frete: true, variacoes: { cor: ['Preto', 'Branco', 'Azul'] }, specs: ['Bluetooth 5.3', 'Bateria 40h', 'Cancelamento ANC', 'Drivers 40mm', 'Peso 250g'] },
    { id: 2, nome: 'Smartwatch Ultra Fit', categoria: 'eletronicos', desc: 'Relógio inteligente com tela AMOLED, monitoramento cardíaco 24h, oximetria (SpO2), GPS integrado e 100 modos de exercício.', preco: 499.90, original: 799.90, imagem: UNSPLASH + '1546868871-7041f2a55e12?w=500&h=400&fit=crop', avaliacao: 4.6, avaliacoes: 89, badge: 'frete', frete: true, variacoes: { cor: ['Preto', 'Prata', 'Dourado'] }, specs: ['AMOLED 1.4"', 'GPS + GLONASS', '5ATM', 'Bateria 14 dias', '100+ esportes'] },
    { id: 3, nome: 'Camiseta Tech DryFit', categoria: 'roupas', desc: 'Camiseta esportiva com tecnologia DryFit, secagem 3x mais rápida e anti-odor.', preco: 89.90, original: 129.90, imagem: UNSPLASH + '1521572163474-6864f9cf17ab?w=500&h=400&fit=crop', avaliacao: 4.5, avaliacoes: 234, badge: 'desconto', frete: false, variacoes: { cor: ['Preto', 'Branco', 'Cinza', 'Azul Marinho'], tamanho: ['P', 'M', 'G', 'GG'] }, specs: ['DryFit Pro', 'Anti-odor', 'Costura zero', 'UPF 50+', '98% poliéster'] },
    { id: 4, nome: 'Tênis Runner Air Max', categoria: 'roupas', desc: 'Tênis de corrida com amortecimento Air Max, mesh respirável com 30% reciclado e solado antiderrapante.', preco: 349.90, original: 499.90, imagem: UNSPLASH + '1542291026-7eec264c27ff?w=500&h=400&fit=crop', avaliacao: 4.9, avaliacoes: 412, badge: 'destaque', frete: true, variacoes: { cor: ['Preto/Vermelho', 'Branco/Prata', 'Azul Royal'], tamanho: ['38', '39', '40', '41', '42', '43'] }, specs: ['Air Max 360', 'Mesh reciclado', 'Palmilha ortopédica', 'Solado borracha', '280g'] },
    { id: 5, nome: 'Mochila Anti-Furto Pro', categoria: 'acessorios', desc: 'Mochila urbana com zíperes ocultos, compartimento para notebook 15.6" e porta USB.', preco: 199.90, original: 299.90, imagem: UNSPLASH + '1553062407-98eeb64c6a62?w=500&h=400&fit=crop', avaliacao: 4.7, avaliacoes: 156, badge: 'frete', frete: true, variacoes: { cor: ['Cinza', 'Preto', 'Azul'] }, specs: ['USB integrada', 'Anti-corte', 'Impermeável', '15.6" laptop', '30L'] },
    { id: 6, nome: 'Powerbank Ultra 20.000mAh', categoria: 'eletronicos', desc: 'Carregador portátil 65W com 2 USB-C, 1 USB-A, display digital e aprovado para avião.', preco: 149.90, original: 229.90, imagem: UNSPLASH + '1583863788434-e58a36330cf0?w=500&h=400&fit=crop', avaliacao: 4.4, avaliacoes: 67, badge: null, frete: false, variacoes: { cor: ['Preto', 'Branco'] }, specs: ['20.000mAh', '65W PD', '2x USB-C', '1x USB-A', 'Display LED'] },
    { id: 7, nome: 'Cafeteira Smart WiFi', categoria: 'casa', desc: 'Cafeteira programável via app, moinho de cerâmica e capacidade para 12 xícaras.', preco: 899.90, original: 1299.90, imagem: UNSPLASH + '1517668808822-9ebb02f2a0e6?w=500&h=400&fit=crop', avaliacao: 4.8, avaliacoes: 201, badge: 'destaque', frete: true, variacoes: { cor: ['Inox', 'Preto Fosco'] }, specs: ['App WiFi', 'Moinho cerâmico', '12 xícaras', 'Timer', 'Auto-limpeza'] },
    { id: 8, nome: 'Óculos Polarizados UV400', categoria: 'acessorios', desc: 'Óculos de sol com lentes polarizadas TAC, 9 camadas de proteção UV e armação de titânio 22g.', preco: 179.90, original: 279.90, imagem: UNSPLASH + '1511499767150-a48a237f0083?w=500&h=400&fit=crop', avaliacao: 4.3, avaliacoes: 45, badge: 'desconto', frete: false, variacoes: { cor: ['Preto', 'Tartaruga', 'Prata'] }, specs: ['TAC polarizado', 'Titanio', 'UV400', '22g', 'Estojo rígido'] },
    { id: 9, nome: 'Mochila Executiva Premium', categoria: 'acessorios', desc: 'Mochila de couro sintético com divisões para notebook 15", tablet 10" e organizador de documentos.', preco: 249.90, original: 349.90, imagem: UNSPLASH + '1547949003-9792a18a2601?w=500&h=400&fit=crop', avaliacao: 4.6, avaliacoes: 78, badge: 'frete', frete: true, variacoes: { cor: ['Marrom', 'Preto', 'Caramelo'] }, specs: ['Couro sintético PU', 'Notebook 15"', 'Tablet 10"', '5 compartimentos'] },
    { id: 10, nome: 'Tablet 10" 4GB RAM 64GB', categoria: 'eletronicos', desc: 'Tablet com tela IPS Full HD 10.1", 4GB RAM, 64GB expansível até 512GB, Android 13 e bateria 6000mAh.', preco: 799.90, original: 1099.90, imagem: UNSPLASH + '1561154464-82e9adf32764?w=500&h=400&fit=crop', avaliacao: 4.5, avaliacoes: 92, badge: 'desconto', frete: true, variacoes: { cor: ['Cinza', 'Dourado', 'Prata'] }, specs: ['10.1" FHD', '4GB RAM', '64GB + SD 512GB', 'Android 13', '6000mAh'] },
    { id: 11, nome: 'Relógio Minimalista', categoria: 'acessorios', desc: 'Relógio analógico com movimento japonês Miyota, vidro de safira e pulseira de couro genuíno.', preco: 349.90, original: 499.90, imagem: UNSPLASH + '1524592094714-0f0654e20314?w=500&h=400&fit=crop', avaliacao: 4.7, avaliacoes: 134, badge: null, frete: false, variacoes: { cor: ['Preto', 'Marrom', 'Azul'] }, specs: ['Miyota', 'Vidro safira', 'Couro genuíno', '50m', '2 anos garantia'] },
    { id: 12, nome: 'Cadeira Ergonômica Home', categoria: 'casa', desc: 'Cadeira de escritório com apoio lombar ajustável, braços 4D, encosto em mesh e certificação BIFMA.', preco: 1299.90, original: 1899.90, imagem: UNSPLASH + '1580480055273-228ff5388ef8?w=500&h=400&fit=crop', avaliacao: 4.9, avaliacoes: 312, badge: 'frete', frete: true, variacoes: { cor: ['Preto', 'Cinza'] }, specs: ['Lombar ajustável', 'Braço 4D', 'Mesh', 'BIFMA', '150kg'] },
    { id: 13, nome: 'Teclado Mecânico RGB Gamer', categoria: 'eletronicos', desc: 'Teclado mecânico switches Blue, iluminação RGB, anti-ghosting e estrutura em alumínio.', preco: 349.90, original: 499.90, imagem: UNSPLASH + '1541140532154-b024d705b90a?w=500&h=400&fit=crop', avaliacao: 4.7, avaliacoes: 203, badge: 'destaque', frete: true, variacoes: { cor: ['Preto', 'Branco'] }, specs: ['Switches Blue', 'RGB 16.8M', 'Anti-ghosting', 'Alumínio', 'USB-C'] },
    { id: 14, nome: 'Monitor 27" Full HD 165Hz', categoria: 'eletronicos', desc: 'Monitor gamer 27" IPS, Full HD, 165Hz, 1ms e FreeSync.', preco: 1299.90, original: 1899.90, imagem: UNSPLASH + '1527443224154-c4a3942d3acf?w=500&h=400&fit=crop', avaliacao: 4.8, avaliacoes: 156, badge: 'frete', frete: true, variacoes: { cor: ['Preto'] }, specs: ['27" IPS', 'Full HD', '165Hz', '1ms', 'FreeSync'] },
    { id: 15, nome: 'Calça Jeans Slim Fit', categoria: 'roupas', desc: 'Calça jeans corte slim, 2% elastano, lavagem escura premium e bolsos reforçados.', preco: 199.90, original: 279.90, imagem: UNSPLASH + '1542272604-787c3835535d?w=500&h=400&fit=crop', avaliacao: 4.6, avaliacoes: 178, badge: null, frete: false, variacoes: { cor: ['Azul Escuro', 'Preto', 'Cinza'], tamanho: ['38', '40', '42', '44', '46'] }, specs: ['98% algodão', '2% elastano', 'Corte slim', 'Costura dupla'] },
    { id: 16, nome: 'Jaqueta Corta-Vento Leve', categoria: 'roupas', desc: 'Jaqueta leve e dobrável contra vento e chuva leve. Ripstop resistente, capuz embutido.', preco: 179.90, original: 249.90, imagem: UNSPLASH + '1551028719-00167b16eac5?w=500&h=400&fit=crop', avaliacao: 4.4, avaliacoes: 89, badge: 'frete', frete: true, variacoes: { cor: ['Preto', 'Cinza', 'Azul Navy'], tamanho: ['P', 'M', 'G', 'GG'] }, specs: ['Ripstop', 'Capuz embutido', 'Dobrável', 'Refletivo'] },
    { id: 17, nome: 'Shorts Esportivo Elite', categoria: 'roupas', desc: 'Shorts de treino com compressão leve, bolso interno para celular e acabamento a laser.', preco: 79.90, original: 119.90, imagem: UNSPLASH + '1517466787929-bc90951d0974?w=500&h=400&fit=crop', avaliacao: 4.7, avaliacoes: 134, badge: 'desconto', frete: false, variacoes: { cor: ['Preto', 'Cinza', 'Azul'], tamanho: ['P', 'M', 'G', 'GG'] }, specs: ['DryFit', 'Bolso interno', 'Acabamento laser', 'Leve 90g'] },
    { id: 18, nome: 'Meia Esportiva Anti-Odor (3 pares)', categoria: 'roupas', desc: 'Kit 3 pares de meias com fibra de bambu, anti-odor e anti-bolha.', preco: 49.90, original: 79.90, imagem: UNSPLASH + '1586350977771-b3b0abd50c82?w=500&h=400&fit=crop', avaliacao: 4.3, avaliacoes: 67, badge: null, frete: false, variacoes: { cor: ['Branco', 'Preto', 'Cinza'], tamanho: ['35-38', '39-42', '43-46'] }, specs: ['Fibra de bambu', 'Anti-odor', 'Anti-bolha', 'Kit 3 pares'] },
    { id: 19, nome: 'Carteira Couro Premium RFID', categoria: 'acessorios', desc: 'Carteira em couro legítimo com bloqueio RFID, 6 slots e janela para RG.', preco: 129.90, original: 199.90, imagem: UNSPLASH + '1627123424574-724758594e93?w=500&h=400&fit=crop', avaliacao: 4.8, avaliacoes: 212, badge: 'frete', frete: true, variacoes: { cor: ['Marrom', 'Preto', 'Caramelo'] }, specs: ['Couro legítimo', 'Bloqueio RFID', '6 slots', 'Janela RG'] },
    { id: 20, nome: 'Cinto Social Couro', categoria: 'acessorios', desc: 'Cinto social em couro bovino, fivela de metal escovado, 3.5cm de largura.', preco: 89.90, original: 139.90, imagem: UNSPLASH + '1624222247344-550fb60583dc?w=500&h=400&fit=crop', avaliacao: 4.5, avaliacoes: 98, badge: null, frete: false, variacoes: { cor: ['Marrom', 'Preto'], tamanho: ['90cm', '100cm', '110cm', '120cm'] }, specs: ['Couro bovino', 'Fivela metal', '3.5cm'] },
    { id: 21, nome: 'Liquidificador 12 Velocidades 1400W', categoria: 'casa', desc: 'Liquidificador profissional 1400W, 12 velocidades, jarra de vidro 2L e lâminas de aço cirúrgico.', preco: 349.90, original: 499.90, imagem: UNSPLASH + '1570222094114-d054a817e56b?w=500&h=400&fit=crop', avaliacao: 4.6, avaliacoes: 145, badge: 'desconto', frete: true, variacoes: { cor: ['Preto', 'Vermelho'] }, specs: ['1400W', '12 velocidades', 'Jarra 2L', 'Lâminas aço'] },
    { id: 22, nome: 'Aspirador Vertical Sem Fio', categoria: 'casa', desc: 'Aspirador vertical leve sem fio, bateria de 40 min, filtro HEPA e design 2-em-1.', preco: 599.90, original: 899.90, imagem: UNSPLASH + '1558317374-067fb5f30001?w=500&h=400&fit=crop', avaliacao: 4.7, avaliacoes: 189, badge: 'frete', frete: true, variacoes: { cor: ['Branco', 'Cinza'] }, specs: ['Sem fio', '40 min', 'Bateria lítio', 'Filtro HEPA'] },
    { id: 23, nome: 'Luminária LED Smart WiFi', categoria: 'casa', desc: 'Luminária de mesa 16 milhões de cores, app, timer e compatível com Alexa e Google Home.', preco: 249.90, original: 349.90, imagem: UNSPLASH + '1507473885765-e6ed057f782c?w=500&h=400&fit=crop', avaliacao: 4.5, avaliacoes: 76, badge: null, frete: false, variacoes: { cor: ['Branco', 'Preto'] }, specs: ['16M cores', 'App + voz', 'Timer', 'Alexa', 'Google Home'] },
    { id: 24, nome: 'Panela Elétrica Multiuso 5L', categoria: 'casa', desc: 'Panela elétrica multi-funções com 8 programas, 5 litros, antiaderente e timer.', preco: 399.90, original: 549.90, imagem: UNSPLASH + '1585515320310-259814833e62?w=500&h=400&fit=crop', avaliacao: 4.8, avaliacoes: 234, badge: 'destaque', frete: true, variacoes: { cor: ['Inox', 'Preto'] }, specs: ['8 programas', '5 litros', 'Antiaderente', 'Timer'] }
  ];

  const catFallback = {
    eletronicos: { grad: 'linear-gradient(135deg,#667eea,#764ba2)', icon: '📱' },
    roupas: { grad: 'linear-gradient(135deg,#f093fb,#f5576c)', icon: '👕' },
    acessorios: { grad: 'linear-gradient(135deg,#4facfe,#00f2fe)', icon: '🎒' },
    casa: { grad: 'linear-gradient(135deg,#43e97b,#38f9d7)', icon: '🏠' }
  };

  let carrinho = JSON.parse(localStorage.getItem('vendamais_carrinho')) || [];
  let filtroAtual = 'todos';
  let buscaAtual = '';
  let ordemAtual = 'padrao';
  let paginaAtual = 1;
  const itensPorPagina = 8;
  let cupomAtivo = null;
  let checkoutPasso = 1;

  function formatarPreco(valor) {
    return 'R$ ' + valor.toFixed(2).replace('.', ',');
  }

  function estrelasHTML(nota) {
    let html = `<div class="estrelas" aria-label="Avaliação ${nota} de 5">`;
    for (let i = 1; i <= 5; i++) {
      html += `<svg width="14" height="14" viewBox="0 0 24 24" fill="${i <= Math.round(nota) ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
    }
    html += '</div>';
    return html;
  }

  function imgHTML(p, classe, w, h) {
    const fb = catFallback[p.categoria] || { grad: '#333', icon: '📦' };
    const base = p.imagem.replace(/\/photo-/, '/photo-');
    const src = base.includes('?') ? base : base + '?w=' + (w || 500) + '&h=' + (h || 400) + '&fit=crop&q=80';
    const w1 = Math.round((w || 500) * 0.6);
    const w2 = Math.round((w || 500) * 1.0);
    const w3 = Math.round((w || 500) * 1.5);
    const srcset = `${src.replace('w=' + (w || 500), 'w=' + w1)} ${w1}w, ${src.replace('w=' + (w || 500), 'w=' + w2)} ${w2}w, ${src.replace('w=' + (w || 500), 'w=' + w3)} ${w3}w`;
    return `<img src="${src}" srcset="${srcset}" sizes="(max-width:600px) 90vw, (max-width:1024px) 45vw, 280px" alt="${p.nome}" class="${classe}" width="${w || 500}" height="${h || 400}" loading="lazy" decoding="async" onerror="this.style.display='none';this.nextElementSibling.style.display='flex';"><div class="img-fallback" style="display:none;background:${fb.grad}">${fb.icon}</div>`;
  }

  function badgeHTML(produto) {
    if (!produto.badge) return '';
    const labels = { destaque: 'Mais Vendido', frete: 'Frete Grátis', desconto: '-' + Math.round((1 - produto.preco / produto.original) * 100) + '%' };
    return `<span class="produto-badge badge-${produto.badge}">${labels[produto.badge]}</span>`;
  }

  function obterFiltrados() {
    let filtrados = filtroAtual === 'todos' ? produtos : produtos.filter(p => p.categoria === filtroAtual);
    if (buscaAtual) {
      const b = buscaAtual.toLowerCase();
      filtrados = filtrados.filter(p => p.nome.toLowerCase().includes(b) || p.desc.toLowerCase().includes(b));
    }
    if (ordemAtual === 'preco-asc') filtrados = [...filtrados].sort((a, b) => a.preco - b.preco);
    if (ordemAtual === 'preco-desc') filtrados = [...filtrados].sort((a, b) => b.preco - a.preco);
    if (ordemAtual === 'avaliacao') filtrados = [...filtrados].sort((a, b) => b.avaliacao - a.avaliacao);
    if (ordemAtual === 'nome') filtrados = [...filtrados].sort((a, b) => a.nome.localeCompare(b.nome));
    return filtrados;
  }

  function renderProdutos() {
    const grid = document.getElementById('produtos-grid');
    const info = document.getElementById('catalogo-info');
    const pag = document.getElementById('paginacao');
    if (!grid) return;
    const filtrados = obterFiltrados();

    if (filtrados.length === 0) {
      grid.innerHTML = '<p class="text-center" style="grid-column:1/-1;color:var(--text-muted);">Nenhum produto encontrado.</p>';
      if (pag) pag.innerHTML = '';
      if (info) info.textContent = '';
      return;
    }

    const totalPaginas = Math.ceil(filtrados.length / itensPorPagina);
    if (paginaAtual > totalPaginas) paginaAtual = 1;
    const inicio = (paginaAtual - 1) * itensPorPagina;
    const paginados = filtrados.slice(inicio, inicio + itensPorPagina);

    grid.innerHTML = paginados.map(p => `
      <article class="produto-card" data-categoria="${p.categoria}" role="listitem" aria-label="${p.nome}">
        <div class="produto-img" onclick="abrirProduto(${p.id})">${imgHTML(p, 'produto-img-tag')}${badgeHTML(p)}</div>
        <div class="produto-info">
          ${estrelasHTML(p.avaliacao)}
          <div class="avaliacao-texto">${p.avaliacao} (${p.avaliacoes} avaliações)</div>
          <div class="produto-categoria">${p.categoria}</div>
          <h3 class="produto-nome" onclick="abrirProduto(${p.id})">${p.nome}</h3>
          <p class="produto-desc">${p.desc}</p>
          <div class="produto-preco"><span class="atual">${formatarPreco(p.preco)}</span>${p.original ? `<span class="original">${formatarPreco(p.original)}</span>` : ''}</div>
          <button class="btn-add" onclick="adicionarCarrinho(${p.id})" aria-label="Adicionar ${p.nome} ao carrinho">Adicionar ao carrinho</button>
        </div>
      </article>
    `).join('');

    if (info) info.textContent = `${filtrados.length} produto(s) encontrado(s)`;

    if (pag && totalPaginas > 1) {
      let html = '';
      for (let i = 1; i <= totalPaginas; i++) {
        html += `<button type="button" class="btn-pagina ${i === paginaAtual ? 'active' : ''}" onclick="irParaPagina(${i})" aria-label="Página ${i}" aria-current="${i === paginaAtual ? 'page' : 'false'}" style="padding:10px 16px;background:${i === paginaAtual ? 'var(--accent)' : 'var(--card)'};color:${i === paginaAtual ? 'var(--text-dark)' : 'var(--text)'};border:1px solid var(--border);border-radius:8px;cursor:pointer;font-weight:700;min-width:44px;min-height:44px;">${i}</button>`;
      }
      pag.innerHTML = html;
    } else if (pag) pag.innerHTML = '';
  }

  function ordenarProdutos(criterio) {
    ordemAtual = criterio;
    paginaAtual = 1;
    renderProdutos();
  }

  function irParaPagina(n) {
    paginaAtual = n;
    renderProdutos();
    document.getElementById('produtos').scrollIntoView({ behavior: 'smooth' });
  }

  let variacoesSelecionadas = {};

  function abrirProduto(id) {
    ultimoFoco = document.activeElement;
    variacoesSelecionadas = {};
    const p = produtos.find(prod => prod.id === id);
    if (!p) return;
    const variacoesHTML = Object.entries(p.variacoes).map(([tipo, opcoes]) => `
      <div class="variacoes" style="margin-bottom:12px;" role="radiogroup" aria-label="${tipo.charAt(0).toUpperCase() + tipo.slice(1)} do produto">
        <span class="variacao-label" style="font-weight:600;font-size:.9rem;color:var(--text-muted);display:block;margin-bottom:6px;">${tipo.charAt(0).toUpperCase() + tipo.slice(1)}:</span>
        <div class="variacao-opcoes" style="display:flex;gap:8px;flex-wrap:wrap;">
          ${opcoes.map((op, i) => `<button type="button" role="radio" aria-checked="${i === 0 ? 'true' : 'false'}" aria-label="${tipo} ${op}" class="variacao-opcao" style="padding:12px 16px;min-height:44px;background:${i === 0 ? 'var(--accent)' : 'var(--card)'};border:1px solid var(--border);border-radius:8px;color:${i === 0 ? 'var(--text-dark)' : 'var(--text)'};cursor:pointer" onclick="selecionarVariacao(this, '${tipo}', '${op.replace(/'/g, "\\'")}')">${op}</button>`).join('')}
        </div>
      </div>
    `).join('');

    const specsHTML = p.specs ? `
      <div class="modal-specs" style="margin:16px 0;padding:16px;background:var(--surface);border-radius:var(--radius-sm);border:1px solid var(--border);">
        <h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin-bottom:10px;">Especificações</h3>
        <ul style="list-style:none;padding:0;margin:0;display:grid;grid-template-columns:1fr 1fr;gap:8px;">
          ${p.specs.map(s => `<li style="display:flex;align-items:center;gap:6px;font-size:.88rem;color:var(--text);"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>${s}</li>`).join('')}
        </ul>
      </div>
    ` : '';

    const freteHTML = p.frete ? `
      <div style="display:flex;align-items:center;gap:8px;color:var(--accent);font-size:.9rem;font-weight:600;margin-bottom:12px;">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="1" y="3" width="15" height="13"/><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>
        Frete grátis
      </div>
    ` : '';

    const garantiaHTML = `
      <div class="modal-garantias" style="display:flex;gap:16px;flex-wrap:wrap;margin:16px 0;padding:14px;background:var(--surface);border-radius:var(--radius-sm);border:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--text-muted);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          Garantia 12 meses
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--text-muted);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
          7 dias para trocar
        </div>
        <div style="display:flex;align-items:center;gap:8px;font-size:.85rem;color:var(--text-muted);">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
          Em estoque
        </div>
      </div>
    `;

    const relacionados = produtos.filter(r => r.categoria === p.categoria && r.id !== p.id).slice(0, 3);
    const relacionadosHTML = relacionados.length ? `
      <div class="modal-relacionados" style="margin-top:24px;padding-top:20px;border-top:1px solid var(--border);">
        <h3 style="font-size:.85rem;text-transform:uppercase;letter-spacing:.05em;color:var(--text-muted);margin-bottom:14px;">Você também pode gostar</h3>
        <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px;">
          ${relacionados.map(r => `
            <button type="button" onclick="abrirProduto(${r.id})" style="background:var(--card);border:1px solid var(--border);border-radius:var(--radius-sm);padding:12px;cursor:pointer;text-align:left;transition:all .2s;" onmouseover="this.style.borderColor='rgba(24,210,179,0.3)'" onmouseout="this.style.borderColor='var(--border)'">
              <div style="font-size:.82rem;color:var(--text);font-weight:600;margin-bottom:4px;line-height:1.3;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;">${r.nome}</div>
              <div style="font-size:.9rem;color:var(--accent);font-weight:700;">${formatarPreco(r.preco)}</div>
            </button>
          `).join('')}
        </div>
      </div>
    ` : '';

    const modal = document.getElementById('produto-detalhe-content');
    const modalEl = document.getElementById('modal-detalhe');
    modal.innerHTML = `
      <button class="close-btn" onclick="fecharModais()" aria-label="Fechar detalhes do produto" style="position:absolute;top:16px;right:16px;">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
      </button>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:32px;">
        <div>
          <div class="detalhe-img" style="height:300px;border-radius:var(--radius);overflow:hidden;">${imgHTML(p, 'detalhe-img-tag', 400, 300)}</div>
          ${garantiaHTML}
        </div>
        <div>
          <div class="produto-categoria">${p.categoria}</div>
          <h2 style="font-size:1.5rem;margin-bottom:10px;">${p.nome}</h2>
          ${estrelasHTML(p.avaliacao)}
          <p style="color:var(--text-muted);margin:16px 0;">${p.desc}</p>
          <div class="produto-preco" style="margin-bottom:16px;"><span class="atual">${formatarPreco(p.preco)}</span>${p.original ? `<span class="original">${formatarPreco(p.original)}</span>` : ''}</div>
          ${freteHTML}
          ${specsHTML}
          ${variacoesHTML}
          <button class="btn-primary" onclick="adicionarCarrinho(${p.id}); fecharModais();" style="width:100%;margin-top:8px;">Adicionar ao carrinho</button>
        </div>
      </div>
      ${relacionadosHTML}
    `;
    modalEl.classList.add('open');
    modalEl.setAttribute('aria-hidden', 'false');
    const mcontent = document.querySelector('#modal-detalhe .modal-content');
    mcontent.setAttribute('tabindex', '-1');
    mcontent.focus();
    ativarFocusTrap(mcontent);
  }

  function selecionarVariacao(btn, tipo, op) {
    variacoesSelecionadas[tipo] = op;
    const grupo = btn.closest('[role="radiogroup"]');
    grupo.querySelectorAll('[role="radio"]').forEach(b => {
      b.setAttribute('aria-checked', 'false');
      b.style.background = 'var(--card)';
      b.style.color = 'var(--text)';
    });
    btn.setAttribute('aria-checked', 'true');
    btn.style.background = 'var(--accent)';
    btn.style.color = 'var(--text-dark)';
  }

  function adicionarCarrinho(id) {
    const p = produtos.find(prod => prod.id === id);
    if (!p) return;
    const variacoes = Object.keys(p.variacoes).reduce((a, k) => { a[k] = variacoesSelecionadas[k] || p.variacoes[k][0]; return a; }, {});
    const chave = id + '_' + Object.values(variacoes).join('|');
    const itemExistente = carrinho.find(item => item.chave === chave);
    if (itemExistente) itemExistente.qtd++;
    else carrinho.push({ id: id, chave: chave, nome: p.nome, preco: p.preco, imagem: p.imagem, qtd: 1, frete: p.frete, variacoes: variacoes });
    salvarCarrinho();
    renderCarrinho();
    abrirCarrinho();
    notificar(`${p.nome} adicionado ao carrinho`, 'sucesso');
  }

  function alterarQtd(chave, delta) {
    const item = carrinho.find(i => i.chave === chave);
    if (!item) return;
    item.qtd += delta;
    if (item.qtd < 1) carrinho = carrinho.filter(i => i.chave !== chave);
    salvarCarrinho();
    renderCarrinho();
  }

  function removerItem(chave) {
    carrinho = carrinho.filter(i => i.chave !== chave);
    salvarCarrinho();
    renderCarrinho();
  }

  function salvarCarrinho() {
    localStorage.setItem('vendamais_carrinho', JSON.stringify(carrinho));
    const count = document.getElementById('carrinho-count');
    if (count) count.textContent = carrinho.reduce((a, i) => a + i.qtd, 0);
  }

  function renderCarrinho() {
    const itens = document.getElementById('carrinho-itens');
    const resumo = document.getElementById('carrinho-resumo');
    if (!itens || !resumo) return;

    if (carrinho.length === 0) {
      itens.innerHTML = '<p style="text-align:center;color:var(--text-muted);padding:32px 0;">Seu carrinho está vazio.</p>';
      resumo.innerHTML = '';
      return;
    }

    itens.innerHTML = carrinho.map(item => {
      const variacaoTxt = item.variacoes ? Object.entries(item.variacoes).map(([k, v]) => `${k}: ${v}`).join(', ') : '';
      return `
      <div class="carrinho-item">
        <img src="${item.imagem}" alt="Imagem de ${item.nome}" width="60" height="60">
        <div class="carrinho-item-info">
          <h4>${item.nome}</h4>
          <p style="font-size:.75rem;color:var(--text-muted);">${variacaoTxt}</p>
          <p>${formatarPreco(item.preco)}</p>
        </div>
        <div class="qtd-control">
          <button onclick="alterarQtd('${item.chave}', -1)" aria-label="Diminuir quantidade de ${item.nome}">−</button>
          <span style="min-width:24px;text-align:center">${item.qtd}</span>
          <button onclick="alterarQtd('${item.chave}', 1)" aria-label="Aumentar quantidade de ${item.nome}">+</button>
          <button onclick="removerItem('${item.chave}')" aria-label="Remover ${item.nome}" style="margin-left:8px;">×</button>
        </div>
      </div>
    `}).join('');

    const subtotal = carrinho.reduce((a, item) => a + item.preco * item.qtd, 0);
    const frete = subtotal >= 200 || carrinho.every(i => i.frete) ? 0 : 15.00;
    const desconto = calcularDesconto(subtotal);
    const total = Math.max(0, subtotal + frete - desconto);

    let barraFrete = '';
    if (subtotal < 200 && carrinho.some(i => !i.frete)) {
      const faltando = 200 - subtotal;
      const pct = Math.min(100, (subtotal / 200) * 100);
      barraFrete = `
        <div style="margin:14px 0;">
          <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:6px;">Faltam <strong style="color:var(--accent);">${formatarPreco(faltando)}</strong> para frete grátis</p>
          <div style="height:6px;background:var(--bg);border-radius:3px;overflow:hidden;">
            <div style="height:100%;width:${pct}%;background:var(--accent);border-radius:3px;transition:width .3s;"></div>
          </div>
        </div>
      `;
    }
    resumo.innerHTML = `
      <div><span>Subtotal</span><span>${formatarPreco(subtotal)}</span></div>
      <div><span>Frete</span><span>${frete === 0 ? 'Grátis' : formatarPreco(frete)}</span></div>
      <div><span>Desconto</span><span>-${formatarPreco(desconto)}</span></div>
      <div class="total" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);"><span>Total</span><span>${formatarPreco(total)}</span></div>
      ${barraFrete}
      <div style="margin-top:14px;">
        <button type="button" class="btn-link" onclick="toggleCupomCarrinho()" style="background:none;border:none;color:var(--accent);cursor:pointer;text-decoration:underline;padding:0;font-size:.9rem;">${cupomAtivo ? 'Cupom aplicado' : 'Tem um cupom?'}</button>
        <div id="cupom-carrinho" style="display:${cupomAtivo ? 'flex' : 'none'};gap:8px;margin-top:8px;">
          <input type="text" id="cupom-input" placeholder="Código" style="flex:1;padding:12px;background:var(--card);border:1px solid var(--border);border-radius:8px;color:var(--text);">
          <button class="btn-secondary" onclick="aplicarCupom()" style="padding:12px 16px;">Aplicar</button>
        </div>
      </div>
      <button class="btn-primary" onclick="abrirCheckout()" style="margin-top:12px;">Finalizar compra</button>
    `;
  }

  function calcularDesconto(subtotal) {
    if (!cupomAtivo) return 0;
    if (cupomAtivo === 'DESCONTO10') return subtotal * 0.10;
    if (cupomAtivo === 'PRIMEIRA') return subtotal > 100 ? 20 : 0;
    return 0;
  }

  function toggleCupomCarrinho() {
    const el = document.getElementById('cupom-carrinho');
    if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
  }

  function aplicarCupom() {
    const input = document.getElementById('cupom-input');
    if (!input) return;
    aplicarCupomRaw(input.value.trim().toUpperCase());
  }

  let ultimoFoco = null;

  function notificar(msg, tipo) {
    const lr = document.getElementById('live-region');
    if (!lr) return;
    lr.textContent = (tipo === 'erro' ? 'Erro: ' : '') + msg;
  }

  function abrirCarrinho() {
    ultimoFoco = document.activeElement;
    const sidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.add('open');
    overlay.classList.add('open');
    document.getElementById('btn-carrinho').setAttribute('aria-expanded', 'true');
    sidebar.setAttribute('aria-hidden', 'false');
    sidebar.focus();
    ativarFocusTrap(sidebar);
  }

  function abrirCheckout() {
    fecharCarrinho();
    checkoutPasso = 1;
    const modal = document.getElementById('modal-checkout');
    const mcontent = modal.querySelector('.modal-content');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    mcontent.setAttribute('tabindex', '-1');
    mcontent.focus();
    ativarFocusTrap(mcontent);
    renderCheckout();
  }

  function fecharCarrinho() {
    const sidebar = document.getElementById('carrinho-sidebar');
    const overlay = document.getElementById('overlay');
    sidebar.classList.remove('open');
    overlay.classList.remove('open');
    document.getElementById('btn-carrinho').setAttribute('aria-expanded', 'false');
    liberarFocusTrap();
    if (ultimoFoco) ultimoFoco.focus();
    ultimoFoco = null;
  }

  function fecharModais() {
    document.querySelectorAll('.modal').forEach(m => { m.classList.remove('open'); m.setAttribute('aria-hidden', 'true'); });
    fecharCarrinho();
  }

  let focusTrapHandler = null;

  function ativarFocusTrap(container) {
    const focaveis = container.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
    const primeiro = focaveis[0];
    const ultimo = focaveis[focaveis.length - 1];
    focusTrapHandler = (e) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === primeiro) { e.preventDefault(); ultimo.focus(); }
      } else {
        if (document.activeElement === ultimo) { e.preventDefault(); primeiro.focus(); }
      }
    };
    container.addEventListener('keydown', focusTrapHandler);
  }

  function liberarFocusTrap() {
    const container = document.getElementById('carrinho-sidebar') || document.querySelector('.modal.open .modal-content');
    if (container && focusTrapHandler) container.removeEventListener('keydown', focusTrapHandler);
    focusTrapHandler = null;
  }

  function abrirCheckout() {
    fecharCarrinho();
    checkoutPasso = 1;
    const modal = document.getElementById('modal-checkout');
    const mcontent = modal.querySelector('.modal-content');
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    mcontent.setAttribute('tabindex', '-1');
    mcontent.focus();
    ativarFocusTrap(mcontent);
    renderCheckout();
  }

  function renderCheckout() {
    const subtotal = carrinho.reduce((a, item) => a + item.preco * item.qtd, 0);
    const frete = subtotal >= 200 || carrinho.every(i => i.frete) ? 0 : 15.00;
    const desconto = calcularDesconto(subtotal);
    const total = Math.max(0, subtotal + frete - desconto);

    const resumo = carrinho.map(item => `<div class="checkout-item"><span>${item.qtd}x ${item.nome}</span><span>${formatarPreco(item.preco * item.qtd)}</span></div>`).join('');
    const stepper = `
      <div class="stepper" role="tablist" aria-label="Etapas do checkout" style="display:flex;justify-content:space-between;margin-bottom:24px;position:relative;">
        <button type="button" role="tab" aria-selected="${checkoutPasso === 1}" aria-controls="step1" tabindex="0" style="flex:1;background:transparent;border:none;color:${checkoutPasso >= 1 ? 'var(--accent)' : 'var(--text-muted)'};font-weight:700;cursor:default;" ${checkoutPasso > 1 ? 'onclick="checkoutPasso=1;renderCheckout()"' : ''}>1. Dados</button>
        <button type="button" role="tab" aria-selected="${checkoutPasso === 2}" aria-controls="step2" tabindex="-1" style="flex:1;background:transparent;border:none;color:${checkoutPasso >= 2 ? 'var(--accent)' : 'var(--text-muted)'};font-weight:700;cursor:default;" ${checkoutPasso > 2 ? 'onclick="checkoutPasso=2;renderCheckout()"' : ''}>2. Entrega</button>
        <button type="button" role="tab" aria-selected="${checkoutPasso === 3}" aria-controls="step3" tabindex="-1" style="flex:1;background:transparent;border:none;color:${checkoutPasso >= 3 ? 'var(--accent)' : 'var(--text-muted)'};font-weight:700;cursor:default;">3. Pagamento</button>
      </div>
      <div class="progress-bar" style="height:4px;background:var(--border);border-radius:2px;margin-bottom:24px;overflow:hidden;"><div class="progress-fill" style="height:100%;background:var(--accent);width:${(checkoutPasso/3)*100}%;transition:width .3s;"></div></div>
    `;

    const step1 = `
      <div class="checkout-step ${checkoutPasso === 1 ? 'active' : ''}" id="step1" role="tabpanel" aria-labelledby="step1-tab">
        <p style="text-align:center;color:var(--text-muted);font-size:.9rem;margin-bottom:16px;">Não precisa criar conta. Preencha seus dados para continuar.</p>
        <form class="checkout-form" onsubmit="return false;">
          <label for="ck-nome">Nome completo</label>
          <input type="text" id="ck-nome" placeholder="Seu nome" autocomplete="name" required onblur="validarCampo(this, v => v.length >= 3, 'Nome deve ter pelo menos 3 caracteres')">
          <label for="ck-email">E-mail</label>
          <input type="email" id="ck-email" placeholder="seu@email.com" autocomplete="email" required onblur="validarCampo(this, v => validarEmail(v), 'Informe um e-mail válido')">
          <label for="ck-cpf">CPF (opcional - para nota fiscal)</label>
          <input type="text" id="ck-cpf" placeholder="000.000.000-00" oninput="mascaraCPF(this)" onblur="if(this.value) validarCampo(this, v => validarCPF(v.replace(/\\D/g,'')), 'CPF inválido')">
          <label for="ck-tel">WhatsApp com DDD</label>
          <input type="tel" id="ck-tel" placeholder="(13) 99999-9999" oninput="mascaraTel(this)" autocomplete="tel" required onblur="validarCampo(this, v => v.replace(/\\D/g,'').length === 11, 'Informe um telefone válido')">
          <label class="checkbox" for="ck-lgpd" style="display:flex;align-items:flex-start;gap:8px;font-weight:400;color:var(--text-muted);font-size:.85rem;">
            <input type="checkbox" id="ck-lgpd" required style="width:auto;margin-top:3px;">
            Li e concordo com a <a href="privacidade.html" target="_blank" style="color:var(--accent);">Política de Privacidade</a> e autorizo o tratamento dos meus dados.
          </label>
          <button class="btn-primary" onclick="checkoutProximo(2)">Continuar como convidado</button>
        </form>
      </div>
    `;

    const step2 = `
      <div class="checkout-step ${checkoutPasso === 2 ? 'active' : ''}" id="step2" role="tabpanel" aria-labelledby="step2-tab">
        <form class="checkout-form" onsubmit="return false;">
          <label for="ck-cep">CEP</label>
          <input type="text" id="ck-cep" placeholder="00000-000" autocomplete="postal-code" oninput="mascaraCEP(this); buscarCEP(this.value)" required onblur="validarCampo(this, v => v.replace(/\\D/g,'').length === 8, 'Informe um CEP válido')">
          <label for="ck-endereco">Endereço</label>
          <input type="text" id="ck-endereco" placeholder="Rua, número" autocomplete="address-line1" required onblur="validarCampo(this, v => v.length >= 4, 'Endereço muito curto')">
          <label for="ck-bairro">Bairro</label>
          <input type="text" id="ck-bairro" autocomplete="address-level3" required onblur="validarCampo(this, v => v.length >= 2, 'Bairro muito curto')">
          <label for="ck-cidade">Cidade</label>
          <input type="text" id="ck-cidade" autocomplete="address-level2" required onblur="validarCampo(this, v => v.length >= 2, 'Cidade muito curta')">
          <label for="ck-uf">UF</label>
          <input type="text" id="ck-uf" maxlength="2" autocomplete="address-level1" required onblur="validarCampo(this, v => v.length === 2, 'UF inválida')">
          <div class="cupom-container" style="margin-bottom:16px;">
            <button type="button" class="btn-link" onclick="toggleCupomCheckout()" style="background:none;border:none;color:var(--accent);cursor:pointer;text-decoration:underline;padding:0;font-size:.9rem;">Tem um cupom de desconto?</button>
            <div id="cupom-checkout" style="display:none;margin-top:8px;gap:8px;">
              <input type="text" id="ck-cupom" placeholder="Código" oninput="this.value=this.value.toUpperCase()" style="flex:1;">
              <button type="button" class="btn-secondary" onclick="aplicarCupomCheckout()" style="padding:12px 16px;">Aplicar</button>
            </div>
          </div>
          <button class="btn-primary" onclick="checkoutProximo(3)">Ir para pagamento</button>
          <button type="button" class="btn-secondary" onclick="checkoutPasso=1;renderCheckout()" style="margin-top:10px;width:100%;">Voltar</button>
        </form>
      </div>
    `;

    const step3 = `
      <div class="checkout-step ${checkoutPasso === 3 ? 'active' : ''}" id="step3" role="tabpanel" aria-labelledby="step3-tab">
        <div class="checkout-resumo" style="margin-bottom:20px;">
          <h3>Resumo do pedido</h3>
          ${resumo}
          <div class="checkout-item" style="margin-top:12px;padding-top:12px;border-top:1px solid var(--border);"><span>Frete</span><span>${frete === 0 ? 'Grátis' : formatarPreco(frete)}</span></div>
          <div class="checkout-item"><span>Desconto</span><span>-${formatarPreco(desconto)}</span></div>
          <div class="checkout-item" style="color:var(--text);font-weight:800;font-size:1.1rem;"><span>Total</span><span>${formatarPreco(total)}</span></div>
        </div>
        <div class="pagamento-opcoes" style="display:flex;gap:10px;justify-content:center;margin:16px 0;">
          <button type="button" class="btn-pagamento active" data-tipo="pix" onclick="selecionarPagamento(this,'pix')" style="padding:10px 20px;background:var(--accent);color:var(--text-dark);border:none;border-radius:8px;font-weight:700;cursor:pointer;">PIX</button>
          <button type="button" class="btn-pagamento" data-tipo="cartao" onclick="selecionarPagamento(this,'cartao')" style="padding:10px 20px;background:var(--card);color:var(--text);border:1px solid var(--border);border-radius:8px;font-weight:700;cursor:pointer;">Cartão</button>
        </div>
        <div class="payment-methods" style="display:flex;gap:12px;justify-content:center;margin:16px 0;flex-wrap:wrap;align-items:center;">
          <span style="font-size:.8rem;color:var(--text-muted);">Aceitamos:</span>
          <span style="background:var(--card);padding:6px 12px;border-radius:6px;font-size:.75rem;font-weight:700;border:1px solid var(--border);">Visa</span>
          <span style="background:var(--card);padding:6px 12px;border-radius:6px;font-size:.75rem;font-weight:700;border:1px solid var(--border);">Mastercard</span>
          <span style="background:var(--card);padding:6px 12px;border-radius:6px;font-size:.75rem;font-weight:700;border:1px solid var(--border);">Elo</span>
          <span style="background:var(--card);padding:6px 12px;border-radius:6px;font-size:.75rem;font-weight:700;border:1px solid var(--border);">PIX</span>
        </div>
        <div class="trust-badges" style="display:flex;justify-content:center;gap:16px;margin:0 0 20px;flex-wrap:wrap;">
          <div style="display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:.8rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Compra Segura
          </div>
          <div style="display:flex;align-items:center;gap:6px;color:var(--text-muted);font-size:.8rem;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            SSL/TLS
          </div>
        </div>
        <div class="pix-box" id="pagamento-pix" style="margin-top:20px;">
          <h3 style="margin-bottom:12px;">Pagamento via PIX</h3>
          <div class="pix-qrcode" aria-label="QR Code simulado para pagamento via PIX no valor de ${formatarPreco(total)}">
            <svg viewBox="0 0 100 100" width="100%" height="100%"><rect width="100" height="100" fill="#fff"/><rect x="10" y="10" width="30" height="30" fill="#000"/><rect x="60" y="10" width="30" height="30" fill="#000"/><rect x="10" y="60" width="30" height="30" fill="#000"/><rect x="60" y="60" width="10" height="10" fill="#000"/><rect x="80" y="60" width="10" height="10" fill="#000"/><rect x="60" y="80" width="10" height="10" fill="#000"/><rect x="50" y="50" width="10" height="10" fill="#000"/></svg>
          </div>
          <p style="font-size:.85rem;color:var(--text-muted);margin-bottom:12px;">Código PIX copia e cola:</p>
          <input type="text" value="00020126430014br.gov.bcb.pix0113+5513999997777520400005303986540${String(Math.round(total * 100)).padStart(10, '0')}5802BR5924VendaMais Ecommerce6009SANTOS62070503***6304ABCD" style="width:100%;padding:10px;background:var(--bg);border:1px solid var(--border);border-radius:8px;color:var(--text);font-size:.8rem;margin-bottom:12px;" readonly onclick="this.select();document.execCommand('copy')">
          <button class="btn-primary" onclick="finalizarPedido()">Copiar código e finalizar</button>
        </div>
        <div id="pagamento-cartao" style="display:none;">
          <h3 style="margin-bottom:12px;">Cartão de crédito</h3>
          <form class="checkout-form" onsubmit="return false;">
            <label for="ck-card-num">Número do cartão</label>
            <input type="text" id="ck-card-num" placeholder="0000 0000 0000 0000" oninput="mascaraCartao(this)" maxlength="19">
            <label for="ck-card-nome">Nome no cartão</label>
            <input type="text" id="ck-card-nome" placeholder="Como está no cartão">
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;">
              <label for="ck-card-val">Validade (MM/AA)
                <input type="text" id="ck-card-val" placeholder="MM/AA" oninput="mascaraValidade(this)" maxlength="5" style="width:100%;">
              </label>
              <label for="ck-card-cvv">CVV
                <input type="text" id="ck-card-cvv" placeholder="123" inputmode="numeric" maxlength="4" style="width:100%;">
              </label>
            </div>
            <label for="ck-card-parcelas">Parcelas</label>
            <select id="ck-card-parcelas">${[1,2,3,4,5,6].map(n => `<option value="${n}">${n}x de ${formatarPreco(total/n)} sem juros</option>`).join('')}</select>
            <button class="btn-primary" onclick="finalizarPedido()">Pagar e finalizar</button>
          </form>
        </div>
        <button type="button" class="btn-secondary" onclick="checkoutPasso=2;renderCheckout()" style="margin-top:16px;width:100%;">Voltar</button>
      </div>
    `;

    document.getElementById('checkout-body').innerHTML = stepper + step1 + step2 + step3;
  }

  function checkoutProximo(passo) {
    if (passo === 2) {
      const nome = document.getElementById('ck-nome').value.trim();
      const email = document.getElementById('ck-email').value.trim();
      const cpf = document.getElementById('ck-cpf').value.replace(/\D/g, '');
      const tel = document.getElementById('ck-tel').value.replace(/\D/g, '');
      const lgpd = document.getElementById('ck-lgpd').checked;
      if (nome.length < 3) { notificar('Nome deve ter pelo menos 3 caracteres.', 'erro'); return; }
      if (!validarEmail(email)) { notificar('Informe um e-mail válido.', 'erro'); return; }
      if (cpf.length > 0 && (cpf.length !== 11 || !validarCPF(cpf))) { notificar('Informe um CPF válido ou deixe em branco.', 'erro'); return; }
      if (tel.length !== 11) { notificar('Informe um telefone válido com DDD.', 'erro'); return; }
      if (!lgpd) { notificar('Você precisa aceitar a política de privacidade.', 'erro'); return; }
    }
    if (passo === 3) {
      const cep = document.getElementById('ck-cep').value.replace(/\D/g, '');
      const end = document.getElementById('ck-endereco').value.trim();
      const bairro = document.getElementById('ck-bairro').value.trim();
      const cidade = document.getElementById('ck-cidade').value.trim();
      const uf = document.getElementById('ck-uf').value.trim();
      if (cep.length !== 8) { notificar('Informe um CEP válido.', 'erro'); return; }
      if (end.length < 4 || bairro.length < 2 || cidade.length < 2 || uf.length !== 2) { notificar('Preencha o endereço completo.', 'erro'); return; }
      const cupom = document.getElementById('ck-cupom').value.trim();
      if (cupom) { if (['DESCONTO10', 'PRIMEIRA'].includes(cupom)) { cupomAtivo = cupom; notificar('Cupom aplicado.', 'sucesso'); } else notificar('Cupom inválido.', 'erro'); }
    }
    checkoutPasso = passo;
    renderCheckout();
  }

  function validarEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validarCPF(cpf) {
    if (/^(\d)\1{10}$/.test(cpf)) return false;
    let soma = 0, resto;
    for (let i = 1; i <= 9; i++) soma += parseInt(cpf[i - 1]) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf[9])) return false;
    soma = 0;
    for (let i = 1; i <= 10; i++) soma += parseInt(cpf[i - 1]) * (12 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf[10]);
  }

  function toggleCupomCheckout() {
    const el = document.getElementById('cupom-checkout');
    if (el) el.style.display = el.style.display === 'none' ? 'flex' : 'none';
  }

  function aplicarCupomCheckout() {
    const input = document.getElementById('ck-cupom');
    if (!input) return;
    input.value = input.value.trim().toUpperCase();
    aplicarCupomRaw(input.value);
  }

  function aplicarCupomRaw(c) {
    const subtotal = carrinho.reduce((a, item) => a + item.preco * item.qtd, 0);
    if (c === 'DESCONTO10') { cupomAtivo = c; notificar('Cupom de 10% aplicado.', 'sucesso'); }
    else if (c === 'PRIMEIRA') { if (subtotal >= 100) { cupomAtivo = c; notificar('Cupom PRIMEIRA de R$ 20 aplicado.', 'sucesso'); } else notificar('Cupom PRIMEIRA exige compra mínima de R$ 100.', 'erro'); }
    else notificar('Cupom inválido.', 'erro');
    renderCarrinho();
    renderCheckout();
  }

  function validarCampo(input, regra, msg) {
    const valido = regra(input.value);
    let erro = input.parentNode.querySelector('.erro-msg');
    if (valido) {
      input.setAttribute('aria-invalid', 'false');
      if (erro) erro.remove();
    } else {
      input.setAttribute('aria-invalid', 'true');
      if (!erro) {
        erro = document.createElement('span');
        erro.className = 'erro-msg';
        erro.style.cssText = 'color:var(--danger);font-size:.8rem;display:block;margin-top:4px;';
        input.parentNode.appendChild(erro);
      }
      erro.textContent = msg;
      input.setAttribute('aria-describedby', erro.id || (erro.id = 'erro-' + input.id));
    }
    return valido;
  }

  function finalizarPedido() {
    notificar('Pedido finalizado com sucesso! Em breve você receberá a confirmação.', 'sucesso');
    carrinho = [];
    salvarCarrinho();
    renderCarrinho();
    fecharModais();
  }

  function selecionarPagamento(btn, tipo) {
    document.querySelectorAll('.btn-pagamento').forEach(b => { b.classList.remove('active'); b.style.background = 'var(--card)'; b.style.color = 'var(--text)'; });
    btn.classList.add('active');
    btn.style.background = 'var(--accent)';
    btn.style.color = 'var(--text-dark)';
    document.getElementById('pagamento-pix').style.display = tipo === 'pix' ? 'block' : 'none';
    document.getElementById('pagamento-cartao').style.display = tipo === 'cartao' ? 'block' : 'none';
  }

  function mascaraCartao(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 16);
    input.value = v.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  function mascaraValidade(input) {
    let v = input.value.replace(/\D/g, '').substring(0, 4);
    input.value = v.replace(/(\d{2})(\d)/, '$1/$2');
  }

  function buscarCEP(cep) {
    const limpo = cep.replace(/\D/g, '');
    if (limpo.length !== 8) return;
    fetch('https://viacep.com.br/ws/' + limpo + '/json/')
      .then(r => r.json())
      .then(d => {
        if (!d.erro) {
          document.getElementById('ck-endereco').value = d.logradouro;
          document.getElementById('ck-bairro').value = d.bairro;
          document.getElementById('ck-cidade').value = d.localidade;
          document.getElementById('ck-uf').value = d.uf;
        }
      })
      .catch(() => {});
  }

  function mascaraTel(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 11);
    if (v.length > 7) input.value = '(' + v.slice(0, 2) + ') ' + v.slice(2, 7) + '-' + v.slice(7);
    else if (v.length > 2) input.value = '(' + v.slice(0, 2) + ') ' + v.slice(2);
    else if (v.length > 0) input.value = '(' + v;
  }

  function mascaraCPF(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 11);
    input.value = v.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  function mascaraCEP(input) {
    let v = input.value.replace(/\D/g, '');
    v = v.substring(0, 8);
    input.value = v.replace(/(\d{5})(\d)/, '$1-$2');
  }

  function buscarProdutos(v) {
    buscaAtual = v;
    renderProdutos();
  }

  function filtrar(categoria, btn) {
    filtroAtual = categoria;
    document.querySelectorAll('.produtos-filtros .filtro').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-pressed', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-pressed', 'true');
    renderProdutos();
  }

  function gerarSchemaProdutos() {
    const schema = {
      "@context": "https://schema.org",
      "@type": "ItemList",
      "itemListElement": produtos.map((p, i) => ({
        "@type": "ListItem",
        "position": i + 1,
        "item": {
          "@type": "Product",
          "name": p.nome,
          "image": p.imagem,
          "description": p.desc,
          "brand": { "@type": "Brand", "name": "VendaMais" },
          "offers": { "@type": "Offer", "price": p.preco.toFixed(2), "priceCurrency": "BRL", "availability": "https://schema.org/InStock" },
          "aggregateRating": { "@type": "AggregateRating", "ratingValue": p.avaliacao.toString(), "reviewCount": p.avaliacoes.toString() }
        }
      }))
    };
    document.getElementById('schema-produtos').textContent = JSON.stringify(schema);
  }

  function iniciarContador() {
    const el = document.getElementById('countdown');
    if (!el) return;
    let t = 4 * 3600 + 59 * 60 + 59;
    const iv = setInterval(() => {
      t--;
      if (t < 0) t = 4 * 3600 + 59 * 60 + 59;
      const h = Math.floor(t / 3600).toString().padStart(2, '0');
      const m = Math.floor((t % 3600) / 60).toString().padStart(2, '0');
      const s = (t % 60).toString().padStart(2, '0');
      el.textContent = h + ':' + m + ':' + s;
    }, 1000);
  }

  function iniciarCookieBanner() {
    const banner = document.getElementById('cookie-banner');
    const btn = document.getElementById('btn-cookie');
    if (!banner || !btn) return;
    if (!localStorage.getItem('vendamais_cookies')) banner.style.display = 'block';
    btn.addEventListener('click', () => { localStorage.setItem('vendamais_cookies', '1'); banner.style.display = 'none'; });
  }

  document.addEventListener('DOMContentLoaded', () => {
    gerarSchemaProdutos();
    renderProdutos();
    renderCarrinho();
    salvarCarrinho();
    iniciarContador();
    iniciarCookieBanner();

    document.getElementById('btn-carrinho').addEventListener('click', abrirCarrinho);
    document.getElementById('btn-fechar-carrinho').addEventListener('click', fecharCarrinho);
    document.getElementById('overlay').addEventListener('click', fecharModais);
    document.getElementById('btn-fechar-checkout').addEventListener('click', fecharModais);
    document.getElementById('menu-toggle').addEventListener('click', () => {
      const nav = document.getElementById('nav-links');
      const open = nav.classList.toggle('open');
      document.getElementById('menu-toggle').setAttribute('aria-expanded', open);
    });
    document.querySelectorAll('.produtos-filtros .filtro').forEach(btn => {
      btn.addEventListener('click', () => filtrar(btn.dataset.categoria, btn));
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') fecharModais();
    });
  });

  window.abrirProduto = abrirProduto;
  window.adicionarCarrinho = adicionarCarrinho;
  window.alterarQtd = alterarQtd;
  window.removerItem = removerItem;
  window.aplicarCupom = aplicarCupom;
  window.abrirCheckout = abrirCheckout;
  window.fecharModais = fecharModais;
  window.checkoutProximo = checkoutProximo;
  window.finalizarPedido = finalizarPedido;
  window.buscarCEP = buscarCEP;
  window.mascaraTel = mascaraTel;
  window.mascaraCPF = mascaraCPF;
  window.mascaraCEP = mascaraCEP;
  window.buscarProdutos = buscarProdutos;
  window.ordenarProdutos = ordenarProdutos;
  window.irParaPagina = irParaPagina;
  window.selecionarVariacao = selecionarVariacao;
  window.selecionarPagamento = selecionarPagamento;
  window.mascaraCartao = mascaraCartao;
  window.mascaraValidade = mascaraValidade;
})();

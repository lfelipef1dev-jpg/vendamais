/* VendaMais — Static Site Generator
   Le dados JSON estruturados e gera paginas HTML estaticas.
   Arquitetura: dados JSON -> templates -> HTML estatico -> Cloudflare Pages */

const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const SRC = path.join(ROOT, 'src');
const OUT = path.join(ROOT, 'out');
const DATA = path.join(SRC, 'data');
const PAGES = path.join(SRC, 'pages');
const TEMPLATES = path.join(SRC, 'templates');
const STYLES = path.join(SRC, 'styles');
const SCRIPTS = path.join(SRC, 'scripts');

/* ---------- Carregar dados ---------- */
function loadData() {
  const files = fs.readdirSync(DATA).filter(f => f.endsWith('.json'));
  const data = {};
  files.forEach(f => {
    data[f.replace('.json', '')] = JSON.parse(fs.readFileSync(path.join(DATA, f), 'utf8'));
  });
  return data;
}

/* ---------- Templates ---------- */
const T = require(path.join(TEMPLATES, 'templates.js'));

/* ---------- Limpar out ---------- */
function cleanOut() {
  if (fs.existsSync(OUT)) {
    fs.rmSync(OUT, { recursive: true, force: true });
  }
  fs.mkdirSync(OUT, { recursive: true });
}

/* ---------- Copiar assets ---------- */
function copyAssets() {
  // CSS
  const cssOut = path.join(OUT, 'styles');
  fs.mkdirSync(cssOut, { recursive: true });
  fs.readdirSync(STYLES).filter(f => f.endsWith('.css')).forEach(f => {
    fs.copyFileSync(path.join(STYLES, f), path.join(cssOut, f));
  });

  // JS
  const jsOut = path.join(OUT, 'scripts');
  fs.mkdirSync(jsOut, { recursive: true });
  fs.readdirSync(SCRIPTS).filter(f => f.endsWith('.js')).forEach(f => {
    fs.copyFileSync(path.join(SCRIPTS, f), path.join(jsOut, f));
  });

  // Fonts
  const fontsSrc = path.join(ROOT, 'fonts');
  if (fs.existsSync(fontsSrc)) {
    const fontsOut = path.join(OUT, 'fonts');
    fs.mkdirSync(fontsOut, { recursive: true });
    fs.readdirSync(fontsSrc).filter(f => f.endsWith('.woff2')).forEach(f => {
      fs.copyFileSync(path.join(fontsSrc, f), path.join(fontsOut, f));
    });
  }

  // Imagens (root + subdiretorios)
  const imgExts = /\.(jpg|jpeg|png|svg|webp|gif|ico)$/;
  fs.readdirSync(ROOT).forEach(f => {
    if (imgExts.test(f)) fs.copyFileSync(path.join(ROOT, f), path.join(OUT, f));
  });

  // favicon
  if (fs.existsSync(path.join(ROOT, 'favicon.svg'))) {
    fs.copyFileSync(path.join(ROOT, 'favicon.svg'), path.join(OUT, 'favicon.svg'));
  }

  // _headers
  if (fs.existsSync(path.join(ROOT, '_headers'))) {
    fs.copyFileSync(path.join(ROOT, '_headers'), path.join(OUT, '_headers'));
  }
}

/* ---------- Gerar sitemap ---------- */
function generateSitemap(pages, data) {
  const base = data.store.url;
  const urls = pages
    .filter(p => !p.noindex)
    .map(p => {
      const loc = p.slug === 'index' ? `${base}/` : `${base}/${p.slug}.html`;
      return `  <url>\n    <loc>${loc}</loc>\n    <lastmod>2026-09-01</lastmod>\n  </url>`;
    })
    .join('\n');
  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>`;
  fs.writeFileSync(path.join(OUT, 'sitemap.xml'), xml);
}

/* ---------- Gerar robots.txt ---------- */
function generateRobots(data) {
  const base = data.store.url;
  const txt = `User-agent: *\nAllow: /\nDisallow: /admin.html\nDisallow: /admin-login.html\nDisallow: /conta.html\nDisallow: /login.html\nDisallow: /carrinho.html\nDisallow: /checkout.html\nDisallow: /pedido-confirmado.html\nDisallow: /rastreio.html\n\nSitemap: ${base}/sitemap.xml`;
  fs.writeFileSync(path.join(OUT, 'robots.txt'), txt);
}

/* ---------- Build ---------- */
function build() {
  console.log('VendaMais — build iniciado');
  const data = loadData();

  cleanOut();
  copyAssets();

  // Carregar e executar todos os page renderers
  const pageFiles = fs.readdirSync(PAGES).filter(f => f.endsWith('.js'));
  const allPages = [];

  pageFiles.forEach(file => {
    const renderer = require(path.join(PAGES, file));
    const pages = renderer.render(data, T);
    pages.forEach(page => {
      const outPath = path.join(OUT, page.filename);
      fs.mkdirSync(path.dirname(outPath), { recursive: true });
      fs.writeFileSync(outPath, page.html);
      allPages.push(page);
      console.log(`  ✓ ${page.filename}`);
    });
  });

  generateSitemap(allPages, data);
  console.log('  ✓ sitemap.xml, robots.txt');
  generateRobots(data);

  const fileCount = fs.readdirSync(OUT, { recursive: true }).filter(f => !fs.statSync(path.join(OUT, f)).isDirectory()).length;
  console.log(`Build concluido — ${fileCount} arquivos em out/`);
}

build();

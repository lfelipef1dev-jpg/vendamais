/* QA VendaMais producao */
const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const BASE = 'https://vendamais.expostacker.com.br';
const ROUTES = [
  { path: '/', name: 'Home' },
  { path: '/ofertas/', name: 'Ofertas' },
  { path: '/mais-vendidos/', name: 'MaisVendidos' },
  { path: '/busca/', name: 'Busca' },
  { path: '/favoritos/', name: 'Favoritos' },
  { path: '/conta/', name: 'Conta' },
  { path: '/conta/pedidos/', name: 'Pedidos' },
  { path: '/conta/enderecos/', name: 'Enderecos' },
  { path: '/checkout/', name: 'Checkout' },
  { path: '/sobre/', name: 'Sobre' },
  { path: '/privacidade/', name: 'Privacidade' },
  { path: '/termos/', name: 'Termos' },
  { path: '/categoria/hortifruti/', name: 'CatHortifruti' },
  { path: '/categoria/acougue/', name: 'CatAcougue' },
  { path: '/categoria/bebidas/', name: 'CatBebidas' },
  { path: '/produto/picanha-bovina-kg/', name: 'PdpPicanha' },
  { path: '/produto/leite-integral-1l/', name: 'PdpLeite' },
  { path: '/produto/arroz-branco-5kg/', name: 'PdpArroz' },
];

const VIEWPORTS = [
  { w: 1920, h: 1080 }, { w: 1440, h: 900 }, { w: 1366, h: 768 },
  { w: 1024, h: 768 }, { w: 768, h: 1024 }, { w: 430, h: 932 },
  { w: 390, h: 844 }, { w: 375, h: 812 }, { w: 360, h: 800 },
];

const OUT = path.join(__dirname, 'qa-vendamais');
if (!fs.existsSync(OUT)) fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const results = [];

  for (const route of ROUTES) {
    const page = await browser.newPage();
    const errors = [], failed = [];
    page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
    page.on('response', (r) => { if (r.status() >= 400) failed.push(`HTTP ${r.status()} ${r.url()}`); });

    const r = { route: route.path, name: route.name, viewports: {} };

    for (const vp of VIEWPORTS) {
      await page.setViewport({ width: vp.w, height: vp.h });
      await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise((res) => setTimeout(res, 1500));
      const scrollX = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
      const h1 = await page.evaluate(() => document.querySelectorAll('h1').length);
      const imgsNoAlt = await page.evaluate(() => Array.from(document.querySelectorAll('img')).filter(i => !i.alt).length);
      const safe = route.name.replace(/[^a-z0-9]/gi, '-').toLowerCase();
      await page.screenshot({ path: path.join(OUT, `${safe}-${vp.w}.png`) });
      r.viewports[`${vp.w}`] = { scrollX, h1, imgsNoAlt };
    }

    // LCP/CLS
    await page.setViewport({ width: 1440, height: 900 });
    await page.goto(`${BASE}${route.path}`, { waitUntil: 'networkidle2', timeout: 30000 });
    await new Promise((res) => setTimeout(res, 3000));
    const perf = await page.evaluate(() => new Promise((resolve) => {
      let lcp = null, cls = 0;
      const lo = new PerformanceObserver((l) => { const e = l.getEntries(); if (e.length) lcp = Math.round(e[e.length-1].startTime); });
      lo.observe({ type: 'largest-contentful-paint', buffered: true });
      const co = new PerformanceObserver((l) => { for (const e of l.getEntries()) if (!e.hadRecentInput) cls += e.value; });
      co.observe({ type: 'layout-shift', buffered: true });
      setTimeout(() => { lo.disconnect(); co.disconnect(); resolve({ lcp, cls: Math.round(cls*10000)/10000 }); }, 3000);
    }));
    const reqs = await page.evaluate(() => {
      const e = performance.getEntriesByType('resource');
      return { count: e.length, kb: Math.round(e.reduce((s, r) => s + (r.transferSize||0), 0)/1024) };
    });

    r.errors = [...new Set(errors)].slice(0, 5);
    r.failed = [...new Set(failed)].slice(0, 5);
    r.perf = perf;
    r.reqs = reqs;
    results.push(r);
    await page.close();
    console.log(`OK: ${route.name}`);
  }

  await browser.close();
  fs.writeFileSync(path.join(OUT, 'results.json'), JSON.stringify(results, null, 2));

  console.log('\n=== QA VENDAMAIS PRODUCAO ===');
  let allOk = true;
  for (const r of results) {
    const maxScroll = Math.max(...Object.values(r.viewports).map(v => v.scrollX || 0));
    const h1 = r.viewports['1440']?.h1 || 0;
    const imgsNoAlt = r.viewports['1440']?.imgsNoAlt || 0;
    const ok = r.errors.length === 0 && r.failed.length === 0 && maxScroll === 0;
    if (!ok) allOk = false;
    console.log(`${ok ? 'OK' : 'FAIL'} ${r.name.padEnd(18)} scrollX=${maxScroll} h1=${h1} imgsNoAlt=${imgsNoAlt} LCP=${r.perf?.lcp}ms CLS=${r.perf?.cls} reqs=${r.reqs?.count} ${r.reqs?.kb}KB err=${r.errors.length} fail=${r.failed.length}`);
    if (r.errors.length) r.errors.forEach(e => console.log(`  ERR: ${e.substring(0,120)}`));
    if (r.failed.length) r.failed.forEach(e => console.log(`  FAIL: ${e.substring(0,120)}`));
  }
  console.log(`\n${allOk ? 'TODAS AS ROTAS OK' : 'FALHAS DETECTADAS'}`);
})();

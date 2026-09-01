/* Baixa imagens dos produtos do Unsplash para o VendaMais */
const https = require('https');
const fs = require('fs');
const path = require('path');

const OUT = path.join(__dirname, 'out');
const ROOT = __dirname;

const images = {
  // Hero
  'hero-home.jpg': 'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=1200&h=900&fit=crop&q=80',

  // Categoria
  'cat-eletronicos.jpg': 'https://images.unsplash.com/photo-1498049794561-673ee4ac0881?w=400&h=300&fit=crop&q=80',
  'cat-casa.jpg': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop&q=80',
  'cat-moda.jpg': 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=300&fit=crop&q=80',
  'cat-acessorios.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop&q=80',

  // Fone Bluetooth Pro X1
  'prod-fone-1.jpg': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop&q=80',
  'prod-fone-2.jpg': 'https://images.unsplash.com/photo-1583394838336-acd9776a61fb?w=600&h=600&fit=crop&q=80',
  'prod-fone-3.jpg': 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&h=600&fit=crop&q=80',
  'prod-fone-4.jpg': 'https://images.unsplash.com/photo-1599669454699-24889118cf4d?w=600&h=600&fit=crop&q=80',
  'prod-fone-5.jpg': 'https://images.unsplash.com/photo-1606220965151-4145398c42d2?w=600&h=600&fit=crop&q=80',

  // Smartwatch
  'prod-smartwatch-1.jpg': 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=600&h=600&fit=crop&q=80',
  'prod-smartwatch-2.jpg': 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&h=600&fit=crop&q=80',
  'prod-smartwatch-3.jpg': 'https://images.unsplash.com/photo-1508685096485-25f5bb7c5c81?w=600&h=600&fit=crop&q=80',
  'prod-smartwatch-4.jpg': 'https://images.unsplash.com/photo-1617043786394-f977fa12eddf?w=600&h=600&fit=crop&q=80',

  // Camiseta
  'prod-camiseta-1.jpg': 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600&h=600&fit=crop&q=80',
  'prod-camiseta-2.jpg': 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600&h=600&fit=crop&q=80',
  'prod-camiseta-3.jpg': 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=600&h=600&fit=crop&q=80',

  // Tenis
  'prod-tenis-1.jpg': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&h=600&fit=crop&q=80',
  'prod-tenis-2.jpg': 'https://images.unsplash.com/photo-1600185365483-52d8ed91fffc?w=600&h=600&fit=crop&q=80',
  'prod-tenis-3.jpg': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&h=600&fit=crop&q=80',
  'prod-tenis-4.jpg': 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&h=600&fit=crop&q=80',

  // Mochila anti-furto
  'prod-mochila-1.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',
  'prod-mochila-2.jpg': 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600&h=600&fit=crop&q=80',
  'prod-mochila-3.jpg': 'https://images.unsplash.com/photo-1581605405669-fcdf81165afa?w=600&h=600&fit=crop&q=80',
  'prod-mochila-4.jpg': 'https://images.unsplash.com/photo-1577720580479-7d839d895c4e?w=600&h=600&fit=crop&q=80',

  // Powerbank
  'prod-powerbank-1.jpg': 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600&h=600&fit=crop&q=80',
  'prod-powerbank-2.jpg': 'https://images.unsplash.com/photo-1609592424823-2c1b8f8f8f8f?w=600&h=600&fit=crop&q=80',
  'prod-powerbank-3.jpg': 'https://images.unsplash.com/photo-1591290619762-8a0f8f6e8f8f?w=600&h=600&fit=crop&q=80',

  // Cafeteira
  'prod-cafeteira-1.jpg': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=600&h=600&fit=crop&q=80',
  'prod-cafeteira-2.jpg': 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=600&fit=crop&q=80',
  'prod-cafeteira-3.jpg': 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=600&h=600&fit=crop&q=80',
  'prod-cafeteira-4.jpg': 'https://images.unsplash.com/photo-1442550528053-c431ecb55509?w=600&h=600&fit=crop&q=80',

  // Oculos
  'prod-oculos-1.jpg': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop&q=80',
  'prod-oculos-2.jpg': 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop&q=80',
  'prod-oculos-3.jpg': 'https://images.unsplash.com/photo-1473496169904-658ba7c2d98b?w=600&h=600&fit=crop&q=80',

  // Mochila executiva
  'prod-mochila-exec-1.jpg': 'https://images.unsplash.com/photo-1547949003-9792a18a2601?w=600&h=600&fit=crop&q=80',
  'prod-mochila-exec-2.jpg': 'https://images.unsplash.com/photo-1554224155-67235b3bf4e8?w=600&h=600&fit=crop&q=80',
  'prod-mochila-exec-3.jpg': 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop&q=80',

  // Tablet
  'prod-tablet-1.jpg': 'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&h=600&fit=crop&q=80',
  'prod-tablet-2.jpg': 'https://images.unsplash.com/photo-1542751110-97427bbecf20?w=600&h=600&fit=crop&q=80',
  'prod-tablet-3.jpg': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop&q=80',
  'prod-tablet-4.jpg': 'https://images.unsplash.com/photo-1488229307579-7134f5cdda8e?w=600&h=600&fit=crop&q=80',

  // Relogio
  'prod-relogio-1.jpg': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600&h=600&fit=crop&q=80',
  'prod-relogio-2.jpg': 'https://images.unsplash.com/photo-1547996160-81dfa63595aa?w=600&h=600&fit=crop&q=80',
  'prod-relogio-3.jpg': 'https://images.unsplash.com/photo-1622434641406-a158a450a389?w=600&h=600&fit=crop&q=80',
  'prod-relogio-4.jpg': 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600&h=600&fit=crop&q=80',

  // Cadeira
  'prod-cadeira-1.jpg': 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=600&h=600&fit=crop&q=80',
  'prod-cadeira-2.jpg': 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600&h=600&fit=crop&q=80',
  'prod-cadeira-3.jpg': 'https://images.unsplash.com/photo-1505797149-4084365d3b2b?w=600&h=600&fit=crop&q=80',
  'prod-cadeira-4.jpg': 'https://images.unsplash.com/photo-1589384267710-7a25bc1a8f8f?w=600&h=600&fit=crop&q=80',

  // Teclado
  'prod-teclado-1.jpg': 'https://images.unsplash.com/photo-1541140532154-b024d705b3a3?w=600&h=600&fit=crop&q=80',
  'prod-teclado-2.jpg': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&h=600&fit=crop&q=80',
  'prod-teclado-3.jpg': 'https://images.unsplash.com/photo-1618384887922-7850c4e2b1e0?w=600&h=600&fit=crop&q=80',

  // Monitor
  'prod-monitor-1.jpg': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&h=600&fit=crop&q=80',
  'prod-monitor-2.jpg': 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&h=600&fit=crop&q=80',
  'prod-monitor-3.jpg': 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&h=600&fit=crop&q=80',

  // Jeans
  'prod-jeans-1.jpg': 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&h=600&fit=crop&q=80',
  'prod-jeans-2.jpg': 'https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600&h=600&fit=crop&q=80',
  'prod-jeans-3.jpg': 'https://images.unsplash.com/photo-1582552938353-7d46b395b8f8?w=600&h=600&fit=crop&q=80',

  // Jaqueta
  'prod-jaqueta-1.jpg': 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&h=600&fit=crop&q=80',
  'prod-jaqueta-2.jpg': 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=600&h=600&fit=crop&q=80',
  'prod-jaqueta-3.jpg': 'https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=600&h=600&fit=crop&q=80',

  // Shorts
  'prod-shorts-1.jpg': 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?w=600&h=600&fit=crop&q=80',
  'prod-shorts-2.jpg': 'https://images.unsplash.com/photo-1506629082915-59e5f7d20f8f?w=600&h=600&fit=crop&q=80',
  'prod-shorts-3.jpg': 'https://images.unsplash.com/photo-1593079831268-3384b0db00fc?w=600&h=600&fit=crop&q=80',

  // Meia
  'prod-meia-1.jpg': 'https://images.unsplash.com/photo-1586350977771-2a7b4b4f8b82?w=600&h=600&fit=crop&q=80',
  'prod-meia-2.jpg': 'https://images.unsplash.com/photo-1556906781-9a443c302c76?w=600&h=600&fit=crop&q=80',

  // Carteira
  'prod-carteira-1.jpg': 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop&q=80',
  'prod-carteira-2.jpg': 'https://images.unsplash.com/photo-1601597676311-c1f4c6c8a8f8?w=600&h=600&fit=crop&q=80',
  'prod-carteira-3.jpg': 'https://images.unsplash.com/photo-1591561954557-26941169b49e?w=600&h=600&fit=crop&q=80',

  // Cinto
  'prod-cinto-1.jpg': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&h=600&fit=crop&q=80',
  'prod-cinto-2.jpg': 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop&q=80',

  // Liquidificador
  'prod-liquidificador-1.jpg': 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&h=600&fit=crop&q=80',
  'prod-liquidificador-2.jpg': 'https://images.unsplash.com/photo-1610631066891-52a7b0f8f8f8?w=600&h=600&fit=crop&q=80',
  'prod-liquidificador-3.jpg': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop&q=80',

  // Aspirador
  'prod-aspirador-1.jpg': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop&q=80',
  'prod-aspirador-2.jpg': 'https://images.unsplash.com/photo-1528698827591-e1937199d5b5?w=600&h=600&fit=crop&q=80',
  'prod-aspirador-3.jpg': 'https://images.unsplash.com/photo-1558317374-067fb5f30001?w=600&h=600&fit=crop&q=80',

  // Luminaria
  'prod-luminaria-1.jpg': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&h=600&fit=crop&q=80',
  'prod-luminaria-2.jpg': 'https://images.unsplash.com/photo-1517991104123-1d56a6e81ed9?w=600&h=600&fit=crop&q=80',
  'prod-luminaria-3.jpg': 'https://images.unsplash.com/photo-1565814329452-e1e11bfe6f8e?w=600&h=600&fit=crop&q=80',

  // Panela
  'prod-panela-1.jpg': 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&h=600&fit=crop&q=80',
  'prod-panela-2.jpg': 'https://images.unsplash.com/photo-1574781330855-d0db8cc6a79c?w=600&h=600&fit=crop&q=80',
  'prod-panela-3.jpg': 'https://images.unsplash.com/photo-1556910103-1c0bb455d6f0?w=600&h=600&fit=crop&q=80'
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        download(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode + ' for ' + url)); return; }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (e) => { fs.unlink(dest, () => {}); reject(e); });
  });
}

async function main() {
  const entries = Object.entries(images);
  let ok = 0, fail = 0;
  for (const [name, url] of entries) {
    const dest = path.join(ROOT, name);
    try {
      await download(url, dest);
      // Copy to out/
      fs.copyFileSync(dest, path.join(OUT, name));
      ok++;
      if (ok % 10 === 0) console.log(`  ${ok}/${entries.length}...`);
    } catch (e) {
      console.log(`  FAIL: ${name} — ${e.message}`);
      fail++;
    }
  }
  console.log(`Imagens: ${ok} OK, ${fail} falhas de ${entries.length}`);
}

main();

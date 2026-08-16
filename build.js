const fs = require('fs');
const path = require('path');

const dist = path.join(__dirname, 'dist');
if (!fs.existsSync(dist)) {
  fs.mkdirSync(dist, { recursive: true });
}

const filesToCopy = [
  'index.html',
  'style.css',
  'app.js',
  'privacidade.html',
  'termos.html',
  'trocas.html',
  'robots.txt',
  '_headers',
];

filesToCopy.forEach(file => {
  const src = path.join(__dirname, file);
  const dest = path.join(dist, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
});

const fontsSrc = path.join(__dirname, 'fonts');
const fontsDest = path.join(dist, 'fonts');
if (fs.existsSync(fontsSrc)) {
  fs.cpSync(fontsSrc, fontsDest, { recursive: true });
}

console.log('Build concluido em dist/');

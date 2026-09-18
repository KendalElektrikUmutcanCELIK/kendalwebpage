// Build öncesi çalışır (bkz. package.json "build" script, aynı kalıp
// generate-product-attributes.js ile). news.json artık 6 dilde ~450KB —
// haber bileşenleri (NewsPreview, HaberlerListesiClient, NewsDetailClient)
// "use client" oldukları için bu dosyayı doğrudan import etselerdi TÜM
// dillerin içeriği her ziyaretçiye (ana sayfa dahil) gönderilirdi. Bunun
// yerine her dil için ayrı, küçük bir statik JSON dosyası üretir; ilgili
// bileşenler sadece o an seçili dilin dosyasını fetch() ile çeker.
const fs = require('node:fs');
const path = require('node:path');

const news = require('../src/data/news.json');

const outDir = path.join(__dirname, '..', 'public', 'news');
fs.mkdirSync(outDir, { recursive: true });

for (const lang of Object.keys(news)) {
  fs.writeFileSync(
    path.join(outDir, `${lang}.json`),
    JSON.stringify(news[lang]),
    'utf8',
  );
}

console.log(
  `news/*.json: ${Object.keys(news).length} dil için haber verisi yazıldı.`,
);

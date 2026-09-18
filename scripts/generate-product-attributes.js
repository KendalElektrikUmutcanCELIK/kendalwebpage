// Build öncesi çalışır (bkz. package.json "build" script, aynı kalıp
// generate-legacy-redirects.js ile). Her ürünün `attributes` alanını (tüm
// dillerdeki özellik satırları — products.json'un en büyük tek alanı)
// products.json'dan ayırıp public/product-attributes.json'a yazar.
//
// Neden: /urunler listeleme sayfaları (CategoryFirstShowcase) her seferinde
// yüzlerce ürünü aynı anda client'a gönderiyor, ama `attributes` alanını hiç
// kullanmıyor — sadece "karşılaştır" modalı açıldığında, en fazla 3 ürün
// için lazım. products.ts'in `toProductListItem()` fonksiyonu bu alanı o
// listeleme prop'undan çıkarıyor; bu script de aynı veriyi ayrı bir statik
// JSON dosyası olarak üretir ki CategoryFirstShowcase, karşılaştırma modalı
// gerçekten açıldığında sadece o ürünlerin verisini fetch() ile çekebilsin
// (webpack'in modül grafiğine hiç girmediği için gerçekten "istek olmadan
// indirilmiyor" garantisi sağlanır — bir JS import()'u statik export'ta
// yine de sayfa yüklemesinde eager <script async> olarak indirilebiliyor).
const fs = require('node:fs');
const path = require('node:path');

const products = require('../src/data/products.json');

const attributesById = {};
for (const [id, product] of Object.entries(products)) {
  attributesById[id] = product.attributes;
}

const outPath = path.join(
  __dirname,
  '..',
  'public',
  'product-attributes.json',
);
fs.writeFileSync(outPath, JSON.stringify(attributesById), 'utf8');

console.log(
  `product-attributes.json: ${Object.keys(attributesById).length} ürünün özellik verisi yazıldı.`,
);

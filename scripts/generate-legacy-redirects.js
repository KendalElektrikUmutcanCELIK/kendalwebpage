// Build öncesi çalışır (bkz. package.json "build" script). slug-map.json'daki
// HER slug (kanonik olan da olmayan da — 4200 kaydın hepsi) için, gerçek ürün
// sayfasının tam marka-subdomain URL'sini önceden hesaplayıp
// public/legacy-redirects.json'a yazar.
//
// Neden: (main)/[...slug] rotası eskiden bu 4200 slug'ın HEPSİ için ayrı bir
// statik sayfa (+RSC payload dosyaları) üretiyordu. Ama sitenin kendi iç
// linkleri (ürün kartları vb.) zaten hiçbir zaman bu kısa linki kullanmıyor,
// hep marka route'una (brand/[brandName]/urunler/[category]/[slug]) link
// veriyor — kısa link sadece dışarıdan gelen eski bağlantılar için var. Bu
// yüzden artık (main)/[...slug] ürünler için HİÇ statik sayfa üretmiyor;
// hepsi tek bir yönlendirme dosyasına (bu dosya) ve tek bir ortak sayfaya
// (src/app/(main)/urun-yonlendirme/) bağlanıyor.
const fs = require('node:fs');
const path = require('node:path');

const products = require('../src/data/products.json');
const slugMap = require('../src/data/slug-map.json');

const BRAND_HOSTS = {
  k2: 'https://k2.kendalelektrik.com',
  vanti: 'https://vanti.kendalelektrik.com',
  global: 'https://global.kendalelektrik.com',
};

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

const idToFirstSlug = {};
for (const slug of Object.keys(slugMap)) {
  const id = slugMap[slug];
  if (!idToFirstSlug[id]) {
    idToFirstSlug[id] = slug;
  }
}

function getCanonicalSlug(id) {
  const product = products[id];
  if (!product) return undefined;
  const candidate = slugify(product.name.tr);
  if (slugMap[candidate] === id) {
    return candidate;
  }
  return idToFirstSlug[id];
}

function getCategorySlug(product) {
  const brandName = product.brand || 'k2';
  const categoryName = product.category?.tr?.[0];
  if (categoryName) return slugify(categoryName);
  return brandName === 'vanti' ? 'vantilator' : 'aydinlatma';
}

function getCanonicalUrl(product, canonicalSlug) {
  const brandName = product.brand || 'k2';
  const host = BRAND_HOSTS[brandName] || BRAND_HOSTS.k2;
  const category = getCategorySlug(product);
  return `${host}/urunler/${category}/${encodeURIComponent(canonicalSlug)}`;
}

const redirects = {};
let skippedMissingProduct = 0;

for (const [slug, id] of Object.entries(slugMap)) {
  const product = products[id];
  if (!product) {
    skippedMissingProduct++;
    continue;
  }
  const canonicalSlug = getCanonicalSlug(id);
  if (!canonicalSlug) {
    continue;
  }
  redirects[slug] = getCanonicalUrl(product, canonicalSlug);
}

const outPath = path.join(__dirname, '..', 'public', 'legacy-redirects.json');
fs.writeFileSync(outPath, JSON.stringify(redirects), 'utf8');

console.log(
  `legacy-redirects.json: ${Object.keys(redirects).length} slug yazıldı` +
    (skippedMissingProduct > 0
      ? ` (${skippedMissingProduct} slug'ın ürünü bulunamadı, atlandı)`
      : '') +
    `.`,
);

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const repoPath = __dirname;
const products = require(path.join(repoPath, 'src/data/products.json'));

const OUTPUT_DIR = path.join(repoPath, 'public/urun-bilgi-formlari');
const KENDAL_LOGO_PATH = path.join(repoPath, 'public/images/kendal-logo.svg');

const BRAND_LOGOS = {
  k2: path.join(repoPath, 'public/images/brands/k2-logo.svg'),
  vanti: path.join(repoPath, 'public/images/brands/vanti-logo.svg'),
  global: path.join(repoPath, 'public/images/brands/global-logo.svg'),
};

// Turkish attribute labels that get a clearer bilingual label in the sheet
// than a literal word-for-word translation of the raw data label.
const LABEL_MAP = {
  Watt: { tr: 'Güç', en: 'Power' },
  'Çalışma Ömrü': { tr: 'Ömür', en: 'Life Time' },
  Özellik: { tr: 'Diğer Özellikler', en: 'Additional Features' },
  Renk: { tr: 'Renk Seçenekleri', en: 'Color Options' },
};

function toBase64DataUri(filePath) {
  const ext = path.extname(filePath).slice(1);
  const mime = ext === 'svg' ? 'image/svg+xml' : `image/${ext}`;
  const b64 = fs.readFileSync(filePath, 'base64');
  return `data:${mime};base64,${b64}`;
}

function combineValue(trCombined, enCombined) {
  if (trCombined.trim().toLowerCase() === enCombined.trim().toLowerCase()) {
    return trCombined;
  }
  const separator = trCombined.includes('/') || enCombined.includes('/') ? ' — ' : ' / ';
  return `${trCombined}${separator}${enCombined}`;
}

function buildRows(product) {
  const attrsTr = product.attributes?.tr || [];
  const attrsEn = product.attributes?.en || [];
  const n = Math.min(attrsTr.length, attrsEn.length);

  // Group by (remapped) label: some products repeat the same attribute
  // label (e.g. two separate "Özellik" entries) - merge those into one row.
  const grouped = new Map();
  for (let i = 0; i < n; i++) {
    const trLabelRaw = attrsTr[i].label;
    const override = LABEL_MAP[trLabelRaw];
    const trLabel = override ? override.tr : trLabelRaw;
    const enLabel = override ? override.en : attrsEn[i].label;
    const key = `${trLabel} / ${enLabel}`;
    if (!grouped.has(key)) grouped.set(key, { trValues: [], enValues: [] });
    grouped.get(key).trValues.push(attrsTr[i].value);
    grouped.get(key).enValues.push(attrsEn[i].value);
  }

  const rows = [];
  for (const [label, { trValues, enValues }] of grouped) {
    rows.push({ label, value: combineValue(trValues.join(' / '), enValues.join(' / ')) });
  }

  const catTr = product.category?.tr?.[0];
  const catEn = product.category?.en?.[0];
  if (catTr && catEn) {
    rows.push({ label: 'Kategori / Category', value: combineValue(catTr, catEn) });
  }
  rows.push({ label: 'Marka / Brand', value: (product.brand || 'k2').toUpperCase() });
  return rows;
}

function rowsToHtml(rows) {
  return rows
    .map((r) => `<tr><td class="label">${r.label}</td><td class="value">${r.value}</td></tr>`)
    .join('\n                    ');
}

function buildHtml(product, { kendalLogo, brandLogo, productImage }) {
  const rows = buildRows(product);
  const mid = Math.ceil(rows.length / 2);
  const leftRows = rows.slice(0, mid);
  const rightRows = rows.slice(mid);

  return `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <title>${product.model} Ürün Bilgi Formu</title>
    <style>
        * {
            box-sizing: border-box;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
        }

        @page {
            margin: 0;
            size: A4;
        }

        body {
            font-family: Arial, Helvetica, sans-serif;
            margin: 0;
            padding: 0;
            color: #222;
            background-color: #fff;
            position: relative;
            min-height: 100vh;
            overflow: hidden;
        }

        /* HEADER */
        .header {
            background-color: #111;
            color: #fff;
            padding: 40px 52px 30px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 4px solid #E60000;
            margin: 0 -2px; /* Bleed to prevent white line */
        }

        .logo-container img {
            height: 65px;
        }

        .header-text {
            text-align: right;
        }

        .header-text h1 {
            font-size: 26px;
            font-weight: 700;
            margin: 0 0 5px 0;
            letter-spacing: 1px;
            color: #fff;
        }

        .header-text h2 {
            font-size: 13px;
            font-weight: 400;
            color: #aaa;
            margin: 0;
            letter-spacing: 2px;
            text-transform: uppercase;
        }

        /* CONTENT */
        .content {
            padding: 40px 50px;
        }

        /* PRODUCT HERO */
        .product-hero {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 40px;
        }

        .product-info {
            flex: 1;
            padding-right: 30px;
        }

        .product-info h3 {
            font-size: 32px;
            font-weight: 800;
            color: #E60000;
            margin: 0 0 8px 0;
            line-height: 1.1;
            letter-spacing: -0.5px;
        }

        .product-info h4 {
            font-size: 18px;
            font-weight: 500;
            color: #666;
            margin: 0 0 20px 0;
        }

        .image-container {
            width: 280px;
            height: 280px;
            background: linear-gradient(145deg, #f0f0f0, #ffffff);
            border-radius: 16px;
            box-shadow: 0 10px 30px rgba(0,0,0,0.06);
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
            border: 1px solid #eee;
        }

        .image-container img {
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            filter: drop-shadow(0 15px 15px rgba(0,0,0,0.1));
        }

        /* SPECIFICATIONS */
        .section-title {
            font-size: 16px;
            font-weight: 700;
            color: #111;
            letter-spacing: 1px;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #E60000;
            display: inline-block;
        }

        .specs-section {
            display: flex;
            gap: 40px;
        }

        .spec-column {
            flex: 1;
        }

        .spec-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
        }

        .spec-table tr:nth-child(even) td {
            background-color: #f9f9f9;
        }

        .spec-table td {
            padding: 12px 15px;
            font-size: 13px;
            line-height: 1.4;
            border-bottom: 1px solid #f0f0f0;
        }

        .spec-table td.label {
            font-weight: 600;
            color: #444;
            width: 45%;
        }

        .spec-table td.value {
            font-weight: 400;
            color: #111;
        }

        /* FOOTER */
        .footer {
            position: absolute;
            bottom: 0;
            left: -2px;
            right: -2px;
            background-color: #111;
            color: #888;
            padding: 20px 52px;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 11px;
        }

        .footer a {
            color: #fff;
            text-decoration: none;
            font-weight: 500;
            margin-left: 5px;
            margin-right: 15px;
        }

        .footer img {
            height: 20px;
            margin-left: 15px;
            vertical-align: middle;
        }
    </style>
</head>
<body>
    <div class="header">
        <div class="logo-container">
            <img src="${brandLogo}" alt="Brand Logo" />
        </div>
        <div class="header-text">
            <h1>ÜRÜN BİLGİ FORMU</h1>
            <h2>Product Information Sheet</h2>
        </div>
    </div>

    <div class="content">
        <div class="product-hero">
            <div class="product-info">
                <h3>${product.name.tr}</h3>
                <h4>${product.name.en}</h4>
            </div>
            <div class="image-container">
                <img src="${productImage}" alt="${product.model}" />
            </div>
        </div>

        <div class="section-title">TEKNİK ÖZELLİKLER / TECHNICAL FEATURES</div>
        <div class="specs-section">
            <div class="spec-column">
                <table class="spec-table">
                    ${rowsToHtml(leftRows)}
                </table>
            </div>

            <div class="spec-column">
                <table class="spec-table">
                    ${rowsToHtml(rightRows)}
                </table>
            </div>
        </div>
    </div>

    <div class="footer">
        Daha fazla bilgi için / For more information: <a href="https://www.kendalelektrik.com.tr">www.kendalelektrik.com.tr</a>
        | <img src="${kendalLogo}" alt="Kendal Elektrik Logo" />
    </div>
</body>
</html>
`;
}

function validateProduct(product) {
  if (!product.name?.tr || !product.name?.en) return 'name.tr/en eksik';
  if (!product.attributes?.tr?.length || !product.attributes?.en?.length) return 'attributes.tr/en eksik';
  if (!product.image) return 'image alanı eksik';
  const imgPath = path.join(repoPath, 'public/images', product.image);
  if (!fs.existsSync(imgPath)) return `görsel bulunamadı: ${product.image}`;
  return null;
}

async function generateOne(browser, kendalLogo, product) {
  const brand = product.brand || 'k2';
  const brandLogoPath = BRAND_LOGOS[brand] || BRAND_LOGOS.k2;
  const brandLogo = toBase64DataUri(brandLogoPath);
  const productImage = toBase64DataUri(path.join(repoPath, 'public/images', product.image));

  const html = buildHtml(product, { kendalLogo, brandLogo, productImage });

  const page = await browser.newPage();
  try {
    await page.setContent(html, { waitUntil: 'networkidle0' });
    const pdfPath = path.join(OUTPUT_DIR, `${product.model} Ürün Bilgi Formu.pdf`);
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: { top: '0', right: '0', bottom: '0', left: '0' },
    });
    const stat = fs.statSync(pdfPath);
    return { ok: true, path: pdfPath, size: stat.size };
  } finally {
    await page.close();
  }
}

// Mirrors src/lib/getProductPdfForm.ts's matching so "--missing" agrees with
// what the live site actually resolves as an existing PDF for a product.
function findProductsMissingPdf() {
  const SUFFIX = ' Ürün Bilgi Formu.pdf';
  const existing = fs.existsSync(OUTPUT_DIR)
    ? fs
        .readdirSync(OUTPUT_DIR)
        .filter((f) => f.toLowerCase().endsWith('.pdf'))
        .map((f) =>
          f.toLowerCase().endsWith(SUFFIX.toLowerCase())
            ? f.slice(0, -SUFFIX.length)
            : f.replace(/\.pdf$/i, ''),
        )
    : [];

  return Object.keys(products).filter((id) => {
    const product = products[id];
    const model = (product.model || '').toUpperCase();
    const nameTr = (product.name?.tr || '').toUpperCase();
    return !existing.some(
      (code) => model.includes(code.toUpperCase()) || nameTr.includes(code.toUpperCase()),
    );
  });
}

async function main() {
  const args = process.argv.slice(2);
  const targetIds = args.includes('--missing')
    ? findProductsMissingPdf()
    : args.length > 0
      ? args
      : Object.keys(products);

  if (targetIds.length === 0) {
    console.log('Eksik ürün bilgi formu yok, üretilecek bir şey bulunamadı.');
    return;
  }

  if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const kendalLogo = toBase64DataUri(KENDAL_LOGO_PATH);

  const blocked = [];
  const failed = [];
  const warnings = [];
  let successCount = 0;

  const browser = await puppeteer.launch();

  const BATCH_SIZE = 10;
  for (let i = 0; i < targetIds.length; i += BATCH_SIZE) {
    const batch = targetIds.slice(i, i + BATCH_SIZE);
    for (const id of batch) {
      const product = products[id];
      if (!product) {
        blocked.push({ id, reason: 'products.json içinde bulunamadı' });
        continue;
      }
      const problem = validateProduct(product);
      if (problem) {
        blocked.push({ id, model: product.model, reason: problem });
        continue;
      }
      try {
        const result = await generateOne(browser, kendalLogo, product);
        successCount++;
        if (result.size < 20_000 || result.size > 5_000_000) {
          warnings.push({ id, model: product.model, reason: `olağandışı dosya boyutu: ${result.size} byte` });
        }
      } catch (e) {
        failed.push({ id, model: product.model, reason: e.message });
      }
    }
    console.log(
      `Batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(targetIds.length / BATCH_SIZE)} tamamlandı (${Math.min(i + BATCH_SIZE, targetIds.length)}/${targetIds.length})`,
    );
  }

  await browser.close();

  console.log('\n--- ÖZET ---');
  console.log('Başarılı:', successCount);
  console.log('Engellenen (veri eksik):', blocked.length);
  console.log('Hata alan:', failed.length);
  console.log('Uyarı (dosya boyutu):', warnings.length);

  if (blocked.length) {
    console.log('\nEngellenenler:');
    for (const b of blocked) console.log(` - ${b.id} (${b.model || '?'}): ${b.reason}`);
  }
  if (failed.length) {
    console.log('\nHata alanlar:');
    for (const f of failed) console.log(` - ${f.id} (${f.model || '?'}): ${f.reason}`);
  }
  if (warnings.length) {
    console.log('\nUyarılar:');
    for (const w of warnings) console.log(` - ${w.id} (${w.model || '?'}): ${w.reason}`);
  }

  const reportPath = path.join(repoPath, 'urun_bilgi_formu_rapor.json');
  fs.writeFileSync(
    reportPath,
    JSON.stringify({ successCount, blocked, failed, warnings }, null, 2),
    'utf-8',
  );
  console.log('\nDetay rapor:', reportPath);
}

main().catch((e) => {
  console.error('Beklenmeyen hata:', e);
  process.exit(1);
});

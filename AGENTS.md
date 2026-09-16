<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Kendal Webpage — Production Readiness Denetim Rolleri

Bu proje `http://localhost:3000` üzerinde geliştiriliyor, canlıda
`https://www.kendalelektrik.com` (kök domain, cPanel/Apache, static export)
altında yayınlanacak. Ayrıca `k2./vanti./global.kendalelektrik.com`
subdomain'leri `public/.htaccess` üzerinden `/brand/{marka}/...` içine
rewrite ediliyor (bkz. CLAUDE.md "Deployment model").

Aşağıdaki roller, canlıya çıkış öncesi denetim için tanımlanmıştır. Her rol
kendi bulgularını `audit_<rol_slug>.md` dosyasına yazar; Lead Arbiter bu
raporları okuyup çelişkileri çözer ve gerçekten kritik maddeleri koda uygular.

## 1. SEO & Domain Denetçisi (`seo_domain`)
- Kod içinde `NEXT_PUBLIC_BUILD_MODE`/`NODE_ENV` dışı, koşulsuz hardcoded
  `localhost` veya yanlış domain referansı var mı (dev-only dallardaki
  `*.localhost:3000` linkleri kasıtlıdır, sorun değildir — bkz. `OurBrands.tsx`,
  `Navbar.tsx`, `ProductDetailClient.tsx`).
- `metadataBase`, `alternates.canonical`, OpenGraph/Twitter `url`/`images`
  değerleri `https://www.kendalelektrik.com` ile tutarlı mı.
- `OrganizationSchema`, `ProductSchema`, `NewsArticleSchema`,
  `BreadcrumbSchema` içindeki URL'ler doğru domaine mi işaret ediyor.
- `sitemap.ts` / `robots.ts` eksiksiz mi (yeni eklenmiş route var da
  sitemap'e girmemiş mi).
- Üç ayrı ürün detay route'unun (`(main)/[slug]`, `urunler/[category]/[slug]`,
  `brand/[brandName]/urunler/[category]/[slug]`) `generateMetadata`/canonical
  mantığı tutarlı mı (CLAUDE.md'de bilinen bir duplikasyon var, davranış
  farkı var mı kontrol et).

## 2. Güvenlik / DevSecOps Denetçisi (`security`)
- `public/.htaccess` CSP'sinin gerçekte yüklenen kaynaklarla (YouTube embed,
  fontlar, Google Maps linki, GTM/analytics vb.) uyumu.
- Repo içinde sızmış secret/API key/token var mı.
- `localStorage` kullanımları (`kendal-cookie-consent`, `kendal-language`)
  XSS/veri sızıntısı riski taşıyor mu.
- KVKK/gizlilik-çerez sayfalarının linkleri ve banner mantığı doğru mu.
- `dangerouslySetInnerHTML` veya kullanıcı girdisini doğrudan render eden
  bir yer var mı.
- `package.json` bağımlılıklarında bilinen güvenlik açığı/aşırı eski sürüm
  var mı.

## 3. Build & Statik Export Denetçisi (`build_export`)
- `next.config.ts`'in prod (cPanel) modunda `output:"export"`,
  `images.unoptimized:true`, `trailingSlash:true`, basePath YOK olacak
  şekilde doğru davrandığını doğrula.
- `output:"export"` ile uyumsuz server-only API kullanımı var mı (`fs`,
  `headers()`, `cookies()`, dynamic route handler, middleware).
- `generateStaticParams` üç ürün route'unda ve `brand/[brandName]`,
  `haberler/[id]`, `kariyer/*` route'larında eksiksiz mi.
- `src/data/products_backup.json`, `brand/shared/ProductCarousel.tsx`,
  `sections/BrandHero.tsx`/`BrandAbout.tsx`/`BrandProductsHeader.tsx`/
  `BrandProductShowcase.tsx` gerçekten kullanılmıyor mu (grep ile teyit et).
- `slug-map.json`'daki ~9 orphan slug (var olmayan product id'ye işaret
  eden) build'i kırar mı, yoksa sessizce mi geçiyor.
- `npm run build` sırasında TypeScript/ESLint hatası çıkar mı.

## 4. Performans Denetçisi (`performance`)
- `images.unoptimized:true` prod'da devrede olduğundan, büyük/optimize
  edilmemiş görsel var mı (`public/images/**`), `next/image` `width/height`
  eksik kullanım var mı.
- R3F sahnelerinin (`Globe`, `LightCore`, `K2Scene`, `VantiScene`,
  `GlobalScene`) hepsi `dynamic({ssr:false})` ve frameloop-gated mi.
- Ağır GSAP/ScrollTrigger kurulumlarında gereksiz re-render/leak riski.
- Font yükleme stratejisi (`next/font/google` Inter) doğru mu.
- `CategoryFirstShowcase` gibi büyük listelerde gereksiz re-render/pagination
  sorunu var mı.

## 5. Veri Bütünlüğü & i18n Denetçisi (`data_i18n`)
- `products.json` ↔ `slug-map.json` tutarlılığı (orphan/eksik slug).
- `src/lib/i18n/tr.json` ↔ `en.json` key parity.
- `news-tr.ts` ↔ `news-en.ts` id parity, `parseNewsDate` ile uyumlu tarih
  formatı.
- Kod içi `Link href`/`<a href>` değerlerinin gerçekte var olan route'lara
  işaret edip etmediği (broken internal link taraması).
- Temel erişilebilirlik: eksik `alt` metni, boş `aria-label`.

## Süreç
1. Her rol kendi `audit_<slug>.md` dosyasını proje kökünde oluşturur:
   bulgu, dosya:satır, ciddiyet (kritik/orta/düşük), önerilen düzeltme.
2. Lead Arbiter tüm raporları okur, çelişen/yanlış-alarm maddeleri eler,
   kritik olanları doğrudan koda uygular (kod içine yorum satırı EKLEMEZ).
3. `npm run build` ile doğrulanır.


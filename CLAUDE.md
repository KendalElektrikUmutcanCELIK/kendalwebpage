# Kendal Webpage Project Overview

Welcome to the Kendal Webpage project. 

## 🧠 Codebase Navigation (Graphify Workflow)
**CRITICAL**: This project uses **Graphify** (`@sentropic/graphify`) to map the codebase into a queryable dependency graph.
1. **DO NOT** use brute-force grep searches, file tree crawling, or broad file reading to understand dependencies or imports.
2. Instead, refer directly to the generated AST/Graph in the `.graphify/` directory to trace component imports, references, and relationships.
3. Use the `npx @sentropic/graphify` tools (like `query`, `summary`, or `explain`) if you need to perform deep impact analysis.
4. If you make significant structural changes (new files, removed dependencies), run `npx @sentropic/graphify extract ./` to keep the local graph up to date.

This document contains high-level routing, component inventory, data schemas, and conventions. Treat it as the source of truth for architecture. For exact code references, rely on the Graphify output.

## Tech Stack
- **Framework:** Next.js (v16+) with App Router (`src/app`), built as a **fully static export** (`output: "export"` in production — no SSR/ISR at runtime)
- **UI Library:** React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 (using `@tailwindcss/postcss`)
- **Animations:** GSAP (v3.15+) + ScrollTrigger
- **Smooth Scrolling:** Lenis
- **3D Graphics:** Three.js & React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
- **Geo/maps:** `d3-geo` + `topojson-client` (custom SVG maps, no map library/tiles)
- **Code Quality:** Biome (`biome.json`; `npm run lint`/`format`/`check`) is the canonical linter/formatter. An `eslint.config.mjs` + `eslint`/`eslint-config-next` devDependency also exist from the original `create-next-app` scaffold, but no npm script wires them in — Biome is what actually runs. Biome flags `noExplicitAny` heavily (the `(t as any).xxx` i18n-dictionary-access pattern is used pervasively and is an accepted convention, not a bug to fix) and `noSvgWithoutTitle` on most of the project's bare inline `<svg>` icons (also pre-existing, not something every touch needs to resolve).

## Deployment model (important — affects how code must be written)

The site is built as a **static export** and deployed to two different targets from the same codebase (`next.config.ts`):

- **Production (cPanel, `kendalelektrik.com`)**: root path, `NEXT_PUBLIC_BUILD_MODE` unset. `output: "export"`, `images.unoptimized: true`, `trailingSlash: true`.
- **GitHub Pages preview**: `NEXT_PUBLIC_BUILD_MODE=ghpages` (set in `.github/workflows/nextjs.yml`) → adds `basePath`/`assetPrefix: "/kendalwebpage"` since it's served from a repo-name subpath.
- Every static asset reference (images, PDFs, icons) **must** go through `getAssetPath()` / `getBasePath()` (`src/lib/basePath.ts`) so it resolves correctly under both targets — used in 37+ files. When adding new image/PDF references, use this helper, don't hardcode `/images/...`.
- There is **no `headers()` config** in `next.config.ts` — this is intentional: `output: "export"` doesn't support it. Security headers (CSP, HSTS, X-Frame-Options) and the k2/vanti/global subdomain→`/brand/{name}` rewrite are instead served at the web-server level: `public/.htaccess` (Apache/mod_rewrite, cPanel `.com.tr` target) and `public/web.config` (IIS URL Rewrite, Windows/Plesk `kendalelektrik.com` target) carry the *same* rules in each server's own syntax — both ship in `public/` and get copied to the export root; whichever server a given host runs picks up the file it understands. Keep the two in sync when the rewrite/header logic changes.
- No `redirects()`/`rewrites()` config either. The one redirect the app needs (canonical product slug) is done at runtime via `next/navigation`'s `redirect()` inside the page component — see the `[slug]` section below.
- `images.qualities: [25, 50, 70, 75, 80, 100]` is set in all environments.

## Directory Structure & Architecture

### `src/app/` (Routing) — full tree

```
src/app/
├── layout.tsx                # Root layout: <html lang="tr">, Inter font, global metadata (title/OG/twitter/metadataBase)
│                              #   Provider chain: LanguageProvider → SmoothScrollProvider (Lenis) → LightTemperatureProvider
│                              #   → GsapContext → OrganizationSchema + CustomCursor + {children} + ChatbotWidget
│                              #   ChatbotWidget is mounted here (not in (main)/ or brand/ layouts) so it's on every
│                              #   page, both route groups, with no per-layout wiring needed.
├── globals.css
├── robots.ts                  # force-static; allow:"/" for all UAs; points to 4 per-host sitemaps (www + k2/vanti/global)
├── sitemap.ts                 # force-static; generateSitemaps() emits one sitemap per host (www: static pages+news,
│                               #   k2/vanti/global: brand home + /urunler + that brand's getProductCanonicalUrl() entries)
│                               #   — required because product URLs live on brand subdomains, not www (sitemap protocol
│                               #   forbids cross-host URLs in a single sitemap file)
│
├── (main)/                    # Route group — main corporate site (no URL segment)
│   ├── layout.tsx              # Navbar + <main>{children}</main> + Footer + CookieConsentBanner + ScrollToTop (no providers)
│   ├── page.tsx                 # "/" → HomeClient.tsx
│   ├── HomeClient.tsx           # "use client": Loader, Hero, AboutUs, OurBrands, CompanyStats, GlobalPresence,
│   │                            #   CompanyVideo, NewsTicker, NewsPreview, CatalogCTA, ApertureTransition
│   │                            #   (Certifications moved off the homepage to its own /sertifikalar route)
│   │
│   ├── [slug]/                  # SHORT product URL: /{slug} — e.g. /ges230-20w-torch-led-ampul-beyaz
│   │   ├── page.tsx              # generateStaticParams = getAllSlugs() (every slug-map.json key, incl. non-canonical)
│   │   │                         # generateMetadata (inline, does NOT reuse lib/productMetadata.ts — duplicated logic)
│   │   │                         # redirects to canonical slug if decodedSlug !== getSlugByProductId(product.id)
│   │   │                         # renders ProductDetailClient + ProductSchema + BreadcrumbSchema
│   │   └── ProductDetailClient.tsx  # "use client" — main product detail UI, brand-themed
│   │
│   │   # NOTE: `(main)/urunler` (brand-neutral canonical product listing/detail under www) was REMOVED
│   │   # ("http://localhost:3000/urunler kaldırıldı" commit). The only canonical product route left is
│   │   # `brand/[brandName]/urunler/[category]/[slug]` below — see "Three separate product-detail routes".
│   │
│   ├── haberler/
│   │   ├── layout.tsx            # metadata-only pass-through (no visual wrapper)
│   │   ├── page.tsx               # "/haberler" → HaberlerListesiClient.tsx (list, sorted via parseNewsDate)
│   │   └── [id]/page.tsx + NewsDetailClient.tsx   # generateMetadata + generateStaticParams from newsData ids
│   │
│   ├── kariyer/
│   │   ├── layout.tsx (metadata-only), page.tsx → KariyerClient.tsx
│   │   ├── insan-kaynaklari-politikamiz/page.tsx + HrPolicyClient.tsx
│   │   ├── temel-ilkelerimiz/page.tsx + PrinciplesClient.tsx
│   │   └── insan-haklari-ve-calisan-haklari-politikasi/page.tsx + HumanRightsClient.tsx
│   │
│   ├── uretim/          layout.tsx (metadata-only) + page.tsx → UretimClient.tsx
│   ├── projeler/         layout.tsx (metadata-only) + page.tsx → renders <Projects/> directly (no client wrapper)
│   ├── zincir-marketler/ layout.tsx (metadata-only) + page.tsx → renders <RetailPresence/> directly
│   ├── misyon-ve-vizyon/ page.tsx → MissionVisionClient.tsx
│   ├── iletisim/         page.tsx → IletisimClient.tsx (static contact info/links, no form — no backend needed)
│   ├── sertifikalar/     page.tsx → renders <Certifications/> directly (moved off the homepage, own route)
│   │   ├── iso/            page.tsx → CertificateGallery with ISO management-system cert images
│   │   ├── tse/            page.tsx → CertificateGallery with TSE product-approval cert images
│   │   └── marka-tescil/   page.tsx → CertificateGallery with Turk Patent trademark registration images
│   ├── kvkk/             page.tsx → KVKKContent.tsx
│   └── gizlilik-cerez-politikasi/ page.tsx → PrivacyContent.tsx
│
└── brand/                      # Route group — brand micro-sites, own BrandNavbar/BrandFooter
    └── [brandName]/              # "k2" | "vanti" | "global" — generateStaticParams fixes exactly these 3
        ├── layout.tsx             # generateMetadata (brand favicon) + BrandNavbar/BrandFooter/ScrollToTop (themed color)
        ├── page.tsx                # "/brand/{brandName}" → K2CreativePage / VantiCreativePage / GlobalCreativePage
        └── urunler/
            ├── page.tsx            # brand-filtered CategoryFirstShowcase (isBrandScoped=true)
            └── [category]/[slug]/page.tsx  # brand+category+slug product detail; brandName also passed to ProductDetailClient
                # NOTE (known quirk): the canonical-slug redirect() here targets /urunler/{category}/{canonicalSlug}
                # WITHOUT the brand prefix — likely unintentional, hasn't been fixed, worth checking if touching this route.
```

There are **no** `loading.tsx` / `error.tsx` / `not-found.tsx` files anywhere in the project — not-found handling relies solely on Next's default via `notFound()` calls.

**Two product-detail routes exist** (`(main)/[slug]`, `brand/[brandName]/urunler/[category]/[slug]`), both reading from the same `src/data/products.ts` data layer and rendering the same `ProductDetailClient`. The first is the legacy/short-URL form (kept for old links, generates a page per slug-map entry incl. duplicates, then redirects non-canonical ones to itself); the second is the sole canonical route, one page per product, reached via the k2/vanti/global brand subdomains. A third route, brand-neutral `(main)/urunler/[category]/[slug]` under `www`, existed previously and was removed — do not re-introduce link/sitemap logic assuming it exists.

### `src/components/` — full inventory

62 files across `sections/`, `ui/`, `engine/`, `shared/`, `loader/`, and `brand/` (with `brand/k2/`, `brand/vanti/`, `brand/global/`, `brand/shared/`). **All are client components (`"use client"`) except the four JSON-LD schema components in `shared/`**, which are plain server components with no hooks.

#### `engine/` — animation & 3D infrastructure
- **`GsapContext.tsx`** — app-wide GSAP lifecycle root (wraps whole app in root layout). Creates one root `gsap.context()`, and listens for the `contentvisibilityautostatechange` CSS event on every `<section>` to debounce (150ms) `ScrollTrigger.refresh()` calls; also listens for a custom `window` `scroll-refresh` event (see "scroll-sync convention" below). Individual sections still create their **own** `gsap.context()` scoped to their own container ref — this is not a replacement for per-section contexts.
- **`SmoothScrollProvider.tsx`** — creates the single app-wide `Lenis` instance, exposes `useLenis()` via `LenisContext`. Hooks Lenis's raf into `gsap.ticker`, calls `ScrollTrigger.update()` on scroll, sets `history.scrollRestoration = "manual"`.
- **`Globe.tsx`** — R3F rotating Earth with ~40 hardcoded `LOCATIONS`, animated dashed arcs (custom `THREE.ShaderMaterial`, not drei's MeshLine) from Turkey (HQ) to each location, glowing pins. Camera z lerps from a `scrollProgressRef` (fed by a `ScrollTrigger` in the parent section). Color cross-fades cool→warm via `useLightTemperature()`. `Canvas frameloop` toggles `"always"`/`"never"` based on `useInView()`. Used by `sections/GlobalPresence.tsx` (dynamic import, `ssr:false`).

Pattern: 3D Canvases (`Globe.tsx` and the three brand `*Scene.tsx` files) are always `next/dynamic({ssr:false})`, mounted as fixed/absolute full-bleed backgrounds, never imported eagerly.

#### `loader/Loader.tsx`
Full-screen page loader (`Loader({onComplete})`) shown until first paint. Faux progress bar capped ~90% until `document.readyState==='complete'`; at 100% plays a GSAP curtain-wipe reveal then calls `onComplete`.

#### `shared/` — small reusable pieces
- **`SplitText.tsx`** — `SplitText({text, className, delay, stagger})`, splits text into words, GSAP stagger-reveals them on `ScrollTrigger` (`start: "top 85%"`).
- **`ApertureTransition.tsx`** — scroll-scrubbed radial-gradient iris wipe; animates a plain object's `radius` via `scrollTrigger:{scrub:1}` and manually repaints a fixed overlay's background in `onUpdate` (direct style mutation, not CSS var, for perf).
- **`OrganizationSchema.tsx`, `ProductSchema.tsx`, `NewsArticleSchema.tsx`, `BreadcrumbSchema.tsx`** — server components, each renders one `<script type="application/ld+json">` (schema.org `Organization`/`Product`/`NewsArticle`/`BreadcrumbList`). `ProductSchema` takes `{product, canonicalUrl}` and maps brand codes to display names.

#### `ui/` — global chrome
- **`Navbar.tsx`** — main-site nav; dropdown groups from hardcoded `navGroups` (brand links → `/brand/{name}` in prod, `http://{brand}.localhost:3000` in dev — subdomain-per-brand convention). Tracks active section via scroll position, handles hash-anchor scroll via `useLenis()` using the scroll-sync convention (see below). Has its own mobile accordion menu.
- **`BrandNavbar.tsx`** — brand micro-site nav variant, themed per brand (`brandThemes` map). Fades in after 2.2s specifically on the Global brand homepage (`isGlobalHomePage`), to let its intro play first.
- **`Footer.tsx` / `BrandFooter.tsx`** — main vs. brand footer; `BrandFooter({brandName})` swaps logo/socials (Instagram link only for K2). Both render a "location card": a static pre-rendered map snapshot (`public/images/footer-location-map.webp`, built once offline from OSM tiles — not a live map embed, consistent with the project's no-map-library rule) with a pulsing pin (`.footer-map-ring` in `globals.css`) and a click-through to the real Google Maps listing.
- **`CustomCursor.tsx`** — large soft radial-gradient blob following the mouse via direct `style.transform` mutation (no React state/rAF), hidden on coarse-pointer/touch devices. No context/provider — standalone.
- **`CookieConsentBanner.tsx`** — reads/writes `localStorage["kendal-cookie-consent"]`; only ever rendered inside `(main)/layout.tsx`, never on brand pages. Renders with a `data-cookie-banner` attribute and dispatches a `kendal-cookie-consent-changed` `window` event from a **second** `useEffect` keyed on `[isVisible]` (not inline in the accept handler or the mount-check effect) — this is what lets `ChatbotWidget` (in the unrelated root layout, no direct reference to this component) reliably read the banner's *post-commit* DOM state instead of racing its own async mount effect.
- **`LanguageSwitcher.tsx`** — TR/EN toggle via `useLanguage()`.
- **`ImageSlider.tsx`** — `ImageSlider({images, altPrefix, titlePrefix})`, self-contained auto-advancing carousel (4s interval, pause on hover), plain `useState`/`useEffect`, no GSAP.
- **`ScrollToTop.tsx`** — floating button (visible after `scrollY>300`), uses `useLenis()` + the scroll-sync convention to smooth-scroll to top.

#### `chatbot/` — scripted quick-reply assistant (no LLM/RAG)
Bottom-left floating widget, mounted once in the root `layout.tsx` so it appears on every page. Deliberately **not** a real chat — it's a canned decision-tree FAQ with a typing-indicator delay to feel conversational. The Q&A tree is brand-scoped: the main site gets Kendal Elektrik-wide FAQ (company/brands/export/projects/etc.), while each of the 3 brand micro-sites gets its own root topic set talking only about that brand (K2: categories/solar/magnet-track/export; Vanti: fan product families/smart cooling/energy saving; Global: categories/77-province dealer network) — a visitor on `k2.` never sees the generic Kendal Elektrik menu, and vice versa.
- **`ChatbotWidget.tsx`** — all UI/state. Detects brand context client-side (no props from layout) via `window.location.hostname` prefix (`k2.`/`vanti.`/`global.`) for local dev + production subdomains, falling back to matching `/brand/(k2|vanti|global)` in `window.location.pathname` for the GitHub Pages path-based case where there's no subdomain; this detection effect also re-runs on every `usePathname()` change (not just mount) so brand-to-brand client-side navigation on the path-based GH Pages case doesn't leave `accentKey` stale — hostname-based subdomain switches always get a full page load anyway. `accentKey` selects both the color theme (`ACCENTS` map) and the active Q&A tree (`CHATBOT_CONTEXTS[accentKey]`, see below). Recolors itself per brand and flips the panel between a light theme (on the dark main site) and a dark theme (on the light-themed brand pages) via `isLightPanel = accentKey === 'main'`.
  - Panel persists in the DOM after first open (`hasMounted`) and is hidden via opacity/transform + `pointer-events-none` rather than unmounted, so reopening is instant and conversation state survives. Note: since the panel never unmounts across navigation, the first greeting message injected at open-time is not re-injected if `accentKey` changes later in the same session (e.g. main → brand via an in-app link) — only subsequent topic picks pick up the new context's tree.
  - Both scrollable regions (message list, quick-reply chip row) carry `data-lenis-prevent` — without it the app-wide Lenis smooth-scroll instance (see `SmoothScrollProvider.tsx`) hijacks wheel/touch events over the panel and scrolls the page behind it instead of the panel content. Also needs `min-h-0` on the flex-1 message list (default flex `min-height:auto` otherwise refuses to shrink, so the outer panel's `overflow-hidden` just clips it instead of it scrolling).
  - Reads/writes `document.querySelector('[data-cookie-banner]')` to keep itself lifted above `CookieConsentBanner` when that banner is showing (first-time visitors, main site only) — see that component's own two-effect pattern below for why a naive one-shot check races the banner's mount.
- **`chatbotContent.ts`** — the Q&A data, bilingual tr/en, kept out of `ui/i18n/*.json` since it's sizeable, self-contained, bespoke copy (same reasoning as the `brand/*CreativePage.tsx` inline-translations pattern below). Exports `CHATBOT_CONTEXTS: Record<'main'|'k2'|'vanti'|'global', ChatContext>`, each context bundling its own `greeting`, `rootTopicIds`, and `nodes: Record<string, ChatNode>` — `ChatbotWidget.tsx` just looks up `CHATBOT_CONTEXTS[accentKey]`, it holds no brand-specific copy itself. A shared `CONTACT_NODE` (phone/address, identical across all 4 contexts) is defined once and referenced by object identity from each context's `nodes.contact` rather than duplicated. Brand-context category names/counts (K2's 700+ models across Spotlar/LED Paneller/Magnetler/etc., Vanti's 7 fan families, Global's category list) were pulled from the live `products.json` catalog at the time they were written — re-derive with a quick per-brand category breakdown script rather than trusting the numbers verbatim if the catalog changes materially. Cross-brand links use `getBrandExternalHref()` (`src/lib/basePath.ts`) — for linking to a brand's own site from *outside* it (used by the main-site context); the brand contexts instead use `getBrandUrunlerHref()` for same-origin "view catalog" links since they're already rendered on that brand's own pages.

#### `sections/` — page-level sections (mostly homepage)
All follow the same pattern: `useRef` container + `useIsomorphicLayoutEffect` wrapping `gsap.context(() => {...}, containerRef)` returning `ctx.revert()` on cleanup; ScrollTrigger reveals (`start:"top 80%"` fade+slide-up, or `scrub` for pinned/parallax). Copy comes from `useLanguage()`.

- **`Hero.tsx`** — `h-[130vh]` sticky hero hosting a CSS radial-gradient mask directly in the component, tracks scroll progress into a ref.
- **`GlobalPresence.tsx`** — sticky section hosting `Globe` as background.
- **`AboutUs.tsx`** — two-column about+timeline; scrubbed vertical "wire" scale animation. Code comment notes a past perf fix: switched from scrubbing `filter` (brightness/grayscale, paint-heavy) to scrubbing `opacity`.
- **`WhyUs.tsx`** — 5-feature grid, inline SVG icons, staggered fade-in.
- **`CompanyStats.tsx`** — animated counters (`gsap.to(obj,{val:target})` driving `innerHTML`).
- **`Certifications.tsx`** — no longer a homepage section, lives at its own `/sertifikalar` route (removed from `HomeClient.tsx`). Cert logo grid, 4 of 5 cards clickable: ISO/TSE/Marka Tescil link to their own `/sertifikalar/{iso,tse,marka-tescil}` detail page (rendered via `CertificateGallery.tsx`), Entegre Kalite Politikası opens a PDF directly in a new tab (`public/images/certifications/K2-ENEC-BELGESI.pdf`), Yerli Malı Belgeleri has no documents yet and stays non-clickable (dimmed). The old ISO hover-reveal-4-subcerts interaction was removed in favor of the click-through page.
- **`CertificateGallery.tsx`** — shared `{title, subtitle, images}` component powering the 3 `/sertifikalar/*` detail pages; grid of certificate document images, each opens full-size in a new tab on click, back-link to `/sertifikalar`.
- **`CompanyVideo.tsx`** — click-to-play YouTube embed (lazy, thumbnail until clicked).
- **`BrandsStrip.tsx`** — simple 3-logo strip (K2/Vanti/Global), no GSAP.
- **`OurBrands.tsx`** — brand-card grid, GSAP stagger-reveal, per-brand glow color via CSS var.
- **`Projects.tsx`** — auto-scrolling horizontal carousel of ~43 hardcoded reference projects (`REFERENCE_DATA`), `setInterval`-based autoplay (not GSAP), pause on hover/touch.
- **`RetailPresence.tsx`** — static retailer logo grid (BİM, A101, Koçtaş, etc.), no GSAP.
- **`ProductGallery.tsx`** — category tile grid, staggered fade-in.
- **`NewsTicker.tsx`** — infinite marquee via `gsap.to({xPercent:-50, repeat:-1}, duration:40s)` on a doubled list.
- **`NewsPreview.tsx`** — latest 3 news cards, imports `news-tr`/`news-en` directly (not via `news.ts`), sorted with `parseNewsDate`. No GSAP.
- **`CatalogCTA.tsx`** — PDF catalog download CTA, single fade-in.
- **`BrandHero.tsx`, `BrandAbout.tsx`, `BrandProductShowcase.tsx`** were removed (unused generic brand-name–parameterized sections, an older/simpler alternative to the `brand/*CreativePage.tsx` + `CategoryFirstShowcase` combo). `BrandProductsHeader.tsx` is **not** related to that cleanup — it IS actively used, by `brand/[brandName]/urunler/page.tsx`.
- **`ProductCompareModal.tsx`** — `ProductCompareModal({items, language, brandName, texts, onClose, onRemove})`, portal-rendered comparison table (parses `" / "`-delimited attribute values into bullet lists).

##### `sections/CategoryFirstShowcase/` — the main product catalog browser
Used on `/urunler` and brand product pages.
- **`index.tsx`** — default export `CategoryFirstShowcase({products, brandName, isBrandScoped})`. Manages category/group drill-down (K2 has a two-level category→group hierarchy via `getCategoryGroupForCategory`), search (`?q=`), pagination (`?page=`, 15/page), variant filters (casing/watt/socket from `variantOptions`), and a compare tray (max 3, `MAX_COMPARE`). **All state syncs to the URL query string** (`router.replace(...,{scroll:false})`, rehydrated from `useSearchParams()`).
- **`CategoryCard.tsx`** — category/group tile, Tailwind `animate-in`-style stagger (not GSAP).
- **`ProductCard.tsx`** — product tile; conditional "Compare" chip; strips variant tokens from display name for Global brand via `stripVariantTokens()`.
- **`CompareTray.tsx`** — fixed-bottom tray of selected products + "Compare (n)" button.
- **`FiltersPanelContent.tsx`** — tabbed filter panel (casings/watts/sockets), shared between desktop popover and mobile modal.
- **`helpers.ts`** — `MAX_COMPARE=3`, `getBaseModelKey()`, `slugify()`, `getVisiblePages()` (pagination ellipsis), `getProductCardUrl()`.

#### `brand/` — brand micro-site "creative" landing pages
Each brand (`k2`/`vanti`/`global`) has a large, self-contained one-page story (hero → trust stats → features → category/product marquee → map → CTA) with a full-bleed R3F 3D background and a curtain preloader gated on the 3D scene reporting ready (`onReady` → `sceneReady` → intro timeline plays once, guarded by `introPlayedRef`).

- **`brand/k2/K2CreativePage.tsx`** — orange/dark "mountain summit" theme. Inline bilingual copy (`translations.tr`/`translations.en`) — **does not use the shared `useLanguage()`/`t.*` i18n system**, only reads `language` from it.
  - `K2Scene.tsx` — low-poly cone-geometry mountains + taller "K2 summit", a `Sunrise` that warms color/intensity as a **module-level** scroll-driven variable (`k2DawnProgress`) increases, drei `<Sparkles>`, mouse-parallax rotation. `frameloop` off when tab hidden.
  - `K2Preloader.tsx` — curtain-wipe intro gated on `ready` prop.
- **`brand/vanti/VantiCreativePage.tsx`** — teal/sky "cooling breeze" theme. Same inline-translations pattern.
  - `VantiScene.tsx` — 3D fan rotor (`AeroBlades`) whose spin velocity is driven by **scroll delta** (faster scroll = faster spin, with damping), drifting torus shapes (`<Float>`), `<Sparkles>`, `<Environment>`.
  - `VantiPreloader.tsx` — same curtain pattern, sky-blue.
  - `VantiProductFamilies.tsx`, `VantiVideoShowcase.tsx` — CSS-marquee lists (`.k2-marquee-track`/`.k2-marquee-pause` classes in globals.css), not GSAP.
- **`brand/global/GlobalCreativePage.tsx`** — yellow/gold "light switch" theme. Distinctive intro: hand-drawn cursor SVG animates to a switch icon, "clicks" it, triggers a black→cream (`#fdfbf5`) flash transition. No dedicated preloader component (unlike k2/vanti) — the switch-click sequence IS the reveal.
  - `GlobalScene.tsx` — simplest of the three scenes: a chandelier/bulb mesh whose color/light intensity fades in based on a **module-level** `globalScrollProgress`. ⚠️ Currently **not imported/rendered anywhere** — `GlobalCreativePage.tsx` has no `Canvas`/R3F usage at all, so the Global brand page has no 3D background despite this component existing. Confirm intent (regression vs. deliberate removal) before relying on this description or before touching `GlobalCreativePage.tsx`.
- **`brand/shared/`**:
  - `CategoryShowcase.tsx` — infinite marquee of category cards, groups K2 categories via `getCategoryGroupForCategory`, pure CSS animation, theme-aware.
  - `DealerMap.tsx`/`DealerMapInner.tsx` — Turkey provinces SVG map (dealer coverage). Outer lazy-loads inner via `next/dynamic({ssr:false})` gated by `IntersectionObserver` (`rootMargin:400px`). Inner converts `@/data/turkey-provinces.json` (TopoJSON) via `topojson-client`, custom (non-d3) equirectangular-like `project()` function.
  - `ExportMap.tsx`/`ExportMapInner.tsx` — same lazy-on-intersect pattern, world map using real `d3-geo` (`geoPath`, `geoEquirectangional`, `geoGraticule`) + `topojson-client` on `@/data/world-land-110m.json`, dashed glowing arcs from `HQ` to `EXPORT_COUNTRIES`, click-to-zoom.

#### Cross-cutting conventions (read before touching animation/3D code)
1. **GSAP pattern** (~30+ occurrences): `useRef` + `useIsomorphicLayoutEffect` wrapping `gsap.context(() => {...}, scopeRef)`, cleanup via `ctx.revert()`. `gsap`/`ScrollTrigger` imported from the shared `@/lib/gsapConfig` wrapper everywhere **except** the three `brand/*CreativePage.tsx` files, which import `gsap`/`ScrollTrigger` directly and call `gsap.registerPlugin(ScrollTrigger)` themselves at module scope — a deliberate but inconsistent second setup path.
2. **R3F perf gating**: two different strategies exist — `useInView()`-driven `frameloop` toggling (Globe, homepage) vs. `document.visibilitychange`-driven toggling (K2Scene/VantiScene, brand pages). Scroll-reactive uniforms are driven either via a `scrollProgressRef` passed down from a parent `ScrollTrigger.create({onUpdate})` (Globe), or via a **module-level mutable singleton variable** updated by a raw `window.scroll` listener inside the scene component itself (`globalScrollProgress` in GlobalScene, `k2DawnProgress` in K2Scene) — the latter is a hacky pattern worth knowing about before refactoring those scenes. (`LightCore.tsx` on the homepage hero looks similar at a glance but isn't R3F at all — see `engine/` above.)
3. **Scroll-sync coordination convention**: whenever code does a programmatic `lenis.scrollTo(...)`, it (a) sets `window.isProgrammaticScroll = true`, (b) adds a `disable-cv` class to `<body>` (disables `content-visibility` to avoid layout jumps during the animated scroll), (c) on complete dispatches a custom `window` event `scroll-refresh`, which `GsapContext` listens for to trigger a debounced `ScrollTrigger.refresh()`. This exact triple repeats in `Navbar.tsx` (twice) and `ScrollToTop.tsx` — follow it exactly if adding new programmatic-scroll code, or `ScrollTrigger` positions will desync after `content-visibility:auto` toggles.
4. **i18n split**: most of `sections/`/`ui/` use the shared `useLanguage()`/`t.*` dictionary system, but all three `brand/*/*CreativePage.tsx` files define their own local bilingual `translations = {tr:{...}, en:{...}}` object and only read `language` from `useLanguage()`. Don't assume brand-page copy lives in `src/lib/i18n/*.json` — it doesn't.
5. **Removed as dead code**: `engine/LightCore.tsx`, `sections/BrandHero.tsx`, `BrandAbout.tsx`, `BrandProductShowcase.tsx`, `brand/shared/ProductCarousel.tsx`, `src/data/products_backup.json` — all confirmed unused (zero imports) and deleted. `sections/BrandProductsHeader.tsx` is **not** related — it's used by `brand/[brandName]/urunler/page.tsx`, don't lump it in with the others.
6. **Nested scrollable elements need `data-lenis-prevent`**: the app-wide Lenis instance (`SmoothScrollProvider.tsx`) captures wheel/touch on the whole document by default, including over a `position:fixed` overlay with its own internal scroll (a modal, a dropdown, the chatbot panel) — without the attribute, scrolling inside that element scrolls the page behind it instead. Lenis checks for this attribute natively (`lenis/dist/lenis.mjs`, no config needed on the provider side). Also watch for the classic flex `min-height:auto` trap on any `flex-1 overflow-y-auto` child of a `flex flex-col` — it silently refuses to shrink and never actually scrolls unless paired with `min-h-0`.

### `src/data/` (Static Data) — full schemas

#### `products.json` + `src/data/products.ts` (data-access layer)
**Shape**: flat `Record<string, Product>` keyed by product id — **no nested category tree**. 856 products as of this writing. Brand split: `k2`=755, `vanti`=53, `global`=48. Category/attribute/variant counts below predate later cleanups and haven't been re-verified — treat as approximate, re-check with a quick script before relying on exact figures. 53 distinct TR category names (top: LED Paneller 127, Spotlar 116, LED Ampuller 91, Vantilatörler 53...). `images[]` (multi-image gallery, always in *addition* to `image` — the UI itself prepends `product.image` when building the gallery, see `ProductDetailClient.tsx`'s `allImages`, so don't duplicate the primary photo into this array) present on 94 products. Most of those pair a current product photo with the *previous* photo it replaced, kept as a second gallery image (see the photo-swap workflow memory) rather than a second angle/color. `variantOptions` present on 901/923 (sub-keys: `watt` 710, `light` 425, `casing` 142, `socket` 28, rare `tip`/`color`/`açıklama`/`batarya`/`işık gücü`) — this count predates the cleanup too, re-verify before relying on it.

TypeScript type (defined in `products.ts`, not in the JSON itself):
```ts
export interface ProductAttribute { label: string; value: string; }
export interface Product {
  id: string; model: string; image: string; images?: string[];
  name: { tr: string; en: string };
  attributes: { tr: ProductAttribute[]; en: ProductAttribute[] };
  category?: { tr: string[]; en: string[] };
  brand?: string;
  variantOptions?: { watt?: string|null; socket?: string|null; light?: string|null; casing?: string|null };
}
```
Example record (abridged, `products["4206"]`):
```json
{
  "id": "4206", "model": "GDL41425WPANARA", "image": "urunler/gdl414.webp",
  "name": { "tr": "GDL414 SLIM BACKLIGHT SIVA ALTI PANEL", "en": "GDL414 SLIM BACKLIGHT RECESSED PANEL" },
  "attributes": { "tr": [{"label":"Watt","value":"25W"}, {"label":"Lümen","value":"2300"}, ...], "en": [...] },
  "category": { "tr": ["LED Paneller"], "en": ["LED Panels"] },
  "brand": "global",
  "variantOptions": { "watt": "25W", "light": "Ararenk (4000K)" }
}
```

Key functions in `products.ts`:
- `getProductBySlug(slug)` — resolves via `slugMap[slug]`, falls back to treating `slug` as a raw product id.
- `getAllSlugs()` — `Object.keys(slugMap)`, used for `(main)/[slug]` static params.
- `getSlugByProductId(id)` — derives canonical slug from `slugify(name.tr)`, checks it maps back to the same id in `slugMap`; else falls back to the first matching entry in a reverse `idToSlugMap`.
- `slugify()` — lowercases, maps Turkish chars (ı,ü,ö,ş,ğ,ç) to ASCII, spaces/specials → `-`.
- `getProductImageUrl(image)` — `getAssetPath('/images/' + image)`.
- `BRAND_HOSTS` — brand → canonical domain map (k2/vanti/global subdomains).
- `CATEGORY_GROUPS` — K2's two top-level menu groups: `armatur` (19 category names) and `digerleri` (17 names).
- `getCategoryGroupForCategory`, `getProductCategorySlug`, `getProductCanonicalUrl` — used by SEO metadata and static route generation.

#### `slug-map.json`
Flat `Record<slug, productId>`, 4206 entries (839 distinct product ids) as of the `311514b` "Veri Temizliği Yapıldı" cleanup. Example:
```json
{ "ges230-20w-torch-led-ampul-beyaz": "GES230", "ges231-30w-torch-led-ampul-beyaz": "GES231" }
```
As of that cleanup, **0 orphan slugs** — every value resolves to a `products.json` key (verified by script; previously ~9 didn't, that's fixed now). A product can have multiple slugs (old-URL backward compatibility), which is why "canonical slug" is a distinct concept from "any slug that resolves." Re-verify with a quick script rather than trusting these counts if `products.json`/`slug-map.json` change again.

Route usage: `(main)/[slug]/page.tsx` generates a page for **every** slug-map entry (including non-canonical), then `redirect()`s to the canonical slug at render time if they differ. `brand/[brandName]/urunler/[category]/[slug]` instead builds `generateStaticParams` from `Object.values(products)` directly — one page per product, canonical slugs only.

#### `news.ts`, `news-tr.ts`, `news-en.ts`
`news.ts` is a thin re-export layer:
```ts
export { newsDataTR, newsDataEN }; export type { NewsItem };
export const newsData = newsDataTR; // default/back-compat
```
`news-tr.ts`/`news-en.ts` are parallel arrays (not a key-value dictionary) matched by shared string `id`s, ~37 items each:
```ts
export interface NewsItem { id: string; title: string; date: string; images: string[]; content: string[]; }
```
`date` is free text (TR: `"13 Nisan 2024"`, EN: `"Apr 13, 2024"`) — **not ISO** — so sorting uses `src/lib/newsDate.ts`'s `parseNewsDate()`. Consumers: `HaberlerListesiClient.tsx` and `NewsDetailClient.tsx` (pick `newsDataEN`/`newsDataTR` by current language), `sections/NewsPreview.tsx` (imports `news-tr`/`news-en` directly, bypassing `news.ts`), `app/sitemap.ts`.

#### Other `src/data/` files
- **`exportCountries.ts`** — TS (not JSON). `ExportCountry {id, flag, nameTr, nameEn, lat, lon}`, `HQ` (Turkey centroid), `EXPORT_COUNTRIES` (40 countries). Used by `brand/shared/ExportMapInner.tsx`.
- **`turkey-provinces.json`**, **`world-land-110m.json`** — TopoJSON geo data, consumed via `topojson-client` by `DealerMapInner.tsx` and `ExportMapInner.tsx` respectively.
- **`world-land-110m.LICENSE.txt`** — attribution only (Natural Earth/world-atlas), not read by code.

### `src/lib/` (Utilities & Contexts) — every file
- **`gsapConfig.ts`** — registers `ScrollTrigger` (SSR-guarded), exports `GSAP_DEFAULTS` (`ease:"power3.out", duration:1.2`) and `ST_DEFAULTS` (`start:"top 85%", toggleActions:"play none none reverse"`), re-exports `gsap`/`ScrollTrigger`. The central import for nearly every animated component (see GSAP convention above).
- **`LightTemperatureProvider.tsx`** — global `ScrollTrigger` over `document.body` (`scrub:true`), lerps a cool blue (`#d8e4ff`) → warm orange (`#ffb347`) `THREE.Color` and writes CSS vars `--light-temp`/`--accent-current`. Rounds progress to 1/500 to reduce redundant DOM writes. `useLightTemperature()` exposes `getProgress()`. Wraps app in root layout; consumed by `Globe.tsx` (via the hook).
- **`useInView.ts`** — `useInView<T extends HTMLElement>(rootMargin="200px")`, `IntersectionObserver`-based, returns `[ref, isInView]` (defaults `isInView=true`). Used by `Globe.tsx` for frameloop gating.
- **`useIsomorphicLayoutEffect.ts`** — `typeof window !== "undefined" ? useLayoutEffect : useEffect`. Paired with GSAP setup in nearly every animated component.
- **`basePath.ts`** — `getBasePath()`/`getAssetPath()`, see Deployment section above. Used in 37+ files for every static asset path. Also `getBrandHomeHref`/`getBrandUrunlerHref` (same-origin relative links, for use *from within* a brand's own pages — rendered via `<Link>`, which auto-prepends the GH Pages `basePath`) and `getBrandExternalHref(brand, path?)` (cross-origin links, for use from *outside* a brand — e.g. the chatbot linking out to K2 from the main site; rendered via plain `<a>`, which does **not** get Next's automatic basePath prepending, so this one manually calls `getBasePath()` itself for the GH Pages case).
- **`getProductPdfForm.ts`** — server-side (`fs`/`path`, build/SSG time only) scan of `public/urun-bilgi-formlari/`; `getProductPdfFile(model, nameTr)` matches a PDF whose filename-derived code is contained in the model or TR name. Used by all three product-detail `page.tsx` files for the "Ürün Bilgi Formu" download link.
- **`newsDate.ts`** — `parseNewsDate(dateStr)` parses free-text TR/EN dates into a sortable `Date.UTC(...)` number (separate TR/EN month-name dictionaries); returns `0` on no match. Used by `HaberlerListesiClient.tsx`, `NewsPreview.tsx`.
- **`productMetadata.ts`** — `getProductDetailMetadata(product)` builds Next `Metadata` (title/description/canonical). Shared by `urunler/[category]/[slug]` and `brand/.../[category]/[slug]` — **not** by `(main)/[slug]/page.tsx`, which still inlines its own near-duplicate `generateMetadata` logic.
- **`i18n/LanguageProvider.tsx`** — `Language = "tr"|"en"`, persisted to `localStorage["kendal-language"]`, syncs `document.documentElement.lang`. `useLanguage()` throws if used outside the provider. Consumed in 40 files — the site-wide UI-text i18n mechanism (distinct from the news/product data i18n, which is done via parallel data structures, not this dictionary).
- **`i18n/tr.json` / `en.json`** — parallel nested dictionaries (`nav.about`, etc.), 319 lines each.

### TypeScript type locations
There is **no central `src/types/` domain-types folder** — domain types (`Product`, `ProductAttribute`, `NewsItem`, `ExportCountry`, `CategoryGroupDef`) are each defined inline in their owning data file (`products.ts`, `news-tr.ts`/`news-en.ts` duplicated, `exportCountries.ts`). The only file under `src/types/` is `topojson-client.d.ts`, a hand-written ambient module declaration for the untyped `topojson-client` npm package.

## Key Concepts (quick summary)
1. **Performance & Animation:** GSAP + ScrollTrigger for scroll-driven reveals/pins, Lenis for smooth scroll. `GsapContext` is the app-wide lifecycle root; every section additionally scopes its own `gsap.context()`. See "Cross-cutting conventions" above for the exact scroll-sync and R3F-gating patterns — follow them exactly when adding new scroll-driven code.
2. **3D Elements:** R3F scenes (`Globe` and the three brand `*Scene.tsx` files) are always `dynamic({ssr:false})`, full-bleed backgrounds, frameloop-gated for perf.
3. **Product Catalog:** Flat `products.json` (858 items) + `slug-map.json` (4206 slugs, many-to-one with products) drive the two detail routes (legacy `(main)/[slug]` + canonical `brand/[brandName]/urunler/[category]/[slug]`); `CategoryFirstShowcase` is the shared browsing UI for brand product pages, with all filter/search/page state synced to the URL.
4. **Static export, dual deploy target:** everything must work with `output:"export"` (no server-side code paths at runtime) and resolve correctly under both the root domain and the GitHub Pages subpath via `getAssetPath()`.

## Go-live / cPanel migration

There is a pending migration from the old OpenCart (PHP) site at `kendalelektrik.com.tr` to this Next.js static export, now targeting `kendalelektrik.com` (`.com`, not `.com.tr`) as the permanent production domain going forward — see [`CPANEL_DEPLOYMENT_PLAN.md`](CPANEL_DEPLOYMENT_PLAN.md) for the full audit (subdomain routing feasibility, `.htaccess` rewrite, checklist), though it and `ADMIN_PANEL_PLAN.md` still describe `kendalelektrik.com` as a separate test domain from an earlier stage — that's now superseded, `.com` is the real target. Email (`info@kendalelektrik.com.tr`) and the external `sanalpos`/`b2b` subdomains stay on `.com.tr` — they're separate systems, not part of this site. Read the deployment plan before doing any deploy-related work on this project.

## Adding products / processing photos

See **`urun_ekleme_rehberi.md`** at the repo root for the full new-product workflow (JSON merging, legacy slug redirects, CCT/variant rules, ghost-record cleanup) and **`FOTOGRAF_SIKISTIRMA_REHBERI.md`** for the exact photo-compression method (sharp, `resize 800x800 inside/withoutEnlargement` + `webp({quality:80, effort:6})`) — read both before touching `src/data/products.json` or `public/images/urunler/`.

## Development Workflow
- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (Biome) — `npm run format` to auto-fix formatting, `npm run check` to run both lint+format together.
- **Generate Product PDFs:** `node generate_urun_bilgi_formu.js` (all products), `node generate_urun_bilgi_formu.js ID1 ID2 ...` (specific products), or `node generate_urun_bilgi_formu.js --missing` (only products without an existing PDF) — see [`urun_bilgi_formu_rehberi.md`](urun_bilgi_formu_rehberi.md) for the full workflow, output location, and design decisions before touching this script.

Please refer to this document to understand where to place new components, where to look for routing logic, how the data layer resolves products/slugs, and how the styling/animation/3D stack is structured. When something here seems out of date (a file renamed, a component removed), trust the current code over this doc and update this file accordingly.

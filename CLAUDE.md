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
- There is **no `headers()` config** in `next.config.ts` — this is intentional: `output: "export"` doesn't support it. Security headers (CSP, HSTS, X-Frame-Options) and the k2/vanti/global subdomain→`/brand/{name}` rewrite are instead served at the web-server level via `public/web.config` (IIS URL Rewrite, Windows/Plesk `kendalelektrik.com` target — the site's only production host) — it ships in `public/` and gets copied to the export root. There used to also be a `public/.htaccess` twin (Apache/mod_rewrite) for a `kendalelektrik.com.tr` cPanel target; that domain and its config file were removed from this project on 2026-09-17 — `.com` is now the sole target, see the "Go-live" section below.
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
│   ├── [...slug]/                # SHORT product URL: /{slug} — e.g. /ges230-20w-torch-led-ampul-beyaz
│   │   │                         # (catch-all, not [slug] — also serves admin-panel custom pages from pages.json)
│   │   ├── page.tsx              # generateStaticParams = ONLY custom-page slugs (pages.json) — as of 2026-09-16
│   │   │                         # this route builds ZERO product pages, canonical or not. The site's own links
│   │   │                         # never point here (always brand/[brandName]/urunler/...), so ALL product slugs
│   │   │                         # (all 4200 slug-map.json keys) redirect via urun-yonlendirme/ below instead of
│   │   │                         # being pre-built — cut static-export file count from 32k to ~7.6k.
│   │   │                         # If a segment DOES match a product slug (dev mode only — never happens in a
│   │   │                         # static-export build since none are in generateStaticParams), the page component
│   │   │                         # immediately redirect()s to getProductCanonicalUrl(product) (absolute brand URL).
│   │   └── ProductDetailClient.tsx  # "use client" — main product detail UI, brand-themed; NOT used by this route
│   │                                 # anymore (it never renders a product) — imported cross-route by
│   │                                 # brand/[brandName]/urunler/[category]/[slug]/page.tsx, the actual renderer.
│   │
│   ├── urun-yonlendirme/         # Product-slug resolver: web.config rewrites ANY single-segment (main)/
│   │   └── page.tsx              # request that isn't a real file/dir here (i.e. every product slug, canonical or
│   │                             # legacy). Client component fetches public/legacy-redirects.json (built by
│   │                             # scripts/generate-legacy-redirects.js, runs before `next build`, gitignored —
│   │                             # maps ALL 4200 slug-map.json keys → canonical brand-subdomain URL) and
│   │                             # window.location.replace()s there. Keeps every short/legacy link working without
│   │                             # pre-building a single static page for any of them.
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
4. **i18n split**: most of `sections/`/`ui/` use the shared `useLanguage()`/`t.*` dictionary system, but all three `brand/*/*CreativePage.tsx` files define their own local per-language `translations = {tr:{...}, en:{...}, ar:{...}, es:{...}, de:{...}, zh:{...}}` object (all 6 populated as of the 2026-09-18 rollout) and only read `language` from `useLanguage()`. Don't assume brand-page copy lives in `src/lib/i18n/*.json` — it doesn't. Always index it via `translations[language as keyof typeof translations] || translations.tr` (or `translations.en`) — a bare `translations[language]` isn't guaranteed to exist if a future language gets added to `Language` before this object's copy for it.
5. **Removed as dead code**: `engine/LightCore.tsx`, `sections/BrandHero.tsx`, `BrandAbout.tsx`, `BrandProductShowcase.tsx`, `brand/shared/ProductCarousel.tsx`, `src/data/products_backup.json` — all confirmed unused (zero imports) and deleted. `sections/BrandProductsHeader.tsx` is **not** related — it's used by `brand/[brandName]/urunler/page.tsx`, don't lump it in with the others.
6. **Nested scrollable elements need `data-lenis-prevent`**: the app-wide Lenis instance (`SmoothScrollProvider.tsx`) captures wheel/touch on the whole document by default, including over a `position:fixed` overlay with its own internal scroll (a modal, a dropdown, the chatbot panel) — without the attribute, scrolling inside that element scrolls the page behind it instead. Lenis checks for this attribute natively (`lenis/dist/lenis.mjs`, no config needed on the provider side). Also watch for the classic flex `min-height:auto` trap on any `flex-1 overflow-y-auto` child of a `flex flex-col` — it silently refuses to shrink and never actually scrolls unless paired with `min-h-0`.

### `src/data/` (Static Data) — full schemas

#### `products.json` + `src/data/products.ts` + `src/data/productsServer.ts` (data-access layer)
**Shape**: flat `Record<string, Product>` keyed by product id — **no nested category tree**. 856 products as of this writing. Brand split: `k2`=755, `vanti`=53, `global`=48. Category/attribute/variant counts below predate later cleanups and haven't been re-verified — treat as approximate, re-check with a quick script before relying on exact figures. 53 distinct TR category names (top: LED Paneller 127, Spotlar 116, LED Ampuller 91, Vantilatörler 53...). `images[]` (multi-image gallery, always in *addition* to `image` — the UI itself prepends `product.image` when building the gallery, see `ProductDetailClient.tsx`'s `allImages`, so don't duplicate the primary photo into this array) present on 94 products. Most of those pair a current product photo with the *previous* photo it replaced, kept as a second gallery image (see the photo-swap workflow memory) rather than a second angle/color. `variantOptions` present on 901/923 (sub-keys: `watt` 710, `light` 425, `casing` 142, `socket` 28, rare `tip`/`color`/`açıklama`/`batarya`/`işık gücü`) — this count predates the cleanup too, re-verify before relying on it.

**`products.ts` vs `productsServer.ts` split (2026-09-18, added for the multi-language rollout — see that section below):** `products.ts` is client-safe and never imports `products.json`; `productsServer.ts` is SERVER-ONLY and holds the actual `products` map (imported from `products.json`) plus every function that needs the full catalog (`getProductBySlug`, `getSlugByProductId`, `getProductVariations`). This split exists because Turbopack bundles at file granularity: importing even one unrelated export from a file that also statically imports `products.json` drags the whole ~1.4MB+ JSON (all languages, every product) into any client bundle that touches it — there is no per-binding tree-shaking. `productsServer.ts` must only ever be imported from server components (`page.tsx` files, `sitemap.ts`); a `"use client"` component reaching it — even transitively — reintroduces the leak. `products.ts` still has `getSlugForProduct(product)`, the client-safe slug helper that works off a product object already in hand instead of looking one up from the full map.

TypeScript type (defined in `products.ts`, not in the JSON itself):
```ts
export interface ProductAttribute { label: string; value: string; }
export interface Product {
  id: string; model: string; image: string; images?: string[];
  name: LocalizedField<string>;
  attributes: LocalizedField<ProductAttribute[]>;
  category?: LocalizedField<string[]>;
  brand?: string;
  variantOptions?: { watt?: string|null; socket?: string|null; light?: string|null; casing?: string|null };
}
// LocalizedField<T> (src/lib/i18n/localized.ts) = { tr: T; en: T } & Partial<Record<Language, T>>
// — tr/en are required (fully populated), ar/es/de/zh are optional and filled in
// incrementally; resolveLocalized(field, language) reads it with an en→tr fallback.
```
Example record (abridged, `products["4206"]`) — **as of this writing `attributes`/`name`/`category` are only translated into tr/en; ar/es/de/zh fall back to en via `resolveLocalized()` until the catalog translation pass lands (see "Multi-language rollout" below)**:
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

listing pages (`brand/[brandName]/urunler/page.tsx`, brand homepage) never pass the full `Product` (with `attributes`) to their client components — they map through `toProductListItem()` first (`ProductListItem = Omit<Product, 'attributes'>`, defined in `products.ts`). The compare-modal feature (`CategoryFirstShowcase/index.tsx`) needs full attributes for ≤3 products at a time; rather than shipping everyone's attributes to every visitor, it lazily `fetch()`es `public/product-attributes.json` (generated at build time by `scripts/generate-product-attributes.js`, gitignored, id → `attributes`) only when the compare tray is actually opened. Detail pages (`brand/[brandName]/urunler/[category]/[slug]/page.tsx`) are server components and pass the full `Product` straight through — no lazy-loading needed there, since a server component's own imports never ship to the client, only the props it explicitly returns for that one product.

Key functions:
- `products.ts` (client-safe): `getSlugForProduct(product)`, `getProductCategorySlug(product)`, `getProductCanonicalUrl(product)`, `toProductListItem(product)`, `CATEGORY_GROUPS`, `getCategoryGroupForCategory`, `BRAND_HOSTS`, `getProductImageUrl(image)`, `getAllSlugs()`, `slugMap`.
- `productsServer.ts` (server-only): `products` (the full map), `getProductBySlug(slug)`, `getSlugByProductId(id)`, `getProductVariations(product)` (same-base-model color/watt/casing variants for the detail page's option chips — returns a lean `{id, variantOptions}[]`, never full products).

#### `slug-map.json`
Flat `Record<slug, productId>`, 4206 entries (839 distinct product ids) as of the `311514b` "Veri Temizliği Yapıldı" cleanup. Example:
```json
{ "ges230-20w-torch-led-ampul-beyaz": "GES230", "ges231-30w-torch-led-ampul-beyaz": "GES231" }
```
As of that cleanup, **0 orphan slugs** — every value resolves to a `products.json` key (verified by script; previously ~9 didn't, that's fixed now). A product can have multiple slugs (old-URL backward compatibility), which is why "canonical slug" is a distinct concept from "any slug that resolves." Re-verify with a quick script rather than trusting these counts if `products.json`/`slug-map.json` change again.

Route usage: `(main)/[slug]/page.tsx` generates a page for **every** slug-map entry (including non-canonical), then `redirect()`s to the canonical slug at render time if they differ. `brand/[brandName]/urunler/[category]/[slug]` instead builds `generateStaticParams` from `Object.values(products)` directly — one page per product, canonical slugs only.

#### `news.json` + `src/data/news.ts` + `src/lib/newsClient.ts`
`news.json` is `Record<Language, NewsItem[]>` — one array per language, matched across languages by shared string `id`s (~37 items each, tr/en/ar/es/de/zh all fully translated as of the 2026-09-18 multi-language rollout):
```ts
export interface NewsItem { id: string; title: string; date: string; images: string[]; content: string[]; }
```
`date` is free text per language (TR: `"13 Nisan 2024"`, EN: `"Apr 13, 2024"`) — **not ISO** — so sorting uses `src/lib/newsDate.ts`'s `parseNewsDate()` (TR/EN month names only; other languages' dates still sort correctly for EN/TR-formatted content but wouldn't parse their own month names — not currently an issue since sorting only needs relative order, not display). `news.ts`'s `getNewsData(language)` (with an en→tr fallback, same pattern as `resolveLocalized`) is **server-only in effect** — it's fine to call from `page.tsx` files (`haberler/[id]/page.tsx`'s `generateStaticParams`/metadata, `NewsArticleSchema`) but must not be imported by a `"use client"` component, because `news.json` is ~450KB across all 6 languages and Turbopack would bundle the whole thing into that client chunk (see the `productsServer.ts` split above for the same class of issue). The three client components that actually render news content — `sections/NewsPreview.tsx`, `haberler/HaberlerListesiClient.tsx`, `haberler/[id]/NewsDetailClient.tsx` — instead use `useNewsData(language)` from `src/lib/newsClient.ts`, which `fetch()`es `public/news/{lang}.json` (generated per-language at build time by `scripts/generate-news-data.js`, gitignored, ~55-90KB each) and returns `null` until it resolves. `news-tr.ts`/`news-en.ts` (the old thin per-language wrapper files) were deleted in that same rollout — `news.ts` now reads `news.json` directly for all 6 languages.

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
- **`i18n/LanguageProvider.tsx`** — `Language = "tr"|"en"|"ar"|"es"|"de"|"zh"` (widened 2026-09-18, was `"tr"|"en"` only — see "Multi-language rollout" below). Persisted to both `localStorage["kendal-language"]` and a `.kendalelektrik.com`-scoped cookie (so the choice survives cross-subdomain navigation to k2./vanti./global., which is why this already "just worked" when the rollout added cross-brand persistence to the requirements). First-visit default (no stored preference) is detected from `navigator.languages`/`navigator.language`, falling back to `'tr'` — deliberately browser-language, not IP/geo-based. Also sets `document.documentElement.dir = 'rtl'` for Arabic (`RTL_LANGUAGES`), `'ltr'` otherwise, via the same `useIsomorphicLayoutEffect` anti-flash pattern used for the text itself. `useLanguage()` throws if used outside the provider. Consumed in 40+ files — the site-wide UI-text i18n mechanism (distinct from the news/product data i18n, which is done via parallel data structures, not this dictionary).
- **`i18n/tr.json` / `en.json` / `ar.json` / `es.json` / `de.json` / `zh.json`** — parallel nested dictionaries (`nav.about`, etc.), ~307-320 lines each, all 6 fully translated.
- **`i18n/localized.ts`** — `LocalizedField<T> = { tr: T; en: T } & Partial<Record<Language, T>>` and `resolveLocalized(field, language)` (returns `field[language] ?? field.en ?? field.tr`). The shared pattern for every *content* data type (products, news, settings, retailers, nav links, custom `pages.json` blocks) that predates the 6-language rollout and is being translated incrementally — unlike the UI dictionary above, which is already fully translated for all 6. Always read a `LocalizedField` through `resolveLocalized()`, never `field[language]` directly (that's `T | undefined` for the optional languages and will throw at render time for content not yet translated into that language).

### TypeScript type locations
There is **no central `src/types/` domain-types folder** — domain types (`Product`, `ProductAttribute`, `NewsItem`, `ExportCountry`, `CategoryGroupDef`) are each defined inline in their owning data file (`products.ts`, `news-tr.ts`/`news-en.ts` duplicated, `exportCountries.ts`). The only file under `src/types/` is `topojson-client.d.ts`, a hand-written ambient module declaration for the untyped `topojson-client` npm package.

## Key Concepts (quick summary)
1. **Performance & Animation:** GSAP + ScrollTrigger for scroll-driven reveals/pins, Lenis for smooth scroll. `GsapContext` is the app-wide lifecycle root; every section additionally scopes its own `gsap.context()`. See "Cross-cutting conventions" above for the exact scroll-sync and R3F-gating patterns — follow them exactly when adding new scroll-driven code.
2. **3D Elements:** R3F scenes (`Globe` and the three brand `*Scene.tsx` files) are always `dynamic({ssr:false})`, full-bleed backgrounds, frameloop-gated for perf.
3. **Product Catalog:** Flat `products.json` (858 items) + `slug-map.json` (4206 slugs, many-to-one with products) drive the two detail routes (legacy `(main)/[slug]` + canonical `brand/[brandName]/urunler/[category]/[slug]`); `CategoryFirstShowcase` is the shared browsing UI for brand product pages, with all filter/search/page state synced to the URL.
4. **Static export, dual deploy target:** everything must work with `output:"export"` (no server-side code paths at runtime) and resolve correctly under both the root domain and the GitHub Pages subpath via `getAssetPath()`.
5. **Multi-language (tr/en/ar/es/de/zh):** see "Multi-language rollout" below for full status. UI chrome and most content is fully translated; the product catalog (`name`/`attributes`/`category`) is the one remaining large gap and still falls back to English for the 4 newer languages. Large per-language datasets (product catalog, news) are fetched lazily per-language from `public/` rather than statically imported, because Turbopack's file-granularity bundling would otherwise ship every language's content to every visitor — see that section for the exact mechanism before adding a new large translated dataset.

## Go-live: kendalelektrik.com (not .tr)

This project's production domain is `kendalelektrik.com` (`.com`, Windows/Plesk/IIS, Natro hosting) — it fully replaces the old OpenCart (PHP) site that used to live at `kendalelektrik.com.tr`. As of 2026-09-17, the project has **no deploy connection to `.tr` at all**: the old `deploy-cpanel.yml` workflow, `public/.htaccess` (Apache config), and `CPANEL_DEPLOYMENT_PLAN.md` were all deleted, since they existed solely for that old `.com.tr` cPanel/Apache target. Deploys go out via `.github/workflows/deploy-test-kendalelektrikcom.yml` (`workflow_dispatch`-only, manual trigger) to `.com`'s FTP via `TEST_FTP_*` GitHub secrets. `ADMIN_PANEL_PLAN.md` has the full incident history — including a 2026-09-15 accident where a still-live `push:` trigger on the old `.tr` workflow caused a real accidental deploy to the live OpenCart production site (recovered from backup, no data loss) — **never re-add an automatic trigger or any workflow/config that targets `.tr` without an explicit, fresh instruction to do so.** The support email `info@kendalelektrik.com.tr` and the external `sanalpos`/`b2b` subdomains intentionally stay on `.com.tr` — they're separate live business systems, not part of this site's deploy.

## Multi-language rollout (tr/en/ar/es/de/zh) — status as of 2026-09-18

The site is mid-rollout from 2 languages (tr/en) to 6 (+ ar/es/de/zh). Infrastructure is complete and load-bearing content is either fully translated or safely falls back — nothing is broken in any language today. This section is the map for continuing the remaining content translation work.

**Done (infrastructure + content):**
- `Language` type, `LanguageProvider.tsx` (cookie/localStorage persistence, browser-language auto-detect on first visit, RTL for Arabic), `LanguageSwitcher.tsx` (dropdown, was a bare TR/EN toggle before).
- `src/lib/i18n/localized.ts`'s `LocalizedField<T>`/`resolveLocalized()` pattern — the standard way any *content* data type (as opposed to the UI dictionary) supports partial per-language translation with graceful fallback. Applied to: `Product` (`products.ts`), `NewsItem` (`news.json`), `settings.json`, `retailers.ts`'s `RetailCategory`, `navLinks.ts`'s `NavLink`, `pages.ts`'s `LocalizedText` (admin-panel custom page blocks).
- **Fully translated content** (all 6 languages, no fallback needed): UI dictionary (`i18n/{tr,en,ar,es,de,zh}.json`), `settings.json`, `aboutContent.json`, `missionVision.json`, `retailers.ts`'s category names, all three `brand/*/*CreativePage.tsx` inline `translations` objects (K2/Vanti/Global) + `VantiProductFamilies.tsx`'s fan-family names, `chatbot/chatbotContent.ts` (all 4 brand-scoped Q&A trees, ~90 nodes), `news.json` (all 37 articles).
- **Performance work that came out of this** (independent value, not just rollout-enabling): the `products.ts`/`productsServer.ts` split and `toProductListItem()` (see the products section above), `public/product-attributes.json` lazy-fetch for the compare modal, and `public/news/{lang}.json` lazy-fetch via `newsClient.ts` — all exist because Turbopack bundles at file granularity, not per-export, so a client component importing even one unrelated function from a file that also holds a large data import (full product catalog, full 6-language news set) ships that whole file's data to the browser. **If you add a new large data file with a similar "small client-safe helpers + huge dataset" shape, budget for the same split** — it's not obvious until you inspect the actual built `_next/static/chunks/*.js` output (`grep` for a distinctive string from the data, check whether the containing chunk is referenced as an eager `<script>` in the page's exported HTML).

**Not yet translated (still tr/en-only, falls back to en for ar/es/de/zh):**
- **Product catalog** (`products.json`): `name`, `attributes` (the big one — ~6,000 label/value rows across 856 products), `category` — all still only have `tr`/`en` keys. This is the only remaining major content gap and by far the largest (products.json is ~1.4MB at 2 languages; a full 6-language pass would roughly triple the text volume for these three fields). **This is the natural next step** if resuming this work.
- `CATEGORY_GROUPS` in `products.ts` (K2's two menu-group names, `{tr,en}` only) — small, easy to pick up alongside the catalog pass.

**If resuming the product-catalog translation:**
1. `Product.name`/`.attributes`/`.category` are already typed `LocalizedField<...>` — no type changes needed, just add `ar`/`es`/`de`/`zh` keys to each product's JSON record.
2. Translate in batches via `Edit` on `products.json` directly (same JSON-structure approach used for `news.json` this session) — a single giant `Edit` call against a large JSON file reliably fails silently ("string not found") past some size threshold; keep each `old_string`/`new_string` to roughly 10-20 products' worth of text and verify with `node -e "require('./src/data/products.json')"` after each batch.
3. Re-run `node scripts/generate-product-attributes.js` after any `products.json` change (or just re-run `npm run build`, which does it automatically) so `public/product-attributes.json` stays in sync — the compare modal reads that generated file, not `products.json` directly.
4. High-value shortcut: many `attributes` labels (`Watt`, `Lümen`, `Kasa Tipi`, `Duy Tipi`, `Renk`, casing/color values like `Beyaz`/`Ararenk`/`Günışığı`) repeat across hundreds of products — build a label/value → translation lookup once (script or by hand) instead of re-translating the same handful of terms thousands of times.
5. `name` should generally be a light localization (product/model codes like `GDL414`, `KES180` stay as-is; only the descriptive Turkish words around them need translating) rather than a full re-write — check a few already-bilingual `tr`/`en` pairs in the file to see the existing convention before starting.

## Adding products / processing photos

See **`urun_ekleme_rehberi.md`** at the repo root for the full new-product workflow (JSON merging, legacy slug redirects, CCT/variant rules, ghost-record cleanup) and **`FOTOGRAF_SIKISTIRMA_REHBERI.md`** for the exact photo-compression method (sharp, `resize 800x800 inside/withoutEnlargement` + `webp({quality:80, effort:6})`) — read both before touching `src/data/products.json` or `public/images/urunler/`.

## Development Workflow
- **Start Dev Server:** `npm run dev`
- **Build:** `npm run build`
- **Lint:** `npm run lint` (Biome) — `npm run format` to auto-fix formatting, `npm run check` to run both lint+format together.
- **Generate Product PDFs:** `node generate_urun_bilgi_formu.js` (all products), `node generate_urun_bilgi_formu.js ID1 ID2 ...` (specific products), or `node generate_urun_bilgi_formu.js --missing` (only products without an existing PDF) — see [`urun_bilgi_formu_rehberi.md`](urun_bilgi_formu_rehberi.md) for the full workflow, output location, and design decisions before touching this script.

Please refer to this document to understand where to place new components, where to look for routing logic, how the data layer resolves products/slugs, and how the styling/animation/3D stack is structured. When something here seems out of date (a file renamed, a component removed), trust the current code over this doc and update this file accordingly.

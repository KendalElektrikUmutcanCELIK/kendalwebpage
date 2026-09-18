import {
  getSlugForProduct,
  idToSlugMap,
  type Product,
  type ProductVariation,
  slugMap,
} from './products';
import productsData from './products.json';

// SERVER-ONLY. This file (unlike products.ts) imports products.json — the
// full catalog, every product's every field, in every language — so it
// must never be imported from a "use client" component or from anything a
// client component imports, even indirectly: Turbopack bundles at module
// (file) granularity, so pulling in even one export from this file drags
// the whole ~1.4MB+ JSON blob into that client bundle regardless of which
// export was actually used. Server components (page.tsx files, sitemap.ts)
// can import this freely — server component code and its imports never
// ship to the browser, only the props it explicitly passes down do. See
// products.ts's getSlugForProduct() comment for the client-safe half of
// this split.
export const products: Record<string, Product> =
  productsData as unknown as Record<string, Product>;

const sanitizeLegacySlug = (slug: string) =>
  slug
    .replace(/\*/g, '-')
    .replace(/-+/g, '-')
    .replace(/(^-|-$)/g, '');

export function getProductBySlug(slug: string): Product | undefined {
  const id = slugMap[slug];
  if (id) return products[id];
  if (products[slug]) return products[slug];

  if (slug.includes('*')) {
    const sanitizedId = slugMap[sanitizeLegacySlug(slug)];
    if (sanitizedId) return products[sanitizedId];
  }

  return undefined;
}

// id-only variant of getSlugForProduct(), for call sites (generateStaticParams,
// redirects) that don't already have the product object loaded.
export function getSlugByProductId(id: string): string | undefined {
  const product = products[id as keyof typeof products];
  return product ? getSlugForProduct(product) : idToSlugMap[id];
}

const isDimensionToken = (token: string) => /^\d+[x*×]\d+$/i.test(token || '');

const getVariationBaseName = (name: string) => {
  const words = (name || '').trim().split(' ');
  const firstWordUpper = words[0]?.toUpperCase();
  if (
    firstWordUpper === 'K2' ||
    firstWordUpper === 'GLOBAL' ||
    firstWordUpper === 'VANTİ' ||
    firstWordUpper === 'VANTI'
  ) {
    return words
      .filter(
        (w: string) =>
          !w.match(/^\d+W$/i) &&
          !w.match(/^(E14|E27|GU10|G9|R7S)$/i) &&
          ![
            'SARI',
            'BEYAZ',
            'ARARENK',
            'GÜNIŞIĞI',
            'MAVİ',
            'YEŞİL',
            'KIRMIZI',
            'AMBER',
            'GÜN IŞIĞI',
          ].includes(w.toUpperCase()),
      )
      .join(' ');
  }
  return isDimensionToken(words[1]) ? `${words[0]} ${words[1]}` : words[0];
};

// Same-base-model variants (different color temp/casing/watt/socket) of a
// product, e.g. shown as option chips on its detail page. The detail page
// component only needs each variant's id + variantOptions, never its full
// record — pass this lean result down to it, never the full Product map.
export function getProductVariations(product: Product): ProductVariation[] {
  const baseModel = getVariationBaseName(product.name.tr);
  return Object.values(products)
    .filter((p) => getVariationBaseName(p.name.tr) === baseModel)
    .map((p) => ({ id: p.id, variantOptions: p.variantOptions }));
}

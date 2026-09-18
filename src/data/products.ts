import { getAssetPath } from '@/lib/basePath';
import type { LocalizedField } from '@/lib/i18n/localized';
import slugMapData from './slug-map.json';

export interface ProductAttribute {
  label: string;
  value: string;
}

export interface Product {
  id: string;
  model: string;
  image: string;
  images?: string[];
  name: LocalizedField<string>;
  attributes: LocalizedField<ProductAttribute[]>;
  category?: LocalizedField<string[]>;
  brand?: string;
  variantOptions?: {
    watt?: string | null;
    socket?: string | null;
    light?: string | null;
    casing?: string | null;
  };
}

// Listing/showcase pages (e.g. brand/[brandName]/urunler) render up to ~755
// products at once in a client component — shipping every product's full
// `attributes` (the single largest field, label/value spec rows in every
// language) to the browser on every visit is wasted bytes since the grid
// view never reads it (only the compare modal does, lazily, for ≤3 items).
// Strip it here so listing pages pass this lighter shape across the
// server->client boundary instead of the full Product.
export type ProductListItem = Omit<Product, 'attributes'>;

export function toProductListItem(product: Product): ProductListItem {
  const { attributes: _attributes, ...rest } = product;
  return rest;
}

export interface ProductVariation {
  id: string;
  variantOptions: Product['variantOptions'];
}

export const slugMap: Record<string, string> = slugMapData as Record<
  string,
  string
>;

export function getAllSlugs(): string[] {
  return Object.keys(slugMap);
}

export function getProductImageUrl(image: string): string {
  return getAssetPath('/images/' + image);
}

export const idToSlugMap: Record<string, string> = {};
for (const slug of Object.keys(slugMap)) {
  const id = slugMap[slug as keyof typeof slugMap];
  if (!idToSlugMap[id]) {
    idToSlugMap[id] = slug;
  }
}

const slugify = (text: string) =>
  text
    .toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/ü/g, 'u')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ğ/g, 'g')
    .replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

// Client-safe: computes a product's canonical slug from its OWN id+name
// (already in hand wherever a ProductListItem is rendered), touching only
// the lightweight `slugMap`/`idToSlugMap` lookups — never the full product
// catalog. This matters because this file (`products.ts`) is imported by
// client components, and must therefore NEVER import `products.json`
// (~1.4MB+ of text, every product's every field, in every language)
// itself, even transitively — the bundler (Turbopack) doesn't tree-shake
// unused *bindings* within a module, only unused *modules*: if this file
// statically imported products.json for even one unrelated function, every
// client bundle that imports anything else from this file would still get
// the whole catalog. The full-catalog lookups (`products`,
// `getProductBySlug`, `getSlugByProductId`, `getProductVariations`) live in
// `productsServer.ts` instead, which only server components may import —
// see that file's header comment.
export function getSlugForProduct(product: {
  id: string;
  name: { tr: string };
}): string | undefined {
  const canonical = slugify(product.name.tr);
  if (slugMap[canonical as keyof typeof slugMap] === product.id) {
    return canonical;
  }
  return idToSlugMap[product.id];
}

export const BRAND_HOSTS: Record<string, string> = {
  k2: 'https://k2.kendalelektrik.com',
  vanti: 'https://vanti.kendalelektrik.com',
  global: 'https://global.kendalelektrik.com',
};

export interface CategoryGroupDef {
  key: string;
  brand: string;
  name: { tr: string; en: string };
  categories: string[];
}

export const CATEGORY_GROUPS: CategoryGroupDef[] = [
  {
    key: 'armatur',
    brand: 'k2',
    name: { tr: 'Armatürler', en: 'Fixtures' },
    categories: [
      'Exit Armatürler',
      'LED Armatürler',
      'Sensörlü LED Armatürler',
      'LEDLİ Sokak Armatürleri',
      'Solar Armatürler',
      'Solar Bahçe Armatürler',
      'Solar Sokak Armatürler',
      'Yüksek Tavan Armatürleri',
      'Armatürler',
      'Linear Armatürler',
      'Sarkıt Armatürler',
      'Manyetik Armatürler',
      'Koridor ve Merdiven Armatürler',
      'Sensörlü Koridor ve Merdiven Armatürler',
      'Bahçe Armatürleri',
      'Akdeniz Set Üstü Armatürler',
      'Dış Mekan Duvar Armatürleri',
      'Sinek Öldürücü Armatürler',
      'LEDLİ EXIT ARMATÜRLER',
    ],
  },
  {
    key: 'digerleri',
    brand: 'k2',
    name: { tr: 'Diğerleri', en: 'Others' },
    categories: [
      'Adaptörler',
      'Duylar',
      'Fenerler',
      'Fotoseller',
      'Işıldaklar',
      'Kabin Aydınlatmaları',
      'Kablolar',
      'Klemensler',
      'Kontaktörler',
      'Kumandalar',
      'Lambalar',
      'Zaman Saatleri',
      'Kumandalı Ziller',
      'Spot Aksesuarları',
      'LED Fişleri',
      'Trafolar',
    ],
  },
];

export function getCategoryGroupForCategory(
  categoryName: string,
  brand?: string,
): CategoryGroupDef | undefined {
  const b = brand || 'k2';
  return CATEGORY_GROUPS.find(
    (g) => g.brand === b && g.categories.includes(categoryName),
  );
}

export function getProductCategorySlug(product: ProductListItem): string {
  const brandName = product.brand || 'k2';
  const categoryName = product.category?.tr?.[0];
  return categoryName
    ? slugify(categoryName)
    : brandName === 'vanti'
      ? 'vantilator'
      : 'aydinlatma';
}

export function getProductCanonicalUrl(product: ProductListItem): string {
  const brandName = product.brand || 'k2';
  const host = BRAND_HOSTS[brandName] || BRAND_HOSTS.k2;
  const category = getProductCategorySlug(product);
  const slug = getSlugForProduct(product) || product.id;
  return `${host}/urunler/${category}/${encodeURIComponent(slug)}`;
}

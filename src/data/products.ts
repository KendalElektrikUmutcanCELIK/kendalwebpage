import { getAssetPath } from '@/lib/basePath';
import productsData from './products.json';
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
  name: { tr: string; en: string };
  attributes: { tr: ProductAttribute[]; en: ProductAttribute[] };
  category?: { tr: string[]; en: string[] };
  brand?: string;
  variantOptions?: {
    watt?: string | null;
    socket?: string | null;
    light?: string | null;
    casing?: string | null;
  };
}

export const products: Record<string, Product> =
  productsData as unknown as Record<string, Product>;

export const slugMap: Record<string, string> = slugMapData as Record<
  string,
  string
>;

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

export function getAllSlugs(): string[] {
  return Object.keys(slugMap);
}

export function getProductImageUrl(image: string): string {
  return getAssetPath('/images/' + image);
}

const idToSlugMap: Record<string, string> = {};
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

export function getSlugByProductId(id: string): string | undefined {
  const product = products[id as keyof typeof products];
  if (product) {
    const canonical = slugify(product.name.tr);
    if (slugMap[canonical as keyof typeof slugMap] === id) {
      return canonical;
    }
  }
  return idToSlugMap[id];
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

export function getProductCategorySlug(product: Product): string {
  const brandName = product.brand || 'k2';
  const categoryName = product.category?.tr?.[0];
  return categoryName
    ? slugify(categoryName)
    : brandName === 'vanti'
      ? 'vantilator'
      : 'aydinlatma';
}

export function getProductCanonicalUrl(product: Product): string {
  const brandName = product.brand || 'k2';
  const host = BRAND_HOSTS[brandName] || BRAND_HOSTS.k2;
  const category = getProductCategorySlug(product);
  const slug = getSlugByProductId(product.id) || product.id;
  return `${host}/urunler/${category}/${encodeURIComponent(slug)}`;
}

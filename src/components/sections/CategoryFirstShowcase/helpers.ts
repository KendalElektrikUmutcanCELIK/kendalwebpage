import { getSlugForProduct, type ProductListItem } from '@/data/products';

export const MAX_COMPARE = 3;

const isDimensionToken = (token: string) => /^\d+[x*×]\d+$/i.test(token || '');

export const getBaseModelKey = (name: string) => {
  const words = (name || '').trim().split(' ');
  return isDimensionToken(words[1]) ? `${words[0]} ${words[1]}` : words[0];
};

export const slugify = (text: string) =>
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

// Generate pagination array with ellipses
export const getVisiblePages = (current: number, total: number) => {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  if (current <= 4) return [1, 2, 3, 4, 5, '...', total];
  if (current >= total - 3)
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];

  return [1, '...', current - 1, current, current + 1, '...', total];
};

export function getProductCardUrl(
  product: ProductListItem,
  brandName: string,
  isBrandRoute: boolean,
): string {
  const slug = getSlugForProduct(product) || product.id;
  const categoryName = product.category?.tr?.[0];
  const categorySlug = categoryName
    ? slugify(categoryName)
    : brandName === 'vanti'
      ? 'vantilator'
      : 'aydinlatma';
  return isBrandRoute && brandName && process.env.NODE_ENV === 'production'
    ? `/brand/${brandName}/urunler/${categorySlug}/${slug}`
    : `/urunler/${categorySlug}/${slug}`;
}

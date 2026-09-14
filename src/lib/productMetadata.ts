import type { Metadata } from 'next';
import {
  getProductCanonicalUrl,
  getProductImageUrl,
  type Product,
} from '@/data/products';

const NOT_FOUND_METADATA: Metadata = {
  title: 'Ürün Bulunamadı | Kendal Elektrik',
};

// Öncelik sırasına göre, meta description'da somut rakam olarak göstermeye
// değer bulduğumuz spec etiketleri. Sırayla ilk 3 eşleşen kullanılır.
const SPEC_PRIORITY: {
  match: (label: string) => boolean;
  format: (value: string) => string;
}[] = [
  { match: (l) => l === 'watt' || l === 'güç', format: (v) => v },
  { match: (l) => l === 'lümen', format: (v) => `${v} lümen` },
  { match: (l) => l === 'duy', format: (v) => `${v} duy` },
  { match: (l) => l === 'gerilim', format: (v) => v },
  {
    match: (l) => l === 'renk sıcaklığı' || l === 'işık rengi',
    format: (v) => v,
  },
];

export function buildProductDescription(product: Product): string {
  const category = product.category?.tr?.[0];
  const attributes = product.attributes?.tr || [];

  const specs: string[] = [];
  for (const rule of SPEC_PRIORITY) {
    if (specs.length >= 3) break;
    const attr = attributes.find(
      (a) => rule.match(a.label.trim().toLowerCase()) && a.value,
    );
    if (attr) specs.push(rule.format(String(attr.value)));
  }

  const specText =
    specs.length > 0 ? `${specs.join(', ')} özellikleriyle. ` : '';

  return `${product.name.tr}${category ? ` - ${category}` : ''} | Model: ${product.model}. ${specText}Kendal Elektrik'in yerli üretim aydınlatma ve elektrik ürünleri arasında yer alır.`;
}

export function getProductDetailMetadata(
  product: Product | undefined,
): Metadata {
  if (!product) return NOT_FOUND_METADATA;

  const description = buildProductDescription(product);
  const title = `${product.name.tr} | Kendal Elektrik`;
  const canonicalUrl = getProductCanonicalUrl(product);

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonicalUrl,
      images: [{ url: getProductImageUrl(product.image) }],
    },
  };
}

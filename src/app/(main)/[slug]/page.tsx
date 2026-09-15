import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { PageBlocksClient } from '@/components/blocks/PageBlocksClient';
import { BreadcrumbSchema } from '@/components/shared/BreadcrumbSchema';
import { ProductSchema } from '@/components/shared/ProductSchema';
import { getAllCustomPageSlugs, getCustomPageBySlug } from '@/data/pages';
import {
  BRAND_HOSTS,
  getAllSlugs,
  getProductBySlug,
  getProductCanonicalUrl,
  getProductImageUrl,
  getSlugByProductId,
} from '@/data/products';
import { getProductPdfFile } from '@/lib/getProductPdfForm';
import { buildProductDescription } from '@/lib/productMetadata';
import { ProductDetailClient } from './ProductDetailClient';

/**
 * Ürün kısa linkleri (slug-map.json) ve panelden oluşturulan serbest sayfalar
 * (pages.json) aynı tek-segmentli /{slug} adresini paylaşıyor. Bu isimler her
 * zaman ürünlere/sabit route'lara ayrılmış kalmalı — admin panel taraf
 * (admin-panel/lib/pages.php) yeni bir sayfa slug'ı üretirken bunlarla
 * çakışmayı zaten engelliyor; buradaki filtre, o kontrol atlanırsa bile
 * static export'un aynı yola iki farklı sayfa yazıp build'i kırmasını önleyen
 * ikinci bir güvenlik katmanı. Yeni bir sabit route eklenirse burayı da güncelle.
 */
const RESERVED_TOP_LEVEL_SLUGS = new Set([
  'zincir-marketler',
  'uretim',
  'projeler',
  'misyon-ve-vizyon',
  'kvkk',
  'kariyer',
  'haberler',
  'gizlilik-cerez-politikasi',
  'iletisim',
  'sertifikalar',
  'robots',
  'sitemap',
  'icon',
  'brand',
]);

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = getProductBySlug(decodedSlug);

  if (product) {
    const description = buildProductDescription(product);
    const canonicalUrl = getProductCanonicalUrl(product);

    return {
      title: `${product.name.tr} | Kendal Elektrik`,
      description,
      alternates: { canonical: canonicalUrl },
      openGraph: {
        title: `${product.name.tr} | Kendal Elektrik`,
        description,
        type: 'website',
        url: canonicalUrl,
        images: [{ url: getProductImageUrl(product.image) }],
      },
    };
  }

  const page = getCustomPageBySlug(decodedSlug);
  if (page) {
    return {
      title: `${page.title?.tr ?? decodedSlug} | Kendal Elektrik`,
      description: page.metaDescription?.tr,
    };
  }

  return {
    title: 'Sayfa Bulunamadı | Kendal Elektrik',
  };
}

export function generateStaticParams() {
  const productSlugs = getAllSlugs();
  const productSlugSet = new Set(productSlugs);
  const customPageSlugs = getAllCustomPageSlugs().filter(
    (slug) => !productSlugSet.has(slug) && !RESERVED_TOP_LEVEL_SLUGS.has(slug),
  );
  return [...productSlugs, ...customPageSlugs].map((slug) => ({ slug }));
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const product = getProductBySlug(decodedSlug);

  if (product) {
    const canonicalSlug = getSlugByProductId(product.id);
    if (canonicalSlug && canonicalSlug !== decodedSlug) {
      redirect(`/${encodeURIComponent(canonicalSlug)}`);
    }

    const pdfFormFile = getProductPdfFile(product.model, product.name.tr);
    const canonicalUrl = getProductCanonicalUrl(product);
    const category = product.category?.tr?.[0];
    const brandUrunlerUrl = `${BRAND_HOSTS[product.brand || 'k2'] || BRAND_HOSTS.k2}/urunler`;
    const brandCategoryUrl = category
      ? `${brandUrunlerUrl}?category=${encodeURIComponent(category)}`
      : brandUrunlerUrl;

    return (
      <>
        <ProductSchema product={product} canonicalUrl={canonicalUrl} />
        <BreadcrumbSchema
          items={[
            { name: 'Anasayfa', url: 'https://www.kendalelektrik.com.tr/' },
            { name: 'Ürünler', url: brandUrunlerUrl },
            ...(category
              ? [
                  {
                    name: category,
                    url: brandCategoryUrl,
                  },
                ]
              : []),
            { name: product.name.tr, url: canonicalUrl },
          ]}
        />
        <ProductDetailClient product={product} pdfFormFile={pdfFormFile} />
      </>
    );
  }

  if (!RESERVED_TOP_LEVEL_SLUGS.has(decodedSlug)) {
    const page = getCustomPageBySlug(decodedSlug);
    if (page) {
      return <PageBlocksClient page={page} />;
    }
  }

  notFound();
}

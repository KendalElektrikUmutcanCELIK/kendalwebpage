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
 * Ürün kısa linkleri (slug-map.json, hep tek segment) ve panelden oluşturulan
 * serbest sayfalar (pages.json, tek VEYA çok segmentli — "test/test2" gibi iç
 * içe olabilir) aynı /{...slug} adres uzayını paylaşıyor. Bu isimler her zaman
 * sabit route'lara (haberler, kariyer, sertifikalar, brand vb. — bunların
 * kendi iç içe alt sayfaları da var, ör. /kariyer/temel-ilkelerimiz,
 * /haberler/{id}) ayrılmış kalmalı: bir serbest sayfanın İLK segmenti asla bu
 * isimlerden biri olamaz — aksi halde static export aynı çıktı yoluna iki
 * farklı route yazmaya çalışıp build'i kırar. admin-panel/lib/pages.php yeni
 * sayfa slug'ı üretirken bunu zaten engelliyor; buradaki filtre, o kontrol
 * atlansa bile build'i kırmayı imkansız kılan ikinci bir güvenlik katmanı.
 * Yeni bir sabit route eklenirse burayı da güncelle.
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

function decodeSlugSegments(segments: string[]): string[] {
  return segments.map((s) => decodeURIComponent(s));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const segments = decodeSlugSegments(slug);
  const joinedSlug = segments.join('/');
  const product = segments.length === 1 ? getProductBySlug(segments[0]) : null;

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

  if (!RESERVED_TOP_LEVEL_SLUGS.has(segments[0])) {
    const page = getCustomPageBySlug(joinedSlug);
    if (page) {
      return {
        title: `${page.title?.tr ?? joinedSlug} | Kendal Elektrik`,
        description: page.metaDescription?.tr,
      };
    }
  }

  return {
    title: 'Sayfa Bulunamadı | Kendal Elektrik',
  };
}

export function generateStaticParams() {
  const productSlugs = getAllSlugs();
  const productSlugSet = new Set(productSlugs);
  const customPageSlugs = getAllCustomPageSlugs().filter((slug) => {
    const firstSegment = slug.split('/')[0];
    if (RESERVED_TOP_LEVEL_SLUGS.has(firstSegment)) return false;
    if (!slug.includes('/') && productSlugSet.has(slug)) return false;
    return true;
  });
  return [
    ...productSlugs.map((slug) => ({ slug: [slug] })),
    ...customPageSlugs.map((slug) => ({ slug: slug.split('/') })),
  ];
}

export default async function SlugPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const resolvedParams = await params;
  const segments = decodeSlugSegments(resolvedParams.slug);
  const joinedSlug = segments.join('/');
  const product = segments.length === 1 ? getProductBySlug(segments[0]) : null;

  if (product) {
    const canonicalSlug = getSlugByProductId(product.id);
    if (canonicalSlug && canonicalSlug !== segments[0]) {
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

  if (!RESERVED_TOP_LEVEL_SLUGS.has(segments[0])) {
    const page = getCustomPageBySlug(joinedSlug);
    if (page) {
      return <PageBlocksClient page={page} />;
    }
  }

  notFound();
}

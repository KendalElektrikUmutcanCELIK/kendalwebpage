import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { BreadcrumbSchema } from '@/components/shared/BreadcrumbSchema';
import { ProductSchema } from '@/components/shared/ProductSchema';
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

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug);
  const product = getProductBySlug(decodedSlug);

  if (!product) {
    return {
      title: 'Ürün Bulunamadı | Kendal Elektrik',
    };
  }

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

export function generateStaticParams() {
  const slugs = getAllSlugs();
  return slugs.map((slug) => ({
    slug,
  }));
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const product = getProductBySlug(decodedSlug);

  if (!product) {
    notFound();
  }

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

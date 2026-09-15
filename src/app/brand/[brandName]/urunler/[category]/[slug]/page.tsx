import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import React from 'react';
import { ProductDetailClient } from '@/app/(main)/[...slug]/ProductDetailClient';
import { ProductSchema } from '@/components/shared/ProductSchema';
import {
  getProductBySlug,
  getProductCanonicalUrl,
  getProductCategorySlug,
  getSlugByProductId,
  products,
} from '@/data/products';
import { getProductPdfFile } from '@/lib/getProductPdfForm';
import { getProductDetailMetadata } from '@/lib/productMetadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandName: string; category: string; slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(decodeURIComponent(slug));
  return getProductDetailMetadata(product);
}

export function generateStaticParams() {
  return Object.values(products).map((p) => ({
    brandName: p.brand || 'k2',
    category: getProductCategorySlug(p),
    slug: getSlugByProductId(p.id) || p.id,
  }));
}

export default async function BrandProductDetailPage({
  params,
}: {
  params: Promise<{ brandName: string; category: string; slug: string }>;
}) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  const product = getProductBySlug(decodedSlug);

  if (!product) {
    notFound();
  }

  const canonicalSlug = getSlugByProductId(product.id);
  if (canonicalSlug && canonicalSlug !== decodedSlug) {
    redirect(
      `/brand/${resolvedParams.brandName}/urunler/${resolvedParams.category}/${encodeURIComponent(canonicalSlug)}`,
    );
  }

  const pdfFormFile = getProductPdfFile(product.model, product.name.tr);

  return (
    <>
      <ProductSchema
        product={product}
        canonicalUrl={getProductCanonicalUrl(product)}
      />
      <ProductDetailClient
        product={product}
        brandName={resolvedParams.brandName as 'k2' | 'vanti' | 'global'}
        pdfFormFile={pdfFormFile}
      />
    </>
  );
}

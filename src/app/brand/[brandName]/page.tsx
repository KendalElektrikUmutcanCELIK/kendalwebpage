import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import React from 'react';
import { GlobalCreativePage } from '@/components/brand/global/GlobalCreativePage';
import { K2CreativePage } from '@/components/brand/k2/K2CreativePage';
import { VantiCreativePage } from '@/components/brand/vanti/VantiCreativePage';
import { toProductListItem } from '@/data/products';
import { products } from '@/data/productsServer';

const BRAND_META: Record<
  string,
  { host: string; title: string; description: string }
> = {
  k2: {
    host: 'https://k2.kendalelektrik.com',
    title: 'K2 Led System | Yerli Üretim LED Aydınlatma',
    description:
      'K2 Led System, Kendal Elektrik güvencesiyle yerli üretim LED aydınlatma armatürleri ve ürün gamı.',
  },
  vanti: {
    host: 'https://vanti.kendalelektrik.com',
    title: 'Vanti | Kendal Elektrik Vantilatör Ürünleri',
    description:
      'Vanti, Kendal Elektrik güvencesiyle üretilen vantilatör ve havalandırma ürünleri markasıdır.',
  },
  global: {
    host: 'https://global.kendalelektrik.com',
    title: 'Kendal Global | Aydınlatma ve Elektrik Ürünleri',
    description:
      "Kendal Global, Kendal Elektrik'in uluslararası pazarlara yönelik aydınlatma ve elektrik ürünleri markasıdır.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandName: string }>;
}): Promise<Metadata> {
  const { brandName } = await params;
  const meta = BRAND_META[brandName] || BRAND_META.k2;

  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: meta.host },
    openGraph: {
      title: meta.title,
      description: meta.description,
      type: 'website',
      url: meta.host,
    },
  };
}

export function generateStaticParams() {
  return [{ brandName: 'k2' }, { brandName: 'vanti' }, { brandName: 'global' }];
}

export default async function BrandPage({
  params,
}: {
  params: Promise<{ brandName: string }>;
}) {
  const resolvedParams = await params;
  const { brandName } = resolvedParams;

  if (brandName === 'k2') {
    const allProducts = Object.values(products)
      .filter((p) => p.brand === 'k2')
      .map(toProductListItem);

    return <K2CreativePage allProducts={allProducts} />;
  }

  if (brandName === 'global') {
    const allProducts = Object.values(products)
      .filter((p) => p.brand === 'global')
      .map(toProductListItem);

    return <GlobalCreativePage allProducts={allProducts} />;
  }

  if (brandName === 'vanti') {
    const allProducts = Object.values(products)
      .filter((p) => p.brand === 'vanti')
      .map(toProductListItem);

    return <VantiCreativePage allProducts={allProducts} />;
  }

  notFound();
}

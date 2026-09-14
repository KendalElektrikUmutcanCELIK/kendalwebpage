import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import React, { Suspense } from 'react';
import { BrandProductsHeader } from '@/components/sections/BrandProductsHeader';
import CategoryFirstShowcase from '@/components/sections/CategoryFirstShowcase';
import { ItemListSchema } from '@/components/shared/ItemListSchema';
import { getProductCanonicalUrl, products } from '@/data/products';
import { getAssetPath } from '@/lib/basePath';

const BRAND_META: Record<
  string,
  { host: string; title: string; description: string }
> = {
  k2: {
    host: 'https://k2.kendalelektrik.com.tr',
    title: 'Ürünlerimiz | K2 Led System',
    description:
      "K2 Led System'e ait tüm yerli üretim LED aydınlatma armatürlerini inceleyin.",
  },
  vanti: {
    host: 'https://vanti.kendalelektrik.com.tr',
    title: 'Ürünlerimiz | Vanti',
    description:
      'Vanti markasına ait tüm vantilatör ve havalandırma ürünlerini inceleyin.',
  },
  global: {
    host: 'https://global.kendalelektrik.com.tr',
    title: 'Ürünlerimiz | Kendal Global',
    description:
      'Kendal Global markasına ait tüm aydınlatma ve elektrik ürünlerini inceleyin.',
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
    alternates: { canonical: `${meta.host}/urunler` },
  };
}

export function generateStaticParams() {
  return [{ brandName: 'k2' }, { brandName: 'vanti' }, { brandName: 'global' }];
}

export default async function BrandProductsPage({
  params,
}: {
  params: Promise<{ brandName: string }>;
}) {
  const resolvedParams = await params;
  const { brandName } = resolvedParams;
  const isK2 = brandName === 'k2';

  const allProducts = Object.values(products).filter(
    (p) => p.brand === brandName,
  );

  const meta = BRAND_META[brandName] || BRAND_META.k2;

  const glowStrong = isK2
    ? 'bg-[#ff5500]/60'
    : brandName === 'vanti'
      ? 'bg-blue-300/30'
      : 'bg-[#FFDA51]/35';
  const glowSoft = isK2
    ? 'bg-[#ff5500]/40'
    : brandName === 'vanti'
      ? 'bg-cyan-200/25'
      : 'bg-yellow-200/30';

  return (
    <div
      className={`relative w-full min-h-screen pt-32 pb-16 px-2 sm:px-6 overflow-hidden ${
        isK2
          ? 'bg-[#3a3a40] text-white'
          : brandName === 'vanti'
            ? 'bg-gradient-to-b from-blue-50/70 via-white to-white text-zinc-900'
            : 'bg-[#FFF3C4] text-zinc-900'
      }`}
    >
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.55] [mask-image:radial-gradient(ellipse_65%_45%_at_50%_0%,black,transparent)]"
        style={{
          backgroundImage: isK2
            ? 'radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px)'
            : 'radial-gradient(circle, rgba(0,0,0,0.07) 1px, transparent 1px)',
          backgroundSize: '26px 26px',
        }}
      />
      <div
        className={`absolute -top-32 -left-48 w-[560px] h-[560px] rounded-full blur-[140px] pointer-events-none z-0 ${glowStrong}`}
      />
      <div
        className={`absolute top-1/3 -right-56 w-[640px] h-[640px] rounded-full blur-[160px] pointer-events-none z-0 ${glowSoft}`}
      />
      <div
        className={`absolute bottom-0 left-1/4 w-[480px] h-[480px] rounded-full blur-[150px] pointer-events-none z-0 ${glowSoft}`}
      />

      <ItemListSchema
        name={meta.title}
        items={allProducts.map((p) => ({
          name: p.name.tr,
          url: getProductCanonicalUrl(p),
        }))}
      />

      <div className="relative z-10 max-w-[1440px] mx-auto">
        <BrandProductsHeader brandName={brandName} />

        <Suspense
          fallback={
            <div className="py-24 text-center text-zinc-500">
              Ürünler Yükleniyor...
            </div>
          }
        >
          <CategoryFirstShowcase
            products={allProducts}
            brandName={brandName}
            isBrandScoped
          />
        </Suspense>
      </div>
    </div>
  );
}

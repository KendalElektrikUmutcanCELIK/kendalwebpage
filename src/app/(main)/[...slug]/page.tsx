import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { PageBlocksClient } from '@/components/blocks/PageBlocksClient';
import { getAllCustomPageSlugs, getCustomPageBySlug } from '@/data/pages';
import {
  getProductBySlug,
  getProductCanonicalUrl,
  slugMap,
} from '@/data/products';

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
  'urun-yonlendirme',
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

/**
 * Ürünler burada artık HİÇ statik sayfa olarak üretilmiyor — ne kanonik ne
 * eski/alternatif slug'lar. Sitenin kendi linkleri zaten hep marka route'unu
 * (brand/[brandName]/urunler/[category]/[slug]) kullanıyor, bu kısa link
 * sadece dışarıdan gelen eski bağlantılar için var; o yüzden hepsi tek bir
 * yönlendirme dosyasına (scripts/generate-legacy-redirects.js →
 * public/legacy-redirects.json) ve tek bir ortak sayfaya
 * (src/app/(main)/urun-yonlendirme/) bağlandı. Bkz. o script'in başındaki
 * yorum. Burada sadece admin panelden oluşturulan serbest sayfalar üretiliyor.
 */
export function generateStaticParams() {
  const customPageParams = getAllCustomPageSlugs()
    .filter((slug) => {
      const firstSegment = slug.split('/')[0];
      if (RESERVED_TOP_LEVEL_SLUGS.has(firstSegment)) return false;
      if (!slug.includes('/') && slug in slugMap) return false;
      return true;
    })
    .map((slug) => ({ slug: slug.split('/') }));

  // "output: export" bir catch-all route için en az bir path ister. Şu an
  // hiç admin-panel sayfası yoksa (pages.json boş) liste boş kalır — build'i
  // kırmamak için zararsız bir yer tutucu ekliyoruz, o path normal 404
  // olarak render olur.
  return customPageParams.length > 0
    ? customPageParams
    : [{ slug: ['__bos__'] }];
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
    redirect(getProductCanonicalUrl(product));
  }

  if (!RESERVED_TOP_LEVEL_SLUGS.has(segments[0])) {
    const page = getCustomPageBySlug(joinedSlug);
    if (page) {
      return <PageBlocksClient page={page} />;
    }
  }

  notFound();
}

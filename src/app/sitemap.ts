import type { MetadataRoute } from 'next';
import { newsData } from '@/data/news';
import { BRAND_HOSTS, getProductCanonicalUrl } from '@/data/products';
import { products } from '@/data/productsServer';

export const dynamic = 'force-static';

const WWW_HOST = 'https://www.kendalelektrik.com';
const BRAND_KEYS = ['k2', 'vanti', 'global'] as const;
const HOSTS = ['www', ...BRAND_KEYS] as const;

const trMonths: { [key: string]: number } = {
  Ocak: 0,
  Şubat: 1,
  Mart: 2,
  Nisan: 3,
  Mayıs: 4,
  Haziran: 5,
  Temmuz: 6,
  Ağustos: 7,
  Eylül: 8,
  Ekim: 9,
  Kasım: 10,
  Aralık: 11,
};

function parseTRDate(dateStr: string): Date {
  const parts = dateStr.split(' ');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = trMonths[parts[1]];
    const year = parseInt(parts[2], 10);
    if (!isNaN(day) && month !== undefined && !isNaN(year)) {
      return new Date(Date.UTC(year, month, day));
    }
  }
  return new Date();
}

function wwwSitemap(): MetadataRoute.Sitemap {
  const newsEntries: MetadataRoute.Sitemap = newsData.map((news) => ({
    url: `${WWW_HOST}/haberler/${news.id}`,
    lastModified: parseTRDate(news.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }));

  return [
    {
      url: WWW_HOST,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${WWW_HOST}/projeler`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${WWW_HOST}/uretim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${WWW_HOST}/misyon-ve-vizyon`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${WWW_HOST}/iletisim`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${WWW_HOST}/zincir-marketler`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${WWW_HOST}/haberler`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${WWW_HOST}/sertifikalar`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${WWW_HOST}/sertifikalar/iso`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${WWW_HOST}/sertifikalar/tse`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${WWW_HOST}/sertifikalar/marka-tescil`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    ...newsEntries,
    {
      url: `${WWW_HOST}/kariyer`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${WWW_HOST}/kariyer/insan-kaynaklari-politikamiz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${WWW_HOST}/kariyer/temel-ilkelerimiz`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${WWW_HOST}/kariyer/insan-haklari-ve-calisan-haklari-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.6,
    },
    {
      url: `${WWW_HOST}/kvkk`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
    {
      url: `${WWW_HOST}/gizlilik-cerez-politikasi`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.5,
    },
  ];
}

function brandSitemap(
  brand: (typeof BRAND_KEYS)[number],
): MetadataRoute.Sitemap {
  const host = BRAND_HOSTS[brand];
  const productEntries: MetadataRoute.Sitemap = Object.values(products)
    .filter((product) => (product.brand || 'k2') === brand)
    .map((product) => ({
      url: getProductCanonicalUrl(product),
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  return [
    {
      url: host,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${host}/urunler`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...productEntries,
  ];
}

export async function generateSitemaps() {
  return HOSTS.map((_, id) => ({ id }));
}

export default async function sitemap({
  id,
}: {
  id: Promise<string>;
}): Promise<MetadataRoute.Sitemap> {
  const host = HOSTS[Number(await id)];
  return host === 'www' ? wwwSitemap() : brandSitemap(host);
}

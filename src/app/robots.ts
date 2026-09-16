import type { MetadataRoute } from 'next';

export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: [
      'https://www.kendalelektrik.com/sitemap/0.xml',
      'https://k2.kendalelektrik.com/sitemap/1.xml',
      'https://vanti.kendalelektrik.com/sitemap/2.xml',
      'https://global.kendalelektrik.com/sitemap/3.xml',
    ],
  };
}

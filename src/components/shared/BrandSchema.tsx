import React from 'react';

const BRAND_INFO: Record<
  string,
  { name: string; description: string; logo: string }
> = {
  k2: {
    name: 'K2 Led System',
    description: 'Yerli üretim LED aydınlatma armatürleri markası.',
    logo: 'https://www.kendalelektrik.com/images/brands/k2-logo.svg',
  },
  vanti: {
    name: 'Vanti',
    description: 'Vantilatör ve havalandırma ürünleri markası.',
    logo: 'https://www.kendalelektrik.com/images/brands/vanti-logo.svg',
  },
  global: {
    name: 'Kendal Global',
    description:
      'Uluslararası pazarlara yönelik aydınlatma ve elektrik ürünleri markası.',
    logo: 'https://www.kendalelektrik.com/images/brands/global-logo.svg',
  },
};

const BRAND_HOSTS: Record<string, string> = {
  k2: 'https://k2.kendalelektrik.com',
  vanti: 'https://vanti.kendalelektrik.com',
  global: 'https://global.kendalelektrik.com',
};

export const BrandSchema = ({ brandName }: { brandName: string }) => {
  const info = BRAND_INFO[brandName] || BRAND_INFO.k2;
  const host = BRAND_HOSTS[brandName] || BRAND_HOSTS.k2;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Brand',
    name: info.name,
    description: info.description,
    url: host,
    logo: info.logo,
    parentOrganization: {
      '@type': 'Organization',
      name: 'Kendal Elektrik',
      url: 'https://www.kendalelektrik.com',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

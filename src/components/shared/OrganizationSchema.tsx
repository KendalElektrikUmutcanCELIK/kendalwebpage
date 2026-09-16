import React from 'react';
import siteSettings from '@/data/settings.json';

export const OrganizationSchema = () => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Kendal Elektrik',
    url: 'https://www.kendalelektrik.com',
    logo: 'https://www.kendalelektrik.com/images/kendal-logo.svg',
    foundingDate: '1997',
    description: 'Innovative lighting and electrical equipment manufacturer.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Selimpaşa Org. San. Böl. 5008 Sokak No:6',
      addressLocality: 'Silivri/İstanbul',
      addressCountry: 'TR',
    },
    contactPoint: [
      {
        '@type': 'ContactPoint',
        telephone: '+90-212-482-75-90',
        contactType: 'customer service',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+90-850-259-41-41',
        contactType: 'sales',
      },
      {
        '@type': 'ContactPoint',
        telephone: '+90-444-34-98',
        contactType: 'technical support',
      },
    ],
    sameAs: [
      siteSettings.facebookUrl,
      siteSettings.instagramUrl,
      siteSettings.linkedinUrl,
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

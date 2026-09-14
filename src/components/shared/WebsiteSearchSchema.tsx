import React from 'react';

interface WebsiteSearchSchemaProps {
  name: string;
  siteUrl: string;
  searchUrlTemplate: string;
}

export const WebsiteSearchSchema = ({
  name,
  siteUrl,
  searchUrlTemplate,
}: WebsiteSearchSchemaProps) => {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url: siteUrl,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: searchUrlTemplate,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

import React from 'react';
import type { NewsItem } from '@/data/news-tr';
import { parseNewsDate } from '@/lib/newsDate';

export const NewsArticleSchema = ({ news }: { news: NewsItem }) => {
  const parsedDate = parseNewsDate(news.date);
  const isoDate =
    parsedDate > 0
      ? new Date(parsedDate).toISOString().slice(0, 10)
      : undefined;

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: news.title,
    image: news.images.map((img) => `https://www.kendalelektrik.com${img}`),
    ...(isoDate ? { datePublished: isoDate } : {}),
    author: [
      {
        '@type': 'Organization',
        name: 'Kendal Elektrik',
        url: 'https://www.kendalelektrik.com',
      },
    ],
    publisher: {
      '@type': 'Organization',
      name: 'Kendal Elektrik',
      logo: {
        '@type': 'ImageObject',
        url: 'https://www.kendalelektrik.com/images/kendal-logo.svg',
      },
    },
    description: news.content[0]?.slice(0, 155) ?? '',
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://www.kendalelektrik.com/haberler/${news.id}`,
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

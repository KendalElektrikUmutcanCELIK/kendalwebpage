import { getAssetPath } from '@/lib/basePath';
import newsData from './news.json';
import type { NewsItem } from './news-tr';

export const newsDataEN: NewsItem[] = (newsData.en as NewsItem[]).map(
  (item) => ({
    ...item,
    images: item.images.map((img) => getAssetPath(`/images/${img}`)),
  }),
);

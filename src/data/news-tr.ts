import { getAssetPath } from '@/lib/basePath';
import newsData from './news.json';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  images: string[];
  content: string[];
}

export const newsDataTR: NewsItem[] = (newsData.tr as NewsItem[]).map(
  (item) => ({
    ...item,
    images: item.images.map((img) => getAssetPath(`/images/${img}`)),
  }),
);

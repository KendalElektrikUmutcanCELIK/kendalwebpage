import { getAssetPath } from '@/lib/basePath';
import type { Language } from '@/lib/i18n/LanguageProvider';
import newsDataJson from './news.json';

export interface NewsItem {
  id: string;
  title: string;
  date: string;
  images: string[];
  content: string[];
}

// news.json is being translated incrementally — like Product/LocalizedField
// elsewhere, only tr/en are guaranteed for every article; other languages
// fall back to en, then tr, per-language (not per-article) below.
type NewsDataJson = Partial<Record<Language, NewsItem[]>> & {
  tr: NewsItem[];
  en: NewsItem[];
};

const raw = newsDataJson as unknown as NewsDataJson;

const withResolvedImages = (items: NewsItem[]): NewsItem[] =>
  items.map((item) => ({
    ...item,
    images: item.images.map((img) => getAssetPath(`/images/${img}`)),
  }));

const cache: Partial<Record<Language, NewsItem[]>> = {};

export function getNewsData(language: Language): NewsItem[] {
  const cached = cache[language];
  if (cached) return cached;
  const items = raw[language] ?? raw.en ?? raw.tr;
  const resolved = withResolvedImages(items);
  cache[language] = resolved;
  return resolved;
}

// Back-compat: some call sites only need the id/date list (language-
// agnostic) or a TR default for server-rendered metadata.
export const newsDataTR: NewsItem[] = getNewsData('tr');
export const newsDataEN: NewsItem[] = getNewsData('en');
export const newsData = newsDataTR;

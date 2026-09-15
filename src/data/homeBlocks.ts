import homeBlocksJson from './homeBlocks.json';
import type { PageBlock } from './pages';

export type HomeBlockSlot =
  | 'after-hero'
  | 'after-about'
  | 'after-brands'
  | 'after-stats'
  | 'after-catalog-cta'
  | 'after-video'
  | 'after-global-presence'
  | 'after-news-preview';

const homeBlocks: Record<HomeBlockSlot, PageBlock[]> =
  homeBlocksJson as Record<HomeBlockSlot, PageBlock[]>;

export const getHomeBlocks = (slot: HomeBlockSlot): PageBlock[] =>
  homeBlocks[slot] ?? [];

export const HOME_BLOCK_SLOTS: { key: HomeBlockSlot; label: string }[] = [
  { key: 'after-hero', label: 'Hero ile Hakkımızda Arasına' },
  { key: 'after-about', label: 'Hakkımızda ile Markalarımız Arasına' },
  { key: 'after-brands', label: 'Markalarımız ile Şirket İstatistikleri Arasına' },
  { key: 'after-stats', label: 'Şirket İstatistikleri ile Katalog CTA Arasına' },
  { key: 'after-catalog-cta', label: 'Katalog CTA ile Şirket Videosu Arasına' },
  { key: 'after-video', label: 'Şirket Videosu ile Küresel Varlık Arasına' },
  { key: 'after-global-presence', label: 'Küresel Varlık ile Haberler Arasına' },
  { key: 'after-news-preview', label: 'Haberlerden Sonra (Sayfa Sonu)' },
];

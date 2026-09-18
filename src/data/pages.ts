import type { LocalizedField } from '@/lib/i18n/localized';
import pagesJson from './pages.json';

export type LocalizedText = LocalizedField<string>;

export interface HeadingTextBlockData {
  heading: LocalizedText;
  body: LocalizedText;
}

export interface ImageGalleryBlockData {
  title?: LocalizedText;
  images: { url: string; alt: LocalizedText }[];
}

export interface TextImageBlockData {
  heading: LocalizedText;
  text: LocalizedText;
  image: string;
  imageAlt: LocalizedText;
  imagePosition: 'left' | 'right';
}

export interface CtaBlockData {
  heading?: LocalizedText;
  text?: LocalizedText;
  buttonLabel: LocalizedText;
  buttonUrl: string;
}

export type PageBlock =
  | { id: string; type: 'heading_text'; data: HeadingTextBlockData }
  | { id: string; type: 'image_gallery'; data: ImageGalleryBlockData }
  | { id: string; type: 'text_image'; data: TextImageBlockData }
  | { id: string; type: 'cta'; data: CtaBlockData };

export interface CustomPage {
  slug: string;
  title: LocalizedText;
  metaDescription?: LocalizedText;
  blocks: PageBlock[];
}

const customPages = pagesJson as Record<string, CustomPage>;

export function getAllCustomPageSlugs(): string[] {
  return Object.keys(customPages);
}

export function getCustomPageBySlug(slug: string): CustomPage | undefined {
  return customPages[slug];
}

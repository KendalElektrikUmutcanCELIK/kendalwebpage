import type { Language } from '@/lib/i18n/LanguageProvider';
import aboutContentData from './aboutContent.json';

export interface AboutBeat {
  title: string;
  text: string;
}

export interface AboutContent {
  title: string;
  text1: string;
  text2: string;
  beats: AboutBeat[];
}

const aboutContent: Record<Language, AboutContent> = aboutContentData as Record<
  Language,
  AboutContent
>;

export const getAboutContent = (language: Language): AboutContent =>
  aboutContent[language];

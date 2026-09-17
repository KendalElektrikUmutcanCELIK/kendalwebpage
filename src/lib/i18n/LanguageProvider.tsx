'use client';

import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { isGithubPagesBuild } from '@/lib/basePath';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';
import en from './en.json';
import tr from './tr.json';

export type Language = 'tr' | 'en';
type Dictionary = typeof tr;

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = 'kendal-language';

const isValidLanguage = (value: string | null): value is Language =>
  value === 'tr' || value === 'en';

// Cookie (in addition to localStorage) so the preference also survives a
// hard navigation to a *different* brand subdomain (k2./vanti./global.) —
// those are separate origins, so localStorage set on www. is invisible
// there, but a cookie scoped to the shared parent domain is visible to all
// of them. Falls back to localStorage for browsers/contexts without it.
const getStoredLanguage = (): Language | null => {
  const match = document.cookie.match(/(?:^|;\s*)kendal-language=(tr|en)/);
  if (match) return match[1] as Language;
  const legacy = localStorage.getItem(STORAGE_KEY);
  return isValidLanguage(legacy) ? legacy : null;
};

const storeLanguage = (lang: Language) => {
  localStorage.setItem(STORAGE_KEY, lang);
  // GH Pages preview has no real subdomains (basePath-based paths, single
  // origin) so a plain same-host cookie is correct there; only the actual
  // .com production hosting needs the shared parent-domain scope.
  const domainAttr =
    process.env.NODE_ENV === 'production' && !isGithubPagesBuild
      ? '; domain=.kendalelektrik.com'
      : '';
  // biome-ignore lint/suspicious/noDocumentCookie: Cookie Store API is async (window.cookieStore.set returns a Promise) and unsupported in Safari; this write must be synchronous and universally supported.
  document.cookie = `${STORAGE_KEY}=${lang}; path=/; max-age=31536000${domainAttr}`;
};

// Provides language context and translation dictionary
export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState<Language>('tr');

  // useIsomorphicLayoutEffect (not useEffect): runs before the browser's
  // next paint, so restoring a saved 'en' preference on a fresh page load
  // doesn't flash the default Turkish text first (see also ChatbotWidget.tsx
  // for the same class of fix applied to its brand-color flash).
  useIsomorphicLayoutEffect(() => {
    const saved = getStoredLanguage();
    if (saved) setLanguage(saved);
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    storeLanguage(lang);
  };

  const dictionaries: Record<Language, Dictionary> = {
    tr,
    en,
  };

  const t = dictionaries[language];

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  return (
    <LanguageContext.Provider
      value={{ language, setLanguage: handleSetLanguage, t }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

// Custom hook to use language context
export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

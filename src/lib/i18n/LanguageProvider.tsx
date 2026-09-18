'use client';

import { createContext, type ReactNode, useContext, useState } from 'react';
import { isGithubPagesBuild } from '@/lib/basePath';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';
import ar from './ar.json';
import de from './de.json';
import en from './en.json';
import es from './es.json';
import tr from './tr.json';
import zh from './zh.json';

export type Language = 'tr' | 'en' | 'ar' | 'es' | 'de' | 'zh';
type Dictionary = typeof tr;

// Arabic is the only RTL language in this set — every other supported
// language reads left-to-right.
export const RTL_LANGUAGES: Language[] = ['ar'];

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Dictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

const STORAGE_KEY = 'kendal-language';

const SUPPORTED_LANGUAGES: Language[] = ['tr', 'en', 'ar', 'es', 'de', 'zh'];

const isValidLanguage = (value: string | null): value is Language =>
  !!value && (SUPPORTED_LANGUAGES as string[]).includes(value);

// First-visit-only default (no stored cookie/localStorage preference yet):
// match the visitor's browser/OS language setting rather than defaulting
// everyone to Turkish. Intentionally NOT IP/geo-based — see the language
// rollout discussion this shipped with: browser language reflects the
// visitor's actual preference (works offline, no third-party request/
// latency/privacy tradeoff), whereas IP geolocation only guesses at the
// country of the connection, which is a weaker proxy for language.
const detectBrowserLanguage = (): Language => {
  const candidates = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];
  for (const candidate of candidates) {
    const base = candidate.slice(0, 2).toLowerCase();
    if (isValidLanguage(base)) return base;
  }
  return 'tr';
};

// Cookie (in addition to localStorage) so the preference also survives a
// hard navigation to a *different* brand subdomain (k2./vanti./global.) —
// those are separate origins, so localStorage set on www. is invisible
// there, but a cookie scoped to the shared parent domain is visible to all
// of them. Falls back to localStorage for browsers/contexts without it.
const getStoredLanguage = (): Language | null => {
  const match = document.cookie.match(
    /(?:^|;\s*)kendal-language=(tr|en|ar|es|de|zh)/,
  );
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
    setLanguage(saved || detectBrowserLanguage());
  }, []);

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    storeLanguage(lang);
  };

  const dictionaries: Record<Language, Dictionary> = {
    tr,
    en,
    ar,
    es,
    de,
    zh,
  };

  const t = dictionaries[language];

  // useIsomorphicLayoutEffect here too — not just for the initial-detection
  // effect above — so an RTL (Arabic) preference flips <html dir> before
  // paint instead of flashing an LTR layout first, same reasoning as the
  // text-flash fix this hook already gets used for elsewhere.
  useIsomorphicLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = RTL_LANGUAGES.includes(language)
      ? 'rtl'
      : 'ltr';
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

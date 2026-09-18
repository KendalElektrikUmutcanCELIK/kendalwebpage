import type { Language } from './LanguageProvider';

// Content data (products, news, custom pages, settings) predates the ar/es/
// de/zh rollout and is being translated incrementally — unlike the UI
// dictionary (tr.json/en.json/etc.), which is fully translated for all 6
// languages already. Every localized *content* field therefore still
// requires only tr/en and treats the other 4 languages as optional
// overrides, filled in as each content type's translation work lands.
export type LocalizedField<T> = { tr: T; en: T } & Partial<Record<Language, T>>;

// Falls back to English, then Turkish, for a language whose translation for
// this particular field hasn't been added yet — so the site never shows a
// blank/undefined value while content translation is still in progress.
export function resolveLocalized<T>(
  field: LocalizedField<T>,
  language: Language,
): T {
  return field[language] ?? field.en ?? field.tr;
}

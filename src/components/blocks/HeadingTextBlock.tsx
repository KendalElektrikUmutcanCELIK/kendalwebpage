import type { HeadingTextBlockData } from '@/data/pages';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';

export function HeadingTextBlock({
  data,
  language,
}: {
  data: HeadingTextBlockData;
  language: Language;
}) {
  return (
    <div className="page-block bg-white/[0.03] border border-white/10 rounded-3xl p-6 md:p-10">
      <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">
        {(data.heading && resolveLocalized(data.heading, language)) ?? ''}
      </h2>
      <p className="text-gray-300 leading-relaxed text-lg font-light whitespace-pre-line">
        {(data.body && resolveLocalized(data.body, language)) ?? ''}
      </p>
    </div>
  );
}

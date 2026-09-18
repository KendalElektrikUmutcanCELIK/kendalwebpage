import Link from 'next/link';
import type { CtaBlockData } from '@/data/pages';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';

export function CtaBlock({
  data,
  language,
}: {
  data: CtaBlockData;
  language: Language;
}) {
  const heading = data.heading && resolveLocalized(data.heading, language);
  const text = data.text && resolveLocalized(data.text, language);
  const buttonLabel =
    data.buttonLabel && resolveLocalized(data.buttonLabel, language);

  if (!data.buttonUrl || !buttonLabel) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(data.buttonUrl);
  const buttonClass =
    'inline-flex items-center gap-2 bg-[var(--brand-red)] text-white font-semibold px-8 py-4 rounded-full hover:brightness-110 transition-all';

  return (
    <div className="page-block bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 text-center">
      {heading && (
        <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">
          {heading}
        </h2>
      )}
      {text && (
        <p className="text-gray-300 leading-relaxed text-lg font-light mb-6 max-w-2xl mx-auto">
          {text}
        </p>
      )}
      {isExternal ? (
        <a
          href={data.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {buttonLabel}
        </a>
      ) : (
        <Link href={data.buttonUrl} className={buttonClass}>
          {buttonLabel}
        </Link>
      )}
    </div>
  );
}

import Link from 'next/link';
import type { CtaBlockData } from '@/data/pages';
import type { Language } from '@/lib/i18n/LanguageProvider';

export function CtaBlock({
  data,
  language,
}: {
  data: CtaBlockData;
  language: Language;
}) {
  if (!data.buttonUrl || !data.buttonLabel?.[language]) {
    return null;
  }

  const isExternal = /^https?:\/\//.test(data.buttonUrl);
  const buttonClass =
    'inline-flex items-center gap-2 bg-[var(--brand-red)] text-white font-semibold px-8 py-4 rounded-full hover:brightness-110 transition-all';

  return (
    <div className="page-block bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 text-center">
      {data.heading?.[language] && (
        <h2 className="text-3xl font-bold mb-3 text-white tracking-tight">
          {data.heading[language]}
        </h2>
      )}
      {data.text?.[language] && (
        <p className="text-gray-300 leading-relaxed text-lg font-light mb-6 max-w-2xl mx-auto">
          {data.text[language]}
        </p>
      )}
      {isExternal ? (
        <a
          href={data.buttonUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonClass}
        >
          {data.buttonLabel[language]}
        </a>
      ) : (
        <Link href={data.buttonUrl} className={buttonClass}>
          {data.buttonLabel[language]}
        </Link>
      )}
    </div>
  );
}

'use client';

import type React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface BrandProductsHeaderProps {
  brandName: string;
}

type GlyphName = 'bulb' | 'panel' | 'spot' | 'fan' | 'fanBlade';

const GLYPHS: Record<GlyphName, (className?: string) => React.JSX.Element> = {
  bulb: (className) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <path d="M9 18h6M10 21h4" strokeLinecap="round" />
      <path
        d="M12 3a6.5 6.5 0 0 0-4 11.6c.7.6 1.1 1.5 1.1 2.4h5.8c0-.9.4-1.8 1.1-2.4A6.5 6.5 0 0 0 12 3Z"
        strokeLinejoin="round"
      />
    </svg>
  ),
  panel: (className) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <rect x="3" y="5" width="18" height="14" rx="2" strokeLinejoin="round" />
      <circle cx="8" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="10" r="1" fill="currentColor" stroke="none" />
      <circle cx="8" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="12" cy="14" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="14" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  spot: (className) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.2}
    >
      <path d="M9 3h6l1.5 5h-9L9 3Z" strokeLinejoin="round" />
      <path d="M7.5 8h9L14 14h-4L7.5 8Z" strokeLinejoin="round" />
      <path
        d="M9.5 17.5 8 21M14.5 17.5 16 21M12 17.5V21"
        strokeLinecap="round"
      />
    </svg>
  ),
  fan: (className) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  ),
  fanBlade: (className) => (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
      <path d="M12 12c0-4 2-6.5 4.5-7.5-1 3-.3 6-4.5 7.5Z" />
      <path d="M12 12c-3.8-1.3-6.8-.2-9-3 3.2-.6 6.4.2 9 3Z" />
      <path d="M12 12c2.6 3 2 6.2 0 9-1-3.4-2.6-6-0-9Z" />
    </svg>
  ),
};

const BrandGlyph = ({
  name,
  className,
}: {
  name: GlyphName;
  className?: string;
}) => GLYPHS[name](className);

const ICON_SETS: Record<string, GlyphName[]> = {
  k2: ['bulb', 'panel', 'spot'],
  global: ['bulb', 'panel', 'spot'],
  vanti: ['fan', 'fanBlade'],
};

export const BrandProductsHeader = ({
  brandName,
}: BrandProductsHeaderProps) => {
  const { t } = useLanguage();
  const isK2 = brandName === 'k2';
  const isVanti = brandName === 'vanti';

  const headerTexts = (t as any).brand_pages?.products_page || {
    title: 'Tüm Ürünlerimiz',
    k2_desc:
      'K2 LED SYSTEMS güvencesiyle sunduğumuz tüm aydınlatma ürünlerini aşağıdan inceleyebilirsiniz.',
    vanti_desc: 'VANTİ ile yaşam alanlarınıza değer katan tüm ürünlerimiz.',
    global_desc:
      'Global markasıyla Türkiye geneline sunduğumuz kaliteli ürünlerimizi aşağıdan inceleyebilirsiniz.',
  };

  const title = headerTexts.title;
  const description = isK2
    ? headerTexts.k2_desc
    : isVanti
      ? headerTexts.vanti_desc
      : headerTexts.global_desc;

  const eyebrow = isK2 ? 'K2 LED SYSTEMS' : isVanti ? 'VANTİ' : 'GLOBAL';

  const eyebrowWrap = isK2
    ? 'border-orange-400/30 bg-white/5 text-orange-400'
    : isVanti
      ? 'border-blue-200/80 bg-blue-50/80 text-blue-600'
      : 'border-amber-200/80 bg-amber-50/80 text-amber-700';

  const eyebrowDot = isK2
    ? 'bg-orange-500'
    : isVanti
      ? 'bg-blue-500'
      : 'bg-amber-500';

  const cardGradient = isK2
    ? 'from-orange-500 via-orange-600 to-amber-600'
    : isVanti
      ? 'from-blue-500 via-blue-600 to-cyan-600'
      : 'from-[#ffe375] via-[#FFDA51] to-[#f5c518]';

  const orbA = isK2
    ? 'bg-orange-300/60'
    : isVanti
      ? 'bg-blue-300/60'
      : 'bg-amber-300/60';
  const orbB = isK2
    ? 'bg-amber-200/70'
    : isVanti
      ? 'bg-cyan-200/70'
      : 'bg-yellow-200/70';

  const accentText = isK2
    ? 'text-orange-500'
    : isVanti
      ? 'text-blue-500'
      : 'text-yellow-500';

  const icons = ICON_SETS[brandName] || ICON_SETS.global;

  return (
    <div className="max-w-5xl mx-auto grid lg:grid-cols-[1.15fr_0.85fr] items-center gap-6 mb-6 mt-4">
      <div className="flex flex-col items-center text-center lg:items-start lg:text-left animate-in fade-in slide-in-from-bottom-4 duration-700 ease-out">
        <div
          className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border backdrop-blur-sm mb-4 ${eyebrowWrap}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${eyebrowDot} animate-pulse`}
          />
          <span className="text-xs font-bold tracking-[0.15em] uppercase">
            {eyebrow}
          </span>
        </div>
        <h1
          className={`text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter pb-2 leading-[0.95] ${isK2 ? 'text-white' : 'text-zinc-900'}`}
        >
          {title}
        </h1>
        {description && (
          <p
            className={`mt-3 max-w-xl text-base md:text-lg font-medium leading-relaxed ${isK2 ? 'text-zinc-300' : 'text-zinc-500'}`}
          >
            {description}
          </p>
        )}
      </div>

      <div className="hidden lg:flex relative h-[180px] items-center justify-center animate-in fade-in zoom-in-95 duration-1000 ease-out">
        <div
          className={`absolute w-36 h-36 rounded-full blur-3xl ${orbA} -top-2 -right-4`}
        />
        <div
          className={`absolute w-28 h-28 rounded-full blur-3xl ${orbB} bottom-0 left-4`}
        />

        <div
          className={`relative w-32 h-32 rounded-[1.75rem] bg-gradient-to-br ${cardGradient} shadow-2xl -rotate-6 flex items-center justify-center overflow-hidden`}
        >
          <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle,white_1px,transparent_1px)] [background-size:18px_18px]" />
          <BrandGlyph name={icons[0]} className="w-14 h-14 text-white/90" />
        </div>

        <div className="absolute -bottom-1 right-4 w-20 h-20 rounded-[1.25rem] bg-white shadow-xl rotate-6 border border-zinc-100 flex items-center justify-center">
          <BrandGlyph name={icons[1]} className={`w-8 h-8 ${accentText}`} />
        </div>

        {icons[2] && (
          <div className="absolute -top-3 left-2 w-16 h-16 rounded-[1.1rem] bg-white shadow-xl -rotate-3 border border-zinc-100 flex items-center justify-center">
            <BrandGlyph name={icons[2]} className={`w-6 h-6 ${accentText}`} />
          </div>
        )}
      </div>
    </div>
  );
};

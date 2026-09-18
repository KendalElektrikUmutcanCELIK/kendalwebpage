'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';
import type { Language } from '@/lib/i18n/LanguageProvider';

const ExportMapInner = dynamic(() => import('./ExportMapInner'), {
  ssr: false,
  loading: () => (
    <div className="w-full aspect-[980/480] rounded-[2rem] bg-zinc-500/10 border border-zinc-500/20 animate-pulse" />
  ),
});

interface ExportMapProps {
  eyebrow: string;
  title: string;
  hint: string;
  mobileSummary: string;
  language: Language;
  accent: string;
  theme?: 'dark' | 'light';
  /** Theme for the eyebrow/title card and hint text, relative to the page
   * background they sit on. Defaults to `theme`; pass this separately when
   * the map itself should stay dark but the surrounding page is light. */
  cardTheme?: 'dark' | 'light';
}

export function ExportMap({
  eyebrow,
  title,
  hint,
  mobileSummary,
  language,
  accent,
  theme = 'dark',
  cardTheme,
}: ExportMapProps) {
  const isDark = theme === 'dark';
  const isCardDark = (cardTheme ?? theme) === 'dark';
  const placeholderClass = isDark
    ? 'bg-black/55 backdrop-blur-xl border-white/10'
    : 'bg-white/70 backdrop-blur-xl border-white/50';
  const hintColor = isCardDark ? 'text-white/35' : 'text-zinc-500';
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  // The world map renders full land geometry + a graticule + 40 dashed
  // arcs and was causing scroll jank on mobile (same issue as DealerMap),
  // so mobile gets a plain-text summary instead — gated on matchMedia
  // (not just a CSS hide) so the heavy d3-geo/topojson work and the map's
  // lazy chunk never even load there.
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)');
    setIsMobile(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setIsMobile(e.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    const node = wrapperRef.current;
    if (!node || shouldLoad) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: '400px' },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [shouldLoad, isMobile]);

  const textBgClass = isCardDark
    ? 'bg-black/40 backdrop-blur-xl border-white/10 shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
    : 'bg-white/50 backdrop-blur-xl border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)]';

  return (
    <section className="reveal-text relative z-10 w-full py-12 md:py-16 px-6 md:px-24">
      <div className="flex justify-center mb-10 md:mb-14">
        <div
          className={`text-center max-w-2xl p-8 md:p-10 rounded-[2.5rem] border ${textBgClass}`}
        >
          <h3
            className="font-semibold tracking-widest mb-4 uppercase text-sm md:text-base"
            style={{ color: accent }}
          >
            {eyebrow}
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            {title}
          </h2>
        </div>
      </div>

      {isMobile ? (
        <div className="max-w-2xl mx-auto">
          <p
            className={`text-center text-base leading-relaxed rounded-[2rem] border p-8 ${textBgClass}`}
          >
            {mobileSummary}
          </p>
        </div>
      ) : (
        <>
          <div ref={wrapperRef} className="max-w-[90rem] mx-auto">
            {shouldLoad ? (
              <ExportMapInner
                language={language}
                accent={accent}
                theme={theme}
              />
            ) : (
              <div
                className={`w-full aspect-[980/480] rounded-[2rem] ${placeholderClass}`}
              />
            )}
          </div>

          <p className="text-center mt-6">
            {isCardDark ? (
              <span className={`${hintColor} text-xs md:text-sm`}>{hint}</span>
            ) : (
              <span
                className={`inline-block ${hintColor} text-xs md:text-sm bg-white/70 backdrop-blur-md px-4 py-1.5 rounded-full shadow-sm`}
              >
                {hint}
              </span>
            )}
          </p>
        </>
      )}
    </section>
  );
}

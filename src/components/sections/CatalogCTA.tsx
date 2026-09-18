'use client';

import React, { useRef } from 'react';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export const CatalogCTA = () => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.catalog-content',
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.5,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            start: 'top 85%',
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="catalog"
      ref={containerRef}
      className="w-full relative py-8 md:py-16 px-4 md:px-6 overflow-hidden flex items-center justify-center"
    >
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="absolute w-[800px] h-[450px] md:w-[1250px] md:h-[550px] bg-violet-500/40 blur-[130px] rounded-full translate-x-[10%] -translate-y-1/4 mix-blend-screen" />
      </div>

      <div className="catalog-content relative z-10 w-full max-w-3xl mx-auto text-center p-6 md:p-12 lg:p-14 rounded-[2rem] bg-[var(--global-bg)]/40 backdrop-blur-2xl border border-[var(--global-text)]/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.05)] dark:shadow-[0_8px_32px_0_rgba(0,0,0,0.2)]">
        <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-b from-[var(--global-text)]/[0.03] to-transparent pointer-events-none" />

        <div className="relative flex flex-col items-center">
          <div className="relative w-16 h-20 md:w-20 md:h-24 mb-6">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-[var(--brand-red)] to-rose-700 shadow-lg shadow-[var(--brand-red)]/20 overflow-hidden">
              <div className="absolute top-0 right-0 w-4 h-4 md:w-5 md:h-5 bg-white/25 [clip-path:polygon(100%_0,0_0,100%_100%)]" />
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-1 px-3">
                <span className="text-white font-extrabold text-[10px] md:text-xs tracking-widest">
                  PDF
                </span>
                <span className="w-6 md:w-8 h-[3px] rounded-full bg-white/40" />
                <span className="w-6 md:w-8 h-[3px] rounded-full bg-white/40" />
              </div>
            </div>
          </div>

          <h2 className="text-2xl md:text-3xl lg:text-4xl font-extrabold mb-3 text-[var(--global-text)] tracking-tight">
            {t.catalog.title}
          </h2>

          <p className="text-[var(--global-text)] opacity-70 text-sm md:text-base lg:text-lg mb-8 max-w-2xl mx-auto font-medium">
            {t.catalog.subtitle}
          </p>

          <a
            href={
              language === 'tr'
                ? 'kendal-elektrik-katalog-2026.pdf'
                : 'en-catalog.pdf'
            }
            target="_blank"
            rel="noopener noreferrer"
            title={t.catalog.button}
            aria-label={t.catalog.button}
            className="group inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-[var(--brand-red)] to-rose-600 hover:from-[var(--brand-red-deep)] hover:to-rose-700 text-white font-bold text-sm md:text-base px-7 py-3.5 md:px-9 md:py-4 rounded-2xl transition-all duration-300 shadow-xl shadow-[var(--brand-red)]/20 hover:shadow-[var(--brand-red)]/40 hover:-translate-y-1"
          >
            <svg
              className="w-5 h-5 md:w-6 md:h-6 transition-transform duration-300 group-hover:scale-110"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{t.catalog.button}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

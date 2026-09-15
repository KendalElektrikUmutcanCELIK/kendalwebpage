'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { retailers } from '@/data/retailers';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

const RETAILERS = retailers.map((r) => ({
  name: r.name,
  logo: getAssetPath(`/images/${r.logo}`),
}));

const LOOP_RETAILERS = [...RETAILERS, ...RETAILERS];

export const RetailPresence = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.retail-marquee',
        { opacity: 0, y: 30 },
        {
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.retail-marquee', start: 'top 88%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      id="retail"
      ref={containerRef}
      className="w-full relative pt-36 pb-32 overflow-hidden border-t border-[var(--global-text)]/5"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden -z-10 opacity-50 dark:opacity-70">
        <div className="absolute -left-[20%] top-0 w-[600px] h-[600px] bg-gradient-to-br from-amber-400 to-orange-500 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen" />

        <div className="absolute -right-[20%] bottom-0 w-[700px] h-[700px] bg-gradient-to-bl from-teal-400 to-emerald-600 blur-[150px] rounded-full mix-blend-multiply dark:mix-blend-screen" />

        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/40 blur-[150px] rounded-[100%] mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto text-center px-6">
        <h2 className="text-4xl md:text-6xl font-bold mb-24 text-[var(--global-text)] opacity-90 tracking-tight">
          {(t as any).retail?.title ||
            "Türkiye'nin Önde Gelen Zincir Marketlerinde"}
        </h2>
      </div>

      <div className="retail-marquee k2-marquee-pause relative">
        <div className="k2-marquee-fade-mask overflow-hidden motion-reduce:overflow-x-auto">
          <div
            className="k2-marquee-track flex w-max gap-6 md:gap-8 px-6"
            style={{ animationDuration: '38s' }}
          >
            {LOOP_RETAILERS.map((retailer, idx) => (
              <div
                key={`${retailer.name}-${idx}`}
                aria-hidden={idx >= RETAILERS.length}
                className="shrink-0 w-[220px] md:w-[260px] aspect-video rounded-2xl border border-[var(--global-text)]/10 flex items-center justify-center p-6 transition-all duration-300 bg-white hover:-translate-y-1.5 hover:border-[var(--brand-red)]/60 hover:shadow-[0_16px_36px_-12px_rgba(227,0,15,0.35)] group"
              >
                <div className="relative w-full h-full max-h-[120px] max-w-[200px] flex items-center justify-center">
                  <Image
                    src={retailer.logo}
                    alt={`${retailer.name} - Kendal Elektrik Zincir Marketler`}
                    title={`${retailer.name} - Kendal Elektrik`}
                    fill
                    className="object-contain object-center transition-transform duration-500 group-hover:scale-105"
                    sizes="260px"
                    loading="lazy"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

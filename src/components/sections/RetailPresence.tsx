'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import { retailCategories, retailers } from '@/data/retailers';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export const RetailPresence = () => {
  const { t, language } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.retail-category-block',
        { opacity: 0, scale: 0.95, y: 30 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '#retail', start: 'top 75%' },
        },
      );
    }, containerRef);
    return () => ctx.revert();
  }, []);

  // İlk iki kategoriyi üst yan yana getirmek için ayırıyoruz
  const topCategories = retailCategories.slice(0, 2);
  // Son kategoriyi alta tam genişlikte oturtmak için alıyoruz
  const bottomCategory = retailCategories[2];

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

      <div className="relative z-10 max-w-7xl mx-auto text-center px-6 mb-16">
        <h2 className="text-4xl md:text-6xl font-bold text-[var(--global-text)] opacity-90 tracking-tight">
          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(t as any).retail?.title ||
            "Türkiye'nin Önde Gelen Zincir Marketlerinde"}
        </h2>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6">
        {/* Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* Üst Satır: 2 Kategori Yan Yana (LG ekranda) */}
          {topCategories.map((category) => {
            const categoryRetailers = retailers.filter(
              (r) => r.categoryId === category.id,
            );
            if (categoryRetailers.length === 0) return null;

            return (
              <div
                key={category.id}
                className="retail-category-block flex flex-col bg-[var(--global-text)]/5 dark:bg-white/5 p-6 md:p-8 rounded-3xl border border-[var(--global-text)]/10 backdrop-blur-sm"
              >
                <h3 className="text-xl md:text-2xl font-semibold mb-6 text-[var(--global-text)] opacity-90 text-center">
                  {resolveLocalized(category.name, language)}
                </h3>
                {/* Kategori içindeki marketler 2x2 grid */}
                <div className="grid grid-cols-2 gap-4 h-full">
                  {categoryRetailers.map((retailer) => (
                    <div
                      key={retailer.id}
                      className="aspect-video rounded-xl border border-[var(--global-text)]/10 flex items-center justify-center p-4 transition-all duration-300 bg-white hover:-translate-y-1 hover:border-[var(--brand-red)]/60 hover:shadow-[0_12px_24px_-10px_rgba(227,0,15,0.3)] group"
                    >
                      <div className="relative w-full h-full max-h-[100px] max-w-[180px] flex items-center justify-center">
                        <Image
                          src={getAssetPath(`/images/${retailer.logo}`)}
                          alt={`${retailer.name} - Kendal Elektrik Zincir Marketler`}
                          title={`${retailer.name} - Kendal Elektrik`}
                          fill
                          className={`object-contain object-center transition-transform duration-500 ${
                            ['a101', 'kayserigross'].includes(retailer.id)
                              ? 'scale-[1.4] group-hover:scale-[1.5]'
                              : 'group-hover:scale-105'
                          }`}
                          sizes="(max-width: 768px) 50vw, 25vw"
                          loading="lazy"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}

          {/* Alt Satır: 1 Kategori Tam Genişlikte (LG ekranda) */}
          {bottomCategory &&
            (() => {
              const categoryRetailers = retailers.filter(
                (r) => r.categoryId === bottomCategory.id,
              );
              if (categoryRetailers.length === 0) return null;

              return (
                <div className="retail-category-block lg:col-span-2 flex flex-col bg-[var(--global-text)]/5 dark:bg-white/5 p-6 md:p-8 rounded-3xl border border-[var(--global-text)]/10 backdrop-blur-sm">
                  <h3 className="text-xl md:text-2xl font-semibold mb-6 text-[var(--global-text)] opacity-90 text-center">
                    {bottomCategory.name[language]}
                  </h3>
                  {/* Alt Kategori içindeki marketler 4x1 grid (Mobilde 2x2) */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 h-full">
                    {categoryRetailers.map((retailer) => (
                      <div
                        key={retailer.id}
                        className="aspect-video rounded-xl border border-[var(--global-text)]/10 flex items-center justify-center p-4 transition-all duration-300 bg-white hover:-translate-y-1 hover:border-[var(--brand-red)]/60 hover:shadow-[0_12px_24px_-10px_rgba(227,0,15,0.3)] group"
                      >
                        <div className="relative w-full h-full max-h-[100px] max-w-[180px] flex items-center justify-center">
                          <Image
                            src={getAssetPath(`/images/${retailer.logo}`)}
                            alt={`${retailer.name} - Kendal Elektrik Zincir Marketler`}
                            title={`${retailer.name} - Kendal Elektrik`}
                            fill
                            className={`object-contain object-center transition-transform duration-500 ${
                              ['a101', 'kayserigross'].includes(retailer.id)
                                ? 'scale-[1.4] group-hover:scale-[1.5]'
                                : 'group-hover:scale-105'
                            }`}
                            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 25vw, 20vw"
                            loading="lazy"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })()}
        </div>
      </div>
    </section>
  );
};

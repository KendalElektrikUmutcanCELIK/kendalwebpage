'use client';

import Image from 'next/image';
import React, { useRef } from 'react';
import { getMissionVisionContent } from '@/data/missionVision';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export function MissionVisionClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  const { mission: missionData, vision: visionData } =
    getMissionVisionContent(language);

  const pageTitle =
    language === 'en' ? 'Mission and Vision' : 'Misyon ve Vizyon';

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.mv-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.2,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.mv-blocks', start: 'top 80%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="flex flex-col lg:flex-row min-h-screen bg-[#050505]"
    >
      <div className="w-full lg:w-[55%] flex flex-col justify-center px-8 md:px-16 lg:px-24 py-32 relative z-10">
        <div className="mb-20">
          <h1 className="text-4xl md:text-6xl font-bold mb-4 text-white opacity-90 tracking-tight">
            {pageTitle}
          </h1>
          <div className="h-1.5 w-16 bg-[var(--brand-red)] mt-8 rounded-full"></div>
        </div>

        <div className="mv-blocks flex flex-col gap-8">
          <div className="mv-block group relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 transition-colors duration-500 hover:border-[var(--brand-red)]/40 hover:bg-white/[0.05]">
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-2xl flex items-center justify-center group-hover:bg-[var(--brand-red)] transition-colors duration-500 shadow-[0_0_20px_rgba(255,0,0,0.1)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.3)]">
                <svg
                  className="w-8 h-8 text-[var(--brand-red)] group-hover:text-white transition-colors duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">
                  {missionData.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  {missionData.content}
                </p>
              </div>
            </div>
          </div>

          <div className="mv-block group relative bg-white/[0.03] border border-white/10 rounded-3xl p-8 md:p-10 transition-colors duration-500 hover:border-[var(--brand-red)]/40 hover:bg-white/[0.05]">
            <div className="flex flex-col md:flex-row items-start gap-6 md:gap-8">
              <div className="flex-shrink-0 w-16 h-16 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-2xl flex items-center justify-center group-hover:bg-[var(--brand-red)] transition-colors duration-500 shadow-[0_0_20px_rgba(255,0,0,0.1)] group-hover:shadow-[0_0_25px_rgba(255,0,0,0.3)]">
                <svg
                  className="w-8 h-8 text-[var(--brand-red)] group-hover:text-white transition-colors duration-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">
                  {visionData.title}
                </h2>
                <p className="text-gray-300 leading-relaxed text-lg font-light">
                  {visionData.content}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-[45%] relative min-h-[400px] lg:min-h-screen bg-[#050505]">
        <Image
          src={getAssetPath('/images/factory-bg.webp')}
          alt="Factory Building"
          fill
          className="object-cover object-center"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t lg:bg-gradient-to-r from-[#050505] via-transparent to-transparent opacity-100 w-full h-32 lg:h-full lg:w-48"></div>
      </div>
    </div>
  );
}

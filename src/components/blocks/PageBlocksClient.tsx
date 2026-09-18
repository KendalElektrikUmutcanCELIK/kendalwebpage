'use client';

import { useRef } from 'react';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import type { CustomPage } from '@/data/pages';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export function PageBlocksClient({ page }: { page: CustomPage }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.page-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.page-blocks', start: 'top 80%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white pt-36 pb-24 px-6 min-h-screen"
    >
      <div className="max-w-5xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white opacity-90 mb-4">
            {(page.title && resolveLocalized(page.title, language)) ?? ''}
          </h1>
          <div className="h-1.5 w-16 bg-[var(--brand-red)] rounded-full" />
        </div>
        <div className="page-blocks flex flex-col gap-8">
          {(page.blocks ?? []).map((block) => (
            <BlockRenderer key={block.id} block={block} language={language} />
          ))}
        </div>
      </div>
    </div>
  );
}

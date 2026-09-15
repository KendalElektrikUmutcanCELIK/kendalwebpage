'use client';

import { useRef } from 'react';
import { BlockRenderer } from '@/components/blocks/BlockRenderer';
import { getHomeBlocks, type HomeBlockSlot } from '@/data/homeBlocks';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

/**
 * Anasayfanın sabit bölümleri (HomeClient.tsx) arasına admin panelden opsiyonel
 * blok ekleyebilme mekanizması. Slot boşsa null döner — DOM'a hiç girmez, hiçbir
 * ScrollTrigger/pin hesaplamasını etkilemez (mevcut sabit bölümler bu component
 * eklenmeden önceki hâliyle birebir aynı davranır). Animasyon, "Sayfalar"
 * özelliğindeki PageBlocksClient.tsx ile birebir aynı desen — kendi gsap.context()'i
 * kendi ref'ine bağlı olduğu için diğer bölümlerin animasyonlarıyla çakışmaz.
 */
export function HomeCustomBlocks({ slot }: { slot: HomeBlockSlot }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const { language } = useLanguage();
  const blocks = getHomeBlocks(slot);

  useIsomorphicLayoutEffect(() => {
    if (blocks.length === 0) return;
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
          scrollTrigger: { trigger: '.page-blocks', start: 'top 85%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [blocks.length]);

  if (blocks.length === 0) {
    return null;
  }

  return (
    <div ref={containerRef} className="w-full bg-black py-16 md:py-20 px-6">
      <div className="page-blocks max-w-5xl mx-auto flex flex-col gap-8">
        {blocks.map((block) => (
          <BlockRenderer key={block.id} block={block} language={language} />
        ))}
      </div>
    </div>
  );
}

'use client';

import dynamic from 'next/dynamic';
import React, {
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from 'react';
import { gsap, ScrollTrigger } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

const Globe = dynamic(
  () => import('@/components/engine/Globe').then((mod) => mod.Globe),
  {
    ssr: false,
  },
);

// Below this width the 3D globe is replaced with a static gradient — measured
// at ~39fps with ~23% main-thread time blocked under mobile-class CPU
// throttling; skipping the Canvas entirely brought that to ~58fps.
//
// Unlike the brand pages' 3D scenes (mounted via ssr:false, so they never
// render on the server), GlobalPresence itself is a plain SSR'd client
// component — reading matchMedia in a state initializer would mismatch the
// server-rendered HTML. useSyncExternalStore's getServerSnapshot keeps the
// first client render aligned with the server (always "not mobile"), then
// swaps in the real value right after hydration.
const MOBILE_QUERY = '(max-width: 767px)';

function subscribeToMobileQuery(callback: () => void) {
  const mq = window.matchMedia(MOBILE_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

const getIsMobileSnapshot = () => window.matchMedia(MOBILE_QUERY).matches;
const getIsMobileServerSnapshot = () => false;

// Fixed, curated colors (not the scroll-linked --accent-current var) so the
// look stays predictable regardless of scroll position — same dark+grid+red-glow
// language as app/not-found.tsx, for visual consistency across the site.
const GlobeStaticFallback = () => (
  <div
    className="absolute inset-0"
    style={{
      background: [
        'radial-gradient(50% 38% at 50% 22%, rgba(216,228,255,0.16) 0%, rgba(216,228,255,0.05) 45%, transparent 72%)',
        'radial-gradient(55% 45% at 82% 92%, rgba(227,0,15,0.14) 0%, transparent 68%)',
        'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
        'linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)',
        '#050507',
      ].join(', '),
      backgroundSize: 'auto, auto, 44px 44px, 44px 44px',
    }}
  />
);

export const GlobalPresence = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef(0);
  const isMobile = useSyncExternalStore(
    subscribeToMobileQuery,
    getIsMobileSnapshot,
    getIsMobileServerSnapshot,
  );

  const [shouldMountGlobe, setShouldMountGlobe] = useState(false);

  useEffect(() => {}, []);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      // Sadece masaüstünde (3D Dünya varken) kaydırma yüzdesini hesapla
      if (!isMobile) {
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            scrollProgressRef.current = Math.round(self.progress * 100) / 100;
          },
        });
      }

      gsap.fromTo(
        '.global-reveal',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          stagger: 0.1,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: containerRef.current,
            // Mobilde ekrana girdiği an (top 85%), masaüstünde ise epey kaydırınca (top 15%) başlasın
            start: isMobile ? 'top 85%' : 'top 15%',
            end: 'center center',
            // Mobilde kaydırmaya bağlı (scrub) olmasın, normal animasyon gibi kendi oynasın
            scrub: isMobile ? false : 0.8,
          },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile]);

  return (
    <section
      id="global"
      ref={containerRef}
      className="w-full bg-transparent md:h-[130vh] relative"
    >
      <div className="md:sticky md:top-0 w-full min-h-[50vh] md:h-screen overflow-hidden flex items-center justify-center py-20 md:py-0">
        <div className="absolute inset-0 z-0 opacity-70">
          {isMobile ? (
            <GlobeStaticFallback />
          ) : (
            <Globe scrollProgressRef={scrollProgressRef} />
          )}
        </div>

        <div
          className="absolute top-[-20vh] left-1/2 -translate-x-1/2 w-[150vw] h-[150vh] pointer-events-none opacity-15 mix-blend-overlay z-10"
          style={{
            background:
              'conic-gradient(from 150deg at 50% 0%, transparent 0deg, rgba(255,255,255,1) 30deg, transparent 60deg)',
          }}
        />

        <div className="absolute inset-0 z-10 bg-black/30 pointer-events-none" />

        <div
          ref={textRef}
          className="relative z-20 max-w-4xl mx-auto flex flex-col items-center text-center px-6"
        >
          <h2 className="global-reveal text-4xl md:text-5xl lg:text-7xl font-bold mb-6 text-[var(--global-text)] tracking-tight drop-shadow-2xl">
            {t.global.title}
          </h2>
          <div className="global-reveal w-24 h-1 bg-[var(--brand-red)] mb-8 rounded-full shadow-[0_0_15px_rgba(227,0,15,0.5)]" />
          <div className="global-reveal text-xl md:text-3xl font-medium text-[var(--global-text)] opacity-90 mb-8 leading-relaxed drop-shadow-lg">
            {t.global.subtitle}
          </div>
          <p className="global-reveal text-[var(--global-text)] opacity-80 leading-relaxed text-lg md:text-xl font-light max-w-3xl drop-shadow-md">
            {t.global.text}
          </p>
        </div>
      </div>
    </section>
  );
};

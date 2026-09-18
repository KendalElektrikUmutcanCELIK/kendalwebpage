'use client';

import Image from 'next/image';
import { useRef } from 'react';
import { getAssetPath } from '@/lib/basePath';
import { gsap, ScrollTrigger } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

const MOBILE_QUERY = '(max-width: 767px)';

/** Hero section component with scroll-triggered lighting and text reveal animations. */
export const Hero = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const sideContentRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();
  const lastAppliedProgress = useRef(-1);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      if (window.matchMedia(MOBILE_QUERY).matches) {
        if (overlayRef.current) overlayRef.current.style.opacity = '0';
        gsap.fromTo(
          [contentRef.current, sideContentRef.current],
          { opacity: 0, y: 20 },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            delay: 0.2,
            stagger: 0.1,
          },
        );
        return;
      }

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: () =>
          `+=${(containerRef.current?.offsetHeight ?? 0) - window.innerHeight}`,
        scrub: true,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const progress = Math.round(self.progress * 200) / 200;
          if (progress === lastAppliedProgress.current) return;
          lastAppliedProgress.current = progress;

          const lightProgress = Math.min(1, progress / 0.5);
          const holeSize = lightProgress * 150;
          const edgeSize = holeSize + 11;

          if (overlayRef.current) {
            const maskString = `radial-gradient(circle at 24% 55%, transparent ${holeSize}%, black ${edgeSize}%)`;
            overlayRef.current.style.webkitMaskImage = maskString;
            overlayRef.current.style.maskImage = maskString;
          }

          const textProgress = Math.min(1, Math.max(0, (progress - 0.1) / 0.5));
          const yOffset = ((1 - textProgress) * 30).toFixed(1);
          if (contentRef.current) {
            contentRef.current.style.opacity = textProgress.toFixed(3);
            contentRef.current.style.transform = `translateY(${yOffset}px)`;
          }
          if (sideContentRef.current) {
            sideContentRef.current.style.opacity = textProgress.toFixed(3);
            sideContentRef.current.style.transform = `translateY(${yOffset}px)`;
          }
        },
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return (
    <section
      ref={containerRef}
      className="hero-cv-exclude relative h-auto md:h-[150vh] w-full bg-black overflow-x-hidden md:overflow-visible"
    >
      <div className="relative md:sticky md:top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-start pt-20 md:pt-[12vh] [@media(max-height:820px)]:md:pt-[8vh]">
        {/* MASAÜSTÜ GÖRSELİ */}
        <Image
          src={getAssetPath('/images/yeni-foto.png')}
          alt="Kendal Elektrik Desk"
          fill
          sizes="100vw"
          priority
          className="hidden md:block object-cover object-top absolute inset-0 z-0 md:scale-[1.05] md:origin-top"
        />

        {/* MOBİL GÖRSELİ VE LOGO (Sıfır Animasyon, Maksimum Performans) */}
        <div className="md:hidden absolute inset-0 z-0">
          <Image
            src={getAssetPath('/images/mobile-hero-bg.png')}
            alt="K2 Mobile Background"
            fill
            sizes="100vw"
            priority
            className="object-cover object-center absolute inset-0 z-0"
          />

          {/* Alt Kısım Karartması (Yazıların Okunması İçin) */}
          <div className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-black via-black/80 to-transparent z-[5]" />
        </div>

        <div
          ref={overlayRef}
          className="hidden md:block absolute inset-0 z-[3]"
          style={{
            backgroundColor: 'rgba(0, 0, 0, 0.95)',
            WebkitMaskImage:
              'radial-gradient(circle at 24% 55%, transparent 0%, black 11%)',
            maskImage:
              'radial-gradient(circle at 24% 55%, transparent 0%, black 11%)',
          }}
        />

        <div className="absolute z-10 w-[90vw] md:w-auto max-w-[400px] left-1/2 md:left-auto top-[42%] md:top-auto -translate-x-1/2 md:translate-x-0 right-auto md:right-12 lg:right-24 bottom-auto md:bottom-[15%]">
          <div
            ref={sideContentRef}
            className="flex flex-col items-center md:items-end text-center md:text-right opacity-100 md:opacity-0 md:pointer-events-none"
          >
            <div className="mb-4 inline-block rounded-full border border-white/20 md:border-white/25 bg-white/5 md:bg-black/60 px-6 py-2 text-sm md:text-base font-medium md:font-semibold tracking-widest backdrop-blur-md md:backdrop-blur-xl shadow-[0_0_15px_rgba(255,255,255,0.05)] md:shadow-[0_0_20px_rgba(0,0,0,0.9)] text-white/90">
              {t.hero.badge}
            </div>
            <p className="text-base sm:text-lg md:text-xl text-white/80 md:text-white/90 font-light md:font-medium tracking-wide [text-shadow:_0_2px_10px_rgba(255,255,255,0.15)] md:[text-shadow:_0_2px_15px_rgba(0,0,0,1)] bg-transparent md:bg-black/40 backdrop-blur-none md:backdrop-blur-md p-0 md:p-4 rounded-none md:rounded-2xl border-none md:border md:border-white/10">
              {t.hero.subtitle}
            </p>
          </div>
        </div>

        <div className="absolute z-10 left-1/2 top-[22%] md:top-[38%] transform -translate-x-1/2 -translate-y-1/2 w-[90vw] md:w-auto md:max-w-[900px]">
          <div
            ref={contentRef}
            className="relative flex flex-col items-center text-center opacity-100 md:opacity-0 md:pointer-events-none py-6 px-8 md:py-8 md:px-12 w-full"
          >
            <div className="hidden md:block absolute inset-0 bg-black/20 backdrop-blur-[12px] rounded-[3rem] border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)] -z-10" />

            <h1 className="text-[clamp(1.8rem,-3.1rem_+_25.5vw,3rem)] sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tighter leading-tight text-white [text-shadow:_0_4px_30px_rgba(0,0,0,0.9),_0_2px_10px_rgba(0,0,0,1)]">
              {t.hero.title_part1} <br />
              <span className="">{t.hero.title_part2}</span>
            </h1>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 w-full h-40 md:h-56 z-[5] bg-gradient-to-b from-transparent to-black pointer-events-none" />
      </div>
    </section>
  );
};

'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useRef } from 'react';
import { getAssetPath, isGithubPagesBuild } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

const brands = [
  {
    name: 'K2',
    logo: '/images/brands/k2-logo.svg',
    href:
      process.env.NODE_ENV !== 'production'
        ? 'http://k2.localhost:3000'
        : isGithubPagesBuild
          ? '/brand/k2'
          : 'https://k2.kendalelektrik.com',
    glow: '#f97316',
  },
  {
    name: 'Vanti',
    logo: '/images/brands/vanti-logo.svg',
    href:
      process.env.NODE_ENV !== 'production'
        ? 'http://vanti.localhost:3000'
        : isGithubPagesBuild
          ? '/brand/vanti'
          : 'https://vanti.kendalelektrik.com',
    glow: '#3b82f6',
  },
  {
    name: 'Global',
    logo: '/images/brands/global-logo.svg',
    href:
      process.env.NODE_ENV !== 'production'
        ? 'http://global.localhost:3000'
        : isGithubPagesBuild
          ? '/brand/global'
          : 'https://global.kendalelektrik.com',
    glow: '#facc15',
  },
];

export const OurBrands = () => {
  const { language } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
        },
      );

      gsap.fromTo(
        cardsRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.4,
          stagger: 0.08,
          ease: 'power3.out',
          scrollTrigger: { trigger: containerRef.current, start: 'top 85%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative w-full py-12 md:py-16 px-6 bg-black overflow-hidden"
    >
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1400px] h-[450px] bg-white/30 rounded-full blur-[140px] mix-blend-screen pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.4] pointer-events-none"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(255,255,255,0.08) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
          maskImage:
            'radial-gradient(ellipse 60% 50% at 50% 0%, black 40%, transparent 100%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto z-10">
        <div ref={headerRef} className="text-center mb-14">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white mb-5">
            {language === 'tr' ? 'Markalarımız' : 'Our Brands'}
          </h2>
          <p className="text-base md:text-lg text-white/60 max-w-2xl mx-auto font-medium leading-relaxed">
            {language === 'tr'
              ? 'Sektörün öncü markalarıyla hayatınızı aydınlatıyor ve ferahlatıyoruz.'
              : 'Illuminating and refreshing your life with industry-leading brands.'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
          {brands.map((brand, idx) => (
            <div
              key={brand.name}
              className="group relative"
              style={{ '--glow': brand.glow } as CSSProperties}
            >
              <div
                className="absolute -inset-2 rounded-2xl opacity-0 blur-xl transition-opacity duration-300 ease-out group-hover:opacity-60 pointer-events-none"
                style={{ background: 'var(--glow)' }}
              />
              <Link
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                href={brand.href}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center justify-center h-32 md:h-36 bg-white rounded-2xl border-2 border-zinc-200/80 shadow-sm overflow-hidden transition-all duration-300 ease-out hover:-translate-y-1.5 hover:border-[var(--glow)] hover:shadow-[0_0_45px_-8px_var(--glow)]"
              >
                <div className="w-full h-full p-4 md:p-5 transition-transform duration-300 ease-out group-hover:scale-105">
                  <div className="relative w-full h-full">
                    <Image
                      src={getAssetPath(brand.logo)}
                      alt={brand.name}
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

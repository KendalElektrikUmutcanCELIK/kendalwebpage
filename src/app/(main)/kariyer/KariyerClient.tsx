'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRef } from 'react';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export function KariyerClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  const career = (t as any).career;

  // Ana sayfadaki CompanyStats verileriyle aynı kaynak (yeni içerik değil, mevcut rakamların kariyer bağlamında tekrarı).
  const CAREER_STATS = [
    { value: '29', label: career?.stats?.experience_label || 'Yıllık Tecrübe' },
    { value: '350+', label: career?.stats?.employment_label || 'İstihdam' },
  ];

  const links = [
    {
      href: '/kariyer/insan-kaynaklari-politikamiz',
      title: career?.links?.hr_policy_title || 'İnsan Kaynakları Politikamız',
      desc:
        career?.links?.hr_policy_desc ||
        'Kurumumuzun vizyonu, misyonu ve insan kaynakları stratejileri.',
    },
    {
      href: '/kariyer/temel-ilkelerimiz',
      title: career?.links?.principles_title || 'Temel İlkelerimiz',
      desc:
        career?.links?.principles_desc ||
        'Kendal Elektrik ailesi olarak benimsediğimiz temel insan kaynakları prensipleri.',
    },
    {
      href: '/kariyer/insan-haklari-ve-calisan-haklari-politikasi',
      title:
        career?.links?.human_rights_title ||
        'İnsan Hakları ve Çalışan Hakları Politikası',
      desc:
        career?.links?.human_rights_desc ||
        'Evrensel değerlere, eşitliğe ve işçi haklarına verdiğimiz önem.',
    },
  ];

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
      tl.fromTo(
        '.kariyer-hero-text > *',
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
      )
        .fromTo(
          '.kariyer-hero-image',
          { opacity: 0, scale: 0.96 },
          { opacity: 1, scale: 1, duration: 1 },
          '<',
        )
        .fromTo(
          '.kariyer-card',
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
          '-=0.5',
        );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen bg-[#1c1214] text-white flex flex-col justify-center pt-28 pb-16 px-6 overflow-hidden"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1600px] h-[1200px] bg-[var(--brand-red)]/25 blur-[180px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-[90rem] mx-auto w-full">
        {/* Hero: foto + başlık */}
        <div className="flex flex-col md:flex-row md:justify-center md:items-center gap-8 md:gap-16 mb-12 md:mb-16">
          <div className="kariyer-hero-text order-2 md:order-1 text-center md:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-white tracking-tight">
              {career?.title || 'Kariyer'}
            </h1>
            <div className="h-1.5 w-16 bg-[var(--brand-red)] rounded-full mx-auto md:mx-0 mb-6" />
            <p className="text-white/70 text-lg mb-8">
              {career?.subtitle || 'Kendal Elektrik Ailesine Katılın'}
            </p>

            <div className="flex justify-center md:justify-start gap-5 md:gap-6">
              {CAREER_STATS.map((stat) => (
                <div
                  key={stat.label}
                  className="bg-white/[0.18] backdrop-blur-xl border border-white/30 rounded-2xl px-8 py-6 min-w-[160px] shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.25] hover:border-white/50 hover:-translate-y-1 group"
                >
                  <div className="text-4xl md:text-5xl font-black text-white tracking-tight">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-white/60 uppercase font-semibold tracking-wide mt-2">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div
            className="kariyer-hero-image group order-1 md:order-2 relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
            style={{ maxWidth: 520, aspectRatio: '3 / 2' }}
          >
            <Image
              src={getAssetPath('/images/kariyer-arge.webp')}
              alt="Kendal Elektrik Ar-Ge ekibi"
              fill
              sizes="(max-width: 768px) 100vw, 520px"
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              quality={80}
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Politika sayfaları */}
        <div className="grid gap-6 md:grid-cols-3">
          {links.map((link) => (
            <Link
              href={link.href}
              key={link.href}
              className="kariyer-card group block h-full cursor-pointer"
            >
              <div className="h-full bg-white/[0.18] backdrop-blur-xl p-8 rounded-3xl border border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.25),0_10px_30px_rgba(0,0,0,0.3)] transition-all duration-500 hover:bg-white/[0.25] hover:border-white/50 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(0,0,0,0.35)]">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-lg font-bold text-white tracking-tight">
                    {link.title}
                  </h2>
                  <svg
                    className="w-5 h-5 shrink-0 mt-0.5 text-white/55 transition-all duration-300 group-hover:text-[var(--brand-red)] group-hover:translate-x-1"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </div>
                <p className="text-white/70 font-medium text-sm leading-relaxed">
                  {link.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

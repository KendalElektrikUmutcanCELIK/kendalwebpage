'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { ExportMap } from '@/components/brand/shared/ExportMap';
import type { Product } from '@/data/products';

import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { VantiPreloader } from './VantiPreloader';
import { VantiProductFamilies } from './VantiProductFamilies';
import { VantiVideoShowcase } from './VantiVideoShowcase';

const VantiScene = dynamic(
  () => import('./VantiScene').then((mod) => mod.VantiScene),
  {
    ssr: false,
    loading: () => (
      <div className="fixed inset-0 z-0 pointer-events-none w-full h-screen bg-sky-50" />
    ),
  },
);

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

function WindIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8h11.5a2.5 2.5 0 1 0-2.5-2.5" />
      <path d="M3 12h15.5a2.5 2.5 0 1 1-2.5 2.5" />
      <path d="M3 16h9.5a2.5 2.5 0 1 1-2.5 2.5" />
    </svg>
  );
}

function FanIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M10.827 16.379a6.082 6.082 0 0 1-8.618-7.002l5.412 1.45a6.082 6.082 0 0 1 7.002-8.618l-1.45 5.412a6.082 6.082 0 0 1 8.618 7.002l-5.412-1.45a6.082 6.082 0 0 1-7.002 8.618l1.45-5.412Z" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function LeafIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M11 20A7 7 0 0 1 4 13c0-5 5-10 12-10 0 7-5 12-10 12" />
      <path d="M4 21c3-3 5-5 8-8" />
    </svg>
  );
}

interface VantiCreativePageProps {
  allProducts: Product[];
}

const VANTI_ACCENT = '#0f766e';
const VANTI_VIDEO_IDS = [
  'hFYbw1fmjdE',
  'gRdC236jqlI',
  'BvZSnBJnH2U',
  '5AZFZNcOf_k',
  'Os5nqJq0x0U',
  'zZG5_CxFLBg',
  'jddPviKiuvQ',
  '2V-c5YGcldI',
];

// Video id -> product detail path (category/slug)
const VANTI_VIDEO_PRODUCT_PATHS: Record<string, string> = {
  hFYbw1fmjdE: 'vantilatorler/kcf295-masaustu-fan',
  gRdC236jqlI: 'vantilatorler/kcf276-130w-standing-wall-fan',
  BvZSnBJnH2U: 'vantilatorler/kcf273-turbo-fan-ayakli-vantilator',
  '5AZFZNcOf_k': 'vantilatorler/kcf700-sarjli-el-vantilatoru',
  Os5nqJq0x0U: 'vantilatorler/kcf272l-ayakli-vantilat-r-50w',
  zZG5_CxFLBg: 'vantilatorler/kcf279k-dekoratif-tavan-vantilatoru',
  jddPviKiuvQ: 'vantilatorler/kcf281k-dekoratif-tavan-vantilatoru',
  '2V-c5YGcldI': 'vantilatorler/kcf280k-ahsap-tavan-vantilatoru',
};

const VANTI_URUNLER_BASE = getBrandUrunlerHref('vanti');

const VANTI_VIDEO_PRODUCTS: Record<string, string> = Object.fromEntries(
  Object.entries(VANTI_VIDEO_PRODUCT_PATHS).map(([id, path]) => [
    id,
    `${VANTI_URUNLER_BASE}/${path}`,
  ]),
);

const translations = {
  tr: {
    heroSub: 'SERİNLİĞİN VE KONFORUN TEK ADRESİ',
    explore: 'Ferahlığı Hisset',
    whyEyebrow: 'Neden Vanti?',
    whyHeading: "Türkiye'nin güvendiği serinlik markası.",
    whySubtext:
      'Kendal Elektrik güvencesiyle üretilen Vanti, kalitesi ve müşteri memnuniyetiyle öne çıkıyor.',
    sec1Title: 'Doğal Esinti',
    sec1Text:
      'Evinizin her köşesinde doğanın tazeleyici esintisini hissetmeniz için en sessiz ve güçlü vantilatörler tasarlıyoruz.',
    sec2Title: 'Akıllı Soğutma',
    sec2Text:
      'Geniş açılı salınım ve aerodinamik pervane yapısıyla havayı homojen dağıtır, anında ferahlık sağlar.',
    familiesLabel: 'Ürün Ailelerimiz',
    familiesTitle: 'İhtiyacınıza Uygun Vantilatörü Bulun',
    popularLabel: 'Ürün Kategorileri',
    popularTitle: 'Kategorilerimiz',
    categoryCountLabel: 'Ürün',
    viewAllLabel: 'Tüm Kategoriler',
    exportEyebrow: 'Global Erişim',
    exportTitle: "Vanti'nin serinliği, Türkiye'den dünyaya ihraç ediliyor.",
    exportHint: 'Haritadaki noktalara tıklayın.',
    videoLabel: 'Yakından Bakış',
    videoTitle: 'Ürün Tanıtım Videolarımız',
    videoSubtitle: 'Vanti ürünlerini gerçek kullanımda izleyin.',
    videoPlayLabel: 'Videoyu oynat',
    videoCloseLabel: 'Videoyu kapat',
    videoCtaLabel: 'Ürüne Git',
    trustStats: [
      {
        value: 'En Çok Tercih Edilenlerden',
        label: "Türkiye'nin Vantilatör Markaları Arasında",
      },
      {
        numericTarget: 9.4,
        suffix: ' / 10',
        label: 'Ortalama Müşteri Memnuniyeti',
      },
      { value: "%0.5'in Altında", label: 'İade Oranı' },
    ],
    sec3Title: 'Enerji Tasarrufu',
    sec3Text:
      'Düşük enerji tüketimiyle yüksek performans sunan çevre dostu Vanti serisi ile yazı serin geçirin.',
    catalogBtn: 'Ürünleri İncele',
  },
  en: {
    heroSub: 'THE ONLY ADDRESS OF COOLNESS AND COMFORT',
    explore: 'Feel the Freshness',
    whyEyebrow: 'Why Vanti?',
    whyHeading: 'The cooling brand Turkey trusts.',
    whySubtext:
      "Backed by Kendal Elektrik's assurance, Vanti stands out for its quality and customer satisfaction.",
    sec1Title: 'Natural Breeze',
    sec1Text:
      'We design the quietest and most powerful fans so you can feel the refreshing breeze of nature in every corner of your home.',
    sec2Title: 'Smart Cooling',
    sec2Text:
      'With wide-angle oscillation and aerodynamic blade structure, it distributes air evenly, providing instant freshness.',
    familiesLabel: 'Our Product Families',
    familiesTitle: 'Find the Right Fan for Your Space',
    popularLabel: 'Product Categories',
    popularTitle: 'Our Categories',
    categoryCountLabel: 'Products',
    viewAllLabel: 'All Categories',
    exportEyebrow: 'Global Reach',
    exportTitle: "Vanti's cooling, exported from Turkey to the world.",
    exportHint: 'Click a point on the map.',
    videoLabel: 'Up Close',
    videoTitle: 'Our Product Demo Videos',
    videoSubtitle: 'See Vanti products in real use.',
    videoPlayLabel: 'Play video',
    videoCloseLabel: 'Close video',
    videoCtaLabel: 'View Product',
    trustStats: [
      { value: 'A Most Preferred Choice', label: "Among Turkey's Fan Brands" },
      {
        numericTarget: 9.4,
        suffix: ' / 10',
        label: 'Average Customer Satisfaction',
      },
      { value: 'Under 0.5%', label: 'Return Rate' },
    ],
    sec3Title: 'Energy Saving',
    sec3Text:
      'Spend the summer cool with the eco-friendly Vanti series that offers high performance with low energy consumption.',
    catalogBtn: 'Explore Products',
  },
};

export function VantiCreativePage({ allProducts }: VantiCreativePageProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const statNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const { language } = useLanguage();
  const t = translations[language as keyof typeof translations];
  const [sceneReady, setSceneReady] = useState(false);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to([heroTextRef.current, scrollHintRef.current], {
        opacity: 0,
        y: -100,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '500px top',
          scrub: 1,
        },
      });

      t.trustStats.forEach((stat, i) => {
        if (!('numericTarget' in stat)) return;
        const el = statNumberRefs.current[i];
        if (!el) return;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: stat.numericTarget,
          duration: 2,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: el,
            start: 'top 90%',
          },
          onUpdate: () => {
            el.textContent = obj.val.toFixed(1) + stat.suffix;
          },
        });
      });

      const textBlocks = gsap.utils.toArray<HTMLElement>('.reveal-text');

      textBlocks.forEach((block) => {
        gsap.fromTo(
          block,
          { opacity: 0, y: 100, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.5,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: block,
              start: 'top 95%',
              end: 'top 65%',
              scrub: 1,
            },
          },
        );
      });
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-sky-50 text-teal-900 selection:bg-teal-600 selection:text-white overflow-hidden"
      style={{ '--page-bg': '#f0f9ff' } as React.CSSProperties}
    >
      <VantiPreloader ready={sceneReady} />

      <VantiScene onReady={() => setSceneReady(true)} />

      <section className="relative z-10 w-full h-[100svh] min-h-[600px] md:h-screen md:min-h-[800px] flex flex-col items-center justify-center pointer-events-none px-4">
        <div
          ref={heroTextRef}
          className="text-center inline-flex flex-col items-center p-10 md:p-16 rounded-[4rem] bg-white/40 backdrop-blur-2xl border border-white/60 shadow-[0_8px_32px_rgba(0,0,0,0.1)] -mt-4 mb-10 md:mb-0"
        >
          <img
            src={getAssetPath('/images/brands/vanti-logo.svg')}
            alt="Vanti Logo"
            className="h-28 md:h-40 lg:h-48 mx-auto mb-2 opacity-90 drop-shadow-md"
          />
          <span className="text-xs md:text-lg font-bold tracking-[0.5em] text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-cyan-600 block mt-6">
            {t.heroSub}
          </span>
        </div>
        <div
          ref={scrollHintRef}
          className="absolute bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <p className="whitespace-nowrap text-xs tracking-[0.2em] sm:tracking-[0.3em] uppercase mb-4 md:mb-6 font-bold text-white bg-blue-600/90 backdrop-blur-md px-4 sm:px-6 py-2.5 rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30">
            {t.explore}
          </p>
          <div className="w-[1px] h-12 md:h-32 bg-teal-900/30"></div>
        </div>
      </section>

      <section className="relative z-10 w-full px-6 md:px-16 lg:px-24 -mt-6 md:-mt-10 pb-12 md:pb-16">
        <div className="reveal-text max-w-6xl mx-auto bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[3rem] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-max items-center gap-2 px-4 py-1.5 rounded-full border border-teal-700/20 bg-teal-700/5 text-xs md:text-sm font-bold tracking-widest uppercase text-teal-700 mb-6">
              {t.whyEyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-teal-950 mb-6">
              {t.whyHeading}
            </h2>
            <p className="text-base md:text-lg text-teal-950/70 leading-relaxed max-w-md">
              {t.whySubtext}
            </p>
          </div>

          <div className="flex flex-col gap-10 pl-8 md:pl-10 relative">
            <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-teal-700/15 rounded-full"></div>
            {t.trustStats.map((stat, i) => (
              <div key={stat.label} className="relative">
                <div className="absolute -left-[41px] md:-left-[45px] top-1.5 w-4 h-4 bg-white border-2 border-teal-700 rounded-full shadow-sm"></div>
                <div className="text-2xl md:text-4xl font-bold text-teal-800 leading-tight mb-1.5">
                  {'numericTarget' in stat ? (
                    <span
                      ref={(el) => {
                        statNumberRefs.current[i] = el;
                      }}
                    >
                      0{stat.suffix}
                    </span>
                  ) : (
                    stat.value
                  )}
                </div>
                <div className="text-sm md:text-lg text-teal-950/70">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full px-6 md:px-16 lg:px-24 py-12 md:py-16">
        <div className="reveal-text max-w-6xl mx-auto bg-white/85 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[3rem] p-8 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-teal-900/10">
          {[
            { title: t.sec1Title, text: t.sec1Text, icon: WindIcon },
            { title: t.sec2Title, text: t.sec2Text, icon: FanIcon },
            { title: t.sec3Title, text: t.sec3Text, icon: LeafIcon },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-4 ${i > 0 ? 'md:pl-10' : ''} ${i < 2 ? 'md:pr-10' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-teal-700/10 flex items-center justify-center text-teal-700">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-medium tracking-[0.2em] uppercase text-sm md:text-base text-teal-700">
                  {item.title}
                </h3>
                <p className="text-teal-950/70 text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <VantiProductFamilies
        label={t.familiesLabel}
        title={t.familiesTitle}
        allProducts={allProducts}
        language={language}
      />

      <ExportMap
        eyebrow={t.exportEyebrow}
        title={t.exportTitle}
        hint={t.exportHint}
        language={language}
        accent={VANTI_ACCENT}
        cardTheme="light"
      />

      <VantiVideoShowcase
        videoIds={VANTI_VIDEO_IDS}
        label={t.videoLabel}
        title={t.videoTitle}
        subtitle={t.videoSubtitle}
        playLabel={t.videoPlayLabel}
        closeLabel={t.videoCloseLabel}
        ctaLabel={t.videoCtaLabel}
        productLinks={VANTI_VIDEO_PRODUCTS}
        productFallbackHref={VANTI_URUNLER_BASE}
      />

      <section className="relative z-10 w-full flex flex-col items-center justify-center px-6 pt-0 pb-12 md:pb-16 text-center">
        <Link
          href={VANTI_URUNLER_BASE}
          className="inline-flex items-center justify-center px-14 py-6 bg-teal-800 text-white font-medium tracking-[0.2em] uppercase rounded-full shadow-[0_8px_24px_rgba(15,118,110,0.35)] hover:bg-teal-900 hover:shadow-[0_10px_28px_rgba(15,118,110,0.45)] transition-all duration-300"
        >
          {t.catalogBtn}
        </Link>
      </section>
    </div>
  );
}

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { CategoryShowcase } from '@/components/brand/shared/CategoryShowcase';
import { ExportMap } from '@/components/brand/shared/ExportMap';
import type { ProductListItem } from '@/data/products';
import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { K2Preloader } from './K2Preloader';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const K2_ACCENT = '#f97316';

function MountainIcon({ className }: { className?: string }) {
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
      <path d="m8 3 4.5 9L17 6l5 14H2L8 3z" />
    </svg>
  );
}

function LayersIcon({ className }: { className?: string }) {
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
      <path d="m12 2 9 5-9 5-9-5 9-5z" />
      <path d="m3 12 9 5 9-5" />
    </svg>
  );
}

function ShieldIcon({ className }: { className?: string }) {
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
      <path d="M12 2 4 5v6c0 5.2 3.4 9.4 8 11 4.6-1.6 8-5.8 8-11V5l-8-3z" />
    </svg>
  );
}

interface K2CreativePageProps {
  allProducts: ProductListItem[];
}

const translations = {
  tr: {
    heroSub: 'AYDINLATMANIN ZİRVESİ',
    explore: 'Hikayeyi Keşfet',
    whyEyebrow: 'Neden K2?',
    whyHeading: 'Karanlığı aydınlatan güvenilir marka.',
    whySubtext:
      'Kendal Elektrik güvencesiyle üretilen K2, profesyonel LED teknolojisi ve dayanıklılığıyla fark yaratıyor.',
    trustStats: [
      {
        value: 'Sektörün Zirvesindeki Markalardan',
        label: 'Profesyonel LED Aydınlatmada',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: 'Ortalama Müşteri Memnuniyeti',
      },
      { value: "%0.5'in Altında", label: 'İade Oranı' },
    ],
    sec1Title: 'Zirve',
    sec1Text:
      "İsmini, dağcıların zirvesine ulaşması en zor ve prestijli dağlardan biri olan K2'den alan markamız, 'Karanlığı Aydınlatıyoruz' vizyonuyla hareket etmektedir.",
    sec2Title: 'Geniş Yelpaze',
    sec2Text:
      "Kendal Elektrik'in profesyonel LED aydınlatma sistemleri, enerji verimliliği odaklı çözümleri ve dekoratif ürünlerini içeren geniş yelpazesini temsil eder. K2, Türkiye'nin en prestijli ve güvenilir aydınlatma markalarından biri olarak sektöre öncülük ediyor.",
    popularLabel: 'Ürün Kategorileri',
    popularTitle: 'Kategorilerimiz',
    categoryCountLabel: 'Ürün',
    viewAllLabel: 'Tüm Kategoriler',
    exportEyebrow: 'Global Erişim',
    exportTitle: "K2'nin ışığı sınır tanımıyor.",
    exportHint: 'Haritadaki noktalara tıklayın.',
    sec3Title: 'Zorlu Koşullar',
    sec3Text:
      'Spot, LED panel, projektör, solar armatür ve magnet sistemlerden dekoratif aydınlatmaya uzanan geniş ürün gamıyla K2; ev ve ofis aydınlatmasında yenilikçi LED çözümleriyle enerjiden tasarruf edin, geleceğe yatırım yapın.',
    catalogBtn: 'Ürünleri İncele',
  },
  en: {
    heroSub: 'WE ILLUMINATE THE DARKNESS',
    explore: 'Discover the Story',
    whyEyebrow: 'Why K2?',
    whyHeading: 'The trusted brand that lights up the dark.',
    whySubtext:
      "Backed by Kendal Elektrik's assurance, K2 stands out with professional LED technology and durability.",
    trustStats: [
      {
        value: 'A Peak Name in the Industry',
        label: 'In Professional LED Lighting',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: 'Average Customer Satisfaction',
      },
      { value: 'Under 0.5%', label: 'Return Rate' },
    ],
    sec1Title: 'The Peak',
    sec1Text:
      "Taking its name from K2, one of the most difficult and prestigious mountains for climbers to conquer, our brand operates with the vision to 'Illuminate the Darkness'.",
    sec2Title: 'Wide Range',
    sec2Text:
      "Represents the wide range of Kendal Elektrik's professional LED lighting systems, energy efficiency-oriented solutions, and decorative products. K2 leads the industry as one of Turkey's most prestigious and trusted lighting brands.",
    popularLabel: 'Product Categories',
    popularTitle: 'Our Categories',
    categoryCountLabel: 'Products',
    viewAllLabel: 'All Categories',
    exportEyebrow: 'Global Reach',
    exportTitle: "K2's light knows no borders.",
    exportHint: 'Click a point on the map.',
    sec3Title: 'Extreme Conditions',
    sec3Text:
      "From spotlights, LED panels and floodlights to solar fixtures, magnet systems and decorative lighting, K2's extensive range brings innovative LED solutions to home and office lighting — save energy, invest in the future.",
    catalogBtn: 'Explore Products',
  },
  ar: {
    heroSub: 'قمة الإضاءة',
    explore: 'اكتشف القصة',
    whyEyebrow: 'لماذا K2؟',
    whyHeading: 'العلامة الموثوقة التي تضيء الظلام.',
    whySubtext:
      'بضمان كندال إلكتريك، تتميز K2 بتقنية LED الاحترافية ومتانتها.',
    trustStats: [
      {
        value: 'من أبرز العلامات في القطاع',
        label: 'في مجال إضاءة LED الاحترافية',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: 'متوسط رضا العملاء',
      },
      { value: 'أقل من 0.5%', label: 'نسبة الإرجاع' },
    ],
    sec1Title: 'القمة',
    sec1Text:
      "تستمد علامتنا اسمها من جبل K2، أحد أصعب الجبال وأكثرها شهرة لدى متسلقي الجبال، وتعمل برؤية 'إضاءة الظلام'.",
    sec2Title: 'تشكيلة واسعة',
    sec2Text:
      "تمثّل التشكيلة الواسعة من أنظمة إضاءة LED الاحترافية لدى كندال إلكتريك، والحلول التي تركز على كفاءة الطاقة، والمنتجات الزخرفية. تتصدر K2 القطاع كواحدة من أكثر علامات الإضاءة التركية شهرة وموثوقية.",
    popularLabel: 'فئات المنتجات',
    popularTitle: 'فئاتنا',
    categoryCountLabel: 'منتج',
    viewAllLabel: 'جميع الفئات',
    exportEyebrow: 'وصول عالمي',
    exportTitle: 'ضوء K2 لا يعرف حدوداً.',
    exportHint: 'انقر على نقطة في الخريطة.',
    sec3Title: 'ظروف قاسية',
    sec3Text:
      'من الكشافات وألواح LED والأضواء الكاشفة إلى الأجهزة الشمسية والأنظمة المغناطيسية والإضاءة الزخرفية، تجلب تشكيلة K2 الواسعة حلول LED مبتكرة لإضاءة المنزل والمكتب — وفّر الطاقة، واستثمر في المستقبل.',
    catalogBtn: 'استكشف المنتجات',
  },
  es: {
    heroSub: 'LA CUMBRE DE LA ILUMINACIÓN',
    explore: 'Descubre la Historia',
    whyEyebrow: '¿Por Qué K2?',
    whyHeading: 'La marca confiable que ilumina la oscuridad.',
    whySubtext:
      'Respaldada por la garantía de Kendal Elektrik, K2 destaca por su tecnología LED profesional y durabilidad.',
    trustStats: [
      {
        value: 'Una Marca Líder en el Sector',
        label: 'En Iluminación LED Profesional',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: 'Satisfacción Media del Cliente',
      },
      { value: 'Menos del 0.5%', label: 'Tasa de Devolución' },
    ],
    sec1Title: 'La Cumbre',
    sec1Text:
      "Nuestra marca, que toma su nombre del K2, una de las montañas más difíciles y prestigiosas para los alpinistas, actúa con la visión de 'Iluminar la Oscuridad'.",
    sec2Title: 'Amplia Gama',
    sec2Text:
      "Representa la amplia gama de sistemas profesionales de iluminación LED de Kendal Elektrik, soluciones centradas en la eficiencia energética y productos decorativos. K2 lidera el sector como una de las marcas de iluminación más prestigiosas y confiables de Turquía.",
    popularLabel: 'Categorías de Productos',
    popularTitle: 'Nuestras Categorías',
    categoryCountLabel: 'Productos',
    viewAllLabel: 'Todas las Categorías',
    exportEyebrow: 'Alcance Global',
    exportTitle: 'La luz de K2 no conoce fronteras.',
    exportHint: 'Haga clic en un punto del mapa.',
    sec3Title: 'Condiciones Extremas',
    sec3Text:
      'Desde focos, paneles LED y proyectores hasta luminarias solares, sistemas magnéticos e iluminación decorativa, la amplia gama de K2 aporta soluciones LED innovadoras para el hogar y la oficina — ahorre energía, invierta en el futuro.',
    catalogBtn: 'Explorar Productos',
  },
  de: {
    heroSub: 'DER GIPFEL DER BELEUCHTUNG',
    explore: 'Geschichte Entdecken',
    whyEyebrow: 'Warum K2?',
    whyHeading: 'Die vertrauenswürdige Marke, die die Dunkelheit erhellt.',
    whySubtext:
      'Mit der Garantie von Kendal Elektrik überzeugt K2 durch professionelle LED-Technologie und Langlebigkeit.',
    trustStats: [
      {
        value: 'Eine Spitzenmarke der Branche',
        label: 'Im Bereich Professionelle LED-Beleuchtung',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: 'Durchschnittliche Kundenzufriedenheit',
      },
      { value: 'Unter 0,5 %', label: 'Rücklaufquote' },
    ],
    sec1Title: 'Der Gipfel',
    sec1Text:
      "Unsere Marke, die ihren Namen vom K2 trägt, einem der schwierigsten und angesehensten Berge für Bergsteiger, verfolgt die Vision 'Die Dunkelheit erhellen'.",
    sec2Title: 'Breites Sortiment',
    sec2Text:
      "Repräsentiert das breite Sortiment professioneller LED-Beleuchtungssysteme, energieeffizienzorientierter Lösungen und dekorativer Produkte von Kendal Elektrik. K2 führt die Branche als eine der angesehensten und vertrauenswürdigsten Beleuchtungsmarken der Türkei an.",
    popularLabel: 'Produktkategorien',
    popularTitle: 'Unsere Kategorien',
    categoryCountLabel: 'Produkte',
    viewAllLabel: 'Alle Kategorien',
    exportEyebrow: 'Globale Reichweite',
    exportTitle: 'Das Licht von K2 kennt keine Grenzen.',
    exportHint: 'Klicken Sie auf einen Punkt auf der Karte.',
    sec3Title: 'Extreme Bedingungen',
    sec3Text:
      'Von Strahlern, LED-Panels und Flutlichtern bis hin zu Solarleuchten, Magnetsystemen und dekorativer Beleuchtung — das umfangreiche Sortiment von K2 bringt innovative LED-Lösungen für Heim und Büro: Energie sparen, in die Zukunft investieren.',
    catalogBtn: 'Produkte Entdecken',
  },
  zh: {
    heroSub: '照明之巅',
    explore: '探索品牌故事',
    whyEyebrow: '为什么选择 K2？',
    whyHeading: '照亮黑暗的可信赖品牌。',
    whySubtext:
      '在 Kendal Elektrik 的品质保证下，K2 以专业的LED技术和耐用性脱颖而出。',
    trustStats: [
      {
        value: '行业领先品牌之一',
        label: '专业LED照明领域',
      },
      {
        numericTarget: 9.5,
        suffix: ' / 10',
        label: '平均客户满意度',
      },
      { value: '低于0.5%', label: '退货率' },
    ],
    sec1Title: '巅峰',
    sec1Text:
      '我们的品牌名称源自K2峰——登山者眼中最难攀登、最负盛名的高峰之一，秉承"照亮黑暗"的愿景。',
    sec2Title: '丰富产品线',
    sec2Text:
      '代表着 Kendal Elektrik 广泛的专业LED照明系统、以节能为核心的解决方案以及装饰性产品。K2 作为土耳其最负盛名、最值得信赖的照明品牌之一，引领着行业发展。',
    popularLabel: '产品分类',
    popularTitle: '我们的分类',
    categoryCountLabel: '产品',
    viewAllLabel: '所有分类',
    exportEyebrow: '全球覆盖',
    exportTitle: 'K2 的光芒无国界。',
    exportHint: '点击地图上的位置。',
    sec3Title: '严苛环境',
    sec3Text:
      '从射灯、LED平板灯、投光灯到太阳能灯具、磁吸系统及装饰照明，K2 丰富的产品线为家庭和办公照明带来创新的LED解决方案——节约能源，投资未来。',
    catalogBtn: '探索产品',
  },
};

export function K2CreativePage({ allProducts }: K2CreativePageProps) {
  const { language } = useLanguage();
  const t =
    translations[language as keyof typeof translations] || translations.tr;

  const containerRef = useRef<HTMLDivElement>(null);
  const heroTextRef = useRef<HTMLHeadingElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const heroSubRef = useRef<HTMLSpanElement>(null);
  const ridgeWrapRef = useRef<HTMLDivElement>(null);
  const traceRef = useRef<SVGPathElement>(null);
  const burstRef = useRef<HTMLDivElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const statNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const [sceneReady, setSceneReady] = useState(false);
  const introPlayedRef = useRef(false);

  // K2Scene (the 3D mountain/sunrise background) was removed for
  // performance testing — it used to call this via its Canvas onCreated
  // once WebGL had painted a frame. Two RAFs keeps the same "wait a paint"
  // timing so the preloader curtain-wipe still starts against a settled
  // layout instead of firing on the very first render.
  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setSceneReady(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    if (!sceneReady || introPlayedRef.current) return;
    introPlayedRef.current = true;

    const tl = gsap.timeline({ delay: 0.1 });

    tl.fromTo(
      ridgeWrapRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power2.out' },
    )
      .fromTo(
        traceRef.current,
        { strokeDashoffset: 1 },
        { strokeDashoffset: 0, duration: 1.5, ease: 'power2.inOut' },
        '-=0.15',
      )
      .to(
        flashRef.current,
        { opacity: 0.55, duration: 0.18, ease: 'power1.in' },
        '-=0.1',
      )
      .to(flashRef.current, { opacity: 0, duration: 0.5, ease: 'power2.out' })
      .fromTo(
        burstRef.current,
        { opacity: 0, scale: 0.25 },
        { opacity: 1, scale: 1.3, duration: 0.6, ease: 'power2.out' },
        '<',
      )
      .to(burstRef.current, { scale: 1, duration: 0.5, ease: 'power1.out' })
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85, y: 10 },
        { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' },
        '-=0.6',
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, letterSpacing: '0.15em' },
        {
          opacity: 1,
          letterSpacing: '0.5em',
          duration: 0.9,
          ease: 'power2.out',
        },
        '-=0.5',
      );

    tl.fromTo(
      scrollHintRef.current,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' },
      '-=0.3',
    );

    return () => {
      tl.kill();
    };
  }, [sceneReady, language]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to([heroTextRef.current, scrollHintRef.current], {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true,
        },
      });

      const sections = gsap.utils.toArray<Element>('.reveal-text');
      sections.forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 50 },
          {
            opacity: 1,
            y: 0,
            duration: 1,
            scrollTrigger: {
              trigger: section,
              start: 'top 95%',
              end: 'top 65%',
              scrub: 1,
            },
          },
        );
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
    }, containerRef);

    return () => ctx.revert();
  }, [language]);

  return (
    <div
      ref={containerRef}
      className="relative w-full bg-[#3a3a40] text-white selection:bg-orange-500 selection:text-white"
      style={{ '--page-bg': '#3a3a40' } as React.CSSProperties}
    >
      <K2Preloader ready={sceneReady} />

      <section className="relative z-10 w-full h-[100svh] min-h-[600px] md:h-screen md:min-h-[800px] flex flex-col items-center justify-center pointer-events-none px-4 overflow-hidden">
        <div
          ref={flashRef}
          className="absolute inset-0 opacity-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at 50% 62%, rgba(255,179,92,0.9), rgba(255,179,92,0) 60%)',
          }}
        />

        <div
          ref={ridgeWrapRef}
          className="absolute bottom-0 left-0 w-full h-[38vh] md:h-[46vh] opacity-0"
        >
          <div
            ref={burstRef}
            className="absolute opacity-0"
            style={{
              left: '50%',
              top: '2%',
              width: '260px',
              height: '260px',
              transform: 'translate(-50%, -50%)',
              background:
                'radial-gradient(circle, rgba(255,203,110,0.85) 0%, rgba(255,153,60,0.35) 45%, rgba(255,153,60,0) 72%)',
              filter: 'blur(2px)',
            }}
          />
          <svg
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
            className="absolute inset-0 w-full h-full"
          >
            <path
              d="M0,300 L0,190 L140,225 L300,95 L430,155 L600,20 L780,145 L910,85 L1060,195 L1200,155 L1200,300 Z"
              fill="#1c1c1f"
            />
            <path
              ref={traceRef}
              d="M0,190 L140,225 L300,95 L430,155 L600,20 L780,145 L910,85 L1060,195 L1200,155"
              fill="none"
              stroke="#ffb35c"
              strokeWidth="3"
              strokeLinejoin="round"
              strokeLinecap="round"
              pathLength={1}
              style={{
                strokeDasharray: 1,
                strokeDashoffset: 1,
                filter: 'drop-shadow(0 0 6px rgba(255,179,92,0.85))',
              }}
            />
          </svg>
        </div>

        {/* bottom-[vh] anchors to the same frame as the ridge SVG below, so the logo tracks the peak across aspect ratios instead of drifting like a fixed -mt offset would */}
        <div
          ref={heroTextRef}
          className="absolute left-1/2 -translate-x-1/2 bottom-[35vh] md:bottom-[43vh] text-center flex flex-col items-center"
        >
          <span
            ref={heroSubRef}
            className="text-sm md:text-2xl font-bold tracking-[0.35em] text-white block mb-6 md:mb-8 uppercase [text-shadow:0_2px_16px_rgba(0,0,0,0.9)] opacity-0"
          >
            {t.heroSub}
          </span>
          <img
            ref={logoRef}
            src={getAssetPath('/images/brands/k2-logo.svg')}
            alt="K2 Logo"
            className="h-32 md:h-48 lg:h-56 mx-auto drop-shadow-2xl opacity-0"
          />
        </div>

        <div
          ref={scrollHintRef}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0"
        >
          <p className="text-xs tracking-widest uppercase opacity-50 mb-2">
            {t.explore}
          </p>
          <div className="w-[1px] h-16 bg-gradient-to-b from-white to-transparent"></div>
        </div>
      </section>

      <section className="relative z-10 w-full px-6 md:px-24 py-12 md:py-16 overflow-hidden">
        <div className="absolute -bottom-16 -right-16 md:-right-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-orange-500/40 blur-[110px] rounded-full pointer-events-none z-0" />
        <div className="reveal-text relative z-10 bg-neutral-950/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-max items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 text-xs md:text-sm font-semibold tracking-widest uppercase text-orange-400 mb-6">
              {t.whyEyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-bold leading-tight text-white mb-6">
              {t.whyHeading}
            </h2>
            <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-md">
              {t.whySubtext}
            </p>
          </div>

          <div className="flex flex-col gap-10 pl-8 md:pl-10 relative">
            <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-white/10 rounded-full"></div>
            {t.trustStats.map((stat, i) => (
              <div key={stat.label} className="relative">
                <div className="absolute -left-[41px] md:-left-[45px] top-1.5 w-4 h-4 bg-[#3a3a40] border-2 border-orange-500 rounded-full shadow-sm"></div>
                <div className="text-2xl md:text-4xl font-bold text-orange-400 leading-tight mb-1.5">
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
                <div className="text-sm md:text-lg text-white/60">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 w-full px-6 md:px-24 py-12 md:py-16 overflow-hidden">
        <div className="absolute -top-16 -left-16 md:-left-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-amber-500/35 blur-[110px] rounded-full pointer-events-none z-0" />
        <div className="reveal-text relative z-10 bg-neutral-950/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-white/10">
          {[
            { title: t.sec1Title, text: t.sec1Text, icon: MountainIcon },
            { title: t.sec2Title, text: t.sec2Text, icon: LayersIcon },
            { title: t.sec3Title, text: t.sec3Text, icon: ShieldIcon },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-4 ${i > 0 ? 'md:pl-10' : ''} ${i < 2 ? 'md:pr-10' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-orange-500/10 flex items-center justify-center text-orange-400">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-semibold tracking-widest uppercase text-sm md:text-base text-orange-500">
                  {item.title}
                </h3>
                <p className="text-white/70 text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      <div className="relative overflow-hidden">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-[700px] h-[320px] md:w-[1000px] md:h-[420px] bg-orange-500/35 blur-[120px] rounded-full pointer-events-none z-0" />
        <CategoryShowcase
          label={t.popularLabel}
          title={t.popularTitle}
          allProducts={allProducts}
          language={language}
          brandName="k2"
          accent={K2_ACCENT}
          countLabel={t.categoryCountLabel}
          viewAllLabel={t.viewAllLabel}
          align="left"
        />
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute -top-16 -left-16 md:-left-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-amber-500/35 blur-[110px] rounded-full pointer-events-none z-0" />
        <div className="absolute -bottom-16 -right-16 md:-right-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-orange-500/30 blur-[110px] rounded-full pointer-events-none z-0" />
        <ExportMap
          eyebrow={t.exportEyebrow}
          title={t.exportTitle}
          hint={t.exportHint}
          language={language}
          accent={K2_ACCENT}
        />
      </div>

      <section className="relative z-10 w-full flex flex-col items-center justify-center px-6 py-12 md:py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[420px] md:w-[650px] md:h-[500px] bg-orange-500/40 blur-[110px] rounded-full pointer-events-none z-0" />
        <Link
          href={getBrandUrunlerHref('k2')}
          className="relative z-10 inline-flex items-center justify-center px-10 py-5 bg-orange-600 text-white font-bold tracking-widest uppercase rounded-full shadow-[0_8px_24px_rgba(249,115,22,0.35)] hover:bg-orange-700 hover:shadow-[0_10px_28px_rgba(249,115,22,0.45)] transition-all duration-300"
        >
          {t.catalogBtn}
        </Link>
      </section>
    </div>
  );
}

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Link from 'next/link';
import type React from 'react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { CategoryShowcase } from '@/components/brand/shared/CategoryShowcase';
import { DealerMap } from '@/components/brand/shared/DealerMap';
import type { ProductListItem } from '@/data/products';
import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { GlobalPreloader } from './GlobalPreloader';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const GLOBAL_ACCENT = '#e6b800';

interface GlobalCreativePageProps {
  allProducts: ProductListItem[];
}

const translations = {
  tr: {
    heroSub: 'KAPSAMLI AYDINLATMA ÇÖZÜMLERİ',
    heroTitle: 'IŞIĞIN YENİ BOYUTU',
    explore: 'Işığı Keşfet',
    whyEyebrow: 'Neden Global?',
    whyHeading: 'Aydınlatmada güvenilir bir isim.',
    whySubtext:
      "Global, Kendal Elektrik'in 29 yıllık üretim tecrübesiyle güçleniyor.",
    trustStats: [
      {
        value: 'Sektörün Güvendiği İsimlerden',
        label: 'Aydınlatma Markaları Arasında',
      },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: 'Ortalama Müşteri Memnuniyeti',
      },
      { value: "%0.5'in Altında", label: 'İade Oranı' },
    ],
    sec1Title: 'Kusursuz Güç',
    sec1Text:
      'Kendal Elektrik güvencesiyle, projelerinizi aydınlatacak en parlak ve en güçlü çözümler.',
    sec2Title: 'Sınırsız Performans',
    sec2Text:
      'Endüstriyel tesislerden yaşam alanlarına kadar her noktada ışığın enerjisini hissettiren benzersiz aydınlatma ağı.',
    popularLabel: 'Ürün Kategorileri',
    popularTitle: 'Kategorilerimiz',
    categoryCountLabel: 'Ürün',
    viewAllLabel: 'Tüm Kategoriler',
    dealerEyebrow: 'Yurt İçi Ağımız',
    dealerTitle: "Türkiye'nin her köşesine ışık taşıyan güçlü bir ağ.",
    dealerBadge: '77 İlde Yetkili Bayimiz Var',
    dealerLabel: 'Yetkili Bayi',
    dealerHint: 'İl üzerine gelerek bayi ağımızı keşfedin.',
    sec3Title: 'Geleceğin Işığı',
    sec3Text:
      'Daha parlak, daha uzun ömürlü ve sınırları zorlayan yüksek teknolojili tasarımlar.',
    catalogBtn: 'Ürünleri İncele',
  },
  en: {
    heroSub: 'COMPREHENSIVE LIGHTING SOLUTIONS',
    heroTitle: 'NEW DIMENSION OF LIGHT',
    explore: 'Discover the Light',
    whyEyebrow: 'Why Global?',
    whyHeading: 'A trusted name in lighting.',
    whySubtext:
      "Global is backed by Kendal Elektrik's 29 years of manufacturing experience.",
    trustStats: [
      { value: 'A Trusted Industry Name', label: 'Among Lighting Brands' },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: 'Average Customer Satisfaction',
      },
      { value: 'Under 0.5%', label: 'Return Rate' },
    ],
    sec1Title: 'Flawless Power',
    sec1Text:
      "With Kendal Elektrik's assurance, the brightest and most powerful solutions to illuminate your projects.",
    sec2Title: 'Limitless Performance',
    sec2Text:
      'A unique lighting network that makes you feel the energy of light everywhere from industrial facilities to living spaces.',
    popularLabel: 'Product Categories',
    popularTitle: 'Our Categories',
    categoryCountLabel: 'Products',
    viewAllLabel: 'All Categories',
    dealerEyebrow: 'Our Domestic Network',
    dealerTitle: 'A powerful network carrying light to every corner of Turkey.',
    dealerBadge: 'Authorized Dealers in 77 Provinces',
    dealerLabel: 'Authorized Dealer',
    dealerHint: 'Hover a province to explore our dealer network.',
    sec3Title: 'Light of the Future',
    sec3Text:
      'Brighter, longer-lasting, and boundary-pushing high-tech designs.',
    catalogBtn: 'Explore Products',
  },
  ar: {
    heroSub: 'حلول إضاءة شاملة',
    heroTitle: 'بُعد جديد للضوء',
    explore: 'اكتشف الضوء',
    whyEyebrow: 'لماذا Global؟',
    whyHeading: 'اسم موثوق في عالم الإضاءة.',
    whySubtext:
      'تستمد Global قوتها من 29 عاماً من الخبرة الإنتاجية لدى كندال إلكتريك.',
    trustStats: [
      {
        value: 'من الأسماء الموثوقة في القطاع',
        label: 'بين علامات الإضاءة',
      },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: 'متوسط رضا العملاء',
      },
      { value: 'أقل من 0.5%', label: 'نسبة الإرجاع' },
    ],
    sec1Title: 'قوة مثالية',
    sec1Text:
      'بضمان كندال إلكتريك، أكثر الحلول سطوعاً وقوة لإضاءة مشاريعكم.',
    sec2Title: 'أداء بلا حدود',
    sec2Text:
      'شبكة إضاءة فريدة تجعلك تشعر بطاقة الضوء في كل مكان، من المنشآت الصناعية إلى المساحات السكنية.',
    popularLabel: 'فئات المنتجات',
    popularTitle: 'فئاتنا',
    categoryCountLabel: 'منتج',
    viewAllLabel: 'جميع الفئات',
    dealerEyebrow: 'شبكتنا المحلية',
    dealerTitle: 'شبكة قوية تحمل الضوء إلى كل ركن من تركيا.',
    dealerBadge: 'لدينا موزعون معتمدون في 77 ولاية',
    dealerLabel: 'موزع معتمد',
    dealerHint: 'مرّر المؤشر على ولاية لاستكشاف شبكة موزعينا.',
    sec3Title: 'ضوء المستقبل',
    sec3Text:
      'تصاميم عالية التقنية أكثر سطوعاً وطول عمر وتتجاوز الحدود.',
    catalogBtn: 'استكشف المنتجات',
  },
  es: {
    heroSub: 'SOLUCIONES INTEGRALES DE ILUMINACIÓN',
    heroTitle: 'UNA NUEVA DIMENSIÓN DE LUZ',
    explore: 'Descubre la Luz',
    whyEyebrow: '¿Por Qué Global?',
    whyHeading: 'Un nombre confiable en iluminación.',
    whySubtext:
      'Global se fortalece con los 29 años de experiencia en fabricación de Kendal Elektrik.',
    trustStats: [
      {
        value: 'Un Nombre de Confianza del Sector',
        label: 'Entre las Marcas de Iluminación',
      },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: 'Satisfacción Media del Cliente',
      },
      { value: 'Menos del 0.5%', label: 'Tasa de Devolución' },
    ],
    sec1Title: 'Potencia Impecable',
    sec1Text:
      'Con la garantía de Kendal Elektrik, las soluciones más brillantes y potentes para iluminar sus proyectos.',
    sec2Title: 'Rendimiento Sin Límites',
    sec2Text:
      'Una red de iluminación única que le hace sentir la energía de la luz en todas partes, desde instalaciones industriales hasta espacios habitables.',
    popularLabel: 'Categorías de Productos',
    popularTitle: 'Nuestras Categorías',
    categoryCountLabel: 'Productos',
    viewAllLabel: 'Todas las Categorías',
    dealerEyebrow: 'Nuestra Red Nacional',
    dealerTitle: 'Una red poderosa que lleva la luz a cada rincón de Turquía.',
    dealerBadge: 'Distribuidores Autorizados en 77 Provincias',
    dealerLabel: 'Distribuidor Autorizado',
    dealerHint: 'Pase el cursor sobre una provincia para explorar nuestra red de distribuidores.',
    sec3Title: 'La Luz del Futuro',
    sec3Text:
      'Diseños de alta tecnología más brillantes, duraderos y que superan los límites.',
    catalogBtn: 'Explorar Productos',
  },
  de: {
    heroSub: 'UMFASSENDE BELEUCHTUNGSLÖSUNGEN',
    heroTitle: 'EINE NEUE DIMENSION DES LICHTS',
    explore: 'Licht Entdecken',
    whyEyebrow: 'Warum Global?',
    whyHeading: 'Ein vertrauenswürdiger Name in der Beleuchtung.',
    whySubtext:
      'Global wird durch die 29-jährige Produktionserfahrung von Kendal Elektrik gestärkt.',
    trustStats: [
      {
        value: 'Ein Vertrauenswürdiger Name der Branche',
        label: 'Unter den Beleuchtungsmarken',
      },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: 'Durchschnittliche Kundenzufriedenheit',
      },
      { value: 'Unter 0,5 %', label: 'Rücklaufquote' },
    ],
    sec1Title: 'Makellose Kraft',
    sec1Text:
      'Mit der Garantie von Kendal Elektrik die hellsten und stärksten Lösungen, um Ihre Projekte zu beleuchten.',
    sec2Title: 'Grenzenlose Leistung',
    sec2Text:
      'Ein einzigartiges Beleuchtungsnetzwerk, das die Energie des Lichts überall spüren lässt — von Industrieanlagen bis zu Wohnräumen.',
    popularLabel: 'Produktkategorien',
    popularTitle: 'Unsere Kategorien',
    categoryCountLabel: 'Produkte',
    viewAllLabel: 'Alle Kategorien',
    dealerEyebrow: 'Unser Inlandsnetzwerk',
    dealerTitle: 'Ein starkes Netzwerk, das Licht in jeden Winkel der Türkei bringt.',
    dealerBadge: 'Autorisierte Händler in 77 Provinzen',
    dealerLabel: 'Autorisierter Händler',
    dealerHint: 'Fahren Sie mit der Maus über eine Provinz, um unser Händlernetzwerk zu erkunden.',
    sec3Title: 'Das Licht der Zukunft',
    sec3Text:
      'Hellere, langlebigere und grenzüberschreitende Hightech-Designs.',
    catalogBtn: 'Produkte Entdecken',
  },
  zh: {
    heroSub: '全方位照明解决方案',
    heroTitle: '光的全新维度',
    explore: '探索光影',
    whyEyebrow: '为什么选择 Global？',
    whyHeading: '照明领域值得信赖的名字。',
    whySubtext:
      'Global 凭借 Kendal Elektrik 29年的生产经验不断壮大。',
    trustStats: [
      {
        value: '行业信赖的品牌之一',
        label: '在照明品牌中',
      },
      {
        numericTarget: 9.6,
        suffix: ' / 10',
        label: '平均客户满意度',
      },
      { value: '低于0.5%', label: '退货率' },
    ],
    sec1Title: '卓越动力',
    sec1Text:
      '在 Kendal Elektrik 的品质保证下，为您的项目提供最明亮、最强劲的照明解决方案。',
    sec2Title: '无限性能',
    sec2Text:
      '从工业设施到生活空间，独特的照明网络让您随处感受到光的能量。',
    popularLabel: '产品分类',
    popularTitle: '我们的分类',
    categoryCountLabel: '产品',
    viewAllLabel: '所有分类',
    dealerEyebrow: '我们的国内网络',
    dealerTitle: '将光明带到土耳其每个角落的强大网络。',
    dealerBadge: '在77个省份拥有授权经销商',
    dealerLabel: '授权经销商',
    dealerHint: '将鼠标悬停在省份上以探索我们的经销商网络。',
    sec3Title: '未来之光',
    sec3Text:
      '更明亮、更持久、突破极限的高科技设计。',
    catalogBtn: '探索产品',
  },
};

function BoltIcon({ className }: { className?: string }) {
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
      <path d="M13 2 3 14h7l-1 8 10-12h-7l1-8z" />
    </svg>
  );
}

function InfinityIcon({ className }: { className?: string }) {
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
      <path d="M18.2 8c5.1 0 5.1 8 0 8-5.1 0-7.1-8-12.2-8-5.1 0-5.1 8 0 8 5.1 0 7.1-8 12.2-8z" />
    </svg>
  );
}

function BulbIcon({ className }: { className?: string }) {
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
      <path d="M9 18h6" />
      <path d="M10 22h4" />
      <path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.3 1 2.3h6c0-1 .4-1.8 1-2.3A7 7 0 0 0 12 2Z" />
    </svg>
  );
}

export function GlobalCreativePage({ allProducts }: GlobalCreativePageProps) {
  const { language } = useLanguage();
  const t =
    translations[language as keyof typeof translations] || translations.tr;

  const containerRef = useRef<HTMLDivElement>(null);
  const heroSectionRef = useRef<HTMLElement>(null);
  const heroContentRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  const logoRef = useRef<HTMLImageElement>(null);
  const heroTitleRef = useRef<HTMLHeadingElement>(null);
  const heroSubRef = useRef<HTMLSpanElement>(null);
  const scrollIndicatorRef = useRef<HTMLDivElement>(null);
  const statNumberRefs = useRef<(HTMLSpanElement | null)[]>([]);

  const [introDone, setIntroDone] = useState(false);
  const introPlayedRef = useRef(false);
  const handlePreloaderComplete = useCallback(() => setIntroDone(true), []);

  // Hero content reveal, kicked off by GlobalPreloader once its own
  // click/flash sequence completes (mirrors K2/VantiCreativePage's
  // sceneReady-gated reveal effect).
  useEffect(() => {
    if (!introDone || introPlayedRef.current) return;
    introPlayedRef.current = true;

    const tl = gsap.timeline({ delay: 0 });

    tl.fromTo(
      glowRef.current,
      { opacity: 0, scale: 0.8 },
      { opacity: 1, scale: 1, duration: 1.6 },
    )
      .fromTo(
        logoRef.current,
        { opacity: 0, scale: 0.85 },
        { opacity: 1, scale: 1, duration: 1 },
        '<',
      )
      .fromTo(
        heroTitleRef.current,
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.9 },
        '-=0.75',
      )
      .fromTo(
        heroSubRef.current,
        { opacity: 0, letterSpacing: '0.1em' },
        { opacity: 1, letterSpacing: '0.3em', duration: 0.8 },
        '-=0.6',
      )
      .fromTo(
        scrollIndicatorRef.current,
        { opacity: 0, y: 10 },
        { opacity: 1, y: 0, duration: 0.6 },
        '-=0.4',
      );

    return () => {
      tl.kill();
    };
  }, [introDone, language]);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.to(heroContentRef.current, {
        y: -150,
        opacity: 0,
        scrollTrigger: {
          trigger: heroSectionRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: 1,
        },
      });

      const sections = gsap.utils.toArray<Element>('.reveal-card');
      sections.forEach((section) => {
        const textElements = section.querySelectorAll('.reveal-content');

        const sectionTl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 85%',
            end: 'top 40%',
            scrub: 1,
          },
        });

        sectionTl
          .fromTo(
            section,
            { opacity: 0, y: 50, scale: 0.95 },
            { opacity: 1, y: 0, scale: 1, duration: 1 },
          )
          .fromTo(
            textElements,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 1, stagger: 0.2 },
            '-=0.5',
          );
      });

      gsap.utils.toArray<Element>('.reveal-text').forEach((section) => {
        gsap.fromTo(
          section,
          { opacity: 0, y: 40 },
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
      className="relative w-full bg-[#fdf3d1] text-black overflow-hidden font-sans min-h-screen"
      style={{ '--page-bg': '#fdf3d1' } as React.CSSProperties}
    >
      <GlobalPreloader onComplete={handlePreloaderComplete} />

      <section
        ref={heroSectionRef}
        className="relative z-10 w-full h-screen flex flex-col items-center justify-center pointer-events-none overflow-hidden px-4"
      >
        <div
          ref={heroContentRef}
          className="absolute inset-0 flex flex-col items-center justify-center px-4"
        >
          <div
            ref={glowRef}
            className="absolute w-[420px] h-[420px] md:w-[620px] md:h-[620px] rounded-full pointer-events-none opacity-0 -mt-8"
            style={{
              background:
                'radial-gradient(circle, rgba(255,203,5,0.35) 0%, rgba(255,203,5,0) 70%)',
            }}
          />
          <div className="text-center flex flex-col items-center justify-center -mt-8">
            <img
              ref={logoRef}
              src={getAssetPath('/images/brands/global-logo.svg')}
              alt="Global Logo"
              className="h-24 md:h-32 lg:h-40 mx-auto mb-8 opacity-0"
            />
            <h1
              ref={heroTitleRef}
              className="text-4xl md:text-6xl lg:text-8xl font-black tracking-tight text-black mb-4 opacity-0"
            >
              {t.heroTitle}
            </h1>
            <span
              ref={heroSubRef}
              className="text-sm md:text-lg font-bold text-gray-500 uppercase opacity-0 tracking-widest"
            >
              {t.heroSub}
            </span>
          </div>

          <div
            ref={scrollIndicatorRef}
            className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center opacity-0"
          >
            <p className="text-xs tracking-widest uppercase mb-4 font-bold text-black bg-[#fff3c4] border border-[#ffcb05]/40 px-5 py-2 rounded-full">
              {t.explore}
            </p>
            <div className="w-[2px] h-16 bg-gradient-to-b from-[#ffcb05]/60 to-transparent rounded-full"></div>
          </div>
        </div>
      </section>

      <div className="reveal-text opacity-0 relative z-10 w-full max-w-5xl mx-auto px-6 -mt-6 md:-mt-10 pb-12 md:pb-16">
        <div className="absolute -bottom-10 -right-16 md:-right-24 w-[380px] h-[380px] md:w-[500px] md:h-[500px] bg-orange-400/25 blur-[110px] rounded-full pointer-events-none z-0" />
        <div className="relative z-10 bg-white shadow-xl border border-gray-100 rounded-[3rem] p-8 md:p-14 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-max items-center gap-2 px-4 py-1.5 rounded-full border border-[#e6b800]/30 bg-[#fff3c4]/50 text-xs md:text-sm font-black tracking-widest uppercase text-[#8a6d00] mb-6">
              {t.whyEyebrow}
            </div>
            <h2 className="text-3xl md:text-5xl font-black leading-tight text-black mb-6">
              {t.whyHeading}
            </h2>
            <p className="text-base md:text-lg text-gray-500 leading-relaxed max-w-md">
              {t.whySubtext}
            </p>
          </div>

          <div className="flex flex-col gap-10 pl-8 md:pl-10 relative">
            <div className="absolute top-2 bottom-2 left-0 w-[2px] bg-gray-200 rounded-full"></div>
            {t.trustStats.map((stat, i) => (
              <div key={stat.label} className="relative">
                <div className="absolute -left-[41px] md:-left-[45px] top-1.5 w-4 h-4 bg-white border-2 border-[#e6b800] rounded-full shadow-sm"></div>
                <div className="text-2xl md:text-4xl font-black text-black leading-tight mb-1.5">
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
                <div className="text-sm md:text-lg text-gray-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="reveal-text opacity-0 relative z-10 w-full max-w-5xl mx-auto px-6 py-12 md:py-16">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-sky-400/20 blur-[110px] rounded-full pointer-events-none z-0" />
        <div className="relative z-10 bg-white shadow-xl border border-gray-100 rounded-[3rem] p-8 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-0 md:divide-x md:divide-gray-100">
          {[
            { title: t.sec1Title, text: t.sec1Text, icon: BoltIcon },
            { title: t.sec2Title, text: t.sec2Text, icon: InfinityIcon },
            { title: t.sec3Title, text: t.sec3Text, icon: BulbIcon },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={`flex flex-col gap-4 ${i > 0 ? 'md:pl-10' : ''} ${i < 2 ? 'md:pr-10' : ''}`}
              >
                <div className="w-12 h-12 rounded-full bg-[#fff3c4]/60 flex items-center justify-center text-[#8a6d00]">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="font-black tracking-[0.2em] uppercase text-sm md:text-base text-gray-400">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-base md:text-lg leading-relaxed">
                  {item.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative overflow-hidden">
        <div className="absolute bottom-0 -left-16 md:-left-24 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-violet-400/20 blur-[120px] rounded-full pointer-events-none z-0" />
        <CategoryShowcase
          label={t.popularLabel}
          title={t.popularTitle}
          allProducts={allProducts}
          language={language}
          brandName="global"
          accent={GLOBAL_ACCENT}
          countLabel={t.categoryCountLabel}
          viewAllLabel={t.viewAllLabel}
          align="left"
          theme="light"
        />
      </div>

      <div className="relative md:-mt-12 overflow-hidden">
        <div className="absolute -top-16 -right-16 md:-right-24 w-[380px] h-[380px] md:w-[500px] md:h-[500px] bg-rose-400/20 blur-[110px] rounded-full pointer-events-none z-0" />
        <DealerMap
          eyebrow={t.dealerEyebrow}
          title={t.dealerTitle}
          hint={t.dealerHint}
          badge={t.dealerBadge}
          dealerLabel={t.dealerLabel}
          language={language}
          accent={GLOBAL_ACCENT}
          theme="light"
        />
      </div>

      <section className="relative z-10 w-full flex flex-col items-center justify-center px-6 py-12 md:py-16 text-center overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[420px] h-[420px] md:w-[560px] md:h-[560px] bg-sky-400/15 blur-[110px] rounded-full pointer-events-none z-0" />
        <Link
          href={getBrandUrunlerHref('global')}
          className="relative z-10 inline-flex items-center justify-center px-12 py-5 bg-black text-white font-black tracking-widest uppercase rounded-full shadow-[0_8px_24px_rgba(0,0,0,0.25)] hover:bg-gray-800 hover:shadow-[0_10px_28px_rgba(0,0,0,0.35)] transition-all duration-300"
        >
          {t.catalogBtn}
        </Link>
      </section>
    </div>
  );
}

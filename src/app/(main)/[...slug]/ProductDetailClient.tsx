'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import type React from 'react';
import { useEffect, useState } from 'react';
import { getProductImageUrl, type Product, products } from '@/data/products';
import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface ProductDetailClientProps {
  product: Product;
  brandName?: 'k2' | 'vanti' | 'global';
  pdfFormFile?: string | null;
}

const VANTI_VIDEOS: Record<string, string> = {
  KCF271: '4OztFcGyGwQ',
  KCF272L: 'MHKlz9hlICs',
  KCF272: 'rfhARix9Sxk',
  KCF276K: 'fIa_DqQUTw4',
  KCF276: 'q8hgLksbSyM',
  KCF273: 'PdILKXirxbo',
  KCF278: 'L7lYf_aqNgs',
  KCF279: 'Qq1gsLUXjv0',
  KCF473: '16yMkTg7xhk',
  KCF281: '1Go55UTa7cw',
  KCF283: '6-V_VxyO1rA',
  KCF284: 'seizCrmSe94',
  KCF285: 'Rkp7jKK--6o',
  KCF288: 'qEEGqMZmeeY',
  KCF290: 'q9yFUANQ_eU',
  KCF295: 'J4z5qYJlPdM',
  KCF303: 'pS72bT__0hY',
  KCF321: 'yF6iRNek5b4',
};

function getSpecIcon(label: string) {
  const l = (label || '').toLowerCase();
  const cls = 'w-[18px] h-[18px]';

  if (l.includes('watt') || l.includes('güç') || l.includes('guc')) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 2L4.5 13.5H11L10 22l9-13H12l1-7z"
        />
      </svg>
    );
  }
  if (l.includes('lümen') || l.includes('lumen')) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="4" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeWidth={2}
          d="M12 2v2.5M12 19.5V22M4.2 4.2l1.8 1.8M18 18l1.8 1.8M2 12h2.5M19.5 12H22M4.2 19.8L6 18M18 6l1.8-1.8"
        />
      </svg>
    );
  }
  if (l.includes('duy') || l.includes('socket')) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="7" y="3" width="10" height="7" rx="1.5" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeWidth={2}
          d="M9 10v3m6-3v3M8 13h8l-1.2 7H9.2L8 13z"
        />
      </svg>
    );
  }
  if (l.includes('gerilim') || l.includes('voltage') || l.includes('volt')) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 8l-4 5h3l-1 4 4-5h-3l1-4z"
        />
      </svg>
    );
  }
  if (
    l.includes('ömür') ||
    l.includes('omur') ||
    l.includes('life') ||
    l.includes('saat') ||
    l.includes('hour')
  ) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 7v5l3.5 2"
        />
      </svg>
    );
  }
  if (
    l.includes('koli') ||
    l.includes('box') ||
    l.includes('adet') ||
    l.includes('package')
  ) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M3 8l9-5 9 5-9 5-9-5zm0 0v8l9 5m0-13v13m9-13v8l-9 5"
        />
      </svg>
    );
  }
  if (
    l.includes('ölçü') ||
    l.includes('olcu') ||
    l.includes('boyut') ||
    l.includes('dimension')
  ) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <rect x="3" y="9" width="18" height="6" rx="1" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeWidth={2}
          d="M7 9v3M11 9v3M15 9v3M19 9v3"
        />
      </svg>
    );
  }
  if (l.includes('ip') || l.includes('koruma') || l.includes('protection')) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3z"
        />
      </svg>
    );
  }
  if (
    l.includes('renk') ||
    l.includes('color') ||
    l.includes('cct') ||
    l.includes('kasa') ||
    l.includes('casing')
  ) {
    return (
      <svg
        className={cls}
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="9" strokeWidth={2} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 3a9 9 0 000 18c1.5 0 2-1 2-2s-.5-1.5-.5-2.5S14 15 15 15h2a4 4 0 004-4c0-4.5-4-8-9-8z"
        />
      </svg>
    );
  }
  return (
    <svg className={cls} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
      />
    </svg>
  );
}

export function ProductDetailClient({
  product,
  brandName,
  pdfFormFile,
}: ProductDetailClientProps) {
  const router = useRouter();
  const { language } = useLanguage();
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const name = product.name[language] || product.name.tr;
  const attributes = product.attributes[language] || product.attributes.tr;
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const currentImage = selectedImage || product.image;
  const imageUrl = getProductImageUrl(currentImage);
  const allImages = [product.image, ...(product.images || [])].filter(
    (val, i, arr) => arr.indexOf(val) === i,
  );

  const isK2 = brandName === 'k2';
  const isVanti = brandName === 'vanti';
  const isGlobal = brandName === 'global';
  const isLight = isK2 || isVanti || isGlobal;

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightboxOpen(false);
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightboxOpen]);

  let displayName = name;
  if (isGlobal) {
    const words = name.trim().split(' ');
    displayName = words
      .filter((w: string) => {
        const upper = w.toUpperCase();
        if (upper.match(/^\d+W$/i)) return false;
        if (upper.match(/^\d{3,5}K$/i)) return false;
        if (
          [
            'SARI',
            'BEYAZ',
            'ARARENK',
            'GÜNIŞIĞI',
            'MAVİ',
            'YEŞİL',
            'KIRMIZI',
            'AMBER',
            'GÜN',
            'IŞIĞI',
            'CCT',
          ].includes(upper)
        )
          return false;
        if (upper.match(/^(E14|E27|GU10|G9|R7S)$/i)) return false;
        if (upper.match(/^\d+[*xX]\d+$/)) return false;
        return true;
      })
      .join(' ');
  }

  const videoMatchKey = Object.keys(VANTI_VIDEOS).find(
    (key) => product.model.includes(key) || name.includes(key),
  );
  const videoId = videoMatchKey ? VANTI_VIDEOS[videoMatchKey] : null;

  let themeColor = 'bg-white/20';
  let themeText = 'text-white';
  let themeGlow = 'shadow-[0_0_30px_rgba(255,255,255,0.1)]';
  let themePillBg = 'bg-white/10';
  let badgeColor = 'bg-zinc-800 text-zinc-300 border-zinc-700';
  let ambientGlow = 'bg-white/10';
  let themeImageBg = 'bg-white/[0.03]';
  let pageBg = 'bg-[#f4f5f7]';

  if (isLight) {
    if (isK2) {
      themeColor = 'bg-orange-500';
      themeText = 'text-orange-500';
      themeGlow = 'shadow-[0_0_40px_rgba(249,115,22,0.2)]';
      themePillBg = 'bg-orange-50';
      badgeColor = 'bg-orange-100 text-orange-700 border-orange-200';
      ambientGlow = 'bg-orange-200/50';
      themeImageBg = 'bg-orange-200/90';
      pageBg = 'bg-[#fae3c8]';
    } else if (isVanti) {
      themeColor = 'bg-blue-600';
      themeText = 'text-blue-600';
      themeGlow = 'shadow-[0_0_40px_rgba(37,99,235,0.2)]';
      themePillBg = 'bg-blue-50';
      badgeColor = 'bg-blue-100 text-blue-700 border-blue-200';
      ambientGlow = 'bg-blue-200/50';
      themeImageBg = 'bg-blue-200/90';
      pageBg = 'bg-[#d4e4f9]';
    } else if (isGlobal) {
      themeColor = 'bg-[#FFDA51]';
      themeText = 'text-amber-600';
      themeGlow = 'shadow-[0_0_40px_rgba(255,218,81,0.3)]';
      themePillBg = 'bg-amber-50';
      badgeColor = 'bg-amber-100 text-amber-700 border-amber-200';
      ambientGlow = 'bg-amber-300/50';
      themeImageBg = 'bg-amber-200/90';
      pageBg = 'bg-[#f7e7ac]';
    }
  }

  const homeHref = '/';
  const categoryName =
    product.category?.[language]?.[0] || product.category?.tr?.[0] || null;
  const productBrand = brandName || product.brand || 'k2';
  // isLight: zaten marka sayfaları bağlamındayız — getBrandUrunlerHref cPanel'de
  // (alt alan adı rewrite'ı sayesinde) göreli '/urunler', GH Pages'te (alt alan
  // adı yok) mutlak '/brand/{marka}/urunler' döner (CategoryShowcase.tsx'teki
  // aynı desen). isLight false ise ana www sitesindeyiz, markaya geçmek gerekiyor.
  const categoryBase = isLight
    ? getBrandUrunlerHref(productBrand)
    : process.env.NODE_ENV === 'production'
      ? `/brand/${productBrand}/urunler`
      : `http://${productBrand}.localhost:3000/urunler`;
  const categoryHref = `${categoryBase}${categoryName ? `?category=${encodeURIComponent(categoryName)}` : ''}`;

  const isDimensionToken = (token: string) =>
    /^\d+[x*×]\d+$/i.test(token || '');
  const getBaseName = (name: string) => {
    const words = (name || '').trim().split(' ');
    const firstWordUpper = words[0]?.toUpperCase();
    if (
      firstWordUpper === 'K2' ||
      firstWordUpper === 'GLOBAL' ||
      firstWordUpper === 'VANTİ' ||
      firstWordUpper === 'VANTI'
    ) {
      return words
        .filter(
          (w: string) =>
            !w.match(/^\d+W$/i) &&
            !w.match(/^(E14|E27|GU10|G9|R7S)$/i) &&
            ![
              'SARI',
              'BEYAZ',
              'ARARENK',
              'GÜNIŞIĞI',
              'MAVİ',
              'YEŞİL',
              'KIRMIZI',
              'AMBER',
              'GÜN IŞIĞI',
            ].includes(w.toUpperCase()),
        )
        .join(' ');
    }
    return isDimensionToken(words[1]) ? `${words[0]} ${words[1]}` : words[0];
  };

  const baseModel = getBaseName(product.name.tr);
  const variations = Object.values(products).filter((p) => {
    return getBaseName(p.name.tr) === baseModel;
  });

  const allAttrs = attributes || [];
  const rawSpecs = allAttrs.filter(
    (attr) =>
      attr.value &&
      attr.value.trim() !== '' &&
      attr.value !== 'N/A' &&
      attr.label !== 'Renk' &&
      attr.label !== 'Color',
  );

  const isCctLike = (val: string | null | undefined) => {
    if (!val) return false;
    const upper = val.toUpperCase();
    if (upper.includes('CCT')) return true;
    return (
      (upper.includes('3000K') && upper.includes('6500K')) ||
      (upper.includes('3000K') && upper.includes('4000K')) ||
      (upper.includes('4000K') && upper.includes('6500K')) ||
      (upper.includes('GÜNIŞIĞI') && upper.includes('BEYAZ')) ||
      (upper.includes('GUNISIGI') && upper.includes('BEYAZ'))
    );
  };

  const cctValue = isCctLike(product.variantOptions?.casing)
    ? product.variantOptions?.casing
    : isCctLike(product.variantOptions?.light)
      ? product.variantOptions?.light
      : null;

  const featureLabels = [
    'Özellik',
    'Feature',
    'Açıklama',
    'Description',
    'Fonksiyonlar',
    'Functions',
    'Belge',
    'Certificate',
  ];

  const featureAttrs = rawSpecs.filter((attr) =>
    featureLabels.includes(attr.label),
  );
  const specAttrs = rawSpecs.filter(
    (attr) => !featureLabels.includes(attr.label),
  );

  const featuresList = featureAttrs.flatMap((attr) =>
    String(attr.value)
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .split(' / ')
      .map((s) => s.trim())
      .filter((s) => s)
      .map((s) => (/^\d+\s*[Yy]ıl$/.test(s) ? `${s} Garanti` : s)),
  );

  const hasDedicatedFeatures = featuresList.length > 0;
  const displayFeaturesList = hasDedicatedFeatures
    ? featuresList
    : specAttrs.map((attr) => {
        const decodedValue = String(attr.value)
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>')
          .replace(/&amp;/g, '&');
        return `${attr.label}: ${decodedValue}`;
      });

  const SectionDivider = () => (
    <div className="w-full flex items-center justify-center opacity-90 -my-1 lg:-my-2">
      <div
        className={`flex-1 max-w-[280px] md:max-w-md h-[2px] bg-gradient-to-r ${isLight ? 'from-transparent to-zinc-400' : 'from-transparent to-white/35'}`}
      ></div>
      <div
        className={`w-2 h-2 rounded-full mx-5 ${isLight ? 'bg-zinc-400' : 'bg-white/40'}`}
      ></div>
      <div
        className={`flex-1 max-w-[280px] md:max-w-md h-[2px] bg-gradient-to-l ${isLight ? 'from-transparent to-zinc-400' : 'from-transparent to-white/35'}`}
      ></div>
    </div>
  );

  const SectionHeader = ({
    icon,
    title,
  }: {
    icon: React.ReactNode;
    title: string;
  }) => (
    <div className="flex items-center gap-3 py-3 mb-8 justify-center">
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isLight ? `${themePillBg} ${themeText}` : 'bg-white/[0.06] border border-white/10 text-white'}`}
      >
        {icon}
      </div>
      <h3
        className={`text-xl lg:text-2xl font-bold tracking-tight ${isLight ? 'text-zinc-800' : 'text-white'}`}
      >
        {title}
      </h3>
    </div>
  );

  const titleBlock = (
    <>
      <span
        className={`inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${isLight ? `${themePillBg} ${themeText}` : 'bg-white/[0.06] border border-white/10 text-white/70'}`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${isLight ? themeColor : 'bg-white'}`}
        />
        {product.model}
      </span>
      <h1
        itemProp="name"
        className={`text-2xl md:text-3xl lg:text-[2.6rem] font-extrabold tracking-tight leading-[1.12] text-center px-4 relative z-20
        ${
          isLight
            ? 'bg-clip-text text-transparent bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-600'
            : 'bg-clip-text text-transparent bg-gradient-to-br from-white via-zinc-200 to-zinc-500 drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]'
        }`}
      >
        {displayName}
      </h1>
    </>
  );

  return (
    <div
      className={`relative min-h-screen pb-24 overflow-hidden selection:bg-white/30 ${isLight ? `pt-28 md:pt-36 ${pageBg} text-zinc-900` : 'pt-32 md:pt-40 bg-[#2a2d38] text-white'}`}
    >
      <style>{`
        @keyframes kdlFadeInUp { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: translateY(0); } }
        .kdl-fade-in { animation: kdlFadeInUp 0.7s cubic-bezier(0.16,1,0.3,1) both; }
      `}</style>

      <div
        className="absolute inset-0 pointer-events-none z-[1]"
        style={{
          boxShadow: isLight
            ? 'inset 0 0 150px rgba(0,0,0,0.03)'
            : 'inset 0 0 200px rgba(0,0,0,0.3)',
        }}
      />
      {isLight && (
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none z-[2]"
          style={{
            backgroundImage:
              'url("data:image/svg+xml,%3Csvg viewBox=%220 0 200 200%22 xmlns=%22http://www.w3.org/2000/svg%22%3E%3Cfilter id=%22noiseFilter%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.65%22 numOctaves=%223%22 stitchTiles=%22stitch%22/%3E%3C/filter%3E%3Crect width=%22100%25%22 height=%22100%25%22 filter=%22url(%23noiseFilter)%22/%3E%3C/svg%3E")',
          }}
        />
      )}

      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        {isK2 && (
          <>
            <div className="absolute -left-[15%] top-[-15%] w-[900px] h-[900px] rounded-full bg-orange-500/[0.24] blur-[160px]" />
            <div className="absolute right-[-15%] top-[25%] w-[800px] h-[800px] rounded-full bg-amber-400/[0.18] blur-[150px]" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-gradient-to-b from-orange-300/40 via-orange-400/18 to-transparent blur-3xl opacity-70" />
          </>
        )}

        {isVanti && (
          <>
            <div className="absolute -left-[15%] top-[-15%] w-[900px] h-[900px] rounded-full bg-blue-500/[0.26] blur-[160px]" />
            <div className="absolute right-[-15%] top-[15%] w-[900px] h-[900px] rounded-full bg-cyan-400/[0.2] blur-[150px]" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[900px] h-[450px] bg-gradient-to-b from-cyan-200/45 via-blue-300/18 to-transparent blur-3xl opacity-70" />
          </>
        )}

        {isGlobal && (
          <>
            <div className="absolute -left-[15%] top-[-15%] w-[800px] h-[800px] rounded-full bg-[#FFDA51]/[0.32] blur-[150px]" />
            <div className="absolute right-[-15%] top-[20%] w-[900px] h-[900px] rounded-full bg-yellow-400/[0.24] blur-[150px]" />
            <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] bg-gradient-to-b from-yellow-300/40 via-amber-200/18 to-transparent blur-3xl opacity-75" />
            <div
              className="absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage:
                  'radial-gradient(#FFDA51 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />
          </>
        )}

        {!isLight && (
          <>
            <div className="absolute -left-[15%] top-[-10%] w-[1000px] h-[1000px] rounded-full bg-blue-500/20 blur-[180px]" />
            <div className="absolute left-1/2 -translate-x-1/2 top-[-10%] w-[1000px] h-[800px] bg-gradient-to-b from-indigo-400/20 via-purple-400/10 to-transparent blur-3xl opacity-70" />
          </>
        )}
      </div>

      <div className="relative z-10 container mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-10">
        <div className="kdl-fade-in flex flex-wrap items-center justify-between gap-3 mb-8 md:mb-10">
          <button
            onClick={() => router.back()}
            className={`group flex items-center gap-2.5 w-fit rounded-full pl-2 pr-4 py-2 transition-all duration-300 ${isLight ? 'text-zinc-500 hover:text-zinc-900 bg-white/70 hover:bg-white border border-zinc-200/80 shadow-[0_8px_24px_-8px_rgba(0,0,0,0.08)]' : 'text-white/60 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10'}`}
          >
            <div className="w-6 h-6 rounded-full flex items-center justify-center">
              <svg
                className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </div>
            <span className="font-semibold tracking-wide text-xs uppercase">
              {language === 'en' ? 'Go Back' : 'Geri Dön'}
            </span>
          </button>

          <nav
            aria-label="breadcrumb"
            className={`flex flex-wrap items-center gap-1.5 text-xs font-medium ${isLight ? 'text-zinc-400' : 'text-white/40'}`}
          >
            <Link
              href={homeHref}
              className={`transition-colors ${isLight ? 'hover:text-zinc-700' : 'hover:text-white/80'}`}
            >
              {language === 'en' ? 'Home' : 'Ana Sayfa'}
            </Link>
            <span className="opacity-50">/</span>
            <Link
              href={categoryHref}
              className={`transition-colors ${isLight ? 'hover:text-zinc-700' : 'hover:text-white/80'}`}
            >
              {categoryName || (language === 'en' ? 'Products' : 'Ürünler')}
            </Link>
            <span className="opacity-50">/</span>
            <span className={isLight ? 'text-zinc-600' : 'text-white/70'}>
              {product.model}
            </span>
          </nav>
        </div>

        <article
          itemScope
          itemType="https://schema.org/Product"
          className="flex flex-col items-center w-full gap-14 lg:gap-20"
        >
          {/* Mobile Title (hidden on desktop) */}
          <div className="kdl-fade-in flex lg:hidden flex-col items-center gap-3 w-full mb-[-1.5rem]">
            {titleBlock}
          </div>

          <div className="w-full grid grid-cols-1 lg:grid-cols-[1.05fr_1fr] gap-10 lg:gap-16 items-start">
            {/* MEDIA COLUMN */}
            <div className="kdl-fade-in w-full flex flex-col items-center gap-6 lg:sticky lg:top-32">
              <div className="w-full flex justify-center relative perspective-[1000px] mt-0 mb-4 group/showcase">
                <div
                  className={`absolute inset-0 top-1/2 -translate-y-1/2 w-full max-w-3xl mx-auto h-[80%] blur-[110px] rounded-full pointer-events-none z-0 transition-opacity duration-700 ${isLight ? ambientGlow : 'bg-white/[0.07]'}`}
                />

                <div
                  className="absolute bottom-[-6%] left-1/2 -translate-x-1/2 w-[70%] max-w-[520px] h-[80px] rounded-[100%] blur-md z-0 opacity-70"
                  style={{
                    background: isLight
                      ? 'radial-gradient(ellipse at center, rgba(0,0,0,0.12) 0%, transparent 70%)'
                      : 'radial-gradient(ellipse at center, rgba(255,255,255,0.12) 0%, transparent 70%)',
                    transform: 'rotateX(75deg)',
                  }}
                />

                <button
                  type="button"
                  onClick={() => setLightboxOpen(true)}
                  aria-label={
                    language === 'tr' ? 'Görseli büyüt' : 'Zoom image'
                  }
                  className={`relative w-full max-w-[320px] md:max-w-md flex items-center justify-center p-8 md:p-10 z-10 rounded-[2.5rem] transition-all duration-500 group-hover/showcase:-translate-y-1.5 cursor-zoom-in
                  ${
                    isLight
                      ? `${themeImageBg} backdrop-blur-2xl border border-white shadow-[0_40px_90px_-30px_rgba(0,0,0,0.15)]`
                      : 'bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_40px_100px_-20px_rgba(0,0,0,0.9)]'
                  }`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1/2 rounded-t-[2.5rem] pointer-events-none bg-gradient-to-b ${isLight ? 'from-white/15 to-transparent' : 'from-white/[0.06] to-transparent'}`}
                  />

                  <div
                    className={`absolute top-5 left-5 w-5 h-5 border-t-2 border-l-2 rounded-tl-lg opacity-40 ${isLight ? 'border-zinc-400' : 'border-white/30'}`}
                  />
                  <div
                    className={`absolute bottom-5 right-5 w-5 h-5 border-b-2 border-r-2 rounded-br-lg opacity-40 ${isLight ? 'border-zinc-400' : 'border-white/30'}`}
                  />

                  <img
                    itemProp="image"
                    src={imageUrl}
                    alt={name}
                    className={`w-full h-auto object-contain relative z-20 transition-transform duration-500 group-hover/showcase:scale-[1.03] ${isLight ? 'drop-shadow-xl' : 'drop-shadow-[0_20px_50px_rgba(0,0,0,0.6)]'}`}
                  />

                  <span
                    className={`absolute bottom-4 right-4 z-30 w-9 h-9 rounded-full flex items-center justify-center opacity-0 group-hover/showcase:opacity-100 transition-opacity duration-300 ${isLight ? 'bg-white text-zinc-600 shadow-md' : 'bg-white/10 text-white border border-white/15 backdrop-blur-md'}`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <circle cx="11" cy="11" r="6.5" strokeWidth={2} />
                      <path
                        strokeLinecap="round"
                        strokeWidth={2}
                        d="M20 20l-3.5-3.5M9 8v6M6 11h6"
                      />
                    </svg>
                  </span>
                </button>
              </div>

              {allImages.length > 1 && (
                <div className="flex flex-wrap justify-center gap-3 mt-2 mb-4 w-full max-w-sm">
                  {allImages.map((imgUrl, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedImage(imgUrl)}
                      className={`relative w-14 h-14 md:w-16 md:h-16 rounded-xl border-2 overflow-hidden transition-all duration-300 ${
                        currentImage === imgUrl
                          ? isLight
                            ? 'border-zinc-800 scale-110 shadow-md'
                            : 'border-white scale-110 shadow-[0_0_15px_rgba(255,255,255,0.3)]'
                          : isLight
                            ? 'border-zinc-200/60 hover:border-zinc-400 opacity-70 hover:opacity-100'
                            : 'border-white/10 hover:border-white/40 opacity-50 hover:opacity-100'
                      } ${isLight ? themeImageBg : 'bg-white/5'}`}
                    >
                      <Image
                        src={getProductImageUrl(imgUrl)}
                        alt={`${name} thumbnail ${idx + 1}`}
                        fill
                        className="object-contain p-1.5"
                      />
                    </button>
                  ))}
                </div>
              )}

              {pdfFormFile && (
                <a
                  href={getAssetPath(
                    '/urun-bilgi-formlari/' + encodeURIComponent(pdfFormFile),
                  )}
                  download={pdfFormFile}
                  className={`group inline-flex items-center gap-3 pl-3 pr-5 py-2.5 rounded-full font-bold text-sm transition-all duration-300 border shadow-sm hover:-translate-y-0.5 ${isLight ? 'bg-white text-zinc-800 border-zinc-200 hover:border-zinc-300 hover:shadow-md' : 'bg-white/[0.04] text-white border-white/10 hover:bg-white/[0.08] hover:border-white/20'}`}
                >
                  <span
                    className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${isLight ? themePillBg : 'bg-white/10'}`}
                  >
                    <svg
                      className={`w-4 h-4 ${isLight ? themeText : 'text-white'}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H8a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </span>
                  <span>
                    {language === 'tr'
                      ? 'Ürün Bilgi Formu İndir'
                      : 'Download Product Info Sheet'}
                  </span>
                  <svg
                    className="w-4 h-4 opacity-40 -translate-x-1 group-hover:opacity-90 group-hover:translate-x-0 transition-all duration-300"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </a>
              )}
            </div>

            {/* INFO COLUMN */}
            <div className="kdl-fade-in w-full flex flex-col items-center gap-10">
              <div className="hidden lg:flex flex-col items-center gap-3 w-full">
                {titleBlock}
              </div>

              {(variations.length > 1 ||
                (variations.length === 1 &&
                  (product.variantOptions?.light ||
                    product.variantOptions?.casing ||
                    product.variantOptions?.watt))) && (
                <div className="w-full flex flex-col items-center">
                  {(() => {
                    const variantData = variations.map((variant) => {
                      const opts = variant.variantOptions || {
                        light: null,
                        casing: null,
                        watt: null,
                        socket: null,
                      };
                      let colorTemp = opts.light || opts.casing;
                      if (!colorTemp) {
                        colorTemp = 'Standart';
                      }

                      const isAccessory =
                        product.category?.tr?.includes('Spot Aksesuarı') ||
                        product.category?.tr?.includes('Aksesuar') ||
                        product.category?.tr?.includes('Ray');
                      if (!isAccessory) {
                        if (
                          colorTemp === 'Günışığı' ||
                          colorTemp === 'Gün işığı'
                        )
                          colorTemp = 'Günışığı (3200K)';
                        else if (colorTemp === 'Beyaz')
                          colorTemp = 'Beyaz (6500K)';
                        else if (colorTemp === 'Ararenk')
                          colorTemp = 'Ararenk (4000K)';
                      }

                      const detectedCasing = opts.casing || '';
                      const watt = opts.watt || '';
                      const socket = opts.socket || '';

                      let dotColor = 'bg-zinc-200';
                      const ctUpper = colorTemp.toUpperCase();
                      if (ctUpper.includes('ALEV') || ctUpper.includes('1700K'))
                        dotColor = 'bg-[#FF5722]';
                      else if (
                        ctUpper.includes('AMBER') ||
                        ctUpper.includes('2200K')
                      )
                        dotColor = 'bg-[#FF8C00]';
                      else if (ctUpper.includes('2700K'))
                        dotColor = 'bg-[#FFA957]';
                      else if (
                        ctUpper.includes('3000K') ||
                        ctUpper.includes('GÜNIŞIĞI') ||
                        ctUpper.includes('GUNISIGI') ||
                        ctUpper.includes('GÜN IŞIĞI')
                      )
                        dotColor = 'bg-[#FFB46B]';
                      else if (
                        ctUpper.includes('4000K') ||
                        ctUpper.includes('ARARENK')
                      )
                        dotColor = 'bg-[#FFEDC2]';
                      else if (ctUpper.includes('6500K'))
                        dotColor = 'bg-[#E4F1FE]';
                      else if (ctUpper.includes('BEYAZ'))
                        dotColor = 'bg-white border-zinc-200';
                      else if (ctUpper.includes('KROM'))
                        dotColor = 'bg-slate-300';
                      else if (
                        ctUpper.includes('SATEN') ||
                        ctUpper.includes('SILVER') ||
                        ctUpper.includes('GÜMÜŞ') ||
                        ctUpper.includes('GUMUS')
                      )
                        dotColor = 'bg-stone-300';
                      else if (
                        ctUpper.includes('SİYAH') ||
                        ctUpper.includes('SIYAH')
                      )
                        dotColor = 'bg-zinc-900';
                      else if (
                        ctUpper.includes('GOLD') ||
                        ctUpper.includes('ALTIN')
                      )
                        dotColor = 'bg-yellow-400';
                      else if (ctUpper.includes('BAKIR'))
                        dotColor = 'bg-orange-600';
                      else if (
                        ctUpper.includes('ESKİTME') ||
                        ctUpper.includes('ESKITME')
                      )
                        dotColor = 'bg-yellow-700';
                      else if (
                        ctUpper.includes('MAVİ') ||
                        ctUpper.includes('MAVI')
                      )
                        dotColor = 'bg-blue-500';
                      else if (
                        ctUpper.includes('YEŞİL') ||
                        ctUpper.includes('YESIL') ||
                        ctUpper.includes('YEŞIL')
                      )
                        dotColor = 'bg-green-500';
                      else if (ctUpper.includes('KIRMIZI'))
                        dotColor = 'bg-red-500';
                      else if (ctUpper.includes('PEMBE'))
                        dotColor = 'bg-pink-500';
                      else if (ctUpper.includes('TURUNCU'))
                        dotColor = 'bg-orange-500';
                      else if (ctUpper.includes('RGB'))
                        dotColor =
                          'bg-gradient-to-r from-red-500 via-green-500 to-blue-500';

                      return {
                        variant,
                        colorTemp,
                        dotColor,
                        watt,
                        socket,
                        detectedCasing,
                      };
                    });

                    const currentVariantData =
                      variantData.find((v) => v.variant.id === product.id) ||
                      variantData[0];

                    const uniqueWatts = Array.from(
                      new Set(variantData.map((v) => v.watt).filter((w) => w)),
                    );
                    const uniqueSockets = Array.from(
                      new Set(
                        variantData
                          .filter(
                            (v) =>
                              !currentVariantData.watt ||
                              v.watt === currentVariantData.watt,
                          )
                          .map((v) => v.socket)
                          .filter((s) => s),
                      ),
                    );

                    const uniqueLights = Array.from(
                      new Set(
                        variantData
                          .filter(
                            (v) =>
                              (!currentVariantData.watt ||
                                v.watt === currentVariantData.watt) &&
                              (!currentVariantData.socket ||
                                v.socket === currentVariantData.socket),
                          )
                          .flatMap((v) => {
                            const lightOpt = v.variant.variantOptions?.light;
                            if (!lightOpt) return [];
                            return lightOpt
                              .split(',')
                              .map((c: string) => c.trim());
                          })
                          .filter((c: string) => c && c !== 'Standart'),
                      ),
                    );

                    const uniqueCasings = Array.from(
                      new Set(
                        variantData
                          .filter(
                            (v) =>
                              (!currentVariantData.watt ||
                                v.watt === currentVariantData.watt) &&
                              (!currentVariantData.socket ||
                                v.socket === currentVariantData.socket),
                          )
                          .flatMap((v) => {
                            const casingOpt = v.variant.variantOptions?.casing;
                            if (!casingOpt) return [];
                            return casingOpt
                              .split(',')
                              .map((c: string) => c.trim());
                          })
                          .filter((c: string) => c && c !== 'Standart'),
                      ),
                    );

                    const getBestVariantMatch = (
                      targetAttr: 'watt' | 'socket' | 'light' | 'casing',
                      value: string,
                    ) => {
                      const candidates = variantData.filter((v) =>
                        targetAttr === 'light' || targetAttr === 'casing'
                          ? v.variant.variantOptions?.[targetAttr]?.includes(
                              value,
                            )
                          : v[targetAttr] === value,
                      );
                      if (candidates.length === 0) return null;

                      candidates.sort((a, b) => {
                        let aScore = 0;
                        let bScore = 0;
                        if (targetAttr !== 'watt') {
                          if (a.watt === currentVariantData.watt) aScore++;
                          if (b.watt === currentVariantData.watt) bScore++;
                        }
                        if (targetAttr !== 'socket') {
                          if (a.socket === currentVariantData.socket) aScore++;
                          if (b.socket === currentVariantData.socket) bScore++;
                        }
                        if (targetAttr !== 'light') {
                          if (
                            a.variant.variantOptions?.light ===
                            currentVariantData.variant.variantOptions?.light
                          )
                            aScore++;
                          if (
                            b.variant.variantOptions?.light ===
                            currentVariantData.variant.variantOptions?.light
                          )
                            bScore++;
                        }
                        if (targetAttr !== 'casing') {
                          if (
                            a.variant.variantOptions?.casing ===
                            currentVariantData.variant.variantOptions?.casing
                          )
                            aScore++;
                          if (
                            b.variant.variantOptions?.casing ===
                            currentVariantData.variant.variantOptions?.casing
                          )
                            bScore++;
                        }
                        return bScore - aScore;
                      });
                      return candidates[0];
                    };

                    const renderVariantLink = (
                      match: any,
                      label: string,
                      showColorDot: boolean,
                    ) => {
                      let specificDotColor = 'bg-zinc-200';
                      const ctUpper = label.toUpperCase();
                      if (ctUpper.includes('ALEV') || ctUpper.includes('1700K'))
                        specificDotColor = 'bg-[#FF5722]';
                      else if (
                        ctUpper.includes('AMBER') ||
                        ctUpper.includes('2200K')
                      )
                        specificDotColor = 'bg-[#FF8C00]';
                      else if (ctUpper.includes('2700K'))
                        specificDotColor = 'bg-[#FFA957]';
                      else if (
                        ctUpper.includes('3000K') ||
                        ctUpper.includes('GÜNIŞIĞI') ||
                        ctUpper.includes('GUNISIGI') ||
                        ctUpper.includes('GÜN IŞIĞI')
                      )
                        specificDotColor = 'bg-[#FFB46B]';
                      else if (
                        ctUpper.includes('4000K') ||
                        ctUpper.includes('ARARENK')
                      )
                        specificDotColor = 'bg-[#FFEDC2]';
                      else if (ctUpper.includes('6500K'))
                        specificDotColor = 'bg-[#E4F1FE]';
                      else if (ctUpper.includes('BEYAZ'))
                        specificDotColor = 'bg-white border-zinc-200';
                      else if (ctUpper.includes('KROM'))
                        specificDotColor = 'bg-slate-300';
                      else if (
                        ctUpper.includes('SATEN') ||
                        ctUpper.includes('SILVER') ||
                        ctUpper.includes('GÜMÜŞ') ||
                        ctUpper.includes('GUMUS')
                      )
                        specificDotColor = 'bg-stone-300';
                      else if (
                        ctUpper.includes('SİYAH') ||
                        ctUpper.includes('SIYAH')
                      )
                        specificDotColor = 'bg-zinc-900';
                      else if (
                        ctUpper.includes('GOLD') ||
                        ctUpper.includes('ALTIN')
                      )
                        specificDotColor = 'bg-yellow-400';
                      else if (ctUpper.includes('BAKIR'))
                        specificDotColor = 'bg-orange-600';
                      else if (
                        ctUpper.includes('ESKİTME') ||
                        ctUpper.includes('ESKITME')
                      )
                        specificDotColor = 'bg-yellow-700';
                      else if (ctUpper.includes('SARI'))
                        specificDotColor = 'bg-yellow-300';
                      else if (
                        ctUpper.includes('MAVİ') ||
                        ctUpper.includes('MAVI')
                      )
                        specificDotColor = 'bg-blue-500';
                      else if (
                        ctUpper.includes('YEŞİL') ||
                        ctUpper.includes('YESIL') ||
                        ctUpper.includes('YEŞIL')
                      )
                        specificDotColor = 'bg-green-500';
                      else if (ctUpper.includes('KIRMIZI'))
                        specificDotColor = 'bg-red-500';
                      else if (ctUpper.includes('PEMBE'))
                        specificDotColor = 'bg-pink-500';
                      else if (ctUpper.includes('TURUNCU'))
                        specificDotColor = 'bg-orange-500';
                      else if (ctUpper.includes('CCT'))
                        specificDotColor =
                          'bg-gradient-to-r from-[#FFB46B] via-[#E4F1FE] to-[#FFEDC2]';
                      else if (ctUpper.includes('RGB'))
                        specificDotColor =
                          'bg-gradient-to-r from-red-500 via-green-500 to-blue-500';

                      const pillContent = (
                        <>
                          {showColorDot && (
                            <div className="relative flex items-center justify-center">
                              <span
                                className={`absolute inset-0 rounded-full ${specificDotColor} opacity-50 blur-[3px]`}
                              />
                              <span
                                className={`relative w-2.5 h-2.5 rounded-full ${specificDotColor} shadow-[inset_0_1px_2px_rgba(0,0,0,0.2)] ring-1 ring-black/5 flex-shrink-0 z-10`}
                              />
                            </div>
                          )}
                          <span className="relative z-10">{label}</span>
                        </>
                      );

                      const baseClass =
                        'group relative flex items-center gap-1.5 sm:gap-2.5 px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-xl text-[12px] sm:text-[13px] md:text-sm font-semibold whitespace-nowrap transition-all duration-300';
                      return (
                        <div
                          key={match.variant.id + '-' + label}
                          className={`${baseClass} cursor-default ${
                            isLight
                              ? 'bg-zinc-50 text-zinc-700 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-zinc-200/80 hover:bg-white hover:border-zinc-300 hover:shadow-[0_5px_15px_-3px_rgba(0,0,0,0.08)] hover:-translate-y-0.5'
                              : 'bg-white/[0.04] text-zinc-300 border border-white/[0.05] shadow-sm hover:bg-white/[0.08] hover:border-white/[0.1] hover:-translate-y-0.5'
                          }`}
                        >
                          {pillContent}
                        </div>
                      );
                    };

                    const optionGroups = [
                      uniqueLights.length > 1 && {
                        key: 'light',
                        label:
                          language === 'tr'
                            ? uniqueCasings.length > 1
                              ? 'Işık Rengi Seçenekleri'
                              : 'Renk Seçenekleri'
                            : uniqueCasings.length > 1
                              ? 'Light Color Options'
                              : 'Color Options',
                        showDot: true,
                        items: uniqueLights
                          .map((color) => ({
                            value: color,
                            match: getBestVariantMatch('light', color),
                          }))
                          .filter((x) => x.match),
                      },
                      uniqueCasings.length > 1 && {
                        key: 'casing',
                        label:
                          language === 'tr'
                            ? uniqueLights.length > 1
                              ? 'Kasa Rengi Seçenekleri'
                              : 'Renk Seçenekleri'
                            : uniqueLights.length > 1
                              ? 'Casing Options'
                              : 'Color Options',
                        showDot: true,
                        items: uniqueCasings
                          .map((color) => ({
                            value: color,
                            match: getBestVariantMatch('casing', color),
                          }))
                          .filter((x) => x.match),
                      },
                      uniqueWatts.length > 1 && {
                        key: 'watt',
                        label:
                          language === 'tr'
                            ? 'Watt Seçenekleri'
                            : 'Wattage Options',
                        showDot: false,
                        items: uniqueWatts
                          .map((watt) => ({
                            value: watt,
                            match: getBestVariantMatch('watt', watt),
                          }))
                          .filter((x) => x.match),
                      },
                      uniqueSockets.length > 1 && {
                        key: 'socket',
                        label:
                          language === 'tr'
                            ? 'Duy Seçenekleri'
                            : 'Socket Options',
                        showDot: false,
                        items: uniqueSockets
                          .map((socket) => ({
                            value: socket,
                            match: getBestVariantMatch('socket', socket),
                          }))
                          .filter((x) => x.match),
                      },
                    ].filter(Boolean) as {
                      key: string;
                      label: string;
                      showDot: boolean;
                      items: { value: string; match: any }[];
                    }[];

                    if (optionGroups.length === 0) return null;

                    return (
                      <div
                        className={`w-full max-w-xl mx-auto flex flex-col p-4 sm:p-6 md:p-8 rounded-[2rem] border shadow-[0_8px_40px_rgba(0,0,0,0.03)] transition-all duration-500 hover:shadow-[0_16px_60px_rgba(0,0,0,0.05)] ${
                          isLight
                            ? 'bg-white border-zinc-100'
                            : 'bg-white/[0.02] backdrop-blur-xl border-white/[0.05]'
                        }`}
                      >
                        {optionGroups.map((group, gi) => (
                          <div
                            key={group.key}
                            className={`flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 py-4 ${gi > 0 ? `border-t ${isLight ? 'border-zinc-200/60' : 'border-white/[0.06]'}` : ''}`}
                          >
                            <span
                              className={`sm:w-32 sm:flex-shrink-0 text-[11px] font-bold uppercase tracking-[0.2em] ${isLight ? 'text-zinc-600' : 'text-white/70'}`}
                            >
                              {group.label}
                            </span>
                            <div className="flex flex-wrap gap-1.5 sm:gap-2">
                              {group.items.map(({ value, match }) =>
                                renderVariantLink(match, value, group.showDot),
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    );
                  })()}
                </div>
              )}

              {displayFeaturesList.length > 0 && (
                <>
                  <SectionDivider />
                  <div className="w-full -mt-1">
                    <SectionHeader
                      title={
                        hasDedicatedFeatures
                          ? language === 'tr'
                            ? 'Öne Çıkan Özellikler'
                            : 'Key Features'
                          : language === 'tr'
                            ? 'Teknik Detaylar'
                            : 'Technical Details'
                      }
                      icon={
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          {hasDedicatedFeatures ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2.5}
                              d="M5 13l4 4L19 7"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          )}
                        </svg>
                      }
                    />

                    <ul
                      className={`flex w-fit max-w-2xl mx-auto flex-wrap justify-center items-center gap-3 -mt-4 rounded-[1.75rem] border p-3 md:p-4 ${isLight ? 'bg-white border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]' : 'bg-white/[0.02] border-white/[0.06]'}`}
                    >
                      {displayFeaturesList.map((feat, idx) => {
                        const isYerliUretim =
                          feat.trim().toLowerCase() === 'yerli üretim' ||
                          feat.trim().toLowerCase() === 'domestic production';
                        const isTse = feat.trim().toLowerCase() === 'tse';
                        const isLogoBadge = isYerliUretim || isTse;
                        return (
                          <li
                            key={idx}
                            className={`flex ${isLogoBadge ? 'items-center justify-center' : 'items-center'} gap-2.5 px-3.5 py-3 rounded-2xl transition-colors duration-300 ${isLight ? 'hover:bg-zinc-50' : 'hover:bg-white/[0.04]'}`}
                          >
                            {isYerliUretim ? (
                              <div
                                className={`rounded-lg border p-1.5 ${isLight ? 'border-zinc-200 bg-white' : 'border-white/10 bg-white/[0.04]'}`}
                              >
                                <div className="relative w-[92px] h-[33px]">
                                  <Image
                                    src={getAssetPath(
                                      '/images/yerli-uretim-logo-cropped.webp',
                                    )}
                                    alt="Yerli Üretim"
                                    fill
                                    className="object-contain"
                                  />
                                </div>
                              </div>
                            ) : isTse ? (
                              <div className="relative w-[50px] h-[50px]">
                                <Image
                                  src={getAssetPath('/images/tse-logo.webp')}
                                  alt="TSE"
                                  fill
                                  className="object-contain"
                                />
                              </div>
                            ) : (
                              <>
                                <div
                                  className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isLight ? themePillBg : 'bg-white/[0.06] border border-white/10'}`}
                                >
                                  <svg
                                    className={`w-3.5 h-3.5 ${isLight ? themeText : 'text-white'}`}
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={3}
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                </div>
                                <span
                                  className={`text-sm font-medium leading-snug ${isLight ? 'text-zinc-700' : 'text-zinc-300'}`}
                                >
                                  {feat}
                                </span>
                              </>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </>
              )}
            </div>
          </div>

          {hasDedicatedFeatures && specAttrs.length > 0 && (
            <div className="w-full flex flex-col gap-10 lg:gap-14">
              <SectionDivider />

              <div className="w-full pb-3">
                <SectionHeader
                  title={
                    language === 'tr' ? 'Teknik Detaylar' : 'Technical Details'
                  }
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2.5}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  }
                />

                {specAttrs.length > 0 ? (
                  (() => {
                    const opts = product.variantOptions || {
                      light: null,
                      casing: null,
                      watt: null,
                      socket: null,
                    };
                    const preparedSpecs = specAttrs.map((attr) => {
                      let decodedValue = String(attr.value)
                        .replace(/&lt;/g, '<')
                        .replace(/&gt;/g, '>')
                        .replace(/&amp;/g, '&');
                      const labelLower = attr.label.toLowerCase();
                      if (
                        (labelLower.includes('duy') ||
                          labelLower.includes('socket')) &&
                        opts.socket
                      ) {
                        decodedValue = opts.socket;
                      }
                      if (
                        (labelLower.includes('güç') ||
                          labelLower.includes('guc') ||
                          labelLower.includes('watt')) &&
                        opts.watt
                      ) {
                        decodedValue = opts.watt;
                      }
                      return { attr, decodedValue };
                    });

                    const compactSpecs = preparedSpecs.filter(
                      (s) => s.decodedValue.length <= 40,
                    );
                    const longSpecs = preparedSpecs.filter(
                      (s) => s.decodedValue.length > 40,
                    );

                    return (
                      <div className="flex flex-col gap-4">
                        {compactSpecs.length > 0 && (
                          <dl className="flex flex-wrap justify-center gap-3 lg:gap-4">
                            {compactSpecs.map(
                              ({ attr, decodedValue }, index) => (
                                <div
                                  key={index}
                                  className={`group relative flex-1 min-w-[138px] max-w-[260px] flex flex-col items-center justify-center text-center gap-2.5 p-5 rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1.5 ${isLight ? 'bg-white border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_30px_-12px_rgba(0,0,0,0.12)]' : 'bg-white/[0.03] border-white/[0.07] hover:bg-white/[0.06] hover:border-white/[0.12]'}`}
                                >
                                  <span
                                    className={`absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full transition-all duration-300 group-hover:w-14 ${isLight ? themeColor : 'bg-white/25'}`}
                                  />
                                  <div
                                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? `${themePillBg} ${themeText}` : 'bg-white/[0.06] border border-white/10 text-white/80'}`}
                                  >
                                    {getSpecIcon(attr.label)}
                                  </div>
                                  <dt
                                    className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}
                                  >
                                    {attr.label}
                                  </dt>
                                  <dd
                                    className={`m-0 text-[15px] md:text-base font-semibold leading-snug tracking-normal ${isLight ? 'text-zinc-800' : 'text-white'}`}
                                  >
                                    {decodedValue}
                                  </dd>
                                </div>
                              ),
                            )}
                          </dl>
                        )}

                        {longSpecs.length > 0 && (
                          <dl className="flex flex-col gap-3 max-w-2xl mx-auto w-full">
                            {longSpecs.map(({ attr, decodedValue }, index) => (
                              <div
                                key={index}
                                className={`flex items-start gap-4 p-5 rounded-2xl border text-left ${isLight ? 'bg-white border-zinc-100 shadow-[0_2px_10px_rgba(0,0,0,0.03)]' : 'bg-white/[0.03] border-white/[0.07]'}`}
                              >
                                <div
                                  className={`flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center ${isLight ? `${themePillBg} ${themeText}` : 'bg-white/[0.06] border border-white/10 text-white/80'}`}
                                >
                                  {getSpecIcon(attr.label)}
                                </div>
                                <div className="flex flex-col gap-1 min-w-0">
                                  <dt
                                    className={`text-[10px] md:text-xs font-bold uppercase tracking-widest ${isLight ? 'text-zinc-400' : 'text-zinc-500'}`}
                                  >
                                    {attr.label}
                                  </dt>
                                  <dd
                                    className={`m-0 text-sm md:text-base font-semibold leading-relaxed ${isLight ? 'text-zinc-800' : 'text-white'}`}
                                  >
                                    {decodedValue}
                                  </dd>
                                </div>
                              </div>
                            ))}
                          </dl>
                        )}
                      </div>
                    );
                  })()
                ) : (
                  <div
                    className={`p-8 rounded-3xl border border-dashed flex items-center justify-center max-w-2xl mx-auto ${isLight ? 'bg-white/50 border-zinc-200 text-zinc-400' : 'bg-white/5 border-white/10 text-zinc-500'}`}
                  >
                    <span className="font-medium text-sm">
                      {language === 'tr'
                        ? 'Bu ürüne ait detaylı teknik veri bulunmamaktadır.'
                        : 'No detailed technical data available.'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {videoId && (
            <>
              <SectionDivider />
              <div className="w-full max-w-3xl mx-auto">
                <SectionHeader
                  title={
                    language === 'tr' ? 'Kurulum Videosu' : 'Installation Video'
                  }
                  icon={
                    <svg
                      className="w-4 h-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  }
                />

                <div className="w-full relative group">
                  <div
                    className={`absolute -inset-2 md:-inset-4 ${isLight ? 'bg-gradient-to-r from-blue-100 via-blue-50 to-blue-100' : 'bg-gradient-to-r from-[var(--brand-red)] via-orange-500 to-[var(--brand-red)]'} rounded-[2.5rem] md:rounded-[3rem] opacity-20 blur-2xl transition-opacity duration-700 group-hover:opacity-40 pointer-events-none`}
                  />

                  <div
                    className="w-full aspect-video rounded-[2rem] overflow-hidden border border-white/20 shadow-[0_0_50px_rgba(0,0,0,0.1)] relative z-10 bg-black cursor-pointer group/video"
                    onClick={() => setIsVideoPlaying(true)}
                  >
                    {!isVideoPlaying ? (
                      <>
                        <img
                          src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
                          alt="Video Thumbnail"
                          className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105 opacity-80 group-hover/video:opacity-100"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div
                            className={`w-24 h-24 ${isLight ? 'bg-blue-600' : 'bg-[var(--brand-red)]'} rounded-full flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.6)] transform transition-transform duration-300 group-hover/video:scale-110`}
                          >
                            <svg
                              className="w-10 h-10 text-white translate-x-[3px]"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </div>
                        </div>
                      </>
                    ) : (
                      <iframe
                        className="w-full h-full object-cover"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&controls=1&rel=0&modestbranding=1`}
                        title="Kurulum Videosu"
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                      ></iframe>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </article>
      </div>

      {lightboxOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 backdrop-blur-md p-6 md:p-12 animate-[kdlFadeInUp_0.3s_ease-out]"
          onClick={() => setLightboxOpen(false)}
        >
          <button
            type="button"
            onClick={() => setLightboxOpen(false)}
            aria-label={language === 'tr' ? 'Kapat' : 'Close'}
            className="absolute top-5 right-5 md:top-8 md:right-8 w-11 h-11 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
          <img
            src={imageUrl}
            alt={name}
            onClick={(e) => e.stopPropagation()}
            className="max-w-full max-h-full object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)]"
          />
        </div>
      )}
    </div>
  );
}

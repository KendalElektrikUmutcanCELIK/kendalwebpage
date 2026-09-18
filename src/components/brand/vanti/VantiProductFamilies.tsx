'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useMemo } from 'react';
import type { ProductListItem } from '@/data/products';
import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';

interface VantiProductFamiliesProps {
  label: string;
  title: string;
  allProducts: ProductListItem[];
  language: Language;
}

interface FamilyDef {
  key: string;
  name: { tr: string; en: string; ar: string; es: string; de: string; zh: string };
  query: string;
  productId: string;
}

const FAMILIES: FamilyDef[] = [
  {
    key: 'tavan',
    name: {
      tr: 'Tavan Vantilatörleri',
      en: 'Ceiling Fans',
      ar: 'مراوح السقف',
      es: 'Ventiladores de Techo',
      de: 'Deckenventilatoren',
      zh: '吊扇',
    },
    query: 'tavan vanti',
    productId: 'KCF306',
  },
  {
    key: 'sanayi',
    name: {
      tr: 'Sanayi Tipi Vantilatörler',
      en: 'Industrial Fans',
      ar: 'مراوح صناعية',
      es: 'Ventiladores Industriales',
      de: 'Industrieventilatoren',
      zh: '工业风扇',
    },
    query: 'sanayi',
    productId: 'KCF291',
  },
  {
    key: 'ayakli',
    name: {
      tr: 'Ayaklı Vantilatörler',
      en: 'Stand Fans',
      ar: 'مراوح واقفة',
      es: 'Ventiladores de Pie',
      de: 'Standventilatoren',
      zh: '落地扇',
    },
    query: 'ayakl',
    productId: 'KCF272L',
  },
  {
    key: 'duvar',
    name: {
      tr: 'Duvar Tipi Vantilatörler',
      en: 'Wall Fans',
      ar: 'مراوح حائط',
      es: 'Ventiladores de Pared',
      de: 'Wandventilatoren',
      zh: '壁扇',
    },
    query: 'duvar ti',
    productId: 'KCF299D',
  },
  {
    key: 'masaustu',
    name: {
      tr: 'Masaüstü Fanlar',
      en: 'Desktop Fans',
      ar: 'مراوح مكتبية',
      es: 'Ventiladores de Escritorio',
      de: 'Tischventilatoren',
      zh: '桌面风扇',
    },
    query: 'masaüstü',
    productId: 'KCF295',
  },
  {
    key: 'sarjli',
    name: {
      tr: 'Şarjlı El Vantilatörleri',
      en: 'Rechargeable Hand Fans',
      ar: 'مراوح يدوية قابلة للشحن',
      es: 'Ventiladores de Mano Recargables',
      de: 'Akku-Handventilatoren',
      zh: '充电式手持风扇',
    },
    query: 'şarj',
    productId: 'KCF700',
  },
  {
    key: 'banyo',
    name: {
      tr: 'Banyo Aspiratörleri',
      en: 'Bathroom Extractor Fans',
      ar: 'شفاطات الحمام',
      es: 'Extractores de Baño',
      de: 'Bad-Lüfter',
      zh: '浴室排气扇',
    },
    query: 'banyo',
    productId: 'KSP120',
  },
];

const PRODUCT_WORD: Record<Language, { one: string; many: string }> = {
  tr: { one: 'Ürün', many: 'Ürün' },
  en: { one: 'Product', many: 'Products' },
  ar: { one: 'منتج', many: 'منتجات' },
  es: { one: 'Producto', many: 'Productos' },
  de: { one: 'Produkt', many: 'Produkte' },
  zh: { one: '产品', many: '产品' },
};

export function VantiProductFamilies({
  label,
  title,
  allProducts,
  language,
}: VantiProductFamiliesProps) {
  const catalogBase = getBrandUrunlerHref('vanti');

  const families = useMemo(() => {
    return FAMILIES.map((f) => {
      const q = f.query.toLowerCase();
      const count = allProducts.filter((p) => {
        const model = (p.model || '').toLowerCase();
        const name = (p.name?.tr || '').toLowerCase();
        return model.includes(q) || name.includes(q);
      }).length;
      const rep = allProducts.find((p) => p.id === f.productId);
      return { ...f, count, image: rep?.image };
    }).filter((f) => f.count > 0 && f.image);
  }, [allProducts]);

  if (families.length === 0) return null;

  const duration = Math.max(22, families.length * 6);
  const loopFamilies = [...families, ...families];

  return (
    <section
      className="reveal-text relative z-10 w-full py-12 md:py-16 overflow-hidden"
      style={{ '--accent': '#0f766e' } as CSSProperties}
    >
      <div className="mb-10 md:mb-14 px-6 md:px-16 lg:px-24">
        <div className="inline-flex flex-col gap-4 bg-white/60 backdrop-blur-xl border border-white/70 shadow-[0_8px_32px_rgba(0,0,0,0.08)] rounded-[2rem] px-6 py-5 md:px-9 md:py-7">
          <h3 className="font-semibold tracking-widest uppercase text-sm md:text-base text-teal-700 flex items-center gap-4">
            <span className="w-12 h-[2px] rounded-full bg-teal-600 block"></span>
            {label}
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight text-teal-950">
            {title}
          </h2>
        </div>
      </div>

      <div className="k2-marquee-pause relative">
        <div className="k2-marquee-fade-mask overflow-hidden motion-reduce:overflow-x-auto">
          <div
            className="k2-marquee-track flex w-max gap-4 md:gap-5 px-6 md:px-16 lg:px-24"
            style={{ animationDuration: `${duration}s` }}
          >
            {loopFamilies.map((f, i) => (
              <Link
                key={`${f.key}-${i}`}
                href={`${catalogBase}?q=${encodeURIComponent(f.query)}`}
                tabIndex={i < families.length ? 0 : -1}
                aria-hidden={i >= families.length}
                className="group shrink-0 flex items-center gap-4 rounded-2xl p-3 pr-6 md:pr-7 min-w-[270px] sm:min-w-[310px] bg-white border border-black/5 shadow-sm hover:shadow-[0_20px_40px_-20px_rgba(15,118,110,0.35)] hover:-translate-y-1 transition-all duration-300"
              >
                <span className="relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden bg-zinc-50">
                  <Image
                    src={getAssetPath('/images/' + f.image)}
                    alt=""
                    fill
                    sizes="112px"
                    className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                    loading="lazy"
                  />
                </span>
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-lg md:text-xl leading-snug text-teal-950 truncate">
                    {resolveLocalized(f.name, language)}
                  </h4>
                  <p className="text-sm text-teal-700/60 font-medium mt-0.5">
                    {f.count}{' '}
                    {f.count === 1
                      ? PRODUCT_WORD[language].one
                      : PRODUCT_WORD[language].many}
                  </p>
                </div>
                <svg
                  className="w-5 h-5 shrink-0 text-zinc-300 transition-all duration-300 group-hover:translate-x-1 group-hover:text-teal-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

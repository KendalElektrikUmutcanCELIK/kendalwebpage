'use client';

import Image from 'next/image';
import Link from 'next/link';
import { type CSSProperties, useMemo } from 'react';
import {
  getCategoryGroupForCategory,
  type ProductListItem,
} from '@/data/products';
import { getAssetPath, getBrandUrunlerHref } from '@/lib/basePath';

interface CategoryShowcaseProps {
  label: string;
  title: string;
  allProducts: ProductListItem[];
  language: string;
  brandName: string;
  accent: string;
  countLabel: string;
  viewAllLabel: string;
  align?: 'left' | 'right';
  theme?: 'dark' | 'light';
}

interface CategoryItem {
  key: string;
  displayName: string;
  count: number;
  href: string;
  sampleImage?: string;
}

export function CategoryShowcase({
  label,
  title,
  allProducts,
  language,
  brandName,
  accent,
  countLabel,
  viewAllLabel,
  align = 'left',
  theme = 'dark',
}: CategoryShowcaseProps) {
  const lang = language === 'en' ? 'en' : 'tr';
  const isDark = theme === 'dark';
  const catalogBase = getBrandUrunlerHref(brandName);

  const categories = useMemo<CategoryItem[]>(() => {
    const raw = new Map<
      string,
      { nameTr: string; nameEn?: string; count: number; sampleImage?: string }
    >();
    for (const p of allProducts) {
      const nameTr = p.category?.tr?.[0];
      if (!nameTr) continue;
      const nameEn = p.category?.en?.[0];
      const existing = raw.get(nameTr);
      if (existing) {
        existing.count += 1;
        if (!existing.nameEn && nameEn) existing.nameEn = nameEn;
      } else {
        raw.set(nameTr, { nameTr, nameEn, count: 1, sampleImage: p.image });
      }
    }

    const isK2 = brandName === 'k2';
    const groups = new Map<
      string,
      { nameTr: string; nameEn: string; count: number; sampleImage?: string }
    >();
    const items: CategoryItem[] = [];

    for (const cat of raw.values()) {
      const groupDef = isK2
        ? getCategoryGroupForCategory(cat.nameTr, brandName)
        : undefined;
      if (groupDef) {
        const g = groups.get(groupDef.key);
        if (g) g.count += cat.count;
        else
          groups.set(groupDef.key, {
            nameTr: groupDef.name.tr,
            nameEn: groupDef.name.en,
            count: cat.count,
            sampleImage: cat.sampleImage,
          });
        continue;
      }
      items.push({
        key: cat.nameTr,
        displayName: (lang === 'en' ? cat.nameEn : cat.nameTr) || cat.nameTr,
        count: cat.count,
        href: `${catalogBase}?category=${encodeURIComponent(cat.nameTr)}`,
        sampleImage: cat.sampleImage,
      });
    }

    for (const [key, g] of groups) {
      items.push({
        key,
        displayName: (lang === 'en' ? g.nameEn : g.nameTr) || g.nameTr,
        count: g.count,
        href: `${catalogBase}?group=${key}`,
        sampleImage: g.sampleImage,
      });
    }

    const collator = new Intl.Collator(lang === 'en' ? 'en' : 'tr', {
      sensitivity: 'base',
    });
    items.sort((a, b) => collator.compare(a.displayName, b.displayName));
    return items;
  }, [allProducts, brandName, lang, catalogBase]);

  if (categories.length === 0) return null;

  const duration = Math.max(20, categories.length * 4.5);
  const loopItems = [...categories, ...categories];

  return (
    <section
      className="reveal-text relative z-10 w-full py-12 md:py-16 overflow-hidden"
      style={{ '--accent': accent } as CSSProperties}
    >
      <div className="mb-10 md:mb-14 px-6 md:px-24 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
        <div>
          <h3
            className="font-semibold tracking-widest mb-4 uppercase text-sm md:text-base text-[var(--accent)] border-l-2 pl-4"
            style={{ borderColor: accent }}
          >
            {label}
          </h3>
          <h2 className="text-3xl md:text-5xl font-bold leading-tight">
            {title}
          </h2>
        </div>
        <Link
          href={catalogBase}
          className={`group inline-flex items-center gap-2 shrink-0 text-sm font-bold uppercase tracking-wide ${
            isDark
              ? 'text-white/60 hover:text-white'
              : 'text-zinc-500 hover:text-zinc-900'
          } transition-colors duration-300`}
        >
          {viewAllLabel}
          <svg
            className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-300"
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
      </div>

      <div className="k2-marquee-pause relative">
        <div className="k2-marquee-fade-mask overflow-hidden motion-reduce:overflow-x-auto">
          <div
            className={`k2-marquee-track flex w-max gap-4 md:gap-5 ${align === 'right' ? 'k2-marquee-reverse' : ''}`}
            style={{ animationDuration: `${duration}s` }}
          >
            {loopItems.map((item, i) => (
              <Link
                key={`${item.key}-${i}`}
                href={item.href}
                tabIndex={i < categories.length ? 0 : -1}
                aria-hidden={i >= categories.length}
                className={`group shrink-0 flex items-center gap-4 rounded-2xl p-3 pr-6 md:pr-7 min-w-[270px] sm:min-w-[310px] transition-all duration-300 hover:-translate-y-1 ${
                  isDark
                    ? 'bg-white/5 border border-white/10 hover:border-[var(--accent)] hover:bg-white/[0.08]'
                    : 'bg-white border border-black/5 shadow-sm hover:shadow-[0_20px_40px_-20px_color-mix(in_srgb,var(--accent)_35%,transparent)]'
                }`}
              >
                <span
                  className={`relative shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-xl overflow-hidden ${
                    isDark ? 'bg-white/10' : 'bg-zinc-50'
                  }`}
                >
                  {item.sampleImage && (
                    <Image
                      src={getAssetPath('/images/' + item.sampleImage)}
                      alt=""
                      fill
                      sizes="112px"
                      className="object-contain p-3 transition-transform duration-500 ease-out group-hover:scale-110"
                      loading="lazy"
                    />
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <h4
                    className={`font-bold text-lg md:text-xl leading-snug truncate ${isDark ? 'text-white' : 'text-zinc-900'}`}
                  >
                    {item.displayName}
                  </h4>
                </div>
                <svg
                  className={`w-5 h-5 shrink-0 transition-all duration-300 group-hover:translate-x-1 group-hover:text-[var(--accent)] ${
                    isDark ? 'text-white/30' : 'text-zinc-300'
                  }`}
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

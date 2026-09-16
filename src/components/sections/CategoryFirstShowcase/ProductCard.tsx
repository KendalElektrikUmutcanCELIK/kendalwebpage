'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product } from '@/data/products';
import { getAssetPath } from '@/lib/basePath';
import { getProductCardUrl } from './helpers';

function stripVariantTokens(name: string): string {
  const words = name.trim().split(' ');
  return words
    .filter((w) => {
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

interface ProductCardTexts {
  model: string;
  view: string;
}

interface CompareTexts {
  add: string;
  added: string;
  max_reached: string;
}

interface ProductCardProps {
  product: Product;
  language: string;
  brandName: string;
  isBrandRoute: boolean;
  isK2: boolean;
  isGlobal: boolean;
  showcaseTexts: ProductCardTexts;
  canCompare: boolean;
  isCompared: boolean;
  isCompareMaxed: boolean;
  compareTexts: CompareTexts;
  onToggleCompare: (product: Product) => void;
  index?: number;
}

export function ProductCard({
  product,
  language,
  brandName,
  isBrandRoute,
  isK2,
  isGlobal,
  showcaseTexts,
  canCompare,
  isCompared,
  isCompareMaxed,
  compareTexts,
  onToggleCompare,
  index = 0,
}: ProductCardProps) {
  const productUrl = getProductCardUrl(product, brandName, isBrandRoute);
  const isVanti = brandName === 'vanti';

  let displayName =
    product.name[language as keyof typeof product.name] || product.name.tr;
  if (isGlobal) {
    displayName = stripVariantTokens(displayName);
  }

  const accentGradient = isK2
    ? 'from-orange-400 to-amber-500'
    : isVanti
      ? 'from-blue-400 to-cyan-500'
      : 'from-amber-300 to-yellow-400';
  const blobClass = isK2
    ? 'bg-orange-200/50'
    : isVanti
      ? 'bg-blue-200/50'
      : 'bg-amber-200/50';
  const ctaClass = isK2
    ? 'bg-orange-600 group-hover:bg-orange-700 text-white'
    : isVanti
      ? 'bg-blue-600 group-hover:bg-blue-700 text-white'
      : 'bg-[#FFDA51] group-hover:bg-[#f0c93e] text-zinc-900';
  const borderHoverClass = isK2
    ? 'hover:border-orange-200'
    : isVanti
      ? 'hover:border-blue-200'
      : 'hover:border-amber-200';

  return (
    <Link
      href={productUrl}
      style={{ animationDelay: `${Math.min(index, 10) * 40}ms` }}
      className={`animate-in fade-in slide-in-from-bottom-2 fill-mode-both bg-white rounded-[1.75rem] overflow-hidden shadow-sm hover:shadow-[0_25px_50px_-18px_rgba(0,0,0,0.2)] hover:-translate-y-1.5 transition-all duration-300 ease-out group border border-zinc-100 flex flex-col relative ${borderHoverClass}`}
    >
      <span
        className={`absolute inset-x-0 top-0 h-[3px] z-20 bg-gradient-to-r ${accentGradient}`}
      />

      <div className="flex flex-col overflow-hidden bg-gradient-to-b from-zinc-50 to-white">
        <div className="pt-3 sm:pt-5" />
        <div className="relative aspect-square flex items-center justify-center">
          <div
            className={`absolute w-2/3 h-2/3 rounded-full blur-3xl opacity-60 group-hover:opacity-100 transition-opacity duration-500 ${blobClass}`}
          />

          {canCompare && (
            <button
              type="button"
              title={
                isCompareMaxed ? compareTexts.max_reached : compareTexts.add
              }
              disabled={isCompareMaxed}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onToggleCompare(product);
              }}
              className={`absolute top-2 left-2 sm:top-3 sm:left-3 z-20 flex items-center gap-1 sm:gap-1.5 pl-1 pr-1.5 py-1 sm:pl-1.5 sm:pr-2.5 sm:py-1.5 rounded-full text-[9px] sm:text-[11px] font-bold border shadow-sm transition-all duration-200 ${
                isCompared
                  ? isK2
                    ? 'bg-orange-500 border-orange-500 text-white'
                    : isVanti
                      ? 'bg-blue-600 border-blue-600 text-white'
                      : 'bg-zinc-900 border-zinc-900 text-white'
                  : isCompareMaxed
                    ? 'bg-white/80 border-zinc-200 text-zinc-300 cursor-not-allowed'
                    : 'bg-white/90 backdrop-blur-sm border-zinc-200 text-zinc-500 hover:border-zinc-300 hover:text-zinc-700'
              }`}
            >
              <span
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0 ${isCompared ? 'bg-white/25 border-white/60' : 'border-zinc-300'}`}
              >
                {isCompared && (
                  <svg
                    className="w-2.5 h-2.5 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
              </span>
              {isCompared ? compareTexts.added : compareTexts.add}
            </button>
          )}

          <Image
            src={getAssetPath('/images/' + product.image)}
            alt={displayName}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
            style={{
              maskImage:
                'radial-gradient(ellipse 70% 70% at 50% 52%, black 68%, transparent 100%)',
              WebkitMaskImage:
                'radial-gradient(ellipse 70% 70% at 50% 52%, black 68%, transparent 100%)',
            }}
            className="relative z-10 object-contain p-2 sm:p-3 scale-[1.08] group-hover:scale-[1.15] group-hover:-translate-y-1 transition-transform duration-500 ease-out"
          />

          <span
            className={`absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-20 w-7 h-7 sm:w-9 sm:h-9 rounded-full flex items-center justify-center scale-0 group-hover:scale-100 transition-transform duration-300 ease-out shadow-lg ${ctaClass}`}
          >
            <svg
              className="w-3.5 h-3.5 sm:w-4 sm:h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2.5}
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </span>
        </div>
      </div>

      <div className="p-3 pt-2.5 sm:p-5 sm:pt-4 flex flex-col flex-grow border-t border-zinc-50">
        <div className="text-[9px] sm:text-[11px] font-bold text-zinc-400 mb-1 sm:mb-1.5 tracking-wider uppercase">
          {showcaseTexts.model} {product.model}
        </div>
        <h4
          className="font-bold text-xs sm:text-sm leading-snug line-clamp-2 text-zinc-800"
          title={displayName}
        >
          {displayName}
        </h4>
      </div>
    </Link>
  );
}

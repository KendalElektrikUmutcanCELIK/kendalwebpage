'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { BrandHomeLink } from '@/components/shared/BrandHomeLink';
import { LanguageSwitcher } from '@/components/ui/LanguageSwitcher';
import {
  getAssetPath,
  getBrandHomeHref,
  getBrandUrunlerHref,
} from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface BrandNavbarProps {
  brandName: string;
}

export const BrandNavbar = ({ brandName }: BrandNavbarProps) => {
  const { t } = useLanguage();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const isGlobalHomePage =
    brandName === 'global' &&
    (pathname === '/brand/global' ||
      pathname === '/brand/global/' ||
      pathname === '/');
  const [isVisible, setIsVisible] = useState(!isGlobalHomePage);

  const isK2 = brandName === 'k2';
  const logoSrc = isK2
    ? getAssetPath('/images/brands/k2-logo.svg')
    : brandName === 'vanti'
      ? getAssetPath('/images/brands/vanti-logo.svg')
      : getAssetPath('/images/brands/global-logo.svg');

  const brandThemes = {
    k2: {
      hoverText: 'hover:text-orange-600',
      hoverBg: 'hover:bg-orange-50',
      activeGlow: 'shadow-orange-500/20',
      btn: 'bg-orange-600 hover:bg-orange-700 text-white shadow-orange-600/25',
      mobileBg: 'bg-zinc-900/95',
    },
    vanti: {
      hoverText: 'hover:text-blue-600',
      hoverBg: 'hover:bg-blue-50',
      activeGlow: 'shadow-blue-500/20',
      btn: 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-600/25',
      mobileBg: 'bg-zinc-900/95',
    },
    global: {
      hoverText: 'hover:text-yellow-600',
      hoverBg: 'hover:bg-yellow-50',
      activeGlow: 'shadow-yellow-400/20',
      btn: 'bg-[#FFDA51] hover:bg-[#EBC33B] text-zinc-900 shadow-yellow-400/25',
      mobileBg: 'bg-zinc-900/95',
    },
  };

  const theme =
    brandThemes[brandName as keyof typeof brandThemes] || brandThemes.k2;

  const homeHref = getBrandHomeHref(brandName);
  const urunlerHref = getBrandUrunlerHref(brandName);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isGlobalHomePage) {
      setIsVisible(false);
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 2200);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(true);
    }
  }, [pathname, isGlobalHomePage]);

  return (
    <>
      <nav
        className={`fixed top-0 lg:top-5 left-0 lg:left-1/2 lg:-translate-x-1/2 w-full lg:w-[calc(100%-2rem)] max-w-[880px] z-50 text-zinc-800 transition-all duration-700 ease-out ${
          !isVisible
            ? 'opacity-0 -translate-y-4 pointer-events-none'
            : 'opacity-100 translate-y-0'
        } ${
          scrolled
            ? `lg:py-3 py-3 lg:px-7 px-4 bg-white/90 backdrop-blur-2xl border-b lg:border border-zinc-200/60 shadow-lg ${theme.activeGlow} lg:rounded-full`
            : 'lg:py-4 py-4 lg:px-8 px-4 bg-white/95 backdrop-blur-xl border-b lg:border border-zinc-200/40 shadow-sm lg:rounded-full'
        }`}
      >
        <div className="flex items-center justify-between w-full relative">
          <BrandHomeLink
            href={homeHref}
            className="relative flex items-center hover:opacity-80 transition-all duration-300 z-50 hover:scale-105"
          >
            <Image
              src={logoSrc}
              alt={`${brandName} Logo`}
              width={140}
              height={45}
              priority
              className={`w-auto object-contain transition-all duration-300 ${scrolled ? 'h-7 md:h-8' : 'h-8 md:h-10'}`}
            />
          </BrandHomeLink>

          <div className="hidden lg:flex items-center gap-2 text-[15px] font-semibold absolute left-1/2 -translate-x-1/2">
            <BrandHomeLink
              href={homeHref}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-zinc-600 ${theme.hoverText} ${theme.hoverBg}`}
            >
              {(t as any).brand_pages?.navbar?.home || 'Ana Sayfa'}
            </BrandHomeLink>
            <Link
              href={urunlerHref}
              className={`px-4 py-2 rounded-full transition-all duration-300 text-zinc-600 ${theme.hoverText} ${theme.hoverBg}`}
            >
              {(t as any).brand_pages?.navbar?.products || 'Ürünler'}
            </Link>
          </div>

          <div className="flex items-center gap-3 md:gap-5 z-50">
            <div className="hidden md:block">
              <LanguageSwitcher />
            </div>

            <BrandHomeLink
              href={`${homeHref}#iletisim`}
              className={`hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold transition-all duration-300 shadow-lg hover:-translate-y-0.5 hover:shadow-xl ${theme.btn}`}
            >
              <span>
                {(t as any).brand_pages?.navbar?.cta || 'Bize Ulaşın'}
              </span>
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                />
              </svg>
            </BrandHomeLink>

            <div className="md:hidden">
              <LanguageSwitcher />
            </div>

            <button
              className="lg:hidden p-2.5 -mr-2 bg-zinc-100 rounded-full text-zinc-700 hover:text-zinc-900 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle Mobile Menu"
            >
              {isMobileMenuOpen ? (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out lg:hidden ${
          isMobileMenuOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute inset-0 ${theme.mobileBg} backdrop-blur-2xl`}
          onClick={() => setIsMobileMenuOpen(false)}
        />
        <div
          className={`absolute top-[80px] left-0 w-full flex flex-col p-8 gap-6 text-center text-xl font-bold transition-all duration-500 delay-100 ${
            isMobileMenuOpen
              ? 'translate-y-0 opacity-100'
              : '-translate-y-8 opacity-0'
          }`}
        >
          <BrandHomeLink
            href={homeHref}
            className="text-white/80 hover:text-white transition-colors py-2 border-b border-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {(t as any).brand_pages?.navbar?.home || 'Ana Sayfa'}
          </BrandHomeLink>
          <Link
            href={urunlerHref}
            className="text-white/80 hover:text-white transition-colors py-2 border-b border-white/10"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {(t as any).brand_pages?.navbar?.products || 'Ürünler'}
          </Link>
          <BrandHomeLink
            href={`${homeHref}#iletisim`}
            className={`mt-4 py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl ${theme.btn}`}
            onClick={() => setIsMobileMenuOpen(false)}
          >
            {(t as any).brand_pages?.navbar?.cta || 'Bize Ulaşın'}
          </BrandHomeLink>
          <Link
            href="https://www.kendalelektrik.com"
            className="mt-2 py-4 rounded-2xl flex items-center justify-center bg-[#111] hover:bg-black transition-colors shadow-lg border border-zinc-800"
          >
            <Image
              src={getAssetPath('/images/kendal-logo.svg')}
              alt="Kendal Elektrik"
              width={220}
              height={50}
              className="w-auto h-11 object-contain"
            />
          </Link>
        </div>
      </div>

      {/* Right Side Vertical Kendal Return Button (Desktop Only) */}
      <Link
        href="https://www.kendalelektrik.com"
        className="fixed right-0 top-1/2 z-40 hidden md:flex items-center justify-center bg-[#111] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] rounded-t-2xl px-6 py-4 border border-b-0 border-zinc-800 transition-all duration-300 origin-center -rotate-90 translate-x-[calc(50%-34px)] -translate-y-1/2 hover:translate-x-[calc(50%-44px)]"
      >
        <Image
          src={getAssetPath('/images/kendal-logo.svg')}
          alt="Kendal Elektrik"
          width={220}
          height={50}
          className="h-9 w-auto object-contain"
        />
      </Link>
    </>
  );
};

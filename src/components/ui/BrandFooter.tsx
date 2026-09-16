'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getAssetPath, getBrandHomeHref } from '@/lib/basePath';
import siteSettings from '@/data/settings.json';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

interface BrandFooterProps {
  brandName: string;
}

export const BrandFooter = ({ brandName }: BrandFooterProps) => {
  const { t, language } = useLanguage();
  const contact = siteSettings[language];
  const isK2 = brandName === 'k2';
  const logoSrc = isK2
    ? getAssetPath('/images/brands/k2-logo.svg')
    : brandName === 'vanti'
      ? getAssetPath('/images/brands/vanti-logo.svg')
      : getAssetPath('/images/brands/global-logo.svg');

  return (
    <footer
      className="relative z-10 w-full bg-zinc-50 text-zinc-600 py-16 px-6 border-t-2 border-zinc-200"
      id="iletisim"
    >
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
        <div className="md:col-span-1 text-center flex flex-col items-center">
          <Link
            href={getBrandHomeHref(brandName)}
            className="font-bold text-2xl md:text-3xl tracking-tight mb-6 flex flex-col items-center gap-4 hover:opacity-80 transition-opacity"
          >
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-zinc-100">
              <Image
                src={logoSrc}
                alt={brandName}
                width={180}
                height={60}
                className="h-14 w-auto object-contain"
              />
            </div>
          </Link>
          <a
            href="https://www.google.com/maps/place/Kendal+Elektrik+A.%C5%9E./@41.0699578,28.3202748,17z/data=!3m1!4b1!4m6!3m5!1s0x14b541f701f7e257:0xe2e0245245cd5b6f!8m2!3d41.0699539!4d28.3251457!16s%2Fg%2F11r35kq4hq"
            target="_blank"
            rel="noopener noreferrer"
            className="group relative block w-full max-w-xs overflow-hidden rounded-xl border border-zinc-200 text-left shadow-sm transition-shadow hover:shadow-md"
          >
            {/*
              Static pre-rendered map snapshot (OpenStreetMap tiles, captured
              once at build time and shipped as a plain webp) — same asset
              used by the main site footer. Not a live map embed: zero tile
              or JS requests at runtime. See CLAUDE.md: no map libraries.
            */}
            <div className="relative h-36 w-full bg-black">
              <Image
                src={getAssetPath('/images/footer-location-map.webp')}
                alt="Kendal Elektrik konum haritası"
                fill
                sizes="320px"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10 transition-colors group-hover:from-black/90" />
              <span
                className="absolute flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                style={{ left: '48.7%', top: '50.1%' }}
              >
                <span className="footer-map-ring absolute h-6 w-6 rounded-full bg-[var(--brand-red)]/50" />
                <span className="footer-map-ring footer-map-ring-delay absolute h-6 w-6 rounded-full bg-[var(--brand-red)]/50" />
                <span className="relative h-2.5 w-2.5 rounded-full bg-[var(--brand-red)] shadow-[0_0_8px_var(--brand-red)]" />
              </span>

              <div className="absolute inset-x-0 bottom-0 px-4 pb-3 pt-6">
                <p className="text-xs leading-relaxed text-gray-200 transition-colors group-hover:text-white">
                  {(t as any).brand_pages?.footer?.address_prefix || 'Adres: '}
                  {contact.address}
                </p>
                <span className="mt-1.5 inline-flex items-center gap-1 text-xs font-semibold text-white opacity-80 transition-opacity group-hover:opacity-100">
                  {(t as any).brand_pages?.footer?.map_cta || 'Haritada Aç'}
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2}
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5-5 5M6 12h12" />
                  </svg>
                </span>
              </div>
            </div>
          </a>
        </div>

        <div className="text-center flex flex-col items-center md:justify-self-center">
          <h4 className="text-zinc-900 font-semibold mb-6 text-center w-full">
            {(t as any).brand_pages?.footer?.contact_title || 'İletişim'}
          </h4>
          <ul className="space-y-3 text-sm">
            <li>
              <span className="opacity-60 block text-xs mb-1">
                {(t as any).brand_pages?.footer?.contact_line ||
                  'İletişim Hattı'}
              </span>
              <a
                href={`tel:${contact.phone}`}
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {contact.phone}
              </a>
            </li>
            <li>
              <span className="opacity-60 block text-xs mb-1">
                {(t as any).brand_pages?.footer?.sales_line ||
                  'Satış Destek Hattı'}
              </span>
              <a
                href={`tel:${contact.salesPhone}`}
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {contact.salesPhone}
              </a>
            </li>
            <li>
              <span className="opacity-60 block text-xs mb-1">
                {(t as any).brand_pages?.footer?.tech_line ||
                  'Teknik Servis Hattı'}
              </span>
              <a
                href={`tel:${contact.supportPhone}`}
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {contact.supportPhone}
              </a>
            </li>
            <li className="pt-2">
              <a
                href={`mailto:${siteSettings.email}`}
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {siteSettings.email}
              </a>
            </li>
          </ul>
        </div>

        <div className="text-center flex flex-col items-center">
          <h4 className="text-zinc-900 font-semibold mb-6 text-center w-full">
            {(t as any).brand_pages?.footer?.legal_title || 'Yasal'}
          </h4>
          <ul className="space-y-3 text-sm mb-8">
            <li>
              <a
                href="https://www.kendalelektrik.com/kvkk"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {(t as any).brand_pages?.footer?.kvkk ||
                  'KVKK Aydınlatma Metni'}
              </a>
            </li>
            <li>
              <a
                href="https://www.kendalelektrik.com/gizlilik-cerez-politikasi"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[var(--brand-red)] transition-colors"
              >
                {(t as any).brand_pages?.footer?.privacy ||
                  'Gizlilik ve Çerez Politikası'}
              </a>
            </li>
          </ul>

          <div className="flex gap-4">
            <a
              href={siteSettings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[var(--brand-red)] transition-colors"
              aria-label="Facebook"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.469h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.469h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
            </a>
            <a
              href={siteSettings.linkedinUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[var(--brand-red)] transition-colors"
              aria-label="LinkedIn"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </a>
            <a
              href={siteSettings.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-[var(--brand-red)] transition-colors"
              aria-label="Instagram"
            >
              <svg fill="currentColor" viewBox="0 0 24 24" className="w-7 h-7">
                <path
                  fillRule="evenodd"
                  d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                  clipRule="evenodd"
                ></path>
              </svg>
            </a>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-zinc-200 flex flex-col items-center justify-center gap-4 text-center text-xs">
        <p className="opacity-60">
          &copy; {new Date().getFullYear()}{' '}
          {isK2 ? 'K2 LED SYSTEMS' : brandName === 'vanti' ? 'VANTİ' : 'GLOBAL'}{' '}
          {(t as any).brand_pages?.footer?.copyright ||
            '- Kendal Elektrik A.Ş. kuruluşudur. Tüm hakları saklıdır.'}
        </p>
      </div>
    </footer>
  );
};

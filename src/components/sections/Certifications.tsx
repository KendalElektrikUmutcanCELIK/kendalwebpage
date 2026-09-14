'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { getAssetPath } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export const Certifications = () => {
  const { t } = useLanguage();

  const certs = [
    {
      id: 'iso',
      label: (t as any).certifications?.iso,
      icon: getAssetPath('/images/certifications/iso.webp'),
      href: '/sertifikalar/iso',
    },
    {
      id: 'tse',
      label: (t as any).certifications?.tse,
      icon: getAssetPath('/images/certifications/tse.webp'),
      href: '/sertifikalar/tse',
    },
    {
      id: 'kalite',
      label: (t as any).certifications?.kalite,
      icon: getAssetPath('/images/certifications/kalite.webp'),
      href: getAssetPath('/images/certifications/K2-ENEC-BELGESI.pdf'),
      external: true,
    },
    {
      id: 'yerli',
      label: (t as any).certifications?.yerli,
      icon: getAssetPath('/images/certifications/yerli-uretim.webp'),
      href: null,
    },
    {
      id: 'marka',
      label: (t as any).certifications?.marka_tescil,
      icon: getAssetPath('/images/certifications/marka-tescil.webp'),
      href: '/sertifikalar/marka-tescil',
    },
  ];

  return (
    <section
      id="certifications"
      className="w-full relative bg-black pt-36 pb-20 md:pb-28 px-6 overflow-hidden min-h-screen"
    >
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/4 w-[1100px] h-[450px] bg-blue-500/60 blur-[110px] rounded-full" />
        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/4 w-[1100px] h-[450px] bg-blue-500/35 blur-[110px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--global-text)] opacity-90 mb-4">
            {(t as any).certifications?.title || 'Sertifikalarımız'}
          </h1>
          <div className="h-1.5 w-16 bg-[var(--brand-red)] rounded-full mb-6" />
          <p className="text-gray-400 max-w-2xl">
            {(t as any).certifications?.subtitle ||
              'Kalite ve güvenilirlik anlayışımızı belgeleyen sertifikalarımız ve tescillerimiz.'}
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
          {certs.map((cert, idx) => {
            const cardClassName =
              'cert-item relative flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl bg-[var(--global-text)]/[0.02] border border-[var(--global-text)]/10 transition-all duration-300 group z-10' +
              (cert.href
                ? ' hover:bg-[var(--global-text)]/[0.05] hover:border-[var(--brand-red)] hover:shadow-[0_0_15px_rgba(227,0,15,0.3)] cursor-pointer'
                : ' cursor-default');

            const cardContent = (
              <>
                <div className="relative w-16 h-16 md:w-24 md:h-24 mb-3 md:mb-4 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 drop-shadow-md">
                  <Image
                    src={cert.icon}
                    alt={cert.label || 'Certification'}
                    fill
                    sizes="(max-width: 768px) 64px, 96px"
                    className="object-contain drop-shadow-md"
                  />
                </div>

                <h3 className="text-center text-[13px] md:text-base font-medium text-[var(--global-text)] opacity-70 transition-opacity duration-300 group-hover:opacity-100">
                  {cert.label}
                </h3>
              </>
            );

            if (!cert.href) {
              return (
                <div key={idx} className={cardClassName}>
                  {cardContent}
                </div>
              );
            }

            if (cert.external) {
              return (
                <a
                  key={idx}
                  href={cert.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cardClassName}
                >
                  {cardContent}
                </a>
              );
            }

            return (
              <Link key={idx} href={cert.href} className={cardClassName}>
                {cardContent}
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

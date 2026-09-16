'use client';

import Image from 'next/image';
import { useRef } from 'react';
import siteSettings from '@/data/settings.json';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

const PhoneIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);

const MailIcon = () => (
  <svg
    className="w-6 h-6"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);

export function IletisimClient() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { t, language } = useLanguage();
  const contact = siteSettings[language];

  useIsomorphicLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.contact-block',
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: { trigger: '.contact-blocks', start: 'top 80%' },
        },
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={containerRef}
      className="bg-black text-white pt-36 pb-12 px-6 relative z-10 overflow-hidden"
    >
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[120vw] h-[90vh] pointer-events-none opacity-100 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, #6B7B30 0%, transparent 80%)',
        }}
      />

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--global-text)] opacity-90 mb-4">
            {language === 'tr' ? 'İletişim' : 'Contact Us'}
          </h1>
          <div className="h-1.5 w-16 bg-[var(--brand-red)] rounded-full" />
        </div>

        <div className="contact-blocks grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
          {/* İletişim Bilgileri */}
          <div className="contact-block p-6 md:p-7">
            <ul className="space-y-4">
              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-xl flex items-center justify-center text-[var(--brand-red)]">
                  <PhoneIcon />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    {(t as any).footer?.phone_label || 'İletişim Hattı'}
                  </span>
                  <a
                    href={`tel:${contact.phone}`}
                    className="text-xl font-bold text-white hover:text-[var(--brand-red)] transition-colors"
                  >
                    {contact.phone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-xl flex items-center justify-center text-[var(--brand-red)]">
                  <PhoneIcon />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    {(t as any).footer?.sales_phone_label ||
                      'Satış Destek Hattı'}
                  </span>
                  <a
                    href={`tel:${contact.salesPhone}`}
                    className="text-xl font-bold text-white hover:text-[var(--brand-red)] transition-colors"
                  >
                    {contact.salesPhone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-xl flex items-center justify-center text-[var(--brand-red)]">
                  <PhoneIcon />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    {(t as any).footer?.support_phone_label ||
                      'Teknik Servis Hattı'}
                  </span>
                  <a
                    href={`tel:${contact.supportPhone}`}
                    className="text-xl font-bold text-white hover:text-[var(--brand-red)] transition-colors"
                  >
                    {contact.supportPhone}
                  </a>
                </div>
              </li>

              <li className="flex items-start gap-4 pt-4 border-t border-white/10">
                <div className="flex-shrink-0 w-10 h-10 bg-[var(--brand-red)]/10 border border-[var(--brand-red)]/30 rounded-xl flex items-center justify-center text-[var(--brand-red)]">
                  <MailIcon />
                </div>
                <div>
                  <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1">
                    E-Posta
                  </span>
                  <a
                    href={`mailto:${siteSettings.email}`}
                    className="text-lg font-medium text-gray-300 hover:text-[var(--brand-red)] transition-colors"
                  >
                    {siteSettings.email}
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Harita ve Adres */}
          <div className="contact-block flex flex-col">
            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider block mb-1.5">
              {language === 'tr' ? 'Adres' : 'Address'}
            </span>
            <h2 className="text-2xl font-bold text-white mb-5 tracking-tight">
              {language === 'tr'
                ? 'Merkez Ofis & Fabrika'
                : 'Headquarters & Factory'}
            </h2>

            <a
              href="https://www.google.com/maps/place/Kendal+Elektrik+A.%C5%9E./@41.0699578,28.3202748,17z/data=!3m1!4b1!4m6!3m5!1s0x14b541f701f7e257:0xe2e0245245cd5b6f!8m2!3d41.0699539!4d28.3251457!16s%2Fg%2F11r35kq4hq"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block w-full h-64 md:h-72 lg:flex-1 overflow-hidden rounded-3xl text-left transition-transform hover:scale-[1.02]"
            >
              <div className="relative w-full h-full">
                <Image
                  src={getAssetPath('/images/footer-location-map.webp')}
                  alt="Kendal Elektrik konum haritası"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent transition-colors group-hover:from-black/90" />
                <span
                  className="absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
                  style={{ left: '48.7%', top: '50.1%' }}
                >
                  <span className="footer-map-ring absolute h-8 w-8 rounded-full bg-[var(--brand-red)]/50" />
                  <span className="footer-map-ring footer-map-ring-delay absolute h-8 w-8 rounded-full bg-[var(--brand-red)]/50" />
                  <span className="relative h-3 w-3 rounded-full bg-[var(--brand-red)] shadow-[0_0_8px_var(--brand-red)]" />
                </span>

                <div className="absolute inset-x-0 bottom-0 px-6 pb-6 pt-12">
                  <p className="text-sm leading-relaxed text-gray-100 group-hover:text-white transition-colors">
                    {contact.address}
                  </p>
                  <span className="mt-3 inline-flex items-center gap-2 text-sm font-semibold text-white bg-white/10 backdrop-blur-md px-4 py-2 rounded-full opacity-90 group-hover:opacity-100 group-hover:bg-[var(--brand-red)] transition-all">
                    {(t as any).footer?.map_cta || 'Haritada Aç'}
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className="h-4 w-4 transition-transform group-hover:translate-x-1"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13 7l5 5-5 5M6 12h12"
                      />
                    </svg>
                  </span>
                </div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export const CookieConsentBanner = () => {
  const { t } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('kendal-cookie-consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    // Fires after the banner's own DOM node has actually committed (in
    // both directions), so the chatbot widget's read of
    // `[data-cookie-banner]` in its listener always sees the current
    // state — a plain dispatch from handleAccept alone would race the
    // async isVisible(true) mount effect above and read stale DOM.
    window.dispatchEvent(new Event('kendal-cookie-consent-changed'));
  }, [isVisible]);

  const handleAccept = () => {
    localStorage.setItem('kendal-cookie-consent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      data-cookie-banner
      className="fixed bottom-0 left-0 w-full z-50 bg-black/90 backdrop-blur-md border-t border-[var(--brand-red)] p-4 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-white/80 text-sm md:text-base">
          {(t as any).cookies?.message ||
            'We use cookies to ensure you get the best experience on our website.'}
          <Link
            href="/gizlilik-cerez-politikasi"
            className="ml-2 text-[var(--brand-red)] hover:underline whitespace-nowrap"
          >
            {(t as any).footer?.legal?.privacy || 'Privacy and Cookie Policy'}
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="bg-[var(--brand-red)] hover:bg-[var(--brand-red-deep)] text-white px-6 py-2 rounded-full font-semibold transition-colors shrink-0"
        >
          {(t as any).cookies?.accept || 'Accept'}
        </button>
      </div>
    </div>
  );
};

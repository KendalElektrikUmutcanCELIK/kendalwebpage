'use client';

import { useEffect, useRef, useState } from 'react';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const LANGUAGE_OPTIONS: { code: Language; label: string; nativeName: string }[] =
  [
    { code: 'tr', label: 'TR', nativeName: 'Türkçe' },
    { code: 'en', label: 'EN', nativeName: 'English' },
    { code: 'ar', label: 'AR', nativeName: 'العربية' },
    { code: 'es', label: 'ES', nativeName: 'Español' },
    { code: 'de', label: 'DE', nativeName: 'Deutsch' },
    { code: 'zh', label: 'ZH', nativeName: '中文' },
  ];

export const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const current =
    LANGUAGE_OPTIONS.find((opt) => opt.code === language) ||
    LANGUAGE_OPTIONS[0];

  // Click-outside + Escape close, same pattern as the other small dropdowns
  // in this codebase (filters popover, mobile menu).
  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (e: MouseEvent) => {
      if (!containerRef.current?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className="relative text-sm font-medium">
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className="flex items-center gap-1.5 opacity-80 hover:opacity-100 transition-opacity"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 21a9 9 0 100-18 9 9 0 000 18zM3.6 9h16.8M3.6 15h16.8M12 3a15 15 0 014 9 15 15 0 01-4 9 15 15 0 01-4-9 15 15 0 014-9z"
          />
        </svg>
        {current.label}
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2.5}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div
          role="listbox"
          className="absolute right-0 rtl:right-auto rtl:left-0 top-full mt-2 min-w-[9rem] py-1.5 rounded-xl bg-white/95 backdrop-blur-xl shadow-[0_20px_50px_-15px_rgba(0,0,0,0.35)] border border-zinc-100 ring-1 ring-black/[0.02] z-50 text-zinc-800 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        >
          {LANGUAGE_OPTIONS.map((opt) => (
            <button
              key={opt.code}
              type="button"
              role="option"
              aria-selected={opt.code === language}
              onClick={() => {
                setLanguage(opt.code);
                setIsOpen(false);
              }}
              className={`flex items-center justify-between w-full px-4 py-2 text-left rtl:text-right transition-colors ${
                opt.code === language
                  ? 'bg-zinc-100 font-bold'
                  : 'hover:bg-zinc-50'
              }`}
            >
              <span>{opt.nativeName}</span>
              <span className="text-xs opacity-50">{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

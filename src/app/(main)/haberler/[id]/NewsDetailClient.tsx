'use client';

import Link from 'next/link';
import { notFound } from 'next/navigation';
import React from 'react';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { useNewsData } from '@/lib/newsClient';

export function NewsDetailClient({ id }: { id: string }) {
  const { language, t } = useLanguage();

  const newsData = useNewsData(language);
  const news = newsData?.find((n) => n.id === id);

  if (!news) {
    return null;
  }

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pt-32 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -left-[10%] top-0 w-[600px] h-[600px] bg-blue-500/30 blur-[120px] rounded-full" />
        <div className="absolute -right-[10%] bottom-0 w-[600px] h-[600px] bg-cyan-500/30 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-8">
          <Link
            href="/haberler"
            className="inline-flex items-center text-gray-400 hover:text-[var(--brand-red)] transition-colors text-sm font-medium"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            {language === 'en' ? 'Back to All News' : 'Tüm Haberlere Dön'}
          </Link>
        </div>

        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--global-text)] opacity-90 tracking-tight">
            {news.title}
          </h1>
          <div className="flex items-center justify-center gap-4 text-sm text-gray-400">
            <span>{news.date}</span>
          </div>
        </header>

        <ImageSlider
          images={news.images}
          altPrefix={news.title}
          titlePrefix={news.title}
        />

        <article className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mt-12 text-justify">
          {news.content.map((paragraph, idx) => {
            if (paragraph.startsWith('[IMAGE]')) {
              const src = paragraph.replace('[IMAGE]', '').trim();
              return (
                <div key={idx} className="my-8 flex justify-center">
                  <div className="rounded-2xl overflow-hidden border border-white/10 shadow-lg max-w-sm w-full">
                    <img
                      src={src}
                      alt={`${news.title} Haber Görseli`}
                      title={news.title}
                      loading="lazy"
                      className="w-full h-auto object-contain bg-white/5"
                    />
                  </div>
                </div>
              );
            }
            return (
              <p
                key={idx}
                className={
                  idx === 0 ? 'text-xl text-white font-medium mb-8' : 'mb-6'
                }
              >
                {paragraph}
              </p>
            );
          })}
        </article>
      </div>
    </div>
  );
}

'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';
import { getAssetPath } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';
import { parseNewsDate } from '@/lib/newsDate';
import { useNewsData } from '@/lib/newsClient';

export function HaberlerListesiClient() {
  const { language, t } = useLanguage();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  const newsData = useNewsData(language);
  const allNews = [...(newsData ?? [])].sort(
    (a, b) => parseNewsDate(b.date) - parseNewsDate(a.date),
  );
  const totalPages = Math.ceil(allNews.length / itemsPerPage);
  const currentNews = allNews.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pt-36 pb-32 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-emerald-500/40 blur-[120px] rounded-full" />

        <div className="absolute left-1/2 bottom-0 -translate-x-1/2 translate-y-1/2 w-[800px] h-[500px] bg-teal-500/40 blur-[120px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        <header className="mb-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--global-text)] opacity-90 tracking-tight">
            {(t as any).nav?.news ||
              (language === 'en' ? 'Corporate News' : 'Kurumsal Haberler')}
          </h1>
          <p className="text-[var(--global-text)] opacity-60 text-lg">
            {language === 'en'
              ? 'The latest developments and news from the Kendal Electric world.'
              : 'Kendal Elektrik dünyasından en güncel gelişmeler ve haberler.'}
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {currentNews.map((news) => (
            <Link
              href={`/haberler/${news.id}`}
              key={news.id}
              className="group block"
            >
              <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden hover:border-[var(--brand-red)]/50 transition-all duration-300 hover:shadow-[0_0_25px_rgba(255,0,0,0.1)] hover:-translate-y-1 h-full flex flex-col">
                <div className="relative w-full aspect-video overflow-hidden">
                  <Image
                    src={
                      news.images[0] ||
                      getAssetPath('/images/references/turkiye/ref-01.jpg')
                    }
                    alt={news.title}
                    title={news.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-300" />
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-3">
                    <span>{news.date}</span>
                  </div>
                  <h2 className="text-xl font-bold leading-tight mb-4 group-hover:text-[var(--brand-red)] transition-colors line-clamp-3">
                    {news.title}
                  </h2>

                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-sm font-medium text-white/70 group-hover:text-white transition-colors">
                    {language === 'en' ? 'Read News' : 'Haberi Oku'}
                    <svg
                      className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {newsData !== null && allNews.length === 0 && (
          <div className="text-center py-24 text-gray-500">
            {language === 'en'
              ? 'No news added yet.'
              : 'Henüz eklenmiş bir haber bulunmuyor.'}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center mt-16 gap-2">
            <button
              onClick={() => {
                setCurrentPage((prev) => Math.max(prev - 1, 1));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === 1}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Previous page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m15 18-6-6 6-6" />
              </svg>
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  onClick={() => {
                    setCurrentPage(pageNumber);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-10 h-10 flex items-center justify-center rounded-full border transition-all ${
                    currentPage === pageNumber
                      ? 'border-[var(--brand-red)] bg-[var(--brand-red)] text-white font-bold'
                      : 'border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              onClick={() => {
                setCurrentPage((prev) => Math.min(prev + 1, totalPages));
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              disabled={currentPage === totalPages}
              className="w-10 h-10 flex items-center justify-center rounded-full border border-white/20 text-white/70 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              aria-label="Next page"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="m9 18 6-6-6-6" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React from 'react';
import { ImageSlider } from '@/components/ui/ImageSlider';
import { getAssetPath } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function UretimClient() {
  const { language, t } = useLanguage();

  const pageData = (t as any).production_page || {
    title: 'Üretim',
    content:
      'Kendal Elektrik, 2017 yılında faaliyete geçen 22.000 m² kapalı alana sahip modern üretim tesisinde...',
  };

  const newImages = [
    getAssetPath('/images/uretim/flamanli1.webp'),
    getAssetPath('/images/uretim/flamanli2.webp'),
    getAssetPath('/images/uretim/smt1.webp'),
    getAssetPath('/images/uretim/smt2.webp'),
  ];
  const oldImages = Array.from({ length: 10 }, (_, i) =>
    getAssetPath(`/images/uretim/uretim-${i + 1}.webp`),
  );
  const images = [...newImages, ...oldImages];

  return (
    <div className="relative min-h-screen bg-[#050505] text-white pt-36 pb-24 px-6 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -left-[10%] top-0 w-[600px] h-[600px] bg-red-600/30 blur-[120px] rounded-full" />
        <div className="absolute -right-[10%] bottom-0 w-[600px] h-[600px] bg-orange-500/30 blur-[120px] rounded-full" />
      </div>
      <div className="relative z-10 max-w-4xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--global-text)] opacity-90 tracking-tight">
            {pageData.title}
          </h1>
        </header>

        <div className="max-w-2xl mx-auto">
          <ImageSlider
            images={images}
            altPrefix={
              pageData.image_alt || 'Kendal Elektrik Üretim Tesisi Görsel'
            }
            titlePrefix={
              pageData.image_title || 'Kendal Elektrik Üretim Aşaması'
            }
          />
        </div>

        <article className="prose prose-invert prose-lg max-w-none text-gray-300 leading-relaxed mt-12 text-justify">
          {Array.isArray(pageData.content) ? (
            pageData.content.map((paragraph: string, idx: number) => (
              <p
                key={idx}
                className={
                  idx === 0 ? 'text-xl text-white font-medium mb-8' : 'mb-6'
                }
              >
                {paragraph}
              </p>
            ))
          ) : (
            <p className="text-xl text-white font-medium mb-8">
              {pageData.content}
            </p>
          )}
        </article>
      </div>
    </div>
  );
}

'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

export function ImageSlider({
  images,
  altPrefix,
  titlePrefix = '',
}: {
  images: string[];
  altPrefix?: string;
  titlePrefix?: string;
}) {
  const { t } = useLanguage();
  const resolvedAltPrefix = altPrefix ?? (t as any).gallery?.image ?? 'Image';
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!images || images.length <= 1 || isHovered) return;

    const timer = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [isHovered, images]);

  if (!images || images.length === 0) return null;

  const goToNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div
      className="relative w-full aspect-square md:aspect-[4/3] bg-black/50 rounded-2xl overflow-hidden mb-12 border border-white/10 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {images.map((src, idx) => {
        const distance = Math.min(
          Math.abs(idx - currentIndex),
          images.length - Math.abs(idx - currentIndex),
        );
        const shouldRender = distance <= 1;

        return (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {shouldRender && (
              <Image
                src={src}
                alt={`${resolvedAltPrefix} ${idx + 1}`}
                title={titlePrefix ? `${titlePrefix} ${idx + 1}` : undefined}
                fill
                sizes="(max-width: 768px) 100vw, 80vw"
                className="object-contain"
                priority={idx === 0}
              />
            )}
          </div>
        );
      })}

      {images.length > 1 && (
        <>
          <button
            onClick={goToPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[var(--brand-red)] text-white w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label={(t as any).gallery?.previous || 'Previous Image'}
          >
            <svg
              width="24"
              height="24"
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

          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[var(--brand-red)] text-white w-10 h-10 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 opacity-0 group-hover:opacity-100 hover:scale-110"
            aria-label={(t as any).gallery?.next || 'Next Image'}
          >
            <svg
              width="24"
              height="24"
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

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex gap-2">
            {images.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
                  idx === currentIndex
                    ? 'bg-white scale-125'
                    : 'bg-white/40 hover:bg-white/70'
                }`}
                aria-label={`${resolvedAltPrefix} ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

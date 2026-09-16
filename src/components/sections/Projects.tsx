'use client';

import Image from 'next/image';
import React, { useEffect, useRef } from 'react';
import { referenceProjects } from '@/data/projects';
import { getAssetPath } from '@/lib/basePath';
import { useLanguage } from '@/lib/i18n/LanguageProvider';

const REFERENCE_DATA = referenceProjects;

export const Projects = () => {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isPausedRef = useRef(false);
  const resumeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const scrollTrack = (direction: 'left' | 'right') => {
    if (trackRef.current) {
      const scrollAmount =
        window.innerWidth > 768
          ? window.innerWidth / 3
          : window.innerWidth * 0.8;
      trackRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const track = trackRef.current;
      if (!track || isPausedRef.current) return;
      const maxScroll = track.scrollWidth - track.clientWidth;
      if (track.scrollLeft >= maxScroll - 10) {
        track.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        scrollTrack('right');
      }
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  const pauseAutoplay = () => {
    isPausedRef.current = true;
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
  };

  const scheduleResumeAutoplay = () => {
    if (resumeTimeoutRef.current) clearTimeout(resumeTimeoutRef.current);
    resumeTimeoutRef.current = setTimeout(() => {
      isPausedRef.current = false;
    }, 4000);
  };

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative w-full bg-transparent pt-36 pb-32 overflow-hidden"
    >
      <div
        className="absolute top-0 left-0 w-[50vw] h-full pointer-events-none opacity-40 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at -20% 50%, #8a2be2 0%, transparent 70%)',
        }}
      />
      <div
        className="absolute top-0 right-0 w-[50vw] h-full pointer-events-none opacity-30 mix-blend-screen"
        style={{
          background:
            'radial-gradient(ellipse at 120% 50%, #ff00ff 0%, transparent 70%)',
        }}
      />

      <div className="max-w-7xl mx-auto px-6 mb-12 text-center relative z-20">
        <h2 className="text-4xl md:text-6xl font-bold mb-6 text-[var(--global-text)] opacity-90 tracking-tight">
          {(t as any).references?.title || "Türkiye'nin Dört Bir Yanında"}
        </h2>
        <p className="text-[var(--global-text)] opacity-60 text-lg md:text-xl max-w-2xl mx-auto font-light">
          {(t as any).references?.subtitle ||
            '81 ilde sayısız projeyi Kendal Elektrik kalitesiyle aydınlatmaya devam ediyoruz.'}
        </p>
      </div>

      <div className="relative group/carousel">
        <button
          onClick={() => scrollTrack('left')}
          className="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[var(--brand-red)] text-white w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:scale-110 shadow-xl"
          aria-label="Previous Project"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <button
          onClick={() => scrollTrack('right')}
          className="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-30 bg-black/60 hover:bg-[var(--brand-red)] text-white w-10 h-10 md:w-14 md:h-14 flex items-center justify-center rounded-full backdrop-blur-md border border-white/20 transition-all duration-300 opacity-100 md:opacity-0 md:group-hover/carousel:opacity-100 hover:scale-110 shadow-xl"
          aria-label="Next Project"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m9 18 6-6-6-6" />
          </svg>
        </button>

        <div
          className="flex w-full overflow-x-auto snap-x snap-mandatory py-8 px-4 md:px-12 items-center"
          ref={trackRef}
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseEnter={pauseAutoplay}
          onMouseLeave={scheduleResumeAutoplay}
          onTouchStart={pauseAutoplay}
          onTouchEnd={scheduleResumeAutoplay}
        >
          <style
            dangerouslySetInnerHTML={{
              __html: `
            div::-webkit-scrollbar { display: none; }
          `,
            }}
          />

          {REFERENCE_DATA.map((item, idx) => {
            const isPriority = idx < 4;
            return (
              <div
                key={`${item.id}-${idx}`}
                className="flex-shrink-0 snap-center relative w-[80vw] sm:w-[45vw] md:w-[35vw] lg:w-[25vw] aspect-[4/3] mx-3 rounded-xl overflow-hidden group border border-white/5"
              >
                <Image
                  src={getAssetPath(`/images/${item.image}`)}
                  alt={`${item.name} - ${item.location}`}
                  fill
                  sizes="(max-width: 768px) 75vw, (max-width: 1024px) 35vw, 25vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                  priority={isPriority}
                  loading={isPriority ? 'eager' : 'lazy'}
                  quality={75}
                />

                <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 flex flex-col justify-end p-6 pointer-events-none">
                  <h4 className="text-white font-bold text-xl md:text-2xl leading-tight mb-2 drop-shadow-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    {item.name}
                  </h4>
                  <p className="text-white/70 text-sm font-medium tracking-wide transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500 delay-75">
                    {item.location}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

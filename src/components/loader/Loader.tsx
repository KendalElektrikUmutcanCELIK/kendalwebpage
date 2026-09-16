'use client';

import Image from 'next/image';
import React, { useEffect, useRef, useState } from 'react';
import { getAssetPath } from '@/lib/basePath';
import { gsap } from '@/lib/gsapConfig';
import { useIsomorphicLayoutEffect } from '@/lib/useIsomorphicLayoutEffect';

export const Loader = ({ onComplete }: { onComplete: () => void }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topPanelRef = useRef<HTMLDivElement>(null);
  const bottomPanelRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let currentProgress = 0;

    const interval = setInterval(() => {
      currentProgress += Math.random() * 10;
      if (document.readyState !== 'complete' && currentProgress > 90) {
        currentProgress = 90 + Math.random() * 5;
      }

      if (currentProgress >= 100) {
        currentProgress = 100;
        clearInterval(interval);
      }

      setProgress(Math.min(100, Math.round(currentProgress)));
    }, 150);

    const handleLoad = () => {
      setTimeout(() => {
        currentProgress = 100;
        setProgress(100);
      }, 2000);
    };

    if (document.readyState === 'complete') {
      handleLoad();
    } else {
      window.addEventListener('load', handleLoad);
    }

    return () => {
      clearInterval(interval);
      window.removeEventListener('load', handleLoad);
    };
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (progress === 100) {
      const ctx = gsap.context(() => {
        const tl = gsap.timeline({
          onComplete,
        });

        tl.to(laserRef.current, {
          backgroundColor: '#ffffff',
          boxShadow:
            '0 0 40px 10px rgba(255,255,255,1), 0 0 80px 20px rgba(255,255,255,0.8)',
          height: '4px',
          duration: 0.15,
          ease: 'power4.out',
        })
          .to(
            textContainerRef.current,
            {
              opacity: 0,
              scale: 1.2,
              duration: 0.2,
              ease: 'power2.in',
            },
            '<',
          )
          .to(
            topPanelRef.current,
            {
              y: '-100%',
              duration: 1.2,
              ease: 'expo.inOut',
            },
            '+=0.1',
          )
          .to(
            bottomPanelRef.current,
            {
              y: '100%',
              duration: 1.2,
              ease: 'expo.inOut',
            },
            '<',
          )
          .to(
            laserRef.current,
            {
              opacity: 0,
              scaleY: 0,
              duration: 0.4,
              ease: 'power2.out',
            },
            '-=1.0',
          )
          .to(containerRef.current, {
            autoAlpha: 0,
            duration: 0.1,
          });
      }, containerRef);
      return () => ctx.revert();
    }
  }, [progress, onComplete]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden pointer-events-none"
    >
      <div
        ref={topPanelRef}
        className="absolute top-0 left-0 w-full h-[50vh] bg-[#020202] z-10 origin-top shadow-[0_10px_30px_rgba(0,0,0,0.8)] pointer-events-auto"
      />

      <div
        ref={bottomPanelRef}
        className="absolute bottom-0 left-0 w-full h-[50vh] bg-[#020202] z-10 origin-bottom shadow-[0_-10px_30px_rgba(0,0,0,0.8)] pointer-events-auto"
      />

      <div
        ref={laserRef}
        className="absolute top-1/2 left-0 w-full h-[1px] -translate-y-1/2 z-20 transition-all duration-300 origin-left"
        style={{
          width: `${progress}%`,
          backgroundColor: 'var(--brand-red)',
          boxShadow: `0 0 ${10 + progress * 0.2}px ${2 + progress * 0.05}px rgba(227, 0, 15, ${0.5 + progress * 0.005})`,
        }}
      />

      <div
        ref={textContainerRef}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 flex flex-col items-center gap-6 text-white pointer-events-none mix-blend-exclusion w-full px-4"
      >
        <div className="relative w-80 h-28 md:w-[26rem] md:h-36 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mb-4">
          <Image
            src={getAssetPath('/images/kendal-logo.svg')}
            alt="Kendal Elektrik Logo"
            fill
            sizes="(max-width: 768px) 320px, 416px"
            className="object-contain"
            priority
          />
        </div>

        <div className="text-6xl md:text-8xl font-black tracking-tighter tabular-nums drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] mt-2">
          {progress.toString().padStart(3, '0')}
        </div>
      </div>
    </div>
  );
};

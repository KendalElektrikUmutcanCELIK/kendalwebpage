'use client';

import Image from 'next/image';
import Link from 'next/link';

interface CertificateGalleryProps {
  title: string;
  subtitle?: string;
  images: string[];
}

export const CertificateGallery = ({
  title,
  subtitle,
  images,
}: CertificateGalleryProps) => {
  return (
    <section className="w-full relative bg-black pt-36 pb-20 md:pb-28 px-6 min-h-screen overflow-hidden">
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[1300px] h-[500px] bg-amber-500/50 blur-[100px] rounded-full" />
        <div className="absolute left-1/2 top-24 -translate-x-1/2 w-[900px] h-[300px] bg-red-500/40 blur-[100px] rounded-full" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto">
        <Link
          href="/sertifikalar"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[var(--brand-red)] transition-colors mb-8"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Sertifikalar
        </Link>

        <div className="mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[var(--global-text)] opacity-90 mb-4">
            {title}
          </h1>
          <div className="h-1.5 w-16 bg-[var(--brand-red)] rounded-full mb-6" />
          {subtitle && (
            <p className="text-white/80 max-w-2xl drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">
              {subtitle}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {images.map((src, idx) => (
            <a
              key={src}
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-[3/4] rounded-xl overflow-hidden bg-white border border-white/10 transition-all duration-300 hover:border-[var(--brand-red)] hover:shadow-[0_0_20px_rgba(227,0,15,0.25)]"
            >
              <Image
                src={src}
                alt={`${title} ${idx + 1}`}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
                className="object-contain p-2 transition-transform duration-300 group-hover:scale-[1.03]"
              />
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};

import Image from 'next/image';
import type { ImageGalleryBlockData } from '@/data/pages';
import { getAssetPath } from '@/lib/basePath';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';

export function ImageGalleryBlock({
  data,
  language,
}: {
  data: ImageGalleryBlockData;
  language: Language;
}) {
  const images = (data.images ?? []).filter((img) => img.url);
  if (images.length === 0) {
    return null;
  }

  const title = data.title && resolveLocalized(data.title, language);

  return (
    <div className="page-block">
      {title && (
        <h2 className="text-3xl font-bold mb-6 text-white tracking-tight">
          {title}
        </h2>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {images.map((img, idx) => (
          <div
            key={img.url + idx}
            className="relative aspect-[4/3] rounded-2xl overflow-hidden border border-white/10 bg-white/5"
          >
            <Image
              src={getAssetPath(`/images/${img.url}`)}
              alt={(img.alt && resolveLocalized(img.alt, language)) ?? ''}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

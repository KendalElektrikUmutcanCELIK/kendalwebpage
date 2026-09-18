import Image from 'next/image';
import type { TextImageBlockData } from '@/data/pages';
import { getAssetPath } from '@/lib/basePath';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { resolveLocalized } from '@/lib/i18n/localized';

export function TextImageBlock({
  data,
  language,
}: {
  data: TextImageBlockData;
  language: Language;
}) {
  if (!data.image) {
    return null;
  }

  const imageFirst = data.imagePosition === 'left';
  return (
    <div className="page-block flex flex-col md:flex-row items-center gap-8 md:gap-12">
      <div
        className={`relative w-full md:w-1/2 aspect-[4/3] rounded-3xl overflow-hidden border border-white/10 bg-white/5 ${imageFirst ? 'md:order-1' : 'md:order-2'}`}
      >
        <Image
          src={getAssetPath(`/images/${data.image}`)}
          alt={(data.imageAlt && resolveLocalized(data.imageAlt, language)) ?? ''}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover"
        />
      </div>
      <div
        className={`w-full md:w-1/2 ${imageFirst ? 'md:order-2' : 'md:order-1'}`}
      >
        <h2 className="text-3xl font-bold mb-4 text-white tracking-tight">
          {(data.heading && resolveLocalized(data.heading, language)) ?? ''}
        </h2>
        <p className="text-gray-300 leading-relaxed text-lg font-light whitespace-pre-line">
          {(data.text && resolveLocalized(data.text, language)) ?? ''}
        </p>
      </div>
    </div>
  );
}

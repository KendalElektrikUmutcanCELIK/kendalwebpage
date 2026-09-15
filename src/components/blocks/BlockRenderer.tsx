import type { PageBlock } from '@/data/pages';
import type { Language } from '@/lib/i18n/LanguageProvider';
import { CtaBlock } from './CtaBlock';
import { HeadingTextBlock } from './HeadingTextBlock';
import { ImageGalleryBlock } from './ImageGalleryBlock';
import { TextImageBlock } from './TextImageBlock';

export function BlockRenderer({ block, language }: { block: PageBlock; language: Language }) {
  switch (block.type) {
    case 'heading_text':
      return <HeadingTextBlock data={block.data} language={language} />;
    case 'image_gallery':
      return <ImageGalleryBlock data={block.data} language={language} />;
    case 'text_image':
      return <TextImageBlock data={block.data} language={language} />;
    case 'cta':
      return <CtaBlock data={block.data} language={language} />;
    default:
      return null;
  }
}

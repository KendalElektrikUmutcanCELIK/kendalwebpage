import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getAllCustomPageSlugs, getCustomPageBySlug } from '@/data/pages';
import { PageBlocksClient } from './PageBlocksClient';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = getCustomPageBySlug(decodeURIComponent(slug));

  if (!page) {
    return { title: 'Sayfa Bulunamadı | Kendal Elektrik' };
  }

  return {
    title: `${page.title?.tr ?? slug} | Kendal Elektrik`,
    description: page.metaDescription?.tr,
  };
}

export function generateStaticParams() {
  return getAllCustomPageSlugs().map((slug) => ({ slug }));
}

export default async function CustomPageRoute({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = getCustomPageBySlug(decodeURIComponent(slug));

  if (!page) {
    notFound();
  }

  return <PageBlocksClient page={page} />;
}

import { BrandSchema } from '@/components/shared/BrandSchema';
import { BrandFooter } from '@/components/ui/BrandFooter';
import { BrandNavbar } from '@/components/ui/BrandNavbar';
import { ScrollToTop } from '@/components/ui/ScrollToTop';
import { getAssetPath } from '@/lib/basePath';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ brandName: string }>;
}) {
  const resolvedParams = await params;
  const isK2 = resolvedParams.brandName === 'k2';

  return {
    title: isK2
      ? 'K2 LED SYSTEMS'
      : resolvedParams.brandName === 'vanti'
        ? 'VANTİ'
        : 'GLOBAL',
    icons: {
      icon: getAssetPath(
        isK2
          ? '/images/brands/k2-logo.svg'
          : resolvedParams.brandName === 'vanti'
            ? '/images/brands/vanti-logo.svg'
            : '/images/brands/global-logo.svg',
      ),
      apple: getAssetPath(
        isK2
          ? '/images/brands/k2-logo.svg'
          : resolvedParams.brandName === 'vanti'
            ? '/images/brands/vanti-logo.svg'
            : '/images/brands/global-logo.svg',
      ),
    },
  };
}

export function generateStaticParams() {
  return [{ brandName: 'k2' }, { brandName: 'vanti' }, { brandName: 'global' }];
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ brandName: string }>;
}) {
  const resolvedParams = await params;
  const { brandName } = resolvedParams;
  const isK2 = brandName === 'k2';

  const scrollColor = isK2
    ? 'bg-orange-500 hover:bg-orange-600 shadow-[0_0_15px_rgba(249,115,22,0.5)]'
    : brandName === 'vanti'
      ? 'bg-blue-600 hover:bg-blue-700 shadow-[0_0_15px_rgba(37,99,235,0.5)]'
      : 'bg-[#FFDA51] hover:bg-[#e6c449] shadow-[0_0_15px_rgba(255,218,81,0.5)]';

  return (
    <div className="brand-layout-container min-h-screen flex flex-col bg-white">
      <BrandSchema brandName={brandName} />
      <BrandNavbar brandName={brandName} />

      <main className="flex-grow">{children}</main>

      <BrandFooter brandName={brandName} />
      <ScrollToTop colorClass={scrollColor} />
    </div>
  );
}

import type { Metadata } from 'next';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getCertificateImages } from '@/data/certificates';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'TSE Ürün Onay Sertifikaları | Kendal Elektrik',
  description: 'Kendal Elektrik ürünlerine ait TSE ürün onay sertifikaları.',
  alternates: { canonical: '/sertifikalar/tse' },
};

const IMAGES = getCertificateImages('tse').map((file) =>
  getAssetPath(`/images/${file}`),
);

export default function TseSertifikalariPage() {
  return <CertificateGallery certKey="tse" images={IMAGES} />;
}

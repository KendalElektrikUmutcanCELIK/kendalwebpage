import type { Metadata } from 'next';
import React from 'react';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'ISO Yönetim Sistemi Sertifikaları | Kendal Elektrik',
  description:
    "Kendal Elektrik'in ISO 9001, ISO 14001, ISO 45001, ISO 27001 ve EMC yönetim sistemi sertifikaları.",
  alternates: { canonical: '/sertifikalar/iso' },
};

const IMAGES = [
  'emc-1.webp',
  'iso9001-2015.webp',
  'iso14001-2015.webp',
  'iso45001-2018.webp',
  'iso27001-2022.webp',
  'pca-9001-2015.webp',
  'pca-14001-2015.webp',
  'pca-45001-2018.webp',
].map((file) => getAssetPath(`/images/certifications/iso-belgeleri/${file}`));

export default function IsoSertifikalariPage() {
  return (
    <CertificateGallery
      title="ISO Yönetim Sistemi Sertifikaları"
      subtitle="Kalite, çevre, iş sağlığı ve güvenliği ile bilgi güvenliği yönetim sistemlerimize ait sertifikalarımız."
      images={IMAGES}
    />
  );
}

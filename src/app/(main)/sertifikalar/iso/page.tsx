import type { Metadata } from 'next';
import React from 'react';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getCertificateImages } from '@/data/certificates';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'ISO Yönetim Sistemi Sertifikaları | Kendal Elektrik',
  description:
    "Kendal Elektrik'in ISO 9001, ISO 14001, ISO 45001, ISO 27001 ve EMC yönetim sistemi sertifikaları.",
  alternates: { canonical: '/sertifikalar/iso' },
};

const IMAGES = getCertificateImages('iso').map((file) =>
  getAssetPath(`/images/${file}`),
);

export default function IsoSertifikalariPage() {
  return (
    <CertificateGallery
      title="ISO Yönetim Sistemi Sertifikaları"
      subtitle="Kalite, çevre, iş sağlığı ve güvenliği ile bilgi güvenliği yönetim sistemlerimize ait sertifikalarımız."
      images={IMAGES}
    />
  );
}

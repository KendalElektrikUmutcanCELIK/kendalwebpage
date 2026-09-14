import type { Metadata } from 'next';
import React from 'react';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'TSE Ürün Onay Sertifikaları | Kendal Elektrik',
  description: "Kendal Elektrik ürünlerine ait TSE ürün onay sertifikaları.",
  alternates: { canonical: '/sertifikalar/tse' },
};

const IMAGES = ['tse-belgesi.webp', 'kdl4140-tse.webp'].map((file) =>
  getAssetPath(`/images/certifications/tse-belgeleri/${file}`),
);

export default function TseSertifikalariPage() {
  return (
    <CertificateGallery
      title="TSE Ürün Onay Sertifikaları"
      subtitle="Ürünlerimizin Türk Standartları Enstitüsü tarafından onaylandığını gösteren belgeler."
      images={IMAGES}
    />
  );
}

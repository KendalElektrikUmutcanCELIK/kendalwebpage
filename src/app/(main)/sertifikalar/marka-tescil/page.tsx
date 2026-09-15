import type { Metadata } from 'next';
import React from 'react';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getCertificateImages } from '@/data/certificates';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'Türk Patent - Marka Tescil Belgeleri | Kendal Elektrik',
  description:
    "Kendal Elektrik'e ait Türk Patent ve Marka Kurumu marka tescil belgeleri.",
  alternates: { canonical: '/sertifikalar/marka-tescil' },
};

const IMAGES = getCertificateImages('marka-tescil').map((file) =>
  getAssetPath(`/images/${file}`),
);

export default function MarkaTescilSertifikalariPage() {
  return (
    <CertificateGallery
      title="Türk Patent - Marka Tescil Belgeleri"
      subtitle="Kendal Elektrik markalarına ait resmi marka tescil belgelerimiz."
      images={IMAGES}
    />
  );
}

import type { Metadata } from 'next';
import React from 'react';
import { CertificateGallery } from '@/components/sections/CertificateGallery';
import { getAssetPath } from '@/lib/basePath';

export const metadata: Metadata = {
  title: 'Türk Patent - Marka Tescil Belgeleri | Kendal Elektrik',
  description:
    "Kendal Elektrik'e ait Türk Patent ve Marka Kurumu marka tescil belgeleri.",
  alternates: { canonical: '/sertifikalar/marka-tescil' },
};

const IMAGES = [
  'kendal-elektrik-marka-tescil-belgesi-1.webp',
  'kendal-elektrik-marka-tescil-belgesi-2.webp',
  'kendal-elektrik-marka-tescil-belgesi-3.webp',
  'kendal-elektrik-marka-tescil-belgesi-4.webp',
].map((file) =>
  getAssetPath(`/images/certifications/marka-tescil-belgeleri/${file}`),
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

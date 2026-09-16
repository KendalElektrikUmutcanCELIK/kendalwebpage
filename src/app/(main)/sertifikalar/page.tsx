import type { Metadata } from 'next';
import React from 'react';
import { Certifications } from '@/components/sections/Certifications';

export const metadata: Metadata = {
  title: 'Sertifikalarımız | Kendal Elektrik',
  description:
    "Kendal Elektrik'in ISO, TSE, Entegre Kalite Politikası, Yerli Malı ve Türk Patent - Marka Tescil sertifikaları.",
  alternates: { canonical: '/sertifikalar' },
};

export default function SertifikalarPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-0">
      <Certifications />
    </div>
  );
}

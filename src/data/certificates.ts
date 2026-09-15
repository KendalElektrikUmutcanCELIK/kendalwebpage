import certificatesData from './certificates.json';

export type CertificateCategory = 'iso' | 'tse' | 'marka-tescil';

export const certificates: Record<CertificateCategory, string[]> =
  certificatesData as Record<CertificateCategory, string[]>;

export const getCertificateImages = (category: CertificateCategory): string[] =>
  certificates[category] ?? [];

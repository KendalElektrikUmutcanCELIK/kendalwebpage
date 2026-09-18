import type { LocalizedField } from '@/lib/i18n/localized';
import retailersData from './retailers.json';

export interface RetailCategory {
  id: string;
  name: LocalizedField<string>;
}

export interface Retailer {
  id: string;
  name: string;
  logo: string;
  categoryId?: string;
}

export const retailCategories: RetailCategory[] = [
  {
    id: 'ulusal',
    name: {
      tr: 'Ulusal Zincir Marketler',
      en: 'National Retail Chains',
      ar: 'سلاسل المتاجر الوطنية',
      es: 'Cadenas Nacionales',
      de: 'Nationale Handelsketten',
      zh: '全国连锁超市',
    },
  },
  {
    id: 'gross',
    name: {
      tr: 'Gross & Toptan Marketler',
      en: 'Wholesale & Gross Markets',
      ar: 'أسواق الجملة',
      es: 'Mercados Mayoristas',
      de: 'Großhandelsmärkte',
      zh: '批发市场',
    },
  },
  {
    id: 'ozel',
    name: {
      tr: 'Yapı, Ofis & Süpermarketler',
      en: 'Home Improvement, Office & Supermarkets',
      ar: 'مواد البناء والمكاتب والسوبرماركت',
      es: 'Bricolaje, Oficina y Supermercados',
      de: 'Baumärkte, Bürobedarf & Supermärkte',
      zh: '建材、办公与超市',
    },
  },
];

export const retailers: Retailer[] = retailersData as Retailer[];

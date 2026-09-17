import retailersData from './retailers.json';

export interface RetailCategory {
  id: string;
  name: { tr: string; en: string };
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
    name: { tr: 'Ulusal Zincir Marketler', en: 'National Retail Chains' },
  },
  {
    id: 'gross',
    name: { tr: 'Gross & Toptan Marketler', en: 'Wholesale & Gross Markets' },
  },
  {
    id: 'ozel',
    name: {
      tr: 'Yapı, Ofis & Süpermarketler',
      en: 'Home Improvement, Office & Supermarkets',
    },
  },
];

export const retailers: Retailer[] = retailersData as Retailer[];

import retailersData from './retailers.json';

export interface RetailCategory {
  id: string;
  name: string;
}

export interface Retailer {
  id: string;
  name: string;
  logo: string;
  categoryId?: string;
}

export const retailCategories: RetailCategory[] = [
  { id: 'ulusal', name: 'Ulusal Zincir Marketler' },
  { id: 'gross', name: 'Gross & Toptan Marketler' },
  { id: 'ozel', name: 'Yapı, Ofis & Süpermarketler' },
];

export const retailers: Retailer[] = retailersData as Retailer[];

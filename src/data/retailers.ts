import retailersData from './retailers.json';

export interface Retailer {
  id: string;
  name: string;
  logo: string;
}

export const retailers: Retailer[] = retailersData as Retailer[];

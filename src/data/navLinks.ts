import type { LocalizedField } from '@/lib/i18n/localized';
import navLinksJson from './navLinks.json';

export interface NavLink {
  id: string;
  label: LocalizedField<string>;
  url: string;
}

export function getNavLinks(): NavLink[] {
  return navLinksJson as NavLink[];
}

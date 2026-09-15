import navLinksJson from './navLinks.json';

export interface NavLink {
  id: string;
  label: { tr: string; en: string };
  url: string;
}

export function getNavLinks(): NavLink[] {
  return navLinksJson as NavLink[];
}

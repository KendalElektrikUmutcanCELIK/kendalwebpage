import type { LocalizedField } from '@/lib/i18n/localized';
import projectsData from './projects.json';

export interface ReferenceProject {
  id: string;
  name: string;
  location: LocalizedField<string>;
  image: string;
}

export const referenceProjects: ReferenceProject[] =
  projectsData as ReferenceProject[];

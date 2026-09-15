import projectsData from './projects.json';

export interface ReferenceProject {
  id: string;
  name: string;
  location: string;
  image: string;
}

export const referenceProjects: ReferenceProject[] =
  projectsData as ReferenceProject[];

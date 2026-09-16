import type { Language } from '@/lib/i18n/LanguageProvider';
import missionVisionData from './missionVision.json';

export interface MissionVisionEntry {
  title: string;
  content: string;
}

export interface MissionVisionContent {
  mission: MissionVisionEntry;
  vision: MissionVisionEntry;
}

const missionVision: Record<Language, MissionVisionContent> =
  missionVisionData as Record<Language, MissionVisionContent>;

export const getMissionVisionContent = (
  language: Language,
): MissionVisionContent => missionVision[language];

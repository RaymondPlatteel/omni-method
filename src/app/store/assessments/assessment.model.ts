import {Score} from '../models/score.model';

export interface Assessment {
  id: number;
  aid?: string;
  cid?: string;
  icon: string;
  abrv: string;
  label: string;
  description?: string;
  instruction?: string[];
  rules?: string[];
  checklist?: boolean;
  checklistCategories?: boolean;
  min: number;
  max: number;
  increment?: number;
  onboarding: {prompt: string};
  units?: string;
  entryUnits?: string;
  scores?: Score[];
  video?: string;
  thumbnail?: string;
  warning?: string;
  hideChecked?: boolean;
}

export interface Category {
  cid: string;
  seq?: number;
  label: string;
  abrv: string;
  categoryAverage?: number;
}

export interface Checklist {
  aid: string;
  categories?: string[];
  skills: object[];
}

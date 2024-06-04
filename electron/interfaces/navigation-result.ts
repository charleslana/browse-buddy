import { ActionType } from '../types/action-type';

export interface NavigationResult {
  action: ActionType;
  title: string;
  message: string;
  screenshot?: string;
  duration?: number;
  error?: string;
}

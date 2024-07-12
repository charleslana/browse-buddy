import { ActionType } from '@electron/types/action-type';
import { Input } from './input';

export interface Action {
  id: string;
  title?: string;
  type: ActionType;
  context?: string;
  inputs: Input[];
  disabled?: boolean;
  isVisible?: boolean;
}

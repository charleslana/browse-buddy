import { ActionType } from '../types/action-type';
import { Input } from './input';

export interface Action {
  id: string;
  title?: string;
  type: ActionType;
  inputs: Input[];
  disabled?: boolean;
  isVisible?: boolean;
}

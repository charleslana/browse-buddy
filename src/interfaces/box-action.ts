import { ActionCategory } from '@/types/action-category';
import { ActionType } from '@electron/types/action-type';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';
import { Input } from '@electron/interfaces/input';

export default interface BoxAction {
  label: string;
  icon: IconDefinition;
  category: ActionCategory;
  type: ActionType;
  tooltip?: string;
  inputs: Input[];
}

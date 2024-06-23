import { SelectOption } from '../types/select-option';

export interface Input {
  context?: string;
  label: string;
  placeholder?: string;
  value?: string;
  select?: SelectOption;
}

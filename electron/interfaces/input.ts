import { SelectOption } from '../types/select-option';

export interface Input {
  label: string;
  placeholder?: string;
  value?: string;
  select?: SelectOption;
}

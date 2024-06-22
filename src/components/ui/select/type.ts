// SelectTriggerProps & {
// 		placeholder?: string;
// 	 options: { value: Option; label: import('react').ReactNode }[];
// 	 value?: Option;

import { SelectTriggerProps } from '@radix-ui/react-select';

// 	}
export interface SelectDropdownProps<Option>
  extends Omit<SelectTriggerProps, 'value'> {
  placeholder?: string;
  options: { value: Option; label: import('react').ReactNode }[];
  value?: Option;
}

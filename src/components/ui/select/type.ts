import type { SelectTriggerProps } from "@radix-ui/react-select";
import type { ReactNode } from "react";

export interface SelectDropdownProps<Option>
  extends Omit<SelectTriggerProps, "value"> {
  placeholder?: string;
  options: { value: Option; label: ReactNode }[];
  value?: Option;
}

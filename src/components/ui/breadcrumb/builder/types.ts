import { type ComponentPropsWithoutRef, type ReactNode } from "react";

export interface BreadcrumbBuilderProps extends ComponentPropsWithoutRef<"ol"> {
  excludeMap?: Record<string, boolean>;
  disableLastBreadcrumb?: boolean;
  disableFirstBreadcrumb?: boolean;
  disableMap?: Record<string, string>;

  nameFormatMap?: Record<string, (name: string) => ReactNode>;
  nameMap?: Record<string, ReactNode>;
  nameReplaceMap?: Record<string, [RegExp, string]>;
  nameReplace?: {
    pattern: RegExp | string;
    replaceValue: string;
    flags?: string;
  };
  // [[pattern: RegExp | string, flags?: string], string];

  excludeRoot?: boolean;
  disableRoot?: boolean;
  formatRoot?: ((name: string) => ReactNode) | ReactNode;
  pathname: string;
}

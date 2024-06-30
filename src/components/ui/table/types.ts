import type { VariantProps } from 'class-variance-authority';
import type {
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  HTMLAttributes,
} from 'react';
import type {
  tableVariants,
  tableHeadVariants,
  tableCellVariants,
} from './utils';

export type TableVariants = VariantProps<typeof tableVariants>;
export interface TableProps
  extends TableHTMLAttributes<HTMLTableElement>,
    TableVariants {
  isTableHeaderSticky?: boolean;
}

export interface TableHeaderProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableBodyProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableFooterProps
  extends HTMLAttributes<HTMLTableSectionElement> {}

export interface TableRowProps extends HTMLAttributes<HTMLTableRowElement> {}

export type TableHeadVariants = VariantProps<typeof tableHeadVariants>;
export interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableHeaderCellElement>,
    TableHeadVariants {}

export type TableCellVariants = VariantProps<typeof tableCellVariants>;
export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableDataCellElement>,
    TableCellVariants {}

export interface TableCaptionProps
  extends HTMLAttributes<HTMLTableCaptionElement> {}

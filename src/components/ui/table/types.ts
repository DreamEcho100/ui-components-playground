import type { VariantProps } from "class-variance-authority";
import type {
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  HTMLAttributes,
} from "react";
import type {
  tableVariants,
  tableHeadVariants,
  tableCellVariants,
} from "./utils";

export type TableVariants = VariantProps<typeof tableVariants>;
export interface TableProps
  extends TableHTMLAttributes<HTMLTableElement>,
    TableVariants {
  isTableHeaderSticky?: boolean;
}

export type TableHeaderProps = HTMLAttributes<HTMLTableSectionElement>

export type TableBodyProps = HTMLAttributes<HTMLTableSectionElement>

export type TableFooterProps = HTMLAttributes<HTMLTableSectionElement>

export type TableRowProps = HTMLAttributes<HTMLTableRowElement>

export type TableHeadVariants = VariantProps<typeof tableHeadVariants>;
export interface TableHeadProps
  extends ThHTMLAttributes<HTMLTableHeaderCellElement>,
    TableHeadVariants {}

export type TableCellVariants = VariantProps<typeof tableCellVariants>;
export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableDataCellElement>,
    TableCellVariants {}

export type TableCaptionProps = HTMLAttributes<HTMLTableCaptionElement>

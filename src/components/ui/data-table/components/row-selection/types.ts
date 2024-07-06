import type {
  CellContext,
  DisplayColumnDef,
  HeaderContext,
} from "@tanstack/react-table";

export interface DataTableRowSelectionHeaderProps<TData, TValue> {
  headerContext: HeaderContext<TData, TValue>;
  "aria-label"?: string;
}

export interface DataTableRowSelectionCellProps<TData, TValue> {
  cell: CellContext<TData, TValue>;
  "aria-label"?: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type DataTableSelectColumn = DisplayColumnDef<any>;

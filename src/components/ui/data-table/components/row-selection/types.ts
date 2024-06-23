import type {
  CellContext,
  DisplayColumnDef,
  HeaderContext,
} from '@tanstack/react-table';

export interface DataTableRowSelectionHeaderProps<TData, TValue> {
  headerContext: HeaderContext<TData, TValue>;
  'aria-label'?: string;
}

export interface DataTableRowSelectionCellProps<TData, TValue> {
  cell: CellContext<TData, TValue>;
  'aria-label'?: string;
}

export type DataTableSelectColumn = DisplayColumnDef<any>;

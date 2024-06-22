import type {
	CellContext,
	DisplayColumnDef,
	HeaderContext
} from '@tanstack/react-table';

export interface DataTableRowSelectionHeaderProps<TData, TValue> {
	ctx: HeaderContext<TData, TValue>;
	'aria-label'?: string;
}

export interface DataTableRowSelectionCellProps<TData, TValue> {
	ctx: CellContext<TData, TValue>;
	'aria-label'?: string;
}

export type DataTableSelectColumn = DisplayColumnDef<any>;

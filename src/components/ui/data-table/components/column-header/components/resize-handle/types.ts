import { Header, Table } from '@tanstack/react-table';

export interface DataTableResizeHandleProps<TData, TValue> {
	header: Header<TData, unknown>;
	table: Table<TData>;
}

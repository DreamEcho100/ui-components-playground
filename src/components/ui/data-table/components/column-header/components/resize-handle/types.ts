import { type Header, type Table } from "@tanstack/react-table";

export interface DataTableResizeHandleProps<TData, TValue> {
  header: Header<TData, TValue>;
  table: Table<TData>;
}

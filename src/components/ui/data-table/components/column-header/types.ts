import type { Table, Header } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface DataTableColumnHeaderProps<TData, TValue> {
  ctx: Header<TData, TValue>;
  title?: ReactNode;
  table: Table<TData>;
}

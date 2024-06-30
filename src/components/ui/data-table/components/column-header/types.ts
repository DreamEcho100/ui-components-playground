import type { Table, Header } from '@tanstack/react-table';
import type { ReactNode } from 'react';

export interface DataTableColumnHeaderProps<TData, TValue> {
  header: Header<TData, TValue>;
  title?: ReactNode;
  table: Table<TData>;
}

import type {
  Table,
  ColumnResizeMode,
  ColumnResizeDirection,
} from '@tanstack/react-table';
import { StoreApi } from 'zustand';

type ValueOrUpdater<Value> = Value | ((prevValue: Value) => Value);
type ItemDeepPathsSeparatedByDots<Item> = Item extends Record<string, any>
  ? {
      [Key in keyof Item]: Key extends string
        ? `${Key}` | `${Key}.${ItemDeepPathsSeparatedByDots<Item[Key] & {}>}`
        : never;
    }[keyof Item]
  : never;

export interface ColumnSort<TData> {
  desc: boolean;
  id: ItemDeepPathsSeparatedByDots<TData> & string; //  | (string & {});
}
export type SortingState<TData> = ColumnSort<TData>[];

type RowSelectionState<TData> = {
  [Key in ItemDeepPathsSeparatedByDots<TData> | (string & {})]?: boolean;
};

type VisibilityState<TData> = {
  [Key in ItemDeepPathsSeparatedByDots<TData> | (string & {})]?: boolean;
};

interface ColumnFilter<TData> {
  id: ItemDeepPathsSeparatedByDots<TData> & string; //  | (string & {});
  value: unknown;
}
export type ColumnFiltersState<TData> = ColumnFilter<TData>[];

export interface DataTableStoreState<TData> {
  isSortingExternal?: boolean;
  sorting: SortingState<TData>;
  setSorting: (valueOrUpdater: ValueOrUpdater<SortingState<TData>>) => void;

  isFilteringExternal?: boolean;
  columnFilters: ColumnFiltersState<TData>;
  setColumnFilters: (
    valueOrUpdater: ValueOrUpdater<ColumnFiltersState<TData>>,
  ) => void;

  columnVisibility: VisibilityState<TData>;
  setColumnVisibility: (
    valueOrUpdater: ValueOrUpdater<VisibilityState<TData>>,
  ) => void;

  rowSelection: RowSelectionState<TData>;
  setRowSelection: (
    valueOrUpdater: ValueOrUpdater<RowSelectionState<TData>>,
  ) => void;

  columnResizeMode: ColumnResizeMode;
  setColumnResizeMode: (
    valueOrUpdater: ValueOrUpdater<ColumnResizeMode>,
  ) => void;

  columnResizeDirection: ColumnResizeDirection;
  setColumnResizeDirection: (
    valueOrUpdater: ValueOrUpdater<ColumnResizeDirection>,
  ) => void;

  _table?: null | Table<TData>;
  getTable: () => Table<TData>;
}

export type DataTableStoreApi<TData> = StoreApi<DataTableStoreState<TData>>;

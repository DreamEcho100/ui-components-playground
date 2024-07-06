import type {
  Table,
  ColumnResizeMode,
  ColumnResizeDirection,
} from "@tanstack/react-table";
import type { StoreApi } from "zustand";

type ValueOrUpdater<Value> = Value | ((prevValue: Value) => Value);
type ItemDeepPathsSeparatedByDots<Item> =
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Item extends Record<string, any>
    ? {
        [Key in keyof Item]: Key extends string
          ? // eslint-disable-next-line @typescript-eslint/ban-types
            `${Key}` | `${Key}.${ItemDeepPathsSeparatedByDots<Item[Key] & {}>}`
          : never;
      }[keyof Item]
    : never;

export interface ColumnSort<TData> {
  desc: boolean;
  id: ItemDeepPathsSeparatedByDots<TData> & string; //  | (string & {});
}
export type SortingState<TData> = ColumnSort<TData>[];

type RowSelectionState<TData> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [Key in ItemDeepPathsSeparatedByDots<TData> | (string & {})]?: boolean;
};

type VisibilityState<TData> = {
  // eslint-disable-next-line @typescript-eslint/ban-types
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

  __cache: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sorting: Record<string, any>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
  setCache: (key: string, value: ValueOrUpdater<unknown>) => void;
}

export type DataTableStoreApi<TData> = StoreApi<DataTableStoreState<TData>>;

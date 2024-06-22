import { ColumnResizeMode } from '@tanstack/react-table';
import {
  ColumnDef,
  ColumnFiltersState,
  RowSelectionState,
  SortingState,
  VisibilityState,
} from '@tanstack/react-table';
import { SelectDropdownProps } from '~/components/ui/select/type';
import { InputProps } from '~/components/ui/input/types';

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowIdKey?: keyof TData;
  isPending?: boolean;
}

export type ValueOrUpdater<Value> = Value | ((prevValue: Value) => Value);

export interface TableSetters {
  setColumnFilters: (
    valueOrUpdater: ValueOrUpdater<ColumnFiltersState>,
  ) => void;
  setColumnVisibility: (
    valueOrUpdater: ValueOrUpdater<VisibilityState>,
  ) => void;
  setRowSelection: (valueOrUpdater: ValueOrUpdater<RowSelectionState>) => void;
  setSorting: (valueOrUpdater: ValueOrUpdater<SortingState>) => void;
  setColumnResizeMode: (
    valueOrUpdater: ValueOrUpdater<ColumnResizeMode>,
  ) => void;
}
export interface TableState {
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  sorting: SortingState;
  columnResizeMode: ColumnResizeMode;
}

//
//
//
export interface SelectFilter {
  type: 'select';
  props: Omit<SelectDropdownProps<unknown>, 'value' | 'onChange'>;
}
export interface TextFilter {
  type: 'text';
  props?: Omit<InputProps, 'value' | 'onChange'>;
}
export interface RangeNumberFilter {
  type: 'range-number';
  minProps?: Omit<InputProps, 'value' | 'onChange'>;
  maxProps?: Omit<InputProps, 'value' | 'onChange'>;
}

export interface RangeDateFilter {
  type: 'range-date';
  minProps?: Omit<InputProps, 'value' | 'onChange'>;
  maxProps?: Omit<InputProps, 'value' | 'onChange'>;
}

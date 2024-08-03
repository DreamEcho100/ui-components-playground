import type {
  AccessorColumnDef,
  DisplayColumnDef,
  GroupColumnDef,
  ColumnResizeMode,
  RowData,
} from "@tanstack/react-table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  type RowSelectionState,
  type SortingState,
  type VisibilityState,
} from "@tanstack/react-table";
import { type SelectDropdownProps } from "~/components/ui/select/type";
import { type InputProps } from "~/components/ui/input/types";
import { type InfiniteLoadingRowTriggerProps } from "./components/infinite-loading-row-trigger/types";

export type CorrectedColumnDef<
  TData extends RowData,
  TValue = unknown,
> = ColumnDef<TData, TValue>;
// | (DisplayColumnDef<TData, TValue> & { _type: "display" })
// | (GroupColumnDef<TData, TValue> & { _type: "group" })
// | (AccessorColumnDef<TData, TValue> & { _type?: "accessor" });

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  rowIdKey?: keyof TData;
  isPending?: boolean;
  infiniteLoading?: InfiniteLoadingRowTriggerProps;
  topActionsButtonsStart?: React.ReactNode;
  topActionsButtonsEnd?: React.ReactNode;
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
  type: "select";
  props: Omit<SelectDropdownProps<unknown>, "value" | "onChange">;
}
export interface TextFilter {
  type: "text";
  props?: Omit<InputProps, "value" | "onChange">;
}
export interface RangeNumberFilter {
  type: "range-number";
  minProps?: Omit<InputProps, "value" | "onChange">;
  maxProps?: Omit<InputProps, "value" | "onChange">;
}

export interface RangeDateFilter {
  type: "range-date";
  minProps?: Omit<InputProps, "value" | "onChange">;
  maxProps?: Omit<InputProps, "value" | "onChange">;
}

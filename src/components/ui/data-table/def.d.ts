import type { RowData } from "@tanstack/react-table";
import type {
  RangeDateFilter,
  RangeNumberFilter,
  SelectFilter,
  TextFilter,
} from "./types";
import type { dateBetweenFilterFn } from "./components/column-header/components/filters/utils";

declare module "@tanstack/react-table" {
  interface ColumnMeta<TData extends RowData, TValue>
    extends ColumnMeta<TData, TValue> {
    header?: string;
    width?: number | string;
    filterVariant?:
      | TextFilter
      | RangeNumberFilter
      | RangeDateFilter
      | SelectFilter;
  }

  export interface FilterFns {
    dateBetweenFilterFn: typeof dateBetweenFilterFn;
  }
}

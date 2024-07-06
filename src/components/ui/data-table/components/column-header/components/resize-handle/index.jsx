/** @import { DataTableResizeHandleProps } from './types.ts' */

import { useStore } from "zustand";
import { useDataTableContextStore } from "../../../../context";
import classes from "./styles.module.css";

/**
 * @template TData
 * @template TValue
 *
 * @param {DataTableResizeHandleProps<TData, TValue>} props
 */
export function DataTableResizeHandle(props) {
  const dataTableStore = useDataTableContextStore();
  const columnResizeMode = useStore(
    dataTableStore,
    (state) => state.columnResizeMode,
  );

  return (
    <div
      {...{
        onDoubleClick: () => props.header.column.resetSize(),
        onMouseDown: props.header.getResizeHandler(),
        onTouchStart: props.header.getResizeHandler(),
        className: `${classes.resizer} ${
          classes[props.table.options.columnResizeDirection ?? "ltr"]
        } ${props.header.column.getIsResizing() ? classes.isResizing : ""}`,
        style: {
          transform:
            columnResizeMode === "onEnd" && props.header.column.getIsResizing()
              ? `translateX(${
                  (props.table.options.columnResizeDirection === "rtl"
                    ? -1
                    : 1) *
                  (props.table.getState().columnSizingInfo.deltaOffset ?? 0)
                }px)`
              : "",
        },
      }}
    />
  );
}

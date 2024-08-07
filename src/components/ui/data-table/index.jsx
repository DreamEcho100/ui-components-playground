"use client";
/** @import { DataTableProps, TableSetters, TableState } from './types.ts' */
/** @import { PropsWithChildren } from 'react' */

import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { useStore } from "zustand";
import { memo, useMemo } from "react";
import { useDataTableContextStore } from "./context";
import { DataTableColumnHeader } from "./components/column-header";
import { dateBetweenFilterFn } from "./components/column-header/components/filters/utils";
import InfiniteLoadingRowTrigger from "./components/infinite-loading-row-trigger";
import XLSXExportButton from "./components/xlsx-export-button/index.jsx";
import { Chip } from "../chip/index.jsx";
import { Button } from "../button/index.jsx";

/**
 * @template TData
 * @template TValue
 *
 * @param {DataTableProps<TData, TValue>} props
 */
export function DataTable(props) {
  const dataTableStore = useDataTableContextStore();
  const columnFilters = useStore(
    dataTableStore,
    (state) => state.columnFilters,
  );
  const isFilteringExternal = useStore(
    dataTableStore,
    (state) => state.isFilteringExternal,
  );

  const sorting = useStore(dataTableStore, (state) => state.sorting);
  const isSortingExternal = useStore(
    dataTableStore,
    (state) => state.isSortingExternal,
  );

  const columnVisibility = useStore(
    dataTableStore,
    (state) => state.columnVisibility,
  );
  const rowSelection = useStore(dataTableStore, (state) => state.rowSelection);
  const columnResizeMode = useStore(
    dataTableStore,
    (state) => state.columnResizeMode,
  );
  const columnResizeDirection = useStore(
    dataTableStore,
    (state) => state.columnResizeDirection,
  );

  const dataTableSetters = useMemo(() => {
    const store = dataTableStore.getState();

    return /** @type {TableSetters} */ ({
      setColumnFilters: store.setColumnFilters,
      setColumnVisibility: store.setColumnVisibility,
      setRowSelection: store.setRowSelection,
      setSorting: store.setSorting,
      setColumnResizeMode: store.setColumnResizeMode,
    });
  }, [dataTableStore]);

  const table = useReactTable({
    data: props.data,
    columns: props.columns,
    getCoreRowModel: getCoreRowModel(),

    filterFns: {
      dateBetweenFilterFn,
    },

    getSortedRowModel: isSortingExternal ? undefined : getSortedRowModel(),
    onSortingChange: dataTableSetters.setSorting,

    onColumnFiltersChange: dataTableSetters.setColumnFilters,
    getFilteredRowModel: isFilteringExternal
      ? undefined
      : getFilteredRowModel(),

    onColumnVisibilityChange: dataTableSetters.setColumnVisibility,
    onRowSelectionChange: dataTableSetters.setRowSelection,
    columnResizeMode,
    columnResizeDirection,
    state: {
      sorting: sorting,
      columnFilters: columnFilters,
      columnVisibility: /** @type {TableState['columnVisibility']} */ (
        columnVisibility
      ),
      rowSelection: /** @type {TableState['rowSelection']} */ (rowSelection),
    },
    // onStateChange: (state) => {
    //   dataTableStore.setState({ _table: table });
    // },

    // manualFiltering: true,
  });

  useMemo(() => {
    dataTableStore.setState({ _table: /** @type {any} */ (table) });
  }, [dataTableStore, table]);

  // useLayoutEffect(() => {
  // 	dataTableStore.setState({ _table: /** @type {any} */ (table) });
  // }, [dataTableStore, table]);

  // <div className="flex px-4 flex-col py-4">
  //   <div className="flex items-center border">
  //     <Input
  //       placeholder="Filter emails..."
  //       value={
  //         /** @type {string} */ (
  //           table.getColumn('email')?.getFilterValue()
  //         ) ?? ''
  //       }
  //       onChange={(event) =>
  //         table.getColumn('email')?.setFilterValue(event.target.value)
  //       }
  //       className="max-w-sm border-0"
  //     />

  //     <DataTableViewOptions table={table} />
  //   </div>
  // </div>

  return (
    <div className="flex flex-col gap-4 rounded-md bg-background px-4 pt-4 text-foreground">
      <div className="flex flex-col justify-center gap-2">
        {columnFilters.map((filter) => {
          if (filter.operator === "between") {
            /** @type {any} */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let from = filter.value?.[0];
            /** @type {any} */
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            let to = filter.value?.[1];

            if (from instanceof Date) {
              from = from.toLocaleDateString();
            }

            if (to instanceof Date) {
              to = to.toLocaleDateString();
            }

            const hasAnyValue = !!(from || to);

            if (!hasAnyValue) {
              return null;
            }

            return (
              <div
                className="flex flex-wrap items-center gap-2"
                key={filter.id}
              >
                <p>{filter.id}: </p>
                <div className="flex flex-wrap gap-2">
                  {from && (
                    <Chip variant="secondary" className="py-0 ps-0">
                      <Button
                        type="button"
                        className="h-7 rounded-s-full py-0 pe-1 ps-2"
                        variant="light"
                        onClick={() => {
                          dataTableStore.getState().setColumnFilters((old) => {
                            /** @type {any[]} */
                            const newFilters = [];

                            for (const oldFilter of old) {
                              if (
                                oldFilter.id === filter.id &&
                                oldFilter.operator === filter.operator
                              ) {
                                const item1 = null;
                                /** @type {Date|null|undefined} */
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const item2 = oldFilter?.value?.[1] ?? null;

                                if (!item1 && !item2) {
                                  continue;
                                }

                                newFilters.push({
                                  ...oldFilter,
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  value: [item1, item2],
                                });
                              } else {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                newFilters.push(oldFilter);
                              }
                            }

                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return newFilters;
                          });
                        }}
                      >
                        x
                      </Button>
                      &nbsp; From: {from}
                    </Chip>
                  )}
                  {to && (
                    <Chip variant="secondary" className="py-0 ps-0">
                      <Button
                        type="button"
                        className="h-7 rounded-s-full py-0 pe-1 ps-2"
                        variant="light"
                        onClick={() => {
                          dataTableStore.getState().setColumnFilters((old) => {
                            /** @type {any[]} */
                            const newFilters = [];

                            for (const oldFilter of old) {
                              if (
                                oldFilter.id === filter.id &&
                                oldFilter.operator === filter.operator
                              ) {
                                /** @type {Date|null|undefined} */
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
                                const item1 = oldFilter?.value?.[0] ?? null;
                                const item2 = null;

                                if (!item1 && !item2) {
                                  continue;
                                }

                                newFilters.push({
                                  ...oldFilter,
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-ignore
                                  value: [item1, item2],
                                });
                              } else {
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-ignore
                                newFilters.push(oldFilter);
                              }
                            }

                            // eslint-disable-next-line @typescript-eslint/no-unsafe-return
                            return newFilters;
                          });
                        }}
                      >
                        x
                      </Button>
                      &nbsp; To: {to}
                    </Chip>
                  )}
                </div>
              </div>
            );
          }

          /** @type {any} */
          const value = filter.value;

          return (
            <div className="flex flex-wrap items-center gap-2" key={filter.id}>
              <p>{filter.id}: </p>
              <Chip variant="secondary" className="py-0 ps-0">
                <Button
                  type="button"
                  className="h-7 rounded-s-full py-0 pe-1 ps-2"
                  variant="light"
                  onClick={() => {
                    dataTableStore.getState().setColumnFilters((old) => {
                      return old.filter(
                        (oldFilter) =>
                          !(
                            oldFilter.id === filter.id &&
                            oldFilter.operator === filter.operator
                          ),
                      );
                    });
                  }}
                >
                  x
                </Button>
                &nbsp;
                {value}
              </Chip>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of{" "}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </p>

        <div className="flex flex-wrap gap-2">
          {props.topActionsButtonsStart}
          <XLSXExportButton columns={props.columns} />
          {props.topActionsButtonsEnd}
        </div>
      </div>

      <TableContainer table={table}>
        <Table
          isTableHeaderSticky
          style={{
            direction: table.options.columnResizeDirection,
            // width: table.getCenterTotalSize(),
            // width: '100%'
          }}
          className={props.isPending ? "pointer-events-none animate-pulse" : ""}
        >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <DataTableColumnHeader
                      key={header.id}
                      title={flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )}
                      header={header}
                      table={table}
                    />
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              <>
                {
                  //  When resizing any column we will render this special memoized version of our table body
                  table.getState().columnSizingInfo.isResizingColumn ? (
                    <MemoizedDataTableBody
                      table={table}
                      rowIdKey={props.rowIdKey}
                    />
                  ) : (
                    <DataTableBodyContent
                      table={table}
                      rowIdKey={props.rowIdKey}
                    />
                  )
                }
                {props.infiniteLoading && (
                  <InfiniteLoadingRowTrigger {...props.infiniteLoading} />
                )}
              </>
            ) : (
              <TableRow>
                <TableCell
                  colSpan={props.columns.length}
                  className="h-24 text-center"
                >
                  {props.isPending ? "Loading..." : "No data to display."}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

/**
 * @template TData
 *
 * @param {PropsWithChildren<{ table: import('@tanstack/react-table').Table<TData> }>} props
 */
function TableContainer(props) {
  const columnSizingInfo = props.table.getState().columnSizingInfo;
  /**
   * Instead of calling `column.getSize()` on every render for every header
   * and especially every data cell (very expensive),
   * we will calculate all column sizes at once at the root table level in a useMemo
   * and pass the column sizes down as CSS variables to the <table> element.
   */
  const columnSizeVars = useMemo(() => {
    const headers = props.table.getFlatHeaders();
    /** @type {{ [key: string]: number }} */
    const colSizes = {};
    for (const header of headers) {
      colSizes[`--header-${header.id}-size`] = header.getSize();
      colSizes[`--col-${header.column.id}-size`] = header.column.getSize();
    }
    return colSizes;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columnSizingInfo]);

  const children = useMemo(() => props.children, [props.children]);

  return (
    <div
      className="overflow-x-auto rounded-md border"
      style={{
        ...columnSizeVars, //Define column sizes on the <table> element
      }}
    >
      {children}
    </div>
  );
}

/**
 * @template TData
 *
 * @param {PropsWithChildren<{
 * 	table: import('@tanstack/react-table').Table<TData>;
 * 	rowIdKey?: keyof TData;
 * }>} props
 */
function DataTableBodyContent(props) {
  return (
    <>
      {props.table.getRowModel().rows.map((row) => (
        <TableRow
          key={
            (props.rowIdKey &&
              /** @type {string} */ (row.original[props.rowIdKey])) ??
            row.id
          }
          data-state={row.getIsSelected() && "selected"}
        >
          {row.getVisibleCells().map((cell) => (
            <TableCell
              key={cell.id}
              style={{
                width:
                  cell.column.id === "select"
                    ? cell.column.columnDef.meta?.width
                    : `calc(var(--col-${cell.column.id}-size) * 0.0625rem)`,
              }}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

//special memoized wrapper for our table body that we will use during column resizing
const MemoizedDataTableBody = /** @type {typeof DataTableBodyContent} */ (
  memo(
    DataTableBodyContent,
    (prev, next) => prev.table.options.data === next.table.options.data,
  )
);

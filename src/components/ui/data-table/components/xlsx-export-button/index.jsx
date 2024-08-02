"use client";

/** @import { ColumnDef } from '@tanstack/react-table' */
/** @import { AppRouterPathToVars, InferAppRouterGetManyOrManyBasic } from '~/trpc/types/index.js' */

import { Button } from "../../../button";

import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";
import { useDataTableContextStore } from "../../../data-table/context";
import { useStore } from "zustand";

/**
 * @param {{ item: unknown[]; header?: string[]; }} params
 */
export function json2Excel(params) {
  const worksheet = XLSXUtils.json_to_sheet(params.item, {
    header: params.header,
  });

  const wb = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(wb, worksheet, "sheet1");

  return wb;
}

/**
 * @template {InferAppRouterGetManyOrManyBasic} TRouterPath
 * @template {AppRouterPathToVars[TRouterPath]['$output']['items'][number]} TData
 * @template TValue
 *
 * @param {{
 * 	columns:  ColumnDef<TData, TValue>[]
 * }} props
 */
export default function XLSXExportButton(props) {
  const tableStore = useDataTableContextStore();

  const canExportToXLSX = useStore(
    tableStore,
    (state) => state.canExportTo?.xlsx,
  );

  const hasRowSelection = useStore(
    tableStore,
    (state) =>
      state.canExportTo?.xlsx && Object.keys(state.rowSelection).length > 0,
  );

  if (!canExportToXLSX) {
    return null;
  }

  return (
    <Button
      disabled={!hasRowSelection}
      onClick={() => {
        /** @type {string[]} */
        const headers = [];
        /** @type {string[]} */
        const accessorKeys = [];

        for (const column of props.columns) {
          const header = column.meta?.header;
          const accessorKey = /** @type {{ accessorKey?: string }} */ (column)
            .accessorKey;

          if (header && accessorKey) {
            headers.push(header);
            accessorKeys.push(accessorKey);
          }
        }

        const flatRows = tableStore
          .getState()
          .getTable()
          ?.getSelectedRowModel().flatRows;

        if (!flatRows) throw new Error("no selected rows found");

        /** @type {unknown[]} */
        const data = [];

        for (const element of flatRows) {
          /** @type {Record<string, unknown>} */
          const item = {};

          for (let i = 0; i < accessorKeys.length; i++) {
            const accessorKey = /** @type {string} */ (accessorKeys[i]);
            const title = /** @type {string} */ (headers[i]);

            /** @type {unknown} */
            const value = element.getValue(accessorKey);

            if (typeof value !== "undefined") {
              item[title] = value;
            }
          }

          data.push(item);
        }

        const workBook = json2Excel({
          item: data,
          header: headers,
        });

        XLSXWriteFile(workBook, `${new Date().toISOString()}.xlsx`, {
          compression: true,
        });
      }}
      className="w-fit capitalize"
    >
      Export
    </Button>
  );
}

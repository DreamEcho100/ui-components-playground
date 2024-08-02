"use client";
import { Button } from "../../../../button";

import { utils as XLSXUtils, writeFile as XLSXWriteFile } from "xlsx";
import { useDataTableContextStore } from "../../../../data-table/context";
import { useStore } from "zustand";
import { WorkerSharing } from "./worker-sharing";

export function createDefaultFileName() {
  return `${Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
    // hour: "2-digit",
    minute: "2-digit",
    // second: "2-digit",
    // timeZoneName: "short",
    // weekday: "short",
    // year: "numeric",
  })
    .format(new Date())
    .replace(/[/:]/g, "-")
    .replace(/[\s,]+/g, "_")}.xlsx`;
}

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

/** @import { ColumnDef } from '@tanstack/react-table' */
/** @import { AppRouterPathToVars, InferAppRouterGetManyOrManyBasic } from '~/trpc/types/index.js' */

const worker = new Worker(new URL("./export.worker.js", import.meta.url), {
  type: "module",
});

const json_data_to_export = [
  { id: 1, name: "Alice", email: "alice@example.com", age: 28, isActive: true },
  { id: 2, name: "Bob", email: "bob@example.com", age: 34, isActive: false },
  {
    id: 3,
    name: "Charlie",
    email: "charlie@example.com",
    age: 22,
    isActive: true,
  },
  {
    id: 4,
    name: "Diana",
    email: "diana@example.com",
    age: 31,
    isActive: false,
  },
  { id: 5, name: "Eve", email: "eve@example.com", age: 25, isActive: true },
];

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

  const hasRowSelection = useStore(
    tableStore,
    (state) => Object.keys(state.rowSelection).length > 0,
  );

  return (
    <Button
      disabled={!hasRowSelection}
      onClick={() => {
        const dataId = crypto.randomUUID();
        WorkerSharing.register(dataId, json_data_to_export);
        worker.postMessage({ id: dataId });

        // Handle messages from the worker
        worker.onmessage = (e) => {
          console.log("___ e", e);
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const messageSharedFromWorker = WorkerSharing.get(
            `${dataId}-shared`,
            { shouldUnregister: true },
          );

          console.log("___ messageSharedFromWorker", messageSharedFromWorker);
          // const url = URL.createObjectURL(
          //   new Blob([e.data], {
          //     type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
          //   }),
          // );
          // const a = document.createElement("a");
          // a.href = url;
          // a.download = "data.xlsx";
          // document.body.appendChild(a);
          // a.click();
          // document.body.removeChild(a);
        };

        // return;

        /** @type {string[]} */
        const headers = [];
        /** @type {string[]} */
        const accessorKeys = [];

        /** @type {string[]} */

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

/**
 * @template Payload
 * @typedef {{ status: "loading" } | { status: "error"; payload: { message: string; } } | { status: "success"; payload: Payload }} WorkerEventState
 */

import { useEffect, useRef } from "react";

/** @typedef {{ workBook: import("xlsx").WorkBook }} XLSXWriteFileWorkerSuccess */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
/** @typedef {{ jsonData: Record<string, any>[]; }} Json2ExcelWorkerSuccess */

/**
 * @template Payload
 * @param {Worker} worker
 * @param {(params: WorkerEventState<Payload>) => Promise<void> | void} cb
 */
export function getWorkerState(worker, cb) {
  // Defining the callback function to handle messages from the Web Worker
  /**
   * @param {MessageEvent<WorkerEventState<Payload>>} event
   */
  async function onMessageReceived(event) {
    await cb(event.data);
  }

  // Attaching the callback function as an event listener to the Web Worker
  // eslint-disable-next-line @typescript-eslint/no-misused-promises
  worker.addEventListener("message", onMessageReceived);
}

// * @template {string} Keys - The type of keys.

/**
 * @template {object} Data
 * @template Input
 * @param {object} params
 * @param {import("zustand").StoreApi<import("@de100/react-table-query").TableStore<Data,Input>>} params.tableStore
 * @param {import("../../../../../packages/utils/dist/xlsx_").ConversionConfig<Data, string>} params.metadata
 * @param {import("react").MutableRefObject<Worker | undefined>} params.workerRef
 */
export function handleOnExportToXlsxClick(params) {
  const rows =
    params.tableStore.getState().table?.getSelectedRowModel().rows ?? [];

  if (!rows || !params.workerRef.current) return;

  const keys2ExcludeOnEmpty = params.metadata.keys2ExcludeOnEmpty;

  const formattedData = rows.map((item) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    /** @type {Record<string, any>}*/
    const _item = {};

    /** @type {string}*/
    let name;
    for (name in params.metadata.tableKey2Title) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const value = item.getValue(name);

      if (!value) continue;
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const transform = params.metadata.key2TransformType?.[name];

      switch (transform) {
        case "date-time":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          _item[params.metadata.tableKey2Title[name]] = !value
            ? null
            : Intl.DateTimeFormat(
                "en-US",
                {
                  dateStyle: "short",
                  timeStyle: "short",
                  hour12: false,
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              ).format(typeof value === "string" ? new Date(value) : value);
          continue;

        case "date":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          _item[params.metadata.tableKey2Title[name]] = !value
            ? null
            : Intl.DateTimeFormat(
                "en-US",
                {
                  dateStyle: "short",
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              ).format(typeof value === "string" ? new Date(value) : value);
          continue;

        case "time":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          _item[params.metadata.tableKey2Title[name]] = !value
            ? null
            : Intl.DateTimeFormat(
                "en-US",
                {
                  timeStyle: "short",
                  hour12: false,
                },
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              ).format(typeof value === "string" ? new Date(value) : value);
          continue;

        case "number":
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore

          _item[params.metadata.tableKey2Title[name]] =
            typeof value === "number"
              ? value
              : typeof value === "string"
                ? parseFloat(value)
                : null;
          continue;

        default:
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          _item[params.metadata.tableKey2Title[name]] = value;
      }
    }

    return _item;
  });

  const header =
    formattedData.length === 0 && keys2ExcludeOnEmpty
      ? Object.keys(params.metadata.title2Key).filter(
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          (key) =>
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            !keys2ExcludeOnEmpty.includes(params.metadata.title2Key[key]),
        )
      : Object.keys(params.metadata.title2Key);
  params.workerRef.current.postMessage({
    formattedData,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    header,
  });
}

/**
 * @param {Parameters<typeof getWorkerState<XLSXWriteFileWorkerSuccess>>[1]} cb
 * @returns
 */
export function useXLSXWriteFileWorker(cb) {
  /** @type {import("react").MutableRefObject<Worker | undefined>} */
  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("~/libs/xlsx/workers/json2Excel.worker.ts", import.meta.url),
    );
    const current = workerRef.current;

    getWorkerState(current, cb);
    return () => {
      current.terminate();
    };
  }, [cb]);

  return { workerRef };
}

/**
 * @template Payload
 * @typedef {Parameters<typeof getWorkerState<Payload>>[1]} UseJson2ExcelWorkerCB
 */

/**
 * @template Payload
 * @param {Parameters<typeof getWorkerState<Payload>>[1]} cb
 * @returns
 */
export function useJson2ExcelWorker(cb) {
  /** @type {import("react").MutableRefObject<Worker | undefined>} */
  const workerRef = useRef();

  useEffect(() => {
    workerRef.current = new Worker(
      new URL("~/libs/xlsx/workers/excel2json.worker.ts", import.meta.url),
    );
    const current = workerRef.current;

    getWorkerState(current, cb);
    return () => {
      current.terminate();
    };
  }, [cb]);

  return { workerRef };
}

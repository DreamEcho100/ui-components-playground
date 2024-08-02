/** @import { ButtonProps } from "../../../button/types" */
/** @import { ColumnDef } from '@tanstack/react-table' */

import { useRef, useState } from "react";
import { Button } from "../../../button";
import { useQuery } from "@tanstack/react-query";
import { read as XLSXRead, utils as XLSXUtils } from "xlsx";

/**
 * @typedef {{ worksheet: import("xlsx").Sheet; cell: import("xlsx").CellObject, address: string; column: number, row: number, utils: import("xlsx").XLSX$Utils }} mapHeaderRowParams
 */

/**
 * @param {import("xlsx").Sheet} worksheet
 * @param {(params: mapHeaderRowParams) => void} cb
 */
function mapHeaderRow(worksheet, cb) {
  const range = XLSXUtils.decode_range(
    /** @type {string} */
    (worksheet["!ref"]),
  );

  const row = range.s.r; /* start in the first row */
  /* walk every column in the range */
  for (let column = range.s.c; column <= range.e.c; ++column) {
    /** @type {string} */
    const cellAddress = XLSXUtils.encode_cell({ c: column, r: row });

    /* find the cell in the first row */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cell = /** @type {import("xlsx").CellObject} */ (
      worksheet[cellAddress]
    );

    cb({
      cell,
      address: cellAddress,
      column: column,
      row: row,
      utils: XLSXUtils,
      worksheet,
    });
  }
}

/**
 * @param {Record<string, string>} title2Key
 */
function changeSheetHeaderByTitle2Key(title2Key) {
  /** @param {mapHeaderRowParams} params */
  return (params) => {
    /** @type {import("xlsx").CellObject} */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cell =
      params.worksheet[
        /** @type {string} */
        (params.address)
      ]; // worksheet[title]
    const key = /** @type {string} */ (
      title2Key[/** @type {string} */ (cell.v)]
    );

    if (!key) return;

    cell.r = `<t>${key}</t>`;
    if (cell.h) cell.h = `${key}`;
    if (cell.v) cell.v = `${key}`;
    if (cell.w) cell.w = `${key}`;
  };
}

/**
 * @template TData
 * @template TValue
 *
 * @param {ButtonProps & {
 * 	columns:  ColumnDef<TData, TValue>[];
 * 	onSuccess?: (data: Record<string, unknown>[]) => void;
 *  onError?: (error: Error) => void;
 *  accessorKey2Alt?: Record<string, string>;
 * }} props
 */
export default function ExcelToJsonButton({
  columns,
  accessorKey2Alt = {},
  onError,
  onSuccess,
  ...props
}) {
  const [isLoading, setIsLLoading] = useState(false);
  const convertUtilQuery = useQuery({
    queryKey: ["convertUtil"],
    queryFn: () =>
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      import("excel2json-wasm").then(
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
        (module) => /** @type {import("./types").TConvert} */ (module.convert),
      ),
  });
  const inputRef = useRef(
    /** @type {HTMLInputElement | null} */
    (null),
  );

  /** @param {File} file */
  const handleFile = async (file) => {
    setIsLLoading(true);
    try {
      /** @type {Record<string, string>} */
      const header2AccessorKeyMap = {};

      for (const column of columns) {
        const header = column.meta?.header;
        let accessorKey = /** @type {{ accessorKey?: string }} */ (column)
          .accessorKey;

        if (header && accessorKey) {
          if (accessorKey2Alt[accessorKey]) {
            accessorKey = /** @type {string} */ (accessorKey2Alt[accessorKey]);
          }

          header2AccessorKeyMap[header] = accessorKey;
        }
      }

      const reader = new FileReader();

      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      /** @type {Record<string, unknown>[]} */
      const data = await new Promise((resolve, reject) => {
        reader.onload = (e) => {
          const data = new Uint8Array(
            /** @type {ArrayBuffer} */ (e.target?.result),
          );
          const workbook = XLSXRead(data, {
            type: "array",
            cellDates: true,
          });
          const sheetName = workbook.SheetNames[0];

          if (!sheetName) {
            reject("sheetName is not defined");
            return;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const worksheet = workbook.Sheets[sheetName];
          if (!worksheet) {
            reject("worksheet is not defined");
            return;
          }

          mapHeaderRow(
            worksheet,
            changeSheetHeaderByTitle2Key(header2AccessorKeyMap),
          );

          const json = XLSXUtils.sheet_to_json(worksheet);
          // setJsonData(json);

          resolve(/** @type {Record<string, unknown>[]} */ (json));
          return;
        };
        reader.onerror = (e) => {
          reject(`Error reading ${file.name}`);
          return;
        };

        reader.onabort = (e) => {
          reject(`Reading of ${file.name} aborted`);
          return;
        };

        reader.readAsArrayBuffer(file);
      });

      onSuccess?.(data);
    } catch (error) {
      onError?.(/** @type {Error} */ (error));
    } finally {
      const inputCurrent = inputRef.current;
      if (inputCurrent) {
        inputCurrent.value = "";
      }

      setIsLLoading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        ref={inputRef}
        accept=".xlsx"
        disabled={isLoading}
        onChange={async (e) => {
          if (isLoading) {
            return;
          }

          const file = e.target.files?.[0];

          if (!file) {
            return;
          }

          await handleFile(file);
        }}
        style={{ display: "none" }}
      />
      <Button
        {...props}
        onClick={() => {
          inputRef.current?.click();
        }}
        disabled={
          isLoading ||
          convertUtilQuery.isLoading ||
          convertUtilQuery.isError ||
          props.disabled
        }
        className="capitalize"
      >
        import
      </Button>
    </>
  );
}

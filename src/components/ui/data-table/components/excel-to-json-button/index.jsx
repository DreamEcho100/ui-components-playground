/** @import { ButtonProps } from "../../../button/types" */
/** @import { ColumnDef } from '@tanstack/react-table' */

import { useRef, useState } from "react";
import { Button } from "../../../button";
import { useQuery } from "@tanstack/react-query";
import { read as XLSXRead, utils as XLSXUtils } from "xlsx";
import { Download } from "lucide-react";
import { mapHeaderRow, changeSheetHeaderByTitle2Key } from "./utils";

/**
 * @template TData
 * @template TValue
 *
 * @param {Omit<ButtonProps, 'onError'> & {
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
        reader.onerror = () => {
          reject(`Error reading ${file.name}`);
          return;
        };

        reader.onabort = () => {
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
        <Download className="size-4" />
        &nbsp; import
      </Button>
    </>
  );
}

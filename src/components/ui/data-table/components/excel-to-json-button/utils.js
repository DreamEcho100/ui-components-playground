import { utils as XLSXUtils } from "xlsx";

/**
 * @typedef {{ worksheet: import("xlsx").Sheet; cell: import("xlsx").CellObject, address: string; column: number, row: number, utils: import("xlsx").XLSX$Utils }} mapHeaderRowParams
 */

/**
 * @param {import("xlsx").Sheet} worksheet
 * @param {(params: mapHeaderRowParams) => void} cb
 */
export function mapHeaderRow(worksheet, cb) {
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
export function changeSheetHeaderByTitle2Key(title2Key) {
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

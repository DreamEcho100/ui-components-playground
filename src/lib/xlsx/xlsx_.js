import {
  read as XLSXRead,
  utils as XLSXUtils,
  writeFile as XLSXWriteFile,
} from "xlsx";

import { reverseObj } from "./object.js";

export { XLSXWriteFile as XLSXWriteFile, XLSXUtils, XLSXRead };

/**
 * @typedef {import("xlsx").WorkBook} WorkBook
 */

/**
 * @param {{item: unknown[];header?: string[];filename?: string;}} params
 */
export function json2Excel(params) {
  const worksheet = XLSXUtils.json_to_sheet(params.item, {
    header: params.header,
  });

  const wb = XLSXUtils.book_new();
  XLSXUtils.book_append_sheet(wb, worksheet, "sheet1");

  return wb;
}

export function createDefaultFileName() {
  return `${Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
    hour12: false,
  })
    .format(new Date())
    .replace(/[/:]/g, "-")
    .replace(/[\s,]+/g, "_")}.xlsx`;
}

/**
 * @template {object} Data - The type of keys.
 * @template {string} Titles - The type of titles.
 */
export class ConversionConfig {
  /** @typedef {import("./types.ts").DeepKeys<Data>} Keys */

  /**  @type {Partial<Record<Keys, Titles>>} */
  key2Title;

  /**
   * @type {Partial<Record<string, Titles>>}
   * @description Because `@tanstack/react-table` replaces `.` with `_`
   */
  tableKey2Title;

  /**  @type {Partial<Record<Keys, string>>} */
  key2TableKey;

  /** @type {Record<string, string> | undefined} */
  key2TransformType;

  /** @type {Partial<Record<Titles, Keys>>} */
  title2Key;

  /** @type {Keys[] | undefined} */
  keys2ExcludeOnEmpty;

  /**
   * @param {Object} params - The constructor parameters.
   * @param {Partial<Record<Keys, Titles>>} params.key2Title - The key-to-title mapping.
   * @param {Record<string, string> | undefined} [params.key2TransformType] - The key-to-transform-type mapping.
   * @param {Keys[] | undefined} [params.keys2ExcludeOnEmpty] - The keys to exclude on empty.
   */
  constructor(params) {
    this.key2TransformType = params.key2TransformType;
    this.keys2ExcludeOnEmpty = params.keys2ExcludeOnEmpty;

    this.key2Title = params.key2Title;
    this.title2Key = reverseObj(
      /** @type {Record<string, string>} */
      (params.key2Title),
    );

    /** @type {Partial<Record<string, Titles>>} */
    const tableKey2Title = {};

    /** @type {Partial<Record<Keys, string>>} */
    const key2TableKey = {};

    /** @type {string} */
    let key;
    for (key in params.key2Title) {
      const tableKey = key.replace(".", "_");
      tableKey2Title[tableKey] = /** @type {Titles} */ (
        params.key2Title[/** @type {Keys} */ (key)]
      );

      key2TableKey[/** @type {Keys} */ (key)] = tableKey;
    }

    this.tableKey2Title = tableKey2Title;
    this.key2TableKey = key2TableKey;
  }

  valueOf() {
    return {
      key2Title: this.key2Title,
      key2TransformType: this.key2TransformType,
      keys2ExcludeOnEmpty: this.keys2ExcludeOnEmpty,
      title2Key: this.title2Key,
    };
  }
}

/** @param {import("xlsx").Sheet} sheet */
export function getHeaderRow(sheet) {
  const headers = [];
  const range = XLSXUtils.decode_range(
    /** @type {string} */
    (sheet["!ref"]),
  );

  let C = range.s.r; /* start in the first row */
  const R = C;
  /** @description walk every column in the range */
  for (C = range.s.c; C <= range.e.c; ++C) {
    /** @description find the cell in the first row */
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const cell = /** @type {import("xlsx").CellObject} */ (
      sheet[XLSXUtils.encode_cell({ c: C, r: R })]
    );

    let hdr = "UNKNOWN " + C; // <-- replace with your desired default

    // if (cell.t)
    hdr = XLSXUtils.format_cell(cell);

    headers.push(hdr);
  }
  return headers;
}

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

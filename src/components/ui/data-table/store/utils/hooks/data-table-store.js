/** @import { ColumnDef } from '@tanstack/react-table' */
/** @import { CreateDataTableStoreInitialValues } from '../../index.ts' */

import { useRef } from "react";
import { createDataTableStore } from "../..";

/**
 * @template TData
 * @template TValue
 *
 *
 * @param {ColumnDef<TData, TValue>[]} columns
 * @param {CreateDataTableStoreInitialValues<TData>} [initialValues]
 */
export function useDataTableStore(columns, initialValues) {
  const dataTableStore = useRef(createDataTableStore(initialValues)).current;

  return dataTableStore;
}

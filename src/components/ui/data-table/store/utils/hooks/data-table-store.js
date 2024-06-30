import { useRef } from 'react';
import { createDataTableStore } from '../..';

/**
 * @template TData
 * @template TValue
 *
 *
 * @param {import('@tanstack/react-table').ColumnDef<TData, TValue>[]} columns
 * @param {import('../..').CreateDataTableStoreInitialValues<TData>} [initialValues]
 */
export function useDataTableStore(columns, initialValues) {
  const dataTableStore = useRef(createDataTableStore(initialValues)).current;

  return /** @type {const} */ ([dataTableStore, columns]);
}

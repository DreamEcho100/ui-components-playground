import { useMemo, useRef } from 'react';
import { createStore, useStore } from 'zustand';

/**
 * @template TData
 * @typedef {import("./types").DataTableStoreState<TData>} DataTableStoreState
 */

/**
 * @template TData
 *
 * @typedef {(partial: Partial<DataTableStoreState<TData>> | ((store: DataTableStoreState<TData>) => Partial<DataTableStoreState<TData>>), replace?: boolean | undefined) => void} SetDataTableStoreState
 */

/**
 * @template TData
 * @template {keyof DataTableStoreState<TData>} TKey
 *
 * @param {SetDataTableStoreState<TData>} set
 * @param {() => DataTableStoreState<TData>} get
 * @param {TKey} name
 */
const valueOrUpdater =
  (set, get, name) =>
  /**
   * @param {import('../types').ValueOrUpdater<DataTableStoreState<TData>>[TKey]} valueOrUpdater
   */
  (valueOrUpdater) => {
    const store = get();
    const newValue =
      typeof valueOrUpdater === 'function'
        ? valueOrUpdater(store[name])
        : valueOrUpdater;

    set({ [name]: newValue });
  };

/**
 * @template TData
 *
 * @typedef {Partial<Omit<DataTableStoreState<TData>, '_table' | 'getTable'>>} TempInitialValues
 */
/**
 * @template TData
 *
 * @typedef {{
 *  initialValues?: Partial<Omit<TempInitialValues<TData>, `set${string}`>>;
 * }} CreateDataTableStoreInitialValues
 */

/**
 * @template TData
 *
 * @param {CreateDataTableStoreInitialValues<TData>} [options]
 */
export function createDataTableStore(options) {
  return createStore(
    /**
     *
     * @param { (partial: Partial<DataTableStoreState<TData>> | ((store: DataTableStoreState<TData>) => Partial<DataTableStoreState<TData>>), replace?: boolean | undefined) => void} set
     * @returns {DataTableStoreState<TData>}
     */ (set, get) => {
      const defaultSetColumnFilters = valueOrUpdater(set, get, 'columnFilters');
      const defaultSetSorting = valueOrUpdater(set, get, 'sorting');
      const defaultSetRowSelection = valueOrUpdater(set, get, 'rowSelection');
      const defaultSetColumnVisibility = valueOrUpdater(
        set,
        get,
        'columnVisibility',
      );
      const defaultSetColumnResizeMode = valueOrUpdater(
        set,
        get,
        'columnResizeMode',
      );
      const defaultSetColumnResizeDirection = valueOrUpdater(
        set,
        get,
        'columnResizeDirection',
      );

      return {
        columnFilters: options?.initialValues?.columnFilters ?? [],
        setColumnFilters: defaultSetColumnFilters,

        rowSelection: options?.initialValues?.rowSelection ?? {},
        setRowSelection: defaultSetRowSelection,

        columnVisibility: options?.initialValues?.columnVisibility ?? {},
        setColumnVisibility: defaultSetColumnVisibility,

        sorting: options?.initialValues?.sorting ?? [],
        setSorting: defaultSetSorting,

        columnResizeMode:
          options?.initialValues?.columnResizeMode ?? 'onChange',
        setColumnResizeMode: defaultSetColumnResizeMode,

        columnResizeDirection:
          options?.initialValues?.columnResizeDirection ?? 'ltr',
        setColumnResizeDirection: defaultSetColumnResizeDirection,

        _table: null,
        getTable: () => {
          const table = get()._table;

          if (!table) {
            throw new Error(
              'Table not initialized. Make sure to set `table` before calling getTable',
            );
          }

          return table;
        },
      };
    },
  );
}

/**
 * @template TData
 * @template TValue
 *
 *
 * @param {import('@tanstack/react-table').ColumnDef<TData, TValue>[]} columns
 * @param {CreateDataTableStoreInitialValues<TData>} [initialValues]
 */
export function useDataTable(columns, initialValues) {
  const dataTableStore = useRef(createDataTableStore(initialValues)).current;
  const { columnToFilterInfo } = useMemo(() => {
    /** @type {Record<string, { type: string }> | undefined} */
    const columnToFilterInfo = {};
    // /** @type {Record<string, string[]>} */
    // const filterTypeToColumns = {};

    for (const column of columns) {
      const filterVariantType = column.meta?.filterVariant?.type;
      const accessorKey = /** @type {{ accessorKey?: string }} */ (column)
        .accessorKey;

      if (filterVariantType && accessorKey) {
        columnToFilterInfo[accessorKey] = { type: filterVariantType };
      }
    }

    return { columnToFilterInfo };
  }, [columns]);

  const sorting = useStore(dataTableStore, (state) => state.sorting);
  const filters = useStore(dataTableStore, (state) => state.columnFilters);
  const queryFilters = useMemo(() => {
    /** @type {Record<string, any>} */
    const formattedFilters = {};

    for (const filter of filters) {
      const column = columnToFilterInfo[filter.id];
      if (column.type === 'range-number' || column.type === 'range-date') {
        const [min = null, max = null] =
          /** @type {[string, string]} */ (filter.value) ?? [];
        if (min || max) {
          formattedFilters[filter.id] = { min, max };
        }

        continue;
      }

      if (column.type === 'select' || column.type === 'text') {
        formattedFilters[filter.id] = filter.value;
      }
    }

    return formattedFilters;
  }, [columnToFilterInfo, filters]);
  const querySorting = Object.fromEntries(
    sorting.map(({ id, desc }) => [id, desc ? 'desc' : 'asc']),
  );

  return /** @type {const} */ ({
    columns,
    dataTableStore,
    queryFilters,
    querySorting,
  });
}

import { useMemo } from 'react';
import { useStore } from 'zustand';

/**
 * @template TData
 * @template TValue
 *
 * @param {{
 * 		columns: import('@tanstack/react-table').ColumnDef<TData, TValue>[]
 * 		dataTableStore: import("../../types").DataTableStoreApi<TData>
 * }} props
 */
export default function useDataTableQueryInputs(props) {
  const { columnToFilterInfo } = useMemo(() => {
    /** @type {Record<string, { type: string }> | undefined} */
    const columnToFilterInfo = {};
    // /** @type {Record<string, string[]>} */
    // const filterTypeToColumns = {};

    for (const column of props.columns) {
      const filterVariantType = column.meta?.filterVariant?.type;
      const accessorKey = /** @type {{ accessorKey?: string }} */ (column)
        .accessorKey;

      if (filterVariantType && accessorKey) {
        columnToFilterInfo[accessorKey] = { type: filterVariantType };
      }
    }

    return { columnToFilterInfo };
  }, [props.columns]);

  const sorting = useStore(props.dataTableStore, (state) => state.sorting);
  const filters = useStore(
    props.dataTableStore,
    (state) => state.columnFilters,
  );
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

  return {
    queryFilters,
    querySorting,
  };
}

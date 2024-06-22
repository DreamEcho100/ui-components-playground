import { useCallback, useEffect, useMemo, useState } from 'react';
import { Input } from '~/components/ui/input';
import { SelectDropdown } from '~/components/ui/select';
import { formatDate, isValidDate } from './utils';
import { useDataTableContextStore } from '~/components/ui/data-table/context';
import { useStore } from 'zustand';

// A typical debounced input react component
/**
 * @param {{
 *  value: string | number
 *  onChange: (value: string | number) => void
 *  debounce?: number
 * } & Omit<import('~/components/ui/input/types').InputProps, 'onChange'>} props
 */
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = 500,
  ...props
}) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    setValue(initialValue);
  }, [initialValue]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onChange(value);
    }, debounce);

    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Input
      {...props}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      className="flex-grow"
    />
  );
}

/**
 * @template TData
 *
 * @param {{ column: import("@tanstack/react-table").Column<TData, unknown> }} props
 */
export default function Filter(props) {
  const { filterVariant } = props.column.columnDef.meta ?? {};

  // const columnFilterValue = props.column.getFilterValue();
  // const setFilterValue = props.column.setFilterValue;

  const dataTableStore = useDataTableContextStore();
  const columnFilterValue = useStore(dataTableStore, (state) =>
    state.isFilteringExternal
      ? state.columnFilters.find((filter) => filter.id === props.column.id)
          ?.value
      : props.column.getFilterValue(),
  );
  const setFilterValue = useStore(dataTableStore, (state) =>
    state.isFilteringExternal
      ? /** @param {any} value */
        (value) => {
          state.setColumnFilters((old) => {
            const newFilters = old.filter(
              (filter) => filter.id !== props.column.id,
            );
            // newFilters.push({ id: props.column.id, value });
            return [{ id: props.column.id, value }];
          });
        }
      : props.column.setFilterValue,
  );

  // const value = useMemo(() => {}, []);
  // const onChange = useCallback(
  //   /** @param {any} value */
  //   (value) => {},
  //   [],
  // );

  if (!filterVariant?.type) {
    return null;
  }

  if (filterVariant.type === 'select') {
    return (
      <SelectDropdown
        {...filterVariant.props}
        onValueChange={setFilterValue}
        value={columnFilterValue?.toString()}
      />
    );
  }

  if (filterVariant.type === 'range-date') {
    const values = /** @type {[Date, Date]} */ (columnFilterValue);
    const startDate = values?.[0];
    const endDate = values?.[1];
    return (
      <div className="flex space-x-2">
        <DebouncedInput
          type="date"
          value={startDate ? formatDate(startDate) : ''}
          onChange={(value) => {
            const newValue =
              isValidDate(value) && value !== '' && value !== 'Invalid Date'
                ? new Date(value)
                : null;

            setFilterValue(
              /** @param {[Date, Date]} old  */
              (old) => [newValue, old?.[1]],
            );
          }}
        />
        <DebouncedInput
          type="date"
          value={endDate ? formatDate(endDate) : ''}
          onChange={(value) => {
            const newValue =
              isValidDate(value) && value !== '' && value !== 'Invalid Date'
                ? new Date(value)
                : null;

            setFilterValue(
              /** @param {[Date, Date]} old  */
              (old) => [old?.[0], newValue],
            );
          }}
        />
      </div>
    );
  }

  if (filterVariant.type === 'range-number') {
    return (
      <div className="flex space-x-2">
        {/* See faceted column filters example for min max values functionality */}
        <DebouncedInput
          type="number"
          value={/** @type {[number, number]} */ (columnFilterValue)?.[0] ?? ''}
          onChange={(value) =>
            setFilterValue(
              /** @param {[number, number]} old  */
              (old) => [value, old?.[1]],
            )
          }
          placeholder={`Min`}
          className="w-24 border shadow rounded"
        />
        <DebouncedInput
          type="number"
          value={/** @type {[number, number]} */ (columnFilterValue)?.[1] ?? ''}
          onChange={(value) =>
            setFilterValue(
              /** @param {[number, number]} old  */
              (old) => [old?.[0], value],
            )
          }
          placeholder={`Max`}
          className="w-24 border shadow rounded"
        />
      </div>
    );
  }

  if (filterVariant.type === 'text') {
    return (
      <DebouncedInput
        {...filterVariant?.props}
        className="w-36 border shadow rounded"
        onChange={(value) => setFilterValue(value)}
        placeholder={`Search...`}
        type="text"
        value={/** @type {string} */ (columnFilterValue ?? '')}
      />
      // See faceted column filters example for datalist search suggestions
    );
  }

  return null;
}
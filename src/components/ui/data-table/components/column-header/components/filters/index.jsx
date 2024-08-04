import { useEffect, useState } from "react";
import { Input } from "~/components/ui/input";
import { SelectDropdown } from "~/components/ui/select";
import { formatDate, isValidDate } from "./utils";
import { useDataTableContextStore } from "~/components/ui/data-table/context";

const defaultDebounceTimeout = 1000;
/**
 * @param {{
 *  value: string | number
 *  onChange: (value: string | number) => void
 *  debounce?: number
 * } & Omit<import('../../../../../input/types.ts').InputProps, 'onChange'>} props
 */
function DebouncedInput({
  value: initialValue,
  onChange,
  debounce = defaultDebounceTimeout,
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

  const dataTableStore = useDataTableContextStore();
  const columnFilterValue = props.column.getFilterValue();

  const columnId = props.column.id;

  console.log("___ columnId", columnId);

  const setFilterValue =
    /** @param {string} operator */


      (operator) =>
      /** @param {(old: any) => unknown} updater */
      (updater) => {
        /** @type {unknown} */
        const oldValues = dataTableStore
          .getState()
          .columnFilters.find(
            (filter) => filter.id === columnId && filter.operator === operator,
          )?.value;

        /** @type {unknown} */
        const newValues = updater(oldValues);
        console.log(newValues);

        if (
          typeof newValues === "undefined" ||
          (typeof newValues === "object" && !newValues)
        ) {
          return dataTableStore
            .getState()
            .setColumnFilters((old) =>
              old.filter(
                (filter) =>
                  !(filter.id === columnId && filter.operator === operator),
              ),
            );
        }
        console.log("object");
        dataTableStore.getState().setColumnFilters((old) => {
          console.log(old);
          let isFound = false;
          const updatedFilters = old.map((filter) => {
            console.log(filter);
            if (filter.id === columnId && filter.operator === operator) {
              isFound = true;
              return {
                id: columnId,
                value: newValues,
                operator,
              };
            }

            return filter;
          });

          if (!isFound) {
            updatedFilters.push({
              id: columnId,
              value: newValues,
              operator,
            });
          }

          return updatedFilters;
        });
      };

  // const value = useMemo(() => {}, []);
  // const onChange = useCallback(
  //   /** @param {any} value */
  //   (value) => {},
  //   [],
  // );

  if (!filterVariant?.type) {
    return null;
  }

  console.log("___ columnFilterValue", columnFilterValue);
  if (filterVariant.type === "select") {
    const operator = "exact";
    return (
      <SelectDropdown
        {...filterVariant.props}
        onValueChange={(value) => {
          setFilterValue(operator)(
            /** @param {string | undefined} old  */
            (old) => {
              // if (old === value) {
              // 	return;
              // }

              if (typeof value !== "string" || value === "") {
                return;
              }

              console.log(value);
              return value;
            },
          );
        }}
        value={columnFilterValue?.toString()}
        name="select"
      />
    );
  }

  if (filterVariant.type === "range-date") {
    const values = /** @type {[Date, Date]} */ (columnFilterValue);
    const startDate = values?.[0];
    const endDate = values?.[1];
    const operator = "between";

    return (
      <div className="flex space-x-2">
        <DebouncedInput
          type="date"
          value={startDate ? formatDate(startDate) : ""}
          onChange={(value) => {
            const newValue =
              isValidDate(value) && value !== "" && value !== "Invalid Date"
                ? new Date(value)
                : null;

            setFilterValue(operator)(
              /** @param {[Date|null|undefined, Date|null|undefined] | undefined} old  */
              (old) => {
                const item1 = newValue;
                const item2 = old?.[1] ?? null;

                if (
                  (!item1 && !item2) ||
                  (item1 && item2 && item1.getTime() > item2.getTime())
                ) {
                  return;
                }

                return [item1, item2];
              },
            );
          }}
          name="from"
        />
        <DebouncedInput
          type="date"
          value={endDate ? formatDate(endDate) : ""}
          onChange={(value) => {
            const newValue =
              isValidDate(value) && value !== "" && value !== "Invalid Date"
                ? new Date(value)
                : null;

            setFilterValue(operator)(
              /** @param {[Date|null|undefined, Date|null|undefined] | undefined} old  */
              (old) => {
                const item1 = old?.[0] ?? null;
                const item2 = newValue;

                if (
                  (!item1 && !item2) ||
                  (item1 && item2 && item1.getTime() < item2.getTime())
                ) {
                  return;
                }

                return [item1, item2];
              },
            );
          }}
          name="to"
        />
      </div>
    );
  }

  if (filterVariant.type === "range-number") {
    const operator = "between";
    return (
      <div className="flex space-x-2">
        {/* 
				include abbreviation: 
				exclude abbreviation: 
				

				 */}
        {/* <select */}
        {/* See faceted column filters example for from to values functionality */}
        <DebouncedInput
          type="number"
          value={/** @type {[number, number]} */ (columnFilterValue)?.[0] ?? ""}
          onChange={(value) =>
            setFilterValue(operator)(
              /** @param {[number|null|undefined, number|null|undefined] | undefined} old  */
              (old) => {
                const item1 = typeof value === "number" ? value : Number(value);
                const item2 = old?.[1] ?? null;

                if (
                  isNaN(item1) ||
                  (!item1 && !item2) ||
                  (item1 && item2 && item1 < item2)
                ) {
                  return;
                }

                return [item1, item2];
              },
            )
          }
          placeholder={`Min`}
          name="from"
          className="w-24 rounded border shadow"
        />
        <DebouncedInput
          type="number"
          value={/** @type {[number, number]} */ (columnFilterValue)?.[1] ?? ""}
          onChange={(value) =>
            setFilterValue(operator)(
              /** @param {[number, number]} old  */
              (old) => {
                const item1 = old?.[0] ?? null;
                const item2 = typeof value === "number" ? value : Number(value);

                if (
                  isNaN(item2) ||
                  (!item1 && !item2) ||
                  (item1 && item2 && item1 < item2)
                ) {
                  return;
                }

                return [item1, item2];
              },
            )
          }
          placeholder={`Max`}
          name="to"
          className="w-24 rounded border shadow"
        />
      </div>
    );
  }

  if (filterVariant.type === "text") {
    const operator = "contains";

    return (
      <DebouncedInput
        {...filterVariant?.props}
        className="w-36 rounded border shadow"
        onChange={(value) => {
          setFilterValue(operator)(
            /** @param {string | undefined} old  */
            (old) => {
              // if (old === value) {
              // 	return;
              // }

              if (typeof value !== "string" || value === "") {
                return;
              }

              console.log(value);
              return value;
            },
          );
        }}
        placeholder={`Search...`}
        type="text"
        name="search"
        value={/** @type {string} */ (columnFilterValue ?? "")}
      />
      // See faceted column filters example for datalist search suggestions
    );
  }

  return null;
}

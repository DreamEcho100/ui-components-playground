import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Settings2,
} from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { useStore } from "zustand";
import { Button } from "~/components/ui/button";
import { useDataTableContextStore } from "~/components/ui/data-table/context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

const defaultClearSortTimeout = 1500;
const defaultToggleSortTimeout = 1500;

/**
 * @template TData
 *
 * @param {{ column: import("@tanstack/react-table").Column<TData, unknown> }} props
 *
 * @note
 *
 * In this component, the caching mechanism is used to:
 *
 * - Prevent multiple sorting actions from being executed at the same time.
 * - Reset the internal sorting state to what it is in the store for a column after if `isMulti` is false.
 *
 * And all of this to prevent the UI from showing the wrong sorting state.
 *
 * @note
 *
 * In this component, the calculation of the `minWidth` is done to to:
 * - ensure that the column header does not shrink when resizing any column in the table.
 */
export default function Sorting(props) {
  const dataTableStore = useDataTableContextStore();
  const isSorted = props.column.getIsSorted();
  const [isInternallySorted, setIsInternallySorted] = useState(
    props.column.getIsSorted() ?? false,
  );

  const setSortingTimeoutCache = useCallback(
    /**
     * @param {string} key
     * @param {any} value
     * @param {boolean} [isMulti]
     */
    (key, value, isMulti) => {
      const setCache = dataTableStore.getState().setCache;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const currentValue = dataTableStore.getState().__cache.sorting[key];

      if (currentValue) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        clearTimeout(currentValue);
      }

      setCache(
        "sorting",
        /** @param {Record<string, any>} prev  */
        (prev) => {
          if (isMulti) {
            const cache = { ...prev };
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            cache[key] = value;

            return cache;
          }

          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          return { [key]: value };
        },
      );
    },
    [dataTableStore],
  );

  const isMulti = false;

  const _clearSorting = props.column.clearSorting;
  const clearSorting = useCallback(() => {
    setSortingTimeoutCache(`set-sorting-timeout-${props.column.id}`, null);

    setIsInternallySorted(false);

    setSortingTimeoutCache(
      `set-sorting-timeout-${props.column.id}`,
      setTimeout(() => {
        _clearSorting();
        setSortingTimeoutCache(`set-sorting-timeout-${props.column.id}`, null);
      }, defaultClearSortTimeout),
    );
  }, [_clearSorting, props.column.id, setSortingTimeoutCache]);

  const _toggleSorting = useStore(dataTableStore, (state) =>
    state.isSortingExternal
      ? /**
         * @param {boolean} isSorted
         * @param {boolean} [isMulti]
         */
        (isSorted, isMulti) =>
          state.setSorting((prev) => {
            const columnId = props.column.id;

            if (!isMulti) {
              const sorting = (prev ?? []).filter(
                (sorting) => sorting.id !== columnId,
              );

              if (isSorted) {
                sorting.push({ id: columnId, desc: true });
              }

              return sorting;
            }

            if (isSorted) {
              return [{ id: columnId, desc: true }];
            }

            return [];
          })
      : props.column.toggleSorting,
  );
  const toggleSorting = useCallback(
    /**
     * @param {boolean} [desc]
     * @param {boolean} [isMulti]
     */
    (desc, isMulti) => {
      setSortingTimeoutCache(`set-sorting-timeout-${props.column.id}`, null);

      const newIsSorted =
        (typeof desc === "boolean" ? (desc ? "desc" : "asc") : undefined) ??
        (isInternallySorted === "asc" ? "desc" : "asc");

      setIsInternallySorted(newIsSorted);

      setSortingTimeoutCache(
        `set-sorting-timeout-${props.column.id}`,
        setTimeout(() => {
          _toggleSorting(newIsSorted === "desc", isMulti);
          setSortingTimeoutCache(
            `set-sorting-timeout-${props.column.id}`,
            null,
          );
        }, defaultToggleSortTimeout),
      );
    },
    [
      _toggleSorting,
      isInternallySorted,
      props.column.id,
      setSortingTimeoutCache,
    ],
  );

  // const getIsSorted = props.column.getIsSorted;
  const toggleVisibility = props.column.toggleVisibility;

  useEffect(() => {
    if (
      isMulti ||
      dataTableStore.getState().__cache.sorting[
        `set-sorting-timeout-${props.column.id}`
      ]
    ) {
      return;
    }

    setIsInternallySorted(isSorted ?? false);
  }, [dataTableStore, isMulti, isSorted, props.column.id]);

  useEffect(() => {
    return () => {
      setSortingTimeoutCache(`set-sorting-timeout-${props.column.id}`, null);
      setSortingTimeoutCache(`set-sorting-timeout-${props.column.id}`, null);
      dataTableStore.getState().setCache("sorting", {});
    };
  }, [dataTableStore, props.column.id, setSortingTimeoutCache]);

  return (
    <>
      <Button
        variant="ghost"
        size={null}
        className="flex-shrink-0 p-1"
        onClick={() => {
          // const isSorted =
          // getIsSorted();

          if (!isInternallySorted) {
            toggleSorting(true, isMulti);
          } else if (isInternallySorted === "desc") {
            toggleSorting(false, isMulti);
          } else {
            clearSorting();
          }
        }}
      >
        {isInternallySorted === "asc" ? (
          <ArrowUp className="ms-1 size-4 flex-shrink-0" />
        ) : isInternallySorted === "desc" ? (
          <ArrowDown className="ms-1 size-4 flex-shrink-0" />
        ) : (
          <ArrowUpDown className="ms-1 size-4 flex-shrink-0" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={null}
            className="hidden flex-shrink-0 p-1"
          >
            <Settings2 className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <ArrowUpIcon className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <ArrowDownIcon className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => clearSorting()}>
            <ArrowUpDown className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Clear
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toggleVisibility(false)}>
            <EyeOff className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

import {
  createContext,
  useContext,
  useMemo,
  type PropsWithChildren,
} from "react";
import { useStore } from "zustand";
import { type DataTableStoreApi } from "../store/types";
import { type DataTableContextState } from "./types";
import { type DataTableStoreState } from "../store";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const DataTableContext = createContext<DataTableContextState<any>>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  notImplemented: () => {
    throw new Error(
      "To access the DataTableContext, you must use it within a DataTableProvider",
    );
  },
});

interface DataTableProviderProps<TData> {
  store: DataTableStoreApi<TData>;
}

export function DataTableProvider<TData>({
  store,
  children,
}: PropsWithChildren<DataTableProviderProps<TData>>): JSX.Element {
  return (
    <DataTableContext.Provider value={{ store }}>
      {children}
    </DataTableContext.Provider>
  );
}

export function useDataTableContextStore<TData>(): DataTableStoreApi<TData> {
  const context = useContext(DataTableContext);
  if (
    !context ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    context.notImplemented?.()
  ) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider",
    );
  }

  const store = useMemo(() => context.store, [context.store]);

  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return store;
}

export function useDataTableContextStoreValue<TData, U>(
  cb: (state: DataTableStoreState<TData>) => U,
): U {
  const context = useContext(DataTableContext);
  if (
    !context ||
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    context.notImplemented?.()
  ) {
    throw new Error(
      "useDataTableContext must be used within a DataTableProvider",
    );
  }

  return useStore(context.store, cb);
}

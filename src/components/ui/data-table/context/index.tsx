import React, {
	createContext,
	useContext,
	useMemo,
	PropsWithChildren
} from 'react';
import { useStore } from 'zustand';
import { DataTableStoreApi } from '../store/types';
import { DataTableContextState } from './types';
import { DataTableStoreState } from '../store';

const DataTableContext = createContext<DataTableContextState<any>>({
	// @ts-ignore
	notImplemented: () => {
		throw new Error(
			'To access the DataTableContext, you must use it within a DataTableProvider'
		);
	}
});

interface DataTableProviderProps<TData> {
	store: DataTableStoreApi<TData>;
}

export function DataTableProvider<TData>({
	store,
	children
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
		// @ts-ignore
		context.notImplemented?.()
	) {
		throw new Error(
			'useDataTableContext must be used within a DataTableProvider'
		);
	}

	const store = useMemo(() => context.store, [context.store]);

	return store;
}

export function useDataTableContextStoreValue<TData, U>(
	cb: (state: DataTableStoreState<TData>) => U
): U {
	const context = useContext(DataTableContext);
	if (
		!context ||
		// @ts-ignore
		context.notImplemented?.()
	) {
		throw new Error(
			'useDataTableContext must be used within a DataTableProvider'
		);
	}

	return useStore(context.store, cb);
}

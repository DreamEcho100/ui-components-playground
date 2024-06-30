import type { DataTableStoreApi } from '../store/types';

export interface DataTableContextState<TData> {
	store: DataTableStoreApi<TData>;
}

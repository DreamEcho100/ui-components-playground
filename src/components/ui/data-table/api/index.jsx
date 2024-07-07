/** @import { ColumnDef, DisplayColumnDef, GroupColumnDef, AccessorColumnDef } from '@tanstack/react-table' */
/** @import { AppRouterPathToVars, InferAppRouterGetManyOrManyBasic } from '~/trpc/types/index.js' */
/** @import { MaybeDecoratedInfiniteQuery } from 'node_modules/@trpc/react-query/dist/createTRPCReact.js' */
/** @import { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import' */

// import { keepPreviousData } from "@tanstack/react-query";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/unstable-core-do-not-import";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { getItemByPath } from "./utils/index.js";
import { useDataTableContextStore } from "../context";

// const trpcDefaultLimit = 10;
/** @type {any[]} */
const defaultEmptyData = [];
/**
 * @template {InferAppRouterGetManyOrManyBasic} TRouterPath
 * @template {AppRouterPathToVars[TRouterPath]['$output']['items'][number]} TData
 * @template TValue
 *
 * @typedef {{
 *  routerPath: TRouterPath,
 * 	columns:  ColumnDef<TData, TValue>[]
 * }} ApiDataTableStoreProps
 */
// * // ColumnDef<TData, TValue>[]

/**
 * @template {InferAppRouterGetManyOrManyBasic} TRouterPath
 * @template {AppRouterPathToVars[TRouterPath]['$output']['items'][number]} TData
 * @template TValue
 *
 * @param {ApiDataTableStoreProps<TRouterPath, TData, TValue>} props
 */
function useApiDataTableStore(props) {
  const tableStore = useDataTableContextStore();
  const sorting = useStore(tableStore, (state) => state.sorting);
  const filters = useStore(tableStore, (state) => state.columnFilters);
  const limit = useStore(tableStore, (state) => state.pageLimit);

  const infiniteQueryObj = useMemo(
    () =>
      /**
       * @type {MaybeDecoratedInfiniteQuery<{
       * 	input: { cursor?: unknown };
       * 	output: {
       * 		items: unknown[];
       * 		nextCursor: unknown;
       * 		prevCursor: unknown;
       * 	};
       * 	transformer:
       * 	boolean;
       * 	errorShape: DefaultErrorShape;
       * }>}
       */ (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getItemByPath(api, props.routerPath)
      ),
    [props.routerPath],
  );

  const getManyInfiniteQuery = infiniteQueryObj.useInfiniteQuery(
    { limit, sorting, filters },
    {
      // initialData: { pageParams: [], pages: [] },
      // placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      getPreviousPageParam: (lastPage) => lastPage?.prevCursor,
      retry: (failureCount, error) => {
        // Retry only for specific error types
        if (
          error.shape?.code &&
          (error.shape.code === TRPC_ERROR_CODES_BY_KEY.INTERNAL_SERVER_ERROR ||
            error.shape.code === TRPC_ERROR_CODES_BY_KEY.TIMEOUT ||
            error.shape.code === TRPC_ERROR_CODES_BY_KEY.TOO_MANY_REQUESTS)
        ) {
          return failureCount < 3;
        }

        return false;
      },
      retryDelay: (attemptIndex) => {
        // Custom logic for delay
        return Math.min(1000 * 2 ** attemptIndex, 30000);
      },
    },
  );

  const isPending = getManyInfiniteQuery.isFetching;
  const data =
    getManyInfiniteQuery.data?.pages.flatMap((page) => page.items) ??
    defaultEmptyData;

  const isLoading =
    getManyInfiniteQuery.isFetching && !getManyInfiniteQuery.isRefetching;

  useEffect(() => {
    if (!getManyInfiniteQuery.isError) {
      return;
    }

    toast.error("Failed to load data\n" + getManyInfiniteQuery.error.message);
  }, [getManyInfiniteQuery.isError, getManyInfiniteQuery.error]);

  return {
    isPending,
    data,
    isLoading,
    fetchNextPage: getManyInfiniteQuery.fetchNextPage,
    isFetchingNextPage: getManyInfiniteQuery.isFetchingNextPage,
    hasNextPage: getManyInfiniteQuery.hasNextPage,
  };
}

/**
 * @template {InferAppRouterGetManyOrManyBasic} TRouterPath
 * @template {AppRouterPathToVars[TRouterPath]['$output']['items'][number]} TData
 * @template TValue
 *
 * @param {ApiDataTableStoreProps<TRouterPath, TData, TValue>} props
 */
export default function ApiDataTable(props) {
  const {
    isPending,
    data,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useApiDataTableStore(props);

  return (
    <DataTable
      columns={props.columns}
      data={data}
      rowIdKey="id"
      isPending={isPending}
      infiniteLoading={{
        loadMore: (options) => fetchNextPage().then(options.onSuccess),
        isPending: isFetchingNextPage,
        isDisabled: !hasNextPage || isLoading || isFetchingNextPage,
        hasMore: hasNextPage,
      }}
    />
  );
}

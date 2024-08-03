/**
 * @import { ColumnDef } from '@tanstack/react-table'
 * @import { AppRouterPathToVars, InferAppRouterGetManyOrManyBasic, InferAppRouterCreateMany, InferAppRouterDeleteMany } from '~/trpc/types/index.js'
 * @import { DecoratedMutation, DecoratedQuery } from 'node_modules/@trpc/react-query/dist/createTRPCReact.js'
 * @import { DecoratedProcedureUtilsRecord } from '@trpc/react-query/shared'
 * @import { DefaultErrorShape } from '@trpc/server/unstable-core-do-not-import'
 */

// import { keepPreviousData } from "@tanstack/react-query";
import { TRPC_ERROR_CODES_BY_KEY } from "@trpc/server/unstable-core-do-not-import";
import { useEffect, useMemo } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { DataTable } from "~/components/ui/data-table";
import { api } from "~/trpc/react";
import { getItemByPath } from "./utils/index.js";
import { useDataTableContextStore } from "../context";
import ExcelToJsonButton from "../components/excel-to-json-button/index.jsx";
import { Button } from "../../button/index.jsx";

// const trpcDefaultLimit = 10;
/** @type {any[]} */
const defaultEmptyData = [];
/**
 * @template {InferAppRouterGetManyOrManyBasic} TRouterPath
 * @template {AppRouterPathToVars[TRouterPath]['$output']['items'][number]} TData
 * @template TValue
 *
 * @typedef {{
 *  routerPath: TRouterPath;
 * 	columns:  ColumnDef<TData, TValue>[]
 *  createMany: {
 *   routerPath: InferAppRouterCreateMany;
 *   onSuccess?: 'revalidate'; // | 'refetch';
 * 	}
 *  deleteMany: {
 *   routerPath: InferAppRouterDeleteMany;
 *   onSuccess?: 'revalidate'; // | 'refetch';
 *   getInput?: (flatRows: { original: NoInfer<TData> }[]) => unknown[] | Record<string, unknown> & { ids: unknown[] };
 *  }
 * }} ApiDataTableStoreProps
 */

/**
 * @typedef {{
 * 	input: { cursor?: unknown };
 * 	output: {
 * 		items: unknown[];
 * 		nextCursor: unknown;
 * 		prevCursor: unknown;
 * 	};
 * 	transformer: boolean;
 * 	errorShape: DefaultErrorShape;
 *  ctx: any;
 *  meta: any;
 * }} InfiniteQueryObjTDef
 */

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
       * @type {DecoratedQuery<InfiniteQueryObjTDef>}
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
      topActionsButtonsStart={
        <>
          {props.deleteMany && (
            <DeleteManySelectedButton
              routerPath={props.deleteMany.routerPath}
              onSuccess={props.deleteMany.onSuccess}
              getInput={props.deleteMany?.getInput}
              getManyRouterPath={props.routerPath}
              columns={props.columns}
              disabled={isPending}
            />
          )}
          {props.createMany && (
            <ExcelToJsonCreateManyButton
              routerPath={props.createMany.routerPath}
              onSuccess={props.createMany.onSuccess}
              getManyRouterPath={props.routerPath}
              columns={props.columns}
              disabled={isPending}
            />
          )}
        </>
      }
    />
  );
}

/**
 * @template TData
 * @template TValue
 *
 * @param {{
 * 	routerPath: string;
 *  getManyRouterPath: string;
 * 	columns: ColumnDef<TData, TValue>[];
 * 	disabled: boolean;
 *  onSuccess?: 'revalidate' | 'refetch';
 * }} props
 */
function ExcelToJsonCreateManyButton(props) {
  const createMayMutationObj = useMemo(
    () =>
      /**
       * @type {DecoratedMutation<{
       * 	input: { items: any[] };
       * 	output: any;
       * 	transformer: boolean;
       * 	errorShape: DefaultErrorShape;
       * }>}
       */ (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getItemByPath(api, props.routerPath)
      ),
    [props.routerPath],
  );

  const createMayMutation = createMayMutationObj.useMutation();
  const utils = api.useUtils();

  api.posts.create.useMutation;

  return (
    <ExcelToJsonButton
      columns={props.columns}
      disabled={props.disabled}
      onSuccess={async (data) => {
        await createMayMutation.mutateAsync(
          { items: data },
          {
            onError: (error) => {
              toast.error("Failed to create data\n" + error.message);
            },
          },
        );

        if (typeof props.onSuccess === "string") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const recordObj =
            /** @type {DecoratedProcedureUtilsRecord<InfiniteQueryObjTDef, Record<string, import("@trpc/server").AnyTRPCQueryProcedure>>} */ (
              getItemByPath(utils, props.getManyRouterPath)
            );

          switch (props.onSuccess) {
            case "revalidate":
              await recordObj.invalidate();
              break;
            // case "refetch":
            //   await recordObj.refetch()
            //   break;
          }
        }
      }}
      onError={(error) => {
        toast.error("Failed to create data\n" + error.message);
      }}
    />
  );
}

/**
 * @template TData
 * @template TValue
 *
 * @param {{
 * 	routerPath: string;
 *  getManyRouterPath: string;
 *  getInput?: (flatRows: { original: NoInfer<TData> }[]) => unknown[] | Record<string, unknown> & { ids: unknown[] };
 * 	columns: ColumnDef<TData, TValue>[];
 * 	disabled: boolean;
 *  onSuccess?: 'revalidate' | 'refetch';
 * }} props
 */
function DeleteManySelectedButton(props) {
  const tableStore = useDataTableContextStore();
  const hasSelection = useStore(
    tableStore,
    (state) => Object.keys(state.rowSelection).length > 0,
  );

  const deleteManyMutationObj = useMemo(
    () =>
      /**
       * @type {DecoratedMutation<{
       * 	input: any;
       * 	output: any;
       * 	transformer: boolean;
       * 	errorShape: DefaultErrorShape;
       * }>}
       */ (
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        getItemByPath(api, props.routerPath)
      ),
    [props.routerPath],
  );
  const deleteManyMutation = deleteManyMutationObj.useMutation();
  const utils = api.useUtils();

  return (
    <Button
      disabled={!hasSelection || props.disabled}
      onClick={async () => {
        if (!hasSelection) {
          return;
        }

        const flatRows = tableStore
          .getState()
          .getTable()
          .getSelectedRowModel().flatRows;

        const input = /** @type {{ ids: unknown[] }} */ (
          props.getInput
            ? props.getInput(flatRows)
            : // eslint-disable-next-line @typescript-eslint/no-unsafe-return, @typescript-eslint/no-unsafe-member-access
              { ids: flatRows.map((row) => row.original.id) }
        );

        await deleteManyMutation.mutateAsync(input, {
          onError: (error) => {
            toast.error("Failed to delete data\n" + error.message);
          },
        });

        if (typeof props.onSuccess === "string") {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          const recordObj =
            /** @type {DecoratedProcedureUtilsRecord<InfiniteQueryObjTDef, Record<string, import("@trpc/server").AnyTRPCQueryProcedure>>} */ (
              getItemByPath(utils, props.getManyRouterPath)
            );

          switch (props.onSuccess) {
            case "revalidate":
              await recordObj.invalidate();
              break;
            // case "refetch":
            //   await recordObj.refetch()
            //   break;
          }
        }
      }}
    >
      Delete
    </Button>
  );
}

"use client";

import { DataTableProvider } from "~/components/ui/data-table/context";
import ShowcaseArticle from "../../article";
import { paymentColumns } from "./config"; // import { locallySortedAndFilteredDataTableStore as locallySortedAndFilteredDataTableStore } from '~/components/ui/data-table/store';
import { DataTable } from "~/components/ui/data-table";
import { useDataTableStore } from "~/components/ui/data-table/store/utils/hooks/data-table-store";

import { keepPreviousData, useInfiniteQuery } from "@tanstack/react-query";
import fetchPaymentsDataPageAction from "../../../../../server/actions";
import { useEffect } from "react";
import { toast } from "sonner";
import { useStore } from "zustand";
import { paymentsData } from "~/config/utils";
import { api } from "~/trpc/react";

function LocallySortedAndFilteredDataTableStore() {
  const [dataTableStore, columns] = useDataTableStore(paymentColumns);

  return (
    <DataTableProvider store={dataTableStore}>
      <DataTable columns={paymentColumns} data={paymentsData} rowIdKey="id" />
    </DataTableProvider>
  );
}

const rqDefaultLimit = 10;
const rqDefaultCursor = 0;
function RqDataTableStore() {
  const [dataTableStore, columns] = useDataTableStore(paymentColumns, {
    initialValues: {
      isFilteringExternal: true,
      isSortingExternal: true,
      sorting: [{ id: "createdAt", desc: true }],
    },
  });

  const sorting = useStore(dataTableStore, (state) => state.sorting);
  const filters = useStore(dataTableStore, (state) => state.columnFilters);

  const getManyInfiniteQuery = useInfiniteQuery({
    queryKey: [
      "payments-data",
      {
        limit: rqDefaultLimit,
        cursor: rqDefaultCursor,
        sorting,
        filters,
      },
    ],
    queryFn: ({ pageParam }) => fetchPaymentsDataPageAction(pageParam),
    initialData: {
      pageParams: [],
      pages: [],
    },
    initialPageParam:
      /** @type {import('../../../../../server/actions/types').GetManyPaymentActionInput} */ ({
        limit: rqDefaultLimit,
        cursor: rqDefaultCursor,
        sorting,
        filters,
      }),
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      if (!lastPage?.nextCursor) {
        return undefined;
      }

      const lastOffset = lastPage?.nextCursor ?? rqDefaultCursor;

      const newCursor =
        /** @type {import('../../../../../server/actions/types').GetManyPaymentActionInput} */ ({
          cursor: lastOffset,
          limit: rqDefaultLimit,
          filters,
          sorting,
        });

      return newCursor;
    },
    // refetchInterval
    // retry
    retry: (failureCount, error) => {
      // Retry only for specific error types
      if ("status" in error && error.status === 404) {
        return false;
      }

      return failureCount < 3;
    },
    retryDelay: (attemptIndex, error) => {
      // Custom logic for delay
      return Math.min(1000 * 2 ** attemptIndex, 30000);
    },
  });

  const isPending = getManyInfiniteQuery.isFetching;
  const data = getManyInfiniteQuery.data?.pages.flatMap((page) => page.items);

  const isLoading =
    getManyInfiniteQuery.isFetching && !getManyInfiniteQuery.isRefetching;

  useEffect(() => {
    if (!getManyInfiniteQuery.isError) {
      return;
    }

    toast.error("Failed to load data\n" + getManyInfiniteQuery.error.message);
  }, [getManyInfiniteQuery.isError, getManyInfiniteQuery.error]);

  return (
    <DataTableProvider store={dataTableStore}>
      <DataTable
        columns={columns}
        data={data}
        rowIdKey="id"
        isPending={isPending}
        infiniteLoading={{
          loadMore: (options) =>
            getManyInfiniteQuery.fetchNextPage().then(options.onSuccess),
          isPending: getManyInfiniteQuery.isFetchingNextPage,
          isDisabled:
            !getManyInfiniteQuery.hasNextPage ||
            isLoading ||
            getManyInfiniteQuery.isFetchingNextPage,
          hasMore: getManyInfiniteQuery.hasNextPage,
        }}
      />
    </DataTableProvider>
  );
}

const trpcDefaultLimit = 10;
const trpcDefaultCursor = 0;
/** @type {any[]} */
const defaultEmptyData = [];
function TrpcDataTableStore() {
  const [dataTableStore, columns] = useDataTableStore(paymentColumns, {
    initialValues: {
      isFilteringExternal: true,
      isSortingExternal: true,
      sorting: [{ id: "createdAt", desc: true }],
    },
  });

  const sorting = useStore(dataTableStore, (state) => state.sorting);
  const filters = useStore(dataTableStore, (state) => state.columnFilters);

  const getManyInfiniteQuery = api.payments.getMany.useInfiniteQuery(
    /** @type {import('../../../../../server/actions/types').GetManyPaymentActionInput} */ ({
      limit: trpcDefaultLimit,
      cursor: trpcDefaultCursor,
      sorting,
      filters,
    }),
    {
      initialData: {
        pageParams: [],
        pages: [],
      },
      placeholderData: keepPreviousData,
      getNextPageParam: (lastPage) => lastPage?.nextCursor,
      getPreviousPageParam: (lastPage) => lastPage?.prevCursor,
      retry: (failureCount, error) => {
        // Retry only for specific error types
        if ("status" in error && error.status === 404) {
          return false;
        }

        return failureCount < 3;
      },
      retryDelay: (attemptIndex, error) => {
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

  return (
    <DataTableProvider store={dataTableStore}>
      <DataTable
        columns={columns}
        data={data}
        rowIdKey="id"
        isPending={isPending}
        infiniteLoading={{
          loadMore: (options) =>
            getManyInfiniteQuery.fetchNextPage().then(options.onSuccess),
          isPending: getManyInfiniteQuery.isFetchingNextPage,
          isDisabled:
            !getManyInfiniteQuery.hasNextPage ||
            isLoading ||
            getManyInfiniteQuery.isFetchingNextPage,
          hasMore: getManyInfiniteQuery.hasNextPage,
        }}
      />
    </DataTableProvider>
  );
}

export default function DataTablesShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: "Data Tables",
        description: [
          "Data tables are used to display data in a tabular format.",
          "They can be sorted and filtered to help users find the information they need, either by using the built-in sorting and filtering capabilities or by using custom sorting and filtering logic (e.g., API calls for setting sorting and filtering of the table).",
        ],
      }}
      sections={[
        // {
        //   title: 'Locally Sorted and Filtered Data Table',
        //   description:
        //     'Locally Sorted and Filtered Data Table is a table component that displays data in a tabular format with sorting and filtering capabilities.',
        //   content: <LocallySortedAndFilteredDataTableStore />,
        // },
        // {
        //   title: "Externally Sorted and Filtered Data Table",
        //   description:
        //     "Externally Sorted and Filtered Data Table is a table component that displays data in a tabular format with sorting and filtering capabilities.",
        //   content: <RqDataTableStore />,
        // },
        {
          // TrpcDataTableStore
          title: "Externally Sorted and Filtered Data Table (trpc)",
          description:
            "Externally Sorted and Filtered Data Table is a table component that displays data in a tabular format with sorting and filtering capabilities.",
          content: <TrpcDataTableStore />,
        },
      ]}
    />
  );
}

"use client";

import { DataTableProvider } from "~/components/ui/data-table/context";
import ShowcaseArticle from "../../article";
import { basicPostColumns, routerPath } from "./config";
import { useDataTableStore } from "~/components/ui/data-table/store/utils/hooks/data-table-store";

import ApiDataTable from "~/components/ui/data-table/api";

// function LocallySortedAndFilteredDataTableStore() {
//   const dataTableStore = useDataTableStore(paymentColumns);

//   return (
//     <DataTableProvider store={dataTableStore}>
//       <DataTable columns={paymentColumns} data={paymentsData} rowIdKey="id" />
//     </DataTableProvider>
//   );
// }

// const rqDefaultLimit = 10;
// function RqDataTableStore() {
//   const [dataTableStore, columns] = useDataTableStore(paymentColumns, {
//     initialValues: {
//       isFilteringExternal: true,
//       isSortingExternal: true,
//       sorting: [{ id: "createdAt", desc: true }],
//     },
//   });

//   const sorting = useStore(dataTableStore, (state) => state.sorting[0]);
//   const filters = useStore(dataTableStore, (state) => state.columnFilters);

//   const getManyInfiniteQuery = useInfiniteQuery({
//     queryKey: [
//       "payments-data",
//       {
//         limit: rqDefaultLimit,
//         sorting,
//         filters,
//       },
//     ],
//     queryFn: ({ pageParam }) => fetchPaymentsDataPageAction(pageParam),
//     initialData: {
//       pageParams: [],
//       pages: [],
//     },
//     initialPageParam: /** @type {GetManyPaymentActionInput} */ ({
//       limit: rqDefaultLimit,
//       sortBy: sorting?.id,
//       sortDir: sorting?.desc ? "desc" : "asc",
//       direction: "forward",
//       filters,
//     }),
//     placeholderData: keepPreviousData,
//     getNextPageParam: (lastPage) => {
//       if (!lastPage?.nextCursor) {
//         return undefined;
//       }

//       const lastOffset = lastPage?.nextCursor;

//       const newCursor = /** @type {GetManyPaymentActionInput} */ ({
//         limit: rqDefaultLimit,
//         filters,
//         sortBy: sorting?.id,
//         sortDir: sorting?.desc ? "desc" : "asc",
//         cursor: lastOffset,
//         direction: "forward",
//       });

//       return newCursor;
//     },
//     // refetchInterval
//     // retry
//     retry: (failureCount, error) => {
//       // Retry only for specific error types
//       if ("status" in error && error.status === 404) {
//         return false;
//       }

//       return failureCount < 3;
//     },
//     retryDelay: (attemptIndex, error) => {
//       // Custom logic for delay
//       return Math.min(1000 * 2 ** attemptIndex, 30000);
//     },
//   });

//   const isPending = getManyInfiniteQuery.isFetching;
//   const data = getManyInfiniteQuery.data?.pages.flatMap((page) => page.items);

//   const isLoading =
//     getManyInfiniteQuery.isFetching && !getManyInfiniteQuery.isRefetching;

//   useEffect(() => {
//     if (!getManyInfiniteQuery.isError) {
//       return;
//     }

//     toast.error("Failed to load data\n" + getManyInfiniteQuery.error.message);
//   }, [getManyInfiniteQuery.isError, getManyInfiniteQuery.error]);

//   return (
//     <DataTableProvider store={dataTableStore}>
//       <DataTable
//         columns={columns}
//         data={data}
//         rowIdKey="id"
//         isPending={isPending}
//         infiniteLoading={{
//           loadMore: (options) =>
//             getManyInfiniteQuery.fetchNextPage().then(options.onSuccess),
//           isPending: getManyInfiniteQuery.isFetchingNextPage,
//           isDisabled:
//             !getManyInfiniteQuery.hasNextPage ||
//             isLoading ||
//             getManyInfiniteQuery.isFetchingNextPage,
//           hasMore: getManyInfiniteQuery.hasNextPage,
//         }}
//       />
//     </DataTableProvider>
//   );
// }

function TrpcDataTableStore() {
  const dataTableStore = useDataTableStore(basicPostColumns, {
    initialValues: {
      isFilteringExternal: true,
      isSortingExternal: true,
      sorting: [{ id: "createdAt", desc: true }],
      canExportTo: { xlsx: true },
    },
  });

  return (
    <DataTableProvider store={dataTableStore}>
      <ApiDataTable columns={basicPostColumns} routerPath={routerPath} />
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

'use client';

import { DataTableProvider } from '~/components/ui/data-table/context';
import ShowcaseArticle from '../../article';
import { paymentColumns } from './config'; // import { locallySortedAndFilteredDataTableStore as locallySortedAndFilteredDataTableStore } from '~/components/ui/data-table/store';
import { DataTable } from '~/components/ui/data-table';
import { useDataTableStore } from '~/components/ui/data-table/store/utils/hooks/data-table-store';
import { paymentsData } from './utils';
import { keepPreviousData, useInfiniteQuery } from '@tanstack/react-query';
import fetchPaymentsDataPageAction from './actions';
import useDataTableQueryInputs from '~/components/ui/data-table/store/utils/hooks/data-table-query-inputs';

function LocallySortedAndFilteredDataTableStore() {
  const [dataTableStore, columns] = useDataTableStore(paymentColumns);

  return (
    <DataTableProvider store={dataTableStore}>
      <DataTable columns={paymentColumns} data={paymentsData} rowIdKey="id" />
    </DataTableProvider>
  );
}

const defaultLimit = 50;
const defaultOffset = 0;
function ExternallySortedAndFilteredDataTableStore() {
  const [dataTableStore, columns] = useDataTableStore(paymentColumns, {
    initialValues: {
      isFilteringExternal: true,
      isSortingExternal: true,
    },
  });

  const { querySorting, queryFilters } = useDataTableQueryInputs({
    columns,
    dataTableStore,
  });

  const getManyInfiniteQuery = useInfiniteQuery({
    queryKey: [
      'payments-data',
      {
        limit: defaultLimit,
        offset: defaultOffset,
        sorting: querySorting,
        filters: queryFilters,
      },
    ],
    queryFn: ({ pageParam }) => fetchPaymentsDataPageAction(pageParam),
    initialData: {
      pageParams: [],
      pages: [],
    },
    initialPageParam:
      /** @type {import('./actions/types').GetManyPaymentActionInput} */ ({
        limit: defaultLimit,
        offset: defaultOffset,
        sorting: querySorting,
        filters: queryFilters,
      }),
    placeholderData: keepPreviousData,
    getNextPageParam: (lastPage) => {
      const lastOffset = lastPage?.nextCursor ?? defaultOffset;

      /** @type {import('./actions/types').GetManyPaymentActionInput} */
      const newCursor = {
        offset: lastOffset,
        limit: defaultLimit,
        filters: queryFilters,
        sorting: querySorting,
      };

      return newCursor;
    },
  });

  const isPending = getManyInfiniteQuery.isFetching;
  const data = getManyInfiniteQuery.data?.pages.flatMap((page) => page.items);

  return (
    <DataTableProvider store={dataTableStore}>
      <DataTable
        columns={columns}
        data={data}
        rowIdKey="id"
        isPending={isPending}
      />
    </DataTableProvider>
  );
}

export default function DataTablesShowCase() {
  return (
    <ShowcaseArticle
      header={{
        title: 'Data Tables',
        description: [
          'Data tables are used to display data in a tabular format.',
          'They can be sorted and filtered to help users find the information they need, either by using the built-in sorting and filtering capabilities or by using custom sorting and filtering logic (e.g., API calls for setting sorting and filtering of the table).',
        ],
      }}
      sections={[
        // {
        //   title: 'Locally Sorted and Filtered Data Table',
        //   description:
        //     'Locally Sorted and Filtered Data Table is a table component that displays data in a tabular format with sorting and filtering capabilities.',
        //   content: <LocallySortedAndFilteredDataTableStore />,
        // },
        {
          title: 'Externally Sorted and Filtered Data Table',
          description:
            'Externally Sorted and Filtered Data Table is a table component that displays data in a tabular format with sorting and filtering capabilities.',
          content: <ExternallySortedAndFilteredDataTableStore />,
        },
      ]}
    />
  );
}

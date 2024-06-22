'use client';

import { DataTableProvider } from '~/components/ui/data-table/context';
import ShowcaseArticle from '../../article';
import { paymentColumns } from './config'; // import { locallySortedAndFilteredDataTableStore as locallySortedAndFilteredDataTableStore } from '~/components/ui/data-table/store';
import { DataTable } from '~/components/ui/data-table';
import { useCreateDataTableStore } from '~/components/ui/data-table/store';
import { useStore } from 'zustand';
import { paymentsData } from './utils';
import { useInfiniteQuery } from '@tanstack/react-query';
import fetchPaymentsDataPageAction from './actions';

function LocallySortedAndFilteredDataTableStore() {
  const [columns, locallySortedAndFilteredDataTableStore] =
    useCreateDataTableStore(paymentColumns);

  return (
    <DataTableProvider store={locallySortedAndFilteredDataTableStore}>
      <DataTable columns={paymentColumns} data={paymentsData} rowIdKey="id" />
    </DataTableProvider>
  );
}

function ExternallySortedAndFilteredDataTableStore() {
  const [columns, externallySortedAndFilteredDataTableStore] =
    useCreateDataTableStore(paymentColumns, {
      initialValues: {
        isFilteringExternal: true,
        isSortingExternal: true,
      },
    });
  const sorting = useStore(
    externallySortedAndFilteredDataTableStore,
    (state) => state.sorting,
  );
  const filters = useStore(
    externallySortedAndFilteredDataTableStore,
    (state) => state.columnFilters,
  );
  const getManyInfiniteQuery = useInfiniteQuery({
    queryKey: ['payments-data', { sorting, filters }],
    queryFn: ({ pageParam }) => fetchPaymentsDataPageAction(pageParam),
    initialData: {
      pageParams: [],
      pages: [],
    },
    initialPageParam:
      /** @type {import('./actions/types').GetManyPaymentActionInput} */ ({
        limit: 10,
      }),
    getNextPageParam: (lastPage) => {
      const defaultLimit = 10;
      const lastOffset = lastPage?.nextCursor ?? 0;

      /** @type {import('./actions/types').GetManyPaymentActionInput} */
      const newCursor = {
        offset: lastOffset,
        limit: defaultLimit,
      };

      return newCursor;
    },
  });

  const isPending = getManyInfiniteQuery.isFetching;

  const data = getManyInfiniteQuery.data?.pages.flatMap((page) => page.items);

  return (
    <DataTableProvider store={externallySortedAndFilteredDataTableStore}>
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

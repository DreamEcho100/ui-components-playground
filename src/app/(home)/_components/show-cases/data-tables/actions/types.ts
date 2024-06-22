import type {
  ColumnFiltersState,
  SortingState,
} from '~/components/ui/data-table/store/types';
import type { Payment } from '../types';

export interface GetManyPaymentActionInput {
  sorting?: SortingState<Payment>;
  columnFilters?: ColumnFiltersState<Payment>;
  limit?: number;
  offset?: number;
}

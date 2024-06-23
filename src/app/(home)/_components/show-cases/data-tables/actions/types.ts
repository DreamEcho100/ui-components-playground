import type {
  ColumnFiltersState,
  SortingState,
} from '~/components/ui/data-table/store/types';
import type { Payment } from '../types';

export interface GetManyPaymentActionInput {
  sorting?: {
    createdAt?: 'asc' | 'desc';
    status?: 'asc' | 'desc';
    amount?: 'asc' | 'desc';
    email?: 'asc' | 'desc';
  };
  filters?: {
    status?: Payment['status'];
    email?: string;
    createdAt?: { min: string; max: string };
    amount?: { min: number; max: number };
  };
  limit?: number;
  offset?: number;
}

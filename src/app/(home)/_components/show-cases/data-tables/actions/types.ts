import type { Payment } from '../types';

export interface GetManyPaymentActionInput {
  sorting?: {
    id: 'createdAt' | 'status' | 'amount' | 'email';
    desc: boolean;
  }[];
  filters?: (
    | { id: 'status'; value: Payment['status'] }
    | { id: 'email'; value: string }
    | { id: 'createdAt'; value: { from?: string; to?: string } }
    | { id: 'amount'; value: { from?: number; to?: number } }
  )[];

  limit?: number;
  offset?: number;
}

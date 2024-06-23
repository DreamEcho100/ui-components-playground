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
    createdAt?: { from: string; to: string };
    amount?: { from: number; to: number };
  };
  limit?: number;
  offset?: number;
}

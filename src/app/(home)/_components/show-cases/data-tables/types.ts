import { ColumnDef } from '@tanstack/react-table';

export interface Payment {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
  details: {
    lol: string;
    bruh: string;
    xd: string;
  };
  createdAt: string;
}

export type PaymentColumn = ColumnDef<Payment>;

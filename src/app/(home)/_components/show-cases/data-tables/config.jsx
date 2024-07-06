"use client";
/** @import { PaymentColumn } from './types.ts' */

import { MoreHorizontal } from "lucide-react";

import { Button } from "~/components/ui/button";

import { defaultDataTableSelectColumn } from "~/components/ui/data-table/components/row-selection";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

/** @type {PaymentColumn[]} */
export const paymentColumns = [
  defaultDataTableSelectColumn,
  {
    accessorKey: "status",
    meta: {
      header: "Status",
      filterVariant: {
        type: "select",
        props: {
          placeholder: "All",
          options: [
            // { label: 'All', value: '' },
            { label: "Pending", value: "pending" },
            { label: "Processing", value: "processing" },
            { label: "Success", value: "success" },
            { label: "Failed", value: "failed" },
          ],
        },
      },
    },
  },
  {
    accessorKey: "email",
    meta: {
      header: "Email",
      filterVariant: { type: "text" },
    },
  },
  {
    accessorKey: "amount",
    meta: {
      header: "amount",
      filterVariant: {
        type: "range-number",
      },
    },
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    accessorKey: "createdAt",
    meta: {
      header: "created at",
      filterVariant: {
        type: "range-date",
      },
    },
    filterFn: "dateBetweenFilterFn",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const formatted = new Intl.DateTimeFormat("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      }).format(date);

      return <div className="font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const payment = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.id)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
];

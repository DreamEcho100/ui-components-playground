"use client";
/** @import { BasicPostColumn } from './types.ts' */

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

/**
 * @satisfies {import("~/trpc/types").InferAppRouterGetManyOrManyBasic}
 * @constant
 */
export const routerPath = "posts.getMany";
/**
 * @type {BasicPostColumn[]}
 * @satisfies {BasicPostColumn[]}
 */
export const basicPostColumns = [
  defaultDataTableSelectColumn,
  {
    accessorKey: "name",
    meta: {
      header: "Name",
      filterVariant: { type: "text" },
    },
  },
  {
    accessorKey: "status",
    meta: {
      header: "Status",
      filterVariant: {
        type: "select",
        props: {
          placeholder: "All",
          options: [
            { label: "All", value: "" },
            { label: "Draft", value: "DRAFT" },
            { label: "Published", value: "PUBLISHED" },
            { label: "Archived", value: "ARCHIVED" },
          ],
        },
      },
    },
  },
  {
    accessorKey: "viewCount",
    meta: {
      header: "View Count",
      filterVariant: {
        type: "range-number",
      },
    },
  },
  {
    accessorKey: "createdAt",
    meta: {
      header: "Created At",
      filterVariant: {
        type: "range-date",
      },
    },
    filterFn: "dateBetweenFilterFn",
  },
  {
    accessorKey: "updatedAt",
    meta: {
      header: "Updated At",
      filterVariant: {
        type: "range-date",
      },
    },
    filterFn: "dateBetweenFilterFn",
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

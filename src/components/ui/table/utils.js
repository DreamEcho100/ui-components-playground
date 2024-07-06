import { cva } from "class-variance-authority";

export const tableCellVariants = cva(
  "align-middle [&:has([role=checkbox])]:pr-0",
  {
    variants: {
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
export const tableHeadVariants = cva(
  "align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 font-bold",
  {
    variants: {
      size: {
        sm: "p-2",
        md: "p-4",
        lg: "p-6",
      },
    },
    defaultVariants: {
      size: "md",
    },
  },
);
export const tableVariants = cva(
  [
    "w-full caption-bottom text-sm group",
    // 'data-[is-table-header-sticky="true"]:border-separate',
  ],
  {
    variants: {},
    defaultVariants: {},
  },
);

/** @import { ForwardedRef } from 'react' */
/** @import { TableProps, TableHeaderProps, TableBodyProps, TableFooterProps, TableRowProps, TableHeadProps, TableCellProps, TableCaptionProps } from './types.ts' */

import { forwardRef } from "react";
import { cn } from "~/lib/utils";
import { tableVariants, tableHeadVariants, tableCellVariants } from "./utils";

const Table = forwardRef(
  /**
   * @param {TableProps} props
   * @param {ForwardedRef<HTMLTableElement>} ref
   */
  ({ className, isTableHeaderSticky, ...props }, ref) => (
    <div className="relative max-h-[90dvh] w-full border-separate overflow-auto">
      <table
        ref={ref}
        className={cn(tableVariants(), className)}
        {...props}
        data-is-table-header-sticky={isTableHeaderSticky ? "true" : "false"}
      />
    </div>
  ),
);
Table.displayName = "Table";

const TableHeader = forwardRef(
  /**
   * @param {TableHeaderProps} props
   * @param {ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <thead
      ref={ref}
      className={cn(
        [
          "[&_tr]:border-b [&_tr]:border-solid [&_tr]:border-border",
          "bg-white dark:bg-gray-900 dark:text-white",
          'group-[[data-is-table-header-sticky="true"]]:sticky group-[[data-is-table-header-sticky="true"]]:top-0 group-[[data-is-table-header-sticky="true"]]:z-10',
          'group-[[data-is-table-header-sticky="true"]]:shadow-[0_0rem_0.0625rem_0.0625rem_hsl(var(--border))]',
        ],
        className,
      )}
      {...props}
    />
  ),
);
TableHeader.displayName = "TableHeader";

const TableBody = forwardRef(
  /**
   * @param {TableBodyProps} props
   * @param {ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn("[&_tr:last-child]:border-0", className)}
      {...props}
    />
  ),
);
TableBody.displayName = "TableBody";

const TableFooter = forwardRef(
  /**
   * @param {TableFooterProps} props
   * @param {ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        "border-t border-solid border-border bg-muted/50 font-medium [&>tr]:last:border-b-0",
        className,
      )}
      {...props}
    />
  ),
);
TableFooter.displayName = "TableFooter";

const TableRow = forwardRef(
  /**
   * @param {TableRowProps} props
   * @param {ForwardedRef<HTMLTableRowElement>} ref
   */ ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        "border-b border-solid border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = "TableRow";

const TableHead = forwardRef(
  /**
   * @param {TableHeadProps} props
   * @param {ForwardedRef<HTMLTableHeaderCellElement>} ref
   */ ({ className, size, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(tableHeadVariants({ size }), className)}
      {...props}
    />
  ),
);
TableHead.displayName = "TableHead";

const TableCell = forwardRef(
  /**
   * @param {TableCellProps} props
   * @param {ForwardedRef<HTMLTableDataCellElement>} ref
   */ ({ className, size, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ size }), className)}
      {...props}
    />
  ),
);
TableCell.displayName = "TableCell";

const TableCaption = forwardRef(
  /**
   * @param {TableCaptionProps} props
   * @param {ForwardedRef<HTMLTableCaptionElement>} ref
   */ ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn("mt-4 text-sm text-muted-foreground", className)}
      {...props}
    />
  ),
);
TableCaption.displayName = "TableCaption";

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
};

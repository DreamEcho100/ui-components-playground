import { forwardRef } from 'react';
import { cn } from '~/lib/utils';
import { tableVariants, tableHeadVariants, tableCellVariants } from './utils';

const Table = forwardRef(
  /**
   * @param {import('./types').TableProps} props
   * @param {import("react").ForwardedRef<HTMLTableElement>} ref
   */
  ({ className, isTableHeaderSticky, ...props }, ref) => (
    <div className="relative w-full overflow-auto max-h-[90dvh] border-separate">
      <table
        ref={ref}
        className={cn(tableVariants(), className)}
        {...props}
        data-is-table-header-sticky={isTableHeaderSticky ? 'true' : 'false'}
      />
    </div>
  ),
);
Table.displayName = 'Table';

const TableHeader = forwardRef(
  /**
   * @param {import('./types').TableHeaderProps} props
   * @param {import("react").ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <thead ref={ref} className={cn('[&_tr]:border-b', className)} {...props} />
  ),
);
TableHeader.displayName = 'TableHeader';

const TableBody = forwardRef(
  /**
   * @param {import('./types').TableBodyProps} props
   * @param {import("react").ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <tbody
      ref={ref}
      className={cn('[&_tr:last-child]:border-0', className)}
      {...props}
    />
  ),
);
TableBody.displayName = 'TableBody';

const TableFooter = forwardRef(
  /**
   * @param {import('./types').TableFooterProps} props
   * @param {import("react").ForwardedRef<HTMLTableSectionElement>} ref
   */ ({ className, ...props }, ref) => (
    <tfoot
      ref={ref}
      className={cn(
        'border-t bg-muted/50 font-medium [&>tr]:last:border-b-0',
        className,
      )}
      {...props}
    />
  ),
);
TableFooter.displayName = 'TableFooter';

const TableRow = forwardRef(
  /**
   * @param {import('./types').TableRowProps} props
   * @param {import("react").ForwardedRef<HTMLTableRowElement>} ref
   */ ({ className, ...props }, ref) => (
    <tr
      ref={ref}
      className={cn(
        'border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted',
        className,
      )}
      {...props}
    />
  ),
);
TableRow.displayName = 'TableRow';

const TableHead = forwardRef(
  /**
   * @param {import('./types').TableHeadProps} props
   * @param {import("react").ForwardedRef<HTMLTableHeaderCellElement>} ref
   */ ({ className, size, ...props }, ref) => (
    <th
      ref={ref}
      className={cn(tableHeadVariants({ size }), className)}
      {...props}
    />
  ),
);
TableHead.displayName = 'TableHead';

const TableCell = forwardRef(
  /**
   * @param {import('./types').TableCellProps} props
   * @param {import("react").ForwardedRef<HTMLTableDataCellElement>} ref
   */ ({ className, size, ...props }, ref) => (
    <td
      ref={ref}
      className={cn(tableCellVariants({ size }), className)}
      {...props}
    />
  ),
);
TableCell.displayName = 'TableCell';

const TableCaption = forwardRef(
  /**
   * @param {import('./types').TableCaptionProps} props
   * @param {import("react").ForwardedRef<HTMLTableCaptionElement>} ref
   */ ({ className, ...props }, ref) => (
    <caption
      ref={ref}
      className={cn('mt-4 text-sm text-muted-foreground', className)}
      {...props}
    />
  ),
);
TableCaption.displayName = 'TableCaption';

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

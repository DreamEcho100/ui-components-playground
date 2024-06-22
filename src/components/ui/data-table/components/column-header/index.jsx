import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpDown,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Settings2,
  FilterIcon,
} from 'lucide-react';

import { Button } from '~/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { DataTableResizeHandle } from './components/resize-handle';
import { TableHead } from '~/components/ui/table';
import { Popover, PopoverContent } from '~/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import Filter from './components/filters';

/**
 * @template TData
 *
 * @param {{ column: import("@tanstack/react-table").Column<TData, unknown> }} props
 */
function Sorting(props) {
  const clearSorting = props.column.clearSorting;
  const toggleSorting = props.column.toggleSorting;
  const getIsSorted = props.column.getIsSorted;
  const toggleVisibility = props.column.toggleVisibility;

  return (
    <>
      <Button
        variant="ghost"
        size={null}
        className="flex-shrink-0 p-1"
        onClick={() => {
          const isSorted = getIsSorted();

          if (!isSorted) {
            toggleSorting(true);
          } else if (isSorted === 'desc') {
            toggleSorting(false);
          } else {
            clearSorting();
          }
        }}
      >
        {getIsSorted() === 'asc' ? (
          <ArrowUp className="w-4 h-4 ms-1" />
        ) : getIsSorted() === 'desc' ? (
          <ArrowDown className="w-4 h-4 ms-1" />
        ) : (
          <ArrowUpDown className="w-4 h-4 ms-1" />
        )}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size={null}
            className="flex-shrink-0 p-1 hidden"
          >
            <Settings2 className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => toggleSorting(false)}>
            <ArrowUpIcon className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => toggleSorting(true)}>
            <ArrowDownIcon className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Desc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => clearSorting()}>
            <ArrowUpDown className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Clear
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => toggleVisibility(false)}>
            <EyeOff className="me-2 h-3.5 w-3.5 text-muted-foreground/70" />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

/**
 * @template TData
 * @template TValue
 *
 * @param {import("./types").DataTableColumnHeaderProps<TData, TValue>} props
 */
function Content({ ctx, table, title, ...props }) {
  const isPlaceholder = ctx.isPlaceholder;

  if (isPlaceholder) {
    return null;
  }

  const headerTitle = title ?? ctx.column.columnDef.meta?.header;

  const canSort = ctx.column.getCanSort();

  const canFilter = ctx.column.getCanFilter();
  const filterVariant = ctx.column.columnDef.meta?.filterVariant;

  return (
    <div {...props} className="flex items-center justify-between gap-2">
      <span>{headerTitle}</span>
      <div className="flex items-center gap-0.5">
        {canSort && <Sorting column={ctx.column} />}

        {filterVariant && canFilter ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size={null} className="flex-shrink-0 p-1">
                <FilterIcon className="size-3" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <Filter column={ctx.column} />
            </PopoverContent>
          </Popover>
        ) : null}
      </div>
      {ctx.column.getCanResize() && (
        <DataTableResizeHandle header={ctx} table={table} />
      )}
    </div>
  );
}

/**
 * @template TData
 * @template TValue
 *
 * @param {import("./types").DataTableColumnHeaderProps<TData, TValue>} props
 */
export function DataTableColumnHeader(props) {
  return (
    <TableHead
      key={props.ctx.id}
      style={{
        width:
          props.ctx.column.id === 'select'
            ? props.ctx.column.columnDef.meta?.width
            : `calc(var(--header-${props.ctx?.id}-size) * 1px)`,
      }}
    >
      <Content {...props} />
    </TableHead>
  );
}

import { FilterIcon } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { DataTableResizeHandle } from './components/resize-handle';
import { TableHead } from '~/components/ui/table';
import { Popover, PopoverContent } from '~/components/ui/popover';
import { PopoverTrigger } from '@radix-ui/react-popover';
import Filter from './components/filters';
import Sorting from './components/Sorting';
import { useMemo, useRef } from 'react';

/**
 * @template TData
 * @template TValue
 *
 * @param {import("./types").DataTableColumnHeaderProps<TData, TValue>} props
 */
function Content({ header: ctx, table, title, ...props }) {
  const isPlaceholder = ctx.isPlaceholder;
  const titleRef = useRef(/** @type {HTMLSpanElement | null} */ (null));
  const utilsRef = useRef(/** @type {HTMLDivElement | null} */ (null));

  const calculatedMinWidth = useMemo(() => {
    const titleWidth = titleRef.current?.offsetWidth ?? 0;
    const utilsWidth = utilsRef.current?.offsetWidth ?? 0;
    const gaps = [titleWidth, utilsWidth].filter(Boolean).length * 8;

    return titleWidth + utilsWidth + gaps;
  }, []);

  if (isPlaceholder) {
    return null;
  }

  const headerTitle = title ?? ctx.column.columnDef.meta?.header;

  const canSort = ctx.column.getCanSort();

  const canFilter = ctx.column.getCanFilter();
  const filterVariant = ctx.column.columnDef.meta?.filterVariant;
  const hasFilter = filterVariant && canFilter;

  return (
    <div
      {...props}
      className="flex items-center justify-between gap-2"
      style={{
        minWidth:
          calculatedMinWidth > 0 ? `${calculatedMinWidth}px` : 'max-content',
      }}
    >
      <span ref={titleRef}>{headerTitle}</span>
      <div className="flex-shrink-0 flex items-center gap-0.5" ref={utilsRef}>
        {canSort && <Sorting column={ctx.column} />}

        {hasFilter ? (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size={null} className="flex-shrink-0 p-1">
                <FilterIcon className="flex-shrink-0 size-3" />
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
      key={props.header.id}
      style={{
        width:
          props.header.column.id === 'select'
            ? props.header.column.columnDef.meta?.width
            : `calc(var(--header-${props.header?.id}-size) * 0.0625rem)`,
      }}
      className="relative"
    >
      <Content {...props} />
    </TableHead>
  );
}

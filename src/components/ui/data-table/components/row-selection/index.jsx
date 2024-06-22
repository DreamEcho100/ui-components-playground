import { Checkbox } from '~/components/ui/checkbox';

/**
 * @template TData
 * @template TValue
 *
 * @param {import("./types").DataTableRowSelectionHeaderProps<TData, TValue>} props
 */
export function DataTableRowSelectionHeader({ ctx, ...props }) {
	const hasAnyRowsSelected = ctx.table.getSelectedRowModel().rows.length;
	return (
		<Checkbox
			{...props}
			checked={
				hasAnyRowsSelected
					? ctx.table.getIsAllPageRowsSelected() ||
					  (ctx.table.getIsSomePageRowsSelected() && 'indeterminate')
					: false
			}
			// checked={
			// 	!!Object.keys(rowSelection) ? table.getIsAllRowsSelected() : false
			// }
			// onChange={table.getToggleAllRowsSelectedHandler()}
			onCheckedChange={(value) => ctx.table.toggleAllPageRowsSelected(!!value)}
			aria-label={props['aria-label'] ?? 'Select all'}
		/>
	);
}

/**
 * @template TData
 * @template TValue
 *
 * @param {import("./types").DataTableRowSelectionCellProps<TData, TValue>} props
 */
export function DataTableRowSelectionCell({ ctx, ...props }) {
	return (
		<Checkbox
			{...props}
			checked={ctx.row.getIsSelected()}
			onCheckedChange={(value) => ctx.row.toggleSelected(!!value)}
			aria-label={props['aria-label'] ?? 'Select row'}
		/>
	);
}

/**
 * @template TData
 *
 * @type {import('./types').DataTableSelectColumn}
 */
export const defaultDataTableSelectColumn = {
	id: 'select',
	header: (ctx) => <DataTableRowSelectionHeader ctx={ctx} />,
	cell: (ctx) => <DataTableRowSelectionCell ctx={ctx} />,
	enableSorting: false,
	enableHiding: false,
	enableResizing: false,
	meta: {
		width: '2rem'
	}
};

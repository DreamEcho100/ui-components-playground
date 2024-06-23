import { isValidDate } from '~/components/ui/data-table/components/column-header/components/filters/utils';

/**
 * @param {import('../types').Payment[]} data
 * @param {import('./types').GetManyPaymentActionInput} options
 */
export function handleFilteringAndSortingPaymentData(data, options) {
  let newData = data;

  const sorting = options.sorting;
  if (sorting) {
    /** @type {keyof typeof sorting} */
    let key;
    for (key in sorting) {
      switch (key) {
        case 'createdAt': {
          newData = newData.sort((a, b) => {
            const aValue = new Date(a.createdAt).getTime();
            const bValue = new Date(b.createdAt).getTime();
            return sorting[key] === 'asc' ? aValue - bValue : bValue - aValue;
          });
          break;
        }

        case 'amount': {
          newData = newData.sort((a, b) => {
            const aValue = a.amount;
            const bValue = b.amount;
            return sorting[key] === 'asc' ? aValue - bValue : bValue - aValue;
          });
          break;
        }

        default: {
          newData = newData.sort((a, b) => {
            const aValue = a[key];
            const bValue = b[key];
            // @ts-ignore
            return sorting[key] === 'asc' ? aValue - bValue : bValue - aValue;
          });
          break;
        }
      }
    }
  }

  const columnFilters = options.filters;
  if (columnFilters) {
    /** @type {keyof typeof columnFilters} */
    let key;
    for (key in columnFilters) {
      switch (key) {
        case 'status':
        case 'email': {
          const value = columnFilters[key];
          newData = newData.filter((row) => {
            return row[key] === value;
          });
          break;
        }

        case 'createdAt': {
          const { min, max } = columnFilters[key] ?? {};
          newData = newData.filter((row) => {
            const date = new Date(row[key]);
            if (!isValidDate(date)) {
              return false;
            }
            const rowValue = date.getTime();

            const startDate = min ? new Date(min).getTime() : null;
            const endDate = max ? new Date(max).getTime() : null;

            if (startDate && !endDate) {
              return rowValue >= startDate;
            } else if (!startDate && endDate) {
              return rowValue <= endDate;
            } else if (startDate && endDate) {
              return rowValue >= startDate && rowValue <= endDate;
            } else return true;
          });
          break;
        }

        case 'amount': {
          const { min, max } = columnFilters[key] ?? {};
          newData = newData.filter((row) => {
            const rowValue = row[key];

            if (typeof rowValue !== 'number') {
              return false;
            }

            const startDate = min ? Number(min) : null;
            const endDate = max ? Number(max) : null;

            if (startDate && !endDate) {
              return rowValue >= startDate;
            } else if (!startDate && endDate) {
              return rowValue <= endDate;
            } else if (startDate && endDate) {
              return rowValue >= startDate && rowValue <= endDate;
            } else return true;
          });
          break;
        }
      }
    }
  }

  return newData;
}

/** @param {number} periodMs */
export async function sleep(periodMs) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, 1000);
  });
}

import { isValidDate } from '~/components/ui/data-table/components/column-header/components/filters/utils';

/**
 * @param {import('../types').Payment[]} data
 * @param {import('./types').GetManyPaymentActionInput} options
 */
export function handleFilteringAndSortingPaymentData(data, options) {
  let newData = data;

  const sorting = options.sorting;
  if (sorting && sorting.length > 0) {
    newData = newData.toSorted((a, b) => {
      for (const { id, desc } of sorting) {
        if (
          id === 'details.lol' ||
          id === 'details.bruh' ||
          id === 'details.xd' ||
          id === 'details'
        ) {
          continue;
        }

        /** @type {number | string} */
        let aValue;
        /** @type {number | string} */
        let bValue;

        if (id === 'createdAt') {
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
        } else {
          aValue = a[id];
          bValue = b[id];
        }

        if (aValue < bValue) {
          return desc ? 1 : -1;
        }

        if (aValue > bValue) {
          return desc ? -1 : 1;
        }
      }

      return 0;
    });
  }

  const columnFilters = options.columnFilters;
  if (columnFilters && columnFilters.length > 0) {
    newData = newData.filter((row) => {
      for (const { id, value } of columnFilters) {
        if (
          id === 'details.lol' ||
          id === 'details.bruh' ||
          id === 'details.xd' ||
          id === 'details'
        ) {
          continue;
        }

        if (id === 'createdAt') {
          // const rowValue = new Date(row[id]).getTime();
          // const filterValue = new Date(/** @type {string} */(value)).getTime();
          const colValue = row[id];
          /** @type {Date} */
          const date = new Date(colValue);

          if (!isValidDate(date)) return false;

          const [start, end] = /** @type {[string, string]} */ (value); // value => two date input values
          let startDate = start ? new Date(start) : null;
          let endDate = end ? new Date(end) : null;
          if (!startDate || !isValidDate(startDate)) {
            startDate = null;
          }
          if (!endDate || !isValidDate(endDate)) {
            endDate = null;
          }

          //If one filter defined and date is null filter it
          if ((startDate || endDate) && !date) return false;
          if (startDate && !endDate) {
            return date.getTime() >= startDate.getTime();
          } else if (!startDate && endDate) {
            return date.getTime() <= endDate.getTime();
          } else if (startDate && endDate) {
            return (
              date.getTime() >= startDate.getTime() &&
              date.getTime() <= endDate.getTime()
            );
          } else return true;

          continue;
        }

        if (id === 'amount') {
          const colValue = row[id];
          const [start, end] = /** @type {[number, number]} */ (value);
          let startDate = start ? Number(start) : null;
          let endDate = end ? Number(end) : null;
          if (!startDate || Number.isNaN(startDate)) {
            startDate = null;
          }
          if (!endDate || Number.isNaN(endDate)) {
            endDate = null;
          }

          if ((startDate || endDate) && !colValue) return false;
          if (startDate && !endDate) {
            return colValue >= startDate;
          }
          if (!startDate && endDate) {
            return colValue <= endDate;
          }
          if (startDate && endDate) {
            return colValue >= startDate && colValue <= endDate;
          }

          continue;
        }

        const rowValue = row[id];

        if (rowValue !== value) {
          return false;
        }
      }

      return true;
    });
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

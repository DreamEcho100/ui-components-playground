/** @import { FilterFn } from '@tanstack/react-table' */

/** @type {FilterFn<any>} */
export const dateBetweenFilterFn = (row, columnId, value) => {
  /** @type {string | Date} */
  const colValue = row.getValue(columnId);
  /** @type {Date} */
  const date = colValue instanceof Date ? colValue : new Date(colValue);

  if (!isValidDate(date)) return false;

  /** @type {[Date | null, Date | null]} */
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const [start, end] = value; // value => two date input values
  let startDate = start
    ? start instanceof Date
      ? start
      : new Date(start)
    : null;
  let endDate = end ? (end instanceof Date ? end : new Date(end)) : null;
  if (!startDate || !isValidDate(startDate)) {
    startDate = null;
  }
  if (!endDate || !isValidDate(endDate)) {
    endDate = null;
  }

  //If one filter defined and date is null filter it
  if ((startDate ?? endDate) && !date) return false;
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
};
// dateBetweenFilterFn.autoRemove;

/**
 * Formats a given date to 'YYYY-MM-DD' format.
 * @param {string|Date|number} dateValue - The date to format.
 * @returns {string} The formatted date string.
 */
export function formatDate(dateValue) {
  const date = new Date(dateValue);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/**
 * Checks if a given date is valid.
 * @param {string|Date|number} dateValue - The date to validate.
 * @returns {boolean} True if the date is valid, false otherwise.
 */
export function isValidDate(dateValue) {
  if (typeof dateValue === "number") {
    return !isNaN(dateValue) && !isNaN(new Date(dateValue).getTime());
  }

  const parsedDate = new Date(dateValue);

  return !isNaN(parsedDate.getTime());
}

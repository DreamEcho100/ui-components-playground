import { isValidDate } from "~/components/ui/data-table/components/column-header/components/filters/utils";

/** @import { Payment } from '~/config/types.ts' */
/** @import { GetManyPaymentActionInput } from './types.ts' */

/**
 * @template {string} K
 * @template {{ [Key in K]: string; }} T
 *
 * @param {T[]} items
 * @param {K} key
 */
function idToItemGenerator(items, key) {
  /** @type {Map<string, Set<{ [Key in K]: string; } & Record<string, unknown>>>} */
  const idToFilter = new Map();

  if (items) {
    for (const item of items) {
      const filterSet = idToFilter.get(item[key]);

      if (filterSet) {
        filterSet.add(item);
      } else {
        idToFilter.set(item[key], new Set([item]));
      }
    }
  }

  return idToFilter;
}

import { z } from "zod";

const createdAtCursor = z.object({
  sortBy: z.literal("createdAt"),
  cursor: z.coerce.date().nullish().optional(),
});
const amountCursor = z.object({
  sortBy: z.literal("amount"),
  cursor: z.number().nullish().optional(),
});
const emailCursor = z.object({
  sortBy: z.literal("email"),
  cursor: z.string().email().nullish().optional(),
});
const statusCursor = z.object({
  sortBy: z.literal("status"),
  cursor: z.string().nullish().optional(),
});

export const base = z.object({
  filters: z.array(
    z.union([
      z.object({
        id: z.literal("status"),
        value: z.enum(["pending", "paid", "failed"]),
      }),
      z.object({
        id: z.literal("email"),
        value: z.string(),
      }),
      z.object({
        id: z.literal("createdAt"),
        value: z.tuple([
          z.string().nullish().optional(), // from
          z.string().nullish().optional(), // to
        ]),
      }),
      z.object({
        id: z.literal("amount"),
        value: z.tuple([
          z.number().nullish().optional(), // from
          z.number().nullish().optional(), // to
        ]),
      }),
    ]),
  ),
  limit: z.number().optional(),
  sortDir: z.enum(["asc", "desc"]).default("asc"),
  direction: z.enum(["forward", "backward"]), // optional, useful for bi-directional query
});

export const getManyPaymentActionSchema = z.discriminatedUnion("sortBy", [
  createdAtCursor.merge(base).strict(),
  amountCursor.merge(base).strict(),
  emailCursor.merge(base).strict(),
  statusCursor.merge(base).strict(),
]);

/**
 * @param {Payment[]} data
 * @param {GetManyPaymentActionInput} options
 */
export function handleFilteringAndSortingPaymentData(data, options) {
  let newData = data;

  const idToFilter =
    options.filters && idToItemGenerator(options.filters, "id");
  // const idToSorting =
  //   options.sorting && idToItemGenerator(options.sorting, "id");

  idToFilter?.forEach((value, key) => {
    value.forEach((filter) => {
      switch (filter.id) {
        case "status":
        case "email": {
          const filterValue = filter.value;
          newData = newData.filter((row) => {
            const rowValue = row[/** @type {'status' | 'email'} */ (filter.id)];
            return rowValue.includes(/** @type {string} */ (filterValue));
          });
          break;
        }

        case "createdAt": {
          const [from, to] =
            /** @type {[to: string | undefined, from: string | undefined]}  */ (
              filter.value ?? {}
            );
          newData = newData.filter((row) => {
            const date = new Date(row.createdAt);
            if (!isValidDate(date)) {
              return false;
            }
            const rowValue = date.getTime();

            const startDate = from ? new Date(from).getTime() : null;
            const endDate = to ? new Date(to).getTime() : null;

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

        case "amount": {
          const [from, to] =
            /** @type {[to: string | undefined, from: string | undefined]}  */ (
              filter.value ?? {}
            );
          newData = newData.filter((row) => {
            const rowValue = row.amount;

            if (typeof rowValue !== "number") {
              return false;
            }

            const startDate = from ? Number(from) : null;
            const endDate = to ? Number(to) : null;

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
    });
  });

  switch (options.sortBy) {
    case "amount": {
      newData = newData.toSorted((a, b) => {
        const aValue = a.amount;
        const bValue = b.amount;
        return options.sortDir === "asc" ? aValue - bValue : bValue - aValue;
      });
      break;
    }

    case "email": {
      newData = newData.toSorted((a, b) => {
        const aValue = a[options.sortBy];
        const bValue = b[options.sortBy];
        return options.sortDir === "asc"
          ? // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            aValue - bValue
          : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            bValue - aValue;
      });
      break;
    }

    default: {
      newData = newData.toSorted((a, b) => {
        const aValue = new Date(a.createdAt).getTime();
        const bValue = new Date(b.createdAt).getTime();
        return options.sortDir === "asc" ? aValue - bValue : bValue - aValue;
      });
      break;
    }
  }

  return options.direction === "forward" ? newData : newData.reverse();
}

/** @param {number} periodMs */
export async function sleep(periodMs) {
  await new Promise((resolve) => {
    setTimeout(resolve, periodMs);
  });
}

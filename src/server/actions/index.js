"use server";

import { paymentsData } from "~/config/utils";
import { handleFilteringAndSortingPaymentData, sleep } from "./utils";

/** @param {import("./types").GetManyPaymentActionInput} input */
export default async function fetchPaymentsDataPageAction(input) {
  // const offset = input.cursor ?? 0;
  const limit = input.limit ?? 10;

  const filteredItems = handleFilteringAndSortingPaymentData(
    paymentsData,
    input,
  );

  /** @type {typeof filteredItems} */
  let slicedFilteredItems = [];
  /** @type {typeof input['cursor'] | null | undefined} */
  let nextCursor = null;
  /** @type {typeof input['cursor'] | null | undefined} */
  let prevCursor = null;

  // if (offset + limit < filteredItems.length) {
  //   nextCursor = offset + limit;
  // }
  // const prevCursor = offset - limit;

  switch (input.cursorName) {
    case "amount": {
      for (let i = 0; i < filteredItems.length; i++) {
        if (
          /** @type {typeof filteredItems[number]} */ (filteredItems[i])
            .amount >= input.cursor
        ) {
          slicedFilteredItems = filteredItems.slice(i, i + limit);
          nextCursor = filteredItems[i + limit]?.amount;
          prevCursor = filteredItems[i - limit]?.amount;
          break;
        }
      }
    }

    case "email": {
      for (let i = 0; i < filteredItems.length; i++) {
        if (
          /** @type {typeof filteredItems[number]} */ (filteredItems[i])
            .email === input.cursor
        ) {
          slicedFilteredItems = filteredItems.slice(i, i + limit);
          nextCursor = filteredItems[i + limit]?.email;
          prevCursor = filteredItems[i - limit]?.email;
          break;
        }
      }
    }

    default: {
      for (let i = 0; i < filteredItems.length; i++) {
        const date = new Date(
          /** @type {typeof filteredItems[number]} */ (
            filteredItems[i]
          ).createdAt,
        );
        if (!input.cursor) {
          slicedFilteredItems = filteredItems.slice(i, i + limit);
          nextCursor = filteredItems[i + limit]?.createdAt;
          prevCursor = filteredItems[i - limit]?.createdAt;
          break;
        }
        if (date >= input.cursor) {
          slicedFilteredItems = filteredItems.slice(i, i + limit);
          nextCursor = filteredItems[i + limit]?.createdAt;
          prevCursor = filteredItems[i - limit]?.createdAt;
          break;
        }
      }
    }
  }

  await sleep(3000);

  return {
    items: slicedFilteredItems,
    nextCursor,
    prevCursor,
  };
}

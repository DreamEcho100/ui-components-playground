"use server";

import { paymentsData } from "~/config/utils";
import { handleFilteringAndSortingPaymentData, sleep } from "./utils";

/** @param {import("./types").GetManyPaymentActionInput} input */
export default async function fetchPaymentsDataPageAction(input) {
  const offset = input.cursor ?? 0;
  const limit = input.limit ?? 10;

  const filteredItems = handleFilteringAndSortingPaymentData(
    paymentsData,
    input,
  );

  /** @type {number | null} */
  let nextCursor = null;

  if (offset + limit < filteredItems.length) {
    nextCursor = offset + limit;
  }

  const prevCursor = offset - limit;

  await sleep(3000);

  return {
    items: filteredItems.slice(offset, offset + limit),
    nextCursor,
    prevCursor,
  };
}

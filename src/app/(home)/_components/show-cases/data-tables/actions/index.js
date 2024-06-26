'use server';

import { paymentsData } from '../utils';
import { sleep } from './utils';

/** @param {import("./types").GetManyPaymentActionInput} input */
export default async function fetchPaymentsDataPageAction(input) {
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 10;

  /** @type {number | null} */
  let nextCursor = null;

  if (offset > 0) {
    throw new Error('Failed to fetch data');
  }

  if (offset + limit < paymentsData.length) {
    nextCursor = offset + limit;
  }

  await sleep(3000);

  return {
    items: paymentsData.slice(offset, offset + limit),
    nextCursor,
  };
}

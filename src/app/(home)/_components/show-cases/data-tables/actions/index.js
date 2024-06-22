'use server';

import { paymentsData } from '../utils';
import { sleep } from './utils';

/** @param {import("./types").GetManyPaymentActionInput} input */
export default async function fetchPaymentsDataPageAction(input) {
  const offset = input.offset ?? 0;
  const limit = input.limit ?? 10;

  await sleep(3000);

  return {
    items: paymentsData.slice(offset, offset + limit),
    nextCursor: offset + limit,
  };
}

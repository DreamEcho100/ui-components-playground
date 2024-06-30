import fetchPaymentsDataPageAction from "~/server/actions";
import { getManyPaymentActionSchema } from "~/server/actions/utils";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";

export const postRouter = createTRPCRouter({
  getMany: publicProcedure
    .input(getManyPaymentActionSchema)
    .query(({ input }) => {
      return fetchPaymentsDataPageAction(input);
    }),
});

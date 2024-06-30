import type { z } from "zod";
import type { getManyPaymentActionSchema } from "./utils";

export type GetManyPaymentActionInput = z.infer<
  typeof getManyPaymentActionSchema
>;

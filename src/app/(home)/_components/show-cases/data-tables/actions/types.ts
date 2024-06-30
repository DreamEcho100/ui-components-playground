import { z } from 'zod';
import { GetManyPaymentActionSchema } from './utils';

export type GetManyPaymentActionInput = z.infer<
  typeof GetManyPaymentActionSchema
>;

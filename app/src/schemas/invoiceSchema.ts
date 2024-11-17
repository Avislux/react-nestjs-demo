import { z } from 'zod';

export const invoiceSchema = z.object({
  id: z.number(),
  vendor_name: z.string(),
  amount: z.number(),
  due_date: z.string().datetime(),
  description: z.string().nullish(),
  user_id: z.number(),
  paid: z.boolean().optional(),
});
export const invoicesSchema = z.array(invoiceSchema);
export type InvoiceSchema = z.infer<typeof invoiceSchema>;
import { z } from "zod";

export const recordPaymentSchema = z.object({
    reference_number: z.string().min(1, "Reference number is required"),
    amount: z.string().min(1, "Amount is required"),
    payment_method: z.string().min(1, "Payment method is required"),
});

export const createPaymentApiSchema = recordPaymentSchema.extend({
    billing_id: z.string().min(1, "billing_id is required"),
    receipt_url: z.string().url().optional(),
    is_fraud: z.boolean().optional(),
    fraud_reason: z.string().optional(),
});

export const voidBillingSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
});

export const generateBillingSchema = z.object({
    billing_period: z.string().regex(/^\d{4}-\d{2}$/, "Invalid billing period format (use YYYY-MM)"),
});

export const billingLookupSchema = z.object({
    account_number: z.string().min(1, "account_number is required"),
    billing_period: z.string().regex(/^\d{4}-\d{2}$/, "Invalid billing period format (use YYYY-MM)"),
});

export type RecordPaymentInput = z.input<typeof recordPaymentSchema>;
export type RecordPaymentOutput = z.output<typeof recordPaymentSchema>;

export type VoidBillingInput = z.input<typeof voidBillingSchema>;
export type VoidBillingOutput = z.output<typeof voidBillingSchema>;

export type GenerateBillingInput = z.input<typeof generateBillingSchema>;
export type GenerateBillingOutput = z.output<typeof generateBillingSchema>;

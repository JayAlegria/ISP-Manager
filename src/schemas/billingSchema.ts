import { z } from "zod";

export const recordPaymentSchema = z.object({
    reference_number: z.string().min(1, "Reference number is required"),
    amount: z.string().min(1, "Amount is required"),
    verification_status: z.enum(["AUTO_VERIFIED", "MANUAL_REVIEW", "PENDING"], {
        error: "Please select a verification status",
    }),
});

export const voidBillingSchema = z.object({
    reason: z.string().min(1, "Reason is required"),
});

export const generateBillingSchema = z.object({
    billing_period: z.string().regex(/^\d{4}-\d{2}$/, "Invalid billing period format (use YYYY-MM)"),
});

export type RecordPaymentInput = z.input<typeof recordPaymentSchema>;
export type RecordPaymentOutput = z.output<typeof recordPaymentSchema>;

export type VoidBillingInput = z.input<typeof voidBillingSchema>;
export type VoidBillingOutput = z.output<typeof voidBillingSchema>;

export type GenerateBillingInput = z.input<typeof generateBillingSchema>;
export type GenerateBillingOutput = z.output<typeof generateBillingSchema>;

import { z } from "zod"

export const ACCEPTED_RECEIPT_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic"]
export const MAX_RECEIPT_SIZE_BYTES = 5 * 1024 * 1024

export const paymentReceiptFieldsSchema = z.object({
    account_number: z.string().min(1, "Account number is required"),
    billing_period: z.string().regex(/^\d{4}-\d{2}$/, "Please select the billing period"),
    payment_method: z.string().min(1, "Please select a payment method"),
})

export const paymentReceiptFormSchema = paymentReceiptFieldsSchema.extend({
    receipt: z
        .instanceof(File, { message: "Receipt image is required" })
        .refine((file) => file.size > 0, "Receipt image is required")
        .refine((file) => file.size <= MAX_RECEIPT_SIZE_BYTES, "Receipt image must be smaller than 5MB")
        .refine(
            (file) => ACCEPTED_RECEIPT_TYPES.includes(file.type),
            "Receipt must be an image (JPEG, PNG, WEBP, or HEIC)"
        ),
})

export type PaymentReceiptFieldsOutput = z.output<typeof paymentReceiptFieldsSchema>
export type PaymentReceiptFormInput = z.input<typeof paymentReceiptFormSchema>
export type PaymentReceiptFormOutput = z.output<typeof paymentReceiptFormSchema>

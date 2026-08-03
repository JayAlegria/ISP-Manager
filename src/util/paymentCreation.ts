import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type TCreatePaymentInput = {
    billing_id: string
    reference_number: string
    amount: string
    payment_method: string
    receipt_url?: string
    is_fraud?: boolean
    fraud_reason?: string
}

export type TCreatePaymentResult = {
    id: string
    billing_id: string
    customer_id: string | null
    reference_number: string
    amount: string
    billing_amount: string | null
    amount_mismatch: boolean
    payment_method: string
    verification_status: string
    duplicate: boolean
    is_fraud: boolean
    fraud_reason: string | null
    receipt_url: string | null
}

export async function createPaymentForBilling(input: TCreatePaymentInput): Promise<TCreatePaymentResult> {
    let billingId: bigint
    try {
        billingId = BigInt(input.billing_id)
    } catch {
        throw new Error("Invalid billing_id")
    }

    const billing = await prisma.billing.findUnique({
        where: { id: billingId },
    })

    if (!billing) {
        throw new Error("Billing record not found")
    }

    if (billing.status === "PAID") {
        throw new Error("This bill has already been paid")
    }

    if (billing.status === "VOID") {
        throw new Error("Cannot record payment for a voided bill")
    }

    const existingPayment = await prisma.payments.findFirst({
        where: { billing_id: billingId },
        orderBy: { created_at: "desc" },
    })

    if (existingPayment && existingPayment.verification_status !== "REJECTED") {
        throw new Error("This bill already has a payment pending verification or already verified")
    }

    const duplicateReference = await prisma.payments.findFirst({
        where: { reference_number: input.reference_number },
    })

    const payment = await prisma.payments.create({
        data: {
            billing_id: billingId,
            user_id: billing.customer_id,
            reference_number: input.reference_number,
            amount: input.amount,
            payment_method: input.payment_method,
            verified: false,
            verified_at: null,
            verification_status: "PENDING",
            duplicate: !!duplicateReference,
            isFraud: input.is_fraud ?? false,
            fraud_reason: input.fraud_reason ?? null,
            receipt_url: input.receipt_url ?? null,
        },
    })

    revalidatePath("/billing")
    revalidatePath("/payments")

    return {
        id: payment.id.toString(),
        billing_id: billingId.toString(),
        customer_id: billing.customer_id,
        reference_number: payment.reference_number ?? "",
        amount: payment.amount ?? "",
        billing_amount: billing.amount,
        amount_mismatch: payment.amount !== billing.amount,
        payment_method: payment.payment_method ?? "",
        verification_status: payment.verification_status ?? "PENDING",
        duplicate: payment.duplicate ?? false,
        is_fraud: payment.isFraud ?? false,
        fraud_reason: payment.fraud_reason,
        receipt_url: payment.receipt_url,
    }
}

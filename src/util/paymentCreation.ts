import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"

export type TCreatePaymentInput = {
    billing_id: string
    reference_number: string
    amount: string
    payment_method: string
}

export type TCreatePaymentResult = {
    id: string
    billing_id: string
    customer_id: string | null
    reference_number: string
    amount: string
    payment_method: string
    verification_status: string
    duplicate: boolean
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

    if (input.amount !== billing.amount) {
        throw new Error(`Payment amount must match billing amount (₱${billing.amount}). Received: ₱${input.amount}`)
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
        payment_method: payment.payment_method ?? "",
        verification_status: payment.verification_status ?? "PENDING",
        duplicate: payment.duplicate ?? false,
    }
}

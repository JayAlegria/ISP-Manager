"use server"

import { prisma } from "@/lib/prisma"
import { RecordPaymentOutput } from "@/schemas/billingSchema"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function recordPayment(
    billingId: string,
    formData: RecordPaymentOutput
): Promise<TActionResponse> {
    try {
        const billing = await prisma.billing.findUnique({
            where: {
                id: BigInt(billingId),
            },
        })

        if (!billing) {
            return {
                success: false,
                message: "Billing record not found",
            }
        }

        if (billing.status === "PAID") {
            return {
                success: false,
                message: "This bill has already been paid",
            }
        }

        if (billing.status === "VOID") {
            return {
                success: false,
                message: "Cannot record payment for a voided bill",
            }
        }

        if (formData.amount !== billing.amount) {
            return {
                success: false,
                message: `Payment amount must match billing amount (₱${billing.amount}). Received: ₱${formData.amount}`,
            }
        }

        const existingPayment = await prisma.payments.findFirst({
            where: {
                billing_id: BigInt(billingId),
            },
            orderBy: {
                created_at: "desc",
            },
        })

        if (existingPayment && existingPayment.verification_status !== "REJECTED") {
            return {
                success: false,
                message: "This bill already has a payment pending verification or already verified",
            }
        }

        const duplicateReference = await prisma.payments.findFirst({
            where: {
                reference_number: formData.reference_number,
            },
        })

        await prisma.payments.create({
            data: {
                billing_id: BigInt(billingId),
                user_id: billing.customer_id,
                reference_number: formData.reference_number,
                amount: formData.amount,
                payment_method: formData.payment_method,
                verified: false,
                verified_at: null,
                verification_status: "PENDING",
                duplicate: !!duplicateReference,
            },
        })

        revalidatePath("/billing")
        revalidatePath("/payments")

        return {
            success: true,
            message: duplicateReference
                ? "Payment recorded, but this reference number was already used on another payment — flagged as duplicate for review"
                : "Payment recorded and pending verification",
        }
    } catch (error) {
        console.error("Failed to record payment", error)
        return {
            success: false,
            message: "Failed to record payment",
        }
    }
}

export async function voidBilling(billingId: string, reason: string): Promise<TActionResponse> {
    try {
        const billing = await prisma.billing.findUnique({
            where: {
                id: BigInt(billingId),
            },
        })

        if (!billing) {
            return {
                success: false,
                message: "Billing record not found",
            }
        }

        if (billing.status === "PAID") {
            return {
                success: false,
                message: "Cannot void a bill that has been paid",
            }
        }

        if (billing.status === "VOID") {
            return {
                success: false,
                message: "This bill is already voided",
            }
        }

        await prisma.billing.update({
            where: {
                id: BigInt(billingId),
            },
            data: {
                status: "VOID",
                void_reason: reason,
            },
        })

        revalidatePath("/billing")

        return {
            success: true,
            message: `Billing record voided. Reason: ${reason}`,
        }
    } catch (error) {
        console.error("Failed to void billing", error)
        return {
            success: false,
            message: "Failed to void billing",
        }
    }
}

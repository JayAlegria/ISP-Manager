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
                verified: true,
            },
        })

        if (existingPayment) {
            return {
                success: false,
                message: "This bill already has a verified payment",
            }
        }

        const now = new Date()

        await prisma.payments.create({
            data: {
                billing_id: BigInt(billingId),
                user_id: billing.customer_id,
                reference_number: formData.reference_number,
                verified: formData.verification_status === "AUTO_VERIFIED",
                verified_at: formData.verification_status === "AUTO_VERIFIED" ? now : null,
                verification_status: formData.verification_status,
            },
        })

        await prisma.billing.update({
            where: {
                id: BigInt(billingId),
            },
            data: {
                status: formData.verification_status === "AUTO_VERIFIED" ? "PAID" : "PENDING",
            },
        })

        revalidatePath("/billing")

        return {
            success: true,
            message: "Payment recorded successfully",
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

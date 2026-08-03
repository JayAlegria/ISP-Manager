"use server"

import { prisma } from "@/lib/prisma"
import { RecordPaymentOutput } from "@/schemas/billingSchema"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"
import { createPaymentForBilling } from "@/util/paymentCreation"

export async function recordPayment(
    billingId: string,
    formData: RecordPaymentOutput
): Promise<TActionResponse> {
    try {
        const result = await createPaymentForBilling({
            billing_id: billingId,
            reference_number: formData.reference_number,
            amount: formData.amount,
            payment_method: formData.payment_method,
        })

        const flags: string[] = []
        if (result.duplicate) flags.push("this reference number was already used on another payment")
        if (result.amount_mismatch) flags.push(`the amount doesn't match the billing amount (₱${result.billing_amount})`)

        return {
            success: true,
            message:
                flags.length > 0
                    ? `Payment recorded, but ${flags.join(" and ")} — flagged for review`
                    : "Payment recorded and pending verification",
        }
    } catch (error) {
        console.error("Failed to record payment", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to record payment",
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

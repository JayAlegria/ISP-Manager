"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function rejectPayment(paymentId: string): Promise<TActionResponse> {
    try {
        const payment = await prisma.payments.findUnique({
            where: {
                id: BigInt(paymentId),
            },
        })

        if (!payment) {
            return {
                success: false,
                message: "Payment record not found",
            }
        }

        if (payment.verification_status !== "PENDING") {
            return {
                success: false,
                message: "Only pending payments can be rejected",
            }
        }

        await prisma.payments.update({
            where: {
                id: BigInt(paymentId),
            },
            data: {
                verification_status: "REJECTED",
            },
        })

        revalidatePath("/payments")

        return {
            success: true,
            message: "Payment rejected",
        }
    } catch (error) {
        console.error("Failed to reject payment", error)
        return {
            success: false,
            message: "Failed to reject payment",
        }
    }
}

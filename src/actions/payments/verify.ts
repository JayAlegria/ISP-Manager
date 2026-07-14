"use server"

import { prisma } from "@/lib/prisma"
import { createClient } from "@/lib/supabase/server"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function verifyPayment(paymentId: string): Promise<TActionResponse> {
    try {
        const payment = await prisma.payments.findUnique({
            where: {
                id: BigInt(paymentId),
            },
            include: {
                billing: true,
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
                message: "Only pending payments can be verified",
            }
        }

        if (!payment.billing) {
            return {
                success: false,
                message: "This payment is not linked to a billing record",
            }
        }

        if (payment.billing.status === "PAID") {
            return {
                success: false,
                message: "This billing record has already been paid",
            }
        }

        if (payment.billing.status === "VOID") {
            return {
                success: false,
                message: "Cannot verify a payment for a voided billing record",
            }
        }

        if (payment.amount !== payment.billing.amount) {
            return {
                success: false,
                message: `Payment amount (₱${payment.amount}) does not match billing amount (₱${payment.billing.amount})`,
            }
        }

        const supabase = await createClient()
        const { data: userData } = await supabase.auth.getUser()
        const now = new Date()

        await prisma.$transaction([
            prisma.payments.update({
                where: {
                    id: BigInt(paymentId),
                },
                data: {
                    verification_status: "VERIFIED",
                    verified: true,
                    verified_at: now,
                    verified_by: userData?.user?.email ?? null,
                },
            }),
            prisma.billing.update({
                where: {
                    id: payment.billing.id,
                },
                data: {
                    status: "PAID",
                },
            }),
        ])

        revalidatePath("/payments")
        revalidatePath("/billing")

        return {
            success: true,
            message: "Payment verified and billing marked as paid",
        }
    } catch (error) {
        console.error("Failed to verify payment", error)
        return {
            success: false,
            message: "Failed to verify payment",
        }
    }
}

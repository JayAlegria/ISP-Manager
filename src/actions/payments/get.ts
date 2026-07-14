"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TPaymentWithDetails } from "@/types/payments"
import { serializePrisma } from "@/util/serialize"

const paymentInclude = {
    billing: {
        include: {
            user: {
                select: {
                    id: true,
                    account_number: true,
                    name: true,
                    contact_number: true,
                    plans: {
                        select: {
                            id: true,
                            name: true,
                        },
                    },
                },
            },
        },
    },
} as const

export async function getPayments(): Promise<TActionResponse<TPaymentWithDetails[]>> {
    try {
        const payments = await prisma.payments.findMany({
            include: paymentInclude,
            orderBy: {
                created_at: "desc",
            },
        })

        return {
            success: true,
            message: "Fetch all payments successful",
            data: serializePrisma(
                payments.map((payment) => ({
                    ...payment,
                    billing: payment.billing
                        ? { ...payment.billing, customer: payment.billing.user || undefined }
                        : undefined,
                }))
            ) as TPaymentWithDetails[],
        }
    } catch (error) {
        console.error("Failed fetching payments", error)
        return {
            success: false,
            message: "Failed to fetch payments",
        }
    }
}

export async function getPaymentDetails(
    paymentId: string
): Promise<TActionResponse<TPaymentWithDetails>> {
    try {
        const payment = await prisma.payments.findUnique({
            where: {
                id: BigInt(paymentId),
            },
            include: paymentInclude,
        })

        if (!payment) {
            return {
                success: false,
                message: "Payment record not found",
            }
        }

        return {
            success: true,
            message: "Fetch payment details successful",
            data: serializePrisma({
                ...payment,
                billing: payment.billing
                    ? { ...payment.billing, customer: payment.billing.user || undefined }
                    : undefined,
            }) as TPaymentWithDetails,
        }
    } catch (error) {
        console.error("Failed fetching payment details", error)
        return {
            success: false,
            message: "Failed to fetch payment details",
        }
    }
}

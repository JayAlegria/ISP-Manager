"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TBillingWithCustomer } from "@/types/billing"
import { serializePrisma } from "@/util/serialize"

async function markOverdueBillings() {
    await prisma.billing.updateMany({
        where: {
            status: "PENDING",
            due_date: { lt: new Date() },
        },
        data: { status: "OVERDUE" },
    })
}

export async function getBilling(): Promise<TActionResponse<TBillingWithCustomer[]>> {
    try {
        await markOverdueBillings()

        const billings = await prisma.billing.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        account_number: true,
                        name: true,
                        facebook_name: true,
                        contact_number: true,
                        address: true,
                        email: true,
                        billing_day: true,
                        status: true,
                        plans: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                created_at: "desc",
            },
        })
        return {
            success: true,
            message: "Fetch all billing records successful",
            data: serializePrisma(
                billings.map((b) => ({
                    ...b,
                    status: b.status as any,
                    customer: b.user || undefined,
                }))
            ) as TBillingWithCustomer[],
        }
    } catch (error) {
        console.error("Failed fetching billing records", error)
        return {
            success: false,
            message: "Failed to fetch billing records",
        }
    }
}

export async function getBillingDetails(
    billingId: string
): Promise<TActionResponse<TBillingWithCustomer & { payment?: any }>> {
    try {
        await markOverdueBillings()

        const billing = await prisma.billing.findUnique({
            where: {
                id: BigInt(billingId),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        account_number: true,
                        name: true,
                        facebook_name: true,
                        contact_number: true,
                        address: true,
                        email: true,
                        billing_day: true,
                        status: true,
                        plans: {
                            select: {
                                id: true,
                                name: true,
                            },
                        },
                    },
                },
                payments: {
                    where: {
                        verified: true,
                    },
                    take: 1,
                },
            },
        })

        if (!billing) {
            return {
                success: false,
                message: "Billing record not found",
            }
        }

        return {
            success: true,
            message: "Fetch billing details successful",
            data: serializePrisma({
                ...billing,
                status: billing.status as any,
                customer: billing.user || undefined,
                payment: billing.payments[0] || null,
            }) as TBillingWithCustomer & { payment?: any },
        }
    } catch (error) {
        console.error("Failed fetching billing details", error)
        return {
            success: false,
            message: "Failed to fetch billing details",
        }
    }
}

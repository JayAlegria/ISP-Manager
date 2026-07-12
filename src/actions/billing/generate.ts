"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function generateMonthlyBilling(billingPeriod: string): Promise<TActionResponse<{ generated: number }>> {
    try {
        const [year, month] = billingPeriod.split("-").map(Number)

        if (!year || !month || month < 1 || month > 12) {
            return {
                success: false,
                message: "Invalid billing period format. Use YYYY-MM",
            }
        }

        const activeCustomers = await prisma.user.findMany({
            where: {
                status: "active",
                plan: {
                    not: null,
                },
            },
            include: {
                plans: true,
            },
        })

        let generatedCount = 0

        for (const customer of activeCustomers) {
            if (!customer.plans) continue

            const existingBilling = await prisma.billing.findFirst({
                where: {
                    customer_id: customer.id,
                    billing_period: billingPeriod,
                },
            })

            if (existingBilling) {
                continue
            }

            const billingDay = customer.billing_day ?? 1
            const dueDate = new Date(year, month - 1, billingDay)

            await prisma.billing.create({
                data: {
                    customer_id: customer.id,
                    billing_period: billingPeriod,
                    due_date: dueDate,
                    amount: customer.plans.monthly_fee,
                    status: "PENDING",
                },
            })

            generatedCount++
        }

        revalidatePath("/billing")

        return {
            success: true,
            message: `Generated ${generatedCount} billing record(s) for ${billingPeriod}`,
            data: { generated: generatedCount },
        }
    } catch (error) {
        console.error("Failed to generate monthly billing", error)
        return {
            success: false,
            message: "Failed to generate monthly billing",
        }
    }
}

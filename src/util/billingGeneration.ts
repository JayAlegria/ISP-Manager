import { prisma } from "@/lib/prisma"
import { TBillingGenerationResult } from "@/types/billing"
import { revalidatePath } from "next/cache"

export async function generateBillingForPeriod(billingPeriod: string): Promise<TBillingGenerationResult> {
    const [year, month] = billingPeriod.split("-").map(Number)

    if (!year || !month || month < 1 || month > 12) {
        throw new Error("Invalid billing period format. Use YYYY-MM")
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

    const result: TBillingGenerationResult = {
        billing_period: billingPeriod,
        created: [],
        skipped: [],
    }

    for (const customer of activeCustomers) {
        if (!customer.plans) {
            result.skipped.push({
                customer_id: customer.id,
                account_number: customer.account_number,
                customer_name: customer.name,
                customer_email: customer.email,
                billing_period: billingPeriod,
                reason: "Customer has no assigned plan",
            })
            continue
        }

        const existingBilling = await prisma.billing.findFirst({
            where: {
                customer_id: customer.id,
                billing_period: billingPeriod,
            },
        })

        if (existingBilling) {
            result.skipped.push({
                customer_id: customer.id,
                account_number: customer.account_number,
                customer_name: customer.name,
                customer_email: customer.email,
                billing_period: billingPeriod,
                reason: "Billing already exists for this period",
            })
            continue
        }

        const billingDay = customer.billing_day ?? 1
        const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate()
        const effectiveBillingDay = Math.min(billingDay, daysInMonth)
        const dueDate = new Date(Date.UTC(year, month - 1, effectiveBillingDay))

        const billing = await prisma.billing.create({
            data: {
                customer_id: customer.id,
                billing_period: billingPeriod,
                due_date: dueDate,
                amount: customer.plans.monthly_fee,
                status: "PENDING",
            },
        })

        result.created.push({
            id: billing.id.toString(),
            customer_id: customer.id,
            account_number: customer.account_number,
            customer_name: customer.name,
            customer_email: customer.email,
            billing_period: billingPeriod,
            due_date: dueDate.toISOString(),
            amount: billing.amount ?? "",
        })
    }

    revalidatePath("/billing")

    return result
}

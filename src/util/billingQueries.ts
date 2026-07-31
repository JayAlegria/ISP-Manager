import { prisma } from "@/lib/prisma"
import { markOverdueBillings } from "@/util/billingStatus"

export type TActiveBillingRecord = {
    id: string
    billing_period: string | null
    due_date: string | null
    amount: string | null
    status: string | null
    customer: {
        id: string
        account_number: string
        name: string | null
        contact_number: string | null
        email: string | null
    } | null
}

export async function getActiveBillingRecords(): Promise<TActiveBillingRecord[]> {
    await markOverdueBillings()

    const billings = await prisma.billing.findMany({
        where: {
            status: { in: ["PENDING", "OVERDUE"] },
        },
        orderBy: {
            due_date: "asc",
        },
        include: {
            user: {
                select: {
                    id: true,
                    account_number: true,
                    name: true,
                    contact_number: true,
                    email: true,
                },
            },
        },
    })

    return billings.map((billing) => ({
        id: billing.id.toString(),
        billing_period: billing.billing_period,
        due_date: billing.due_date ? billing.due_date.toISOString() : null,
        amount: billing.amount,
        status: billing.status,
        customer: billing.user
            ? {
                  id: billing.user.id,
                  account_number: billing.user.account_number,
                  name: billing.user.name,
                  contact_number: billing.user.contact_number,
                  email: billing.user.email,
              }
            : null,
    }))
}

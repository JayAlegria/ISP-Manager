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

export type TBillingLookupResult = {
    id: string
    created_at: string
    billing_period: string | null
    due_date: string | null
    amount: string | null
    status: string | null
    void_reason: string | null
    customer: {
        id: string
        account_number: string
        name: string | null
        contact_number: string | null
        email: string | null
    } | null
}

export async function getBillingByAccountAndPeriod(
    accountNumber: string,
    billingPeriod: string
): Promise<TBillingLookupResult | null> {
    await markOverdueBillings()

    const billing = await prisma.billing.findFirst({
        where: {
            billing_period: billingPeriod,
            user: {
                account_number: { equals: accountNumber.trim(), mode: "insensitive" },
            },
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

    if (!billing) return null

    return {
        id: billing.id.toString(),
        created_at: billing.created_at.toISOString(),
        billing_period: billing.billing_period,
        due_date: billing.due_date ? billing.due_date.toISOString() : null,
        amount: billing.amount,
        status: billing.status,
        void_reason: billing.void_reason,
        customer: billing.user
            ? {
                  id: billing.user.id,
                  account_number: billing.user.account_number,
                  name: billing.user.name,
                  contact_number: billing.user.contact_number,
                  email: billing.user.email,
              }
            : null,
    }
}

export async function getActiveBillingPeriodsForAccount(accountNumber: string): Promise<string[]> {
    await markOverdueBillings()

    const billings = await prisma.billing.findMany({
        where: {
            status: { in: ["PENDING", "OVERDUE"] },
            user: {
                account_number: { equals: accountNumber.trim(), mode: "insensitive" },
            },
            payments: {
                none: {
                    verification_status: { not: "REJECTED" },
                },
            },
        },
        orderBy: {
            due_date: "asc",
        },
        select: {
            billing_period: true,
        },
    })

    return billings
        .map((billing) => billing.billing_period)
        .filter((period): period is string => !!period)
}

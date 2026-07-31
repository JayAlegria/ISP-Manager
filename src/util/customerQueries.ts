import { prisma } from "@/lib/prisma"
import { markOverdueBillings } from "@/util/billingStatus"

export type TCustomerAccountLookup = {
    id: string
    account_number: string
    name: string | null
}

export async function findCustomerByAccountNumber(accountNumber: string): Promise<TCustomerAccountLookup | null> {
    const customer = await prisma.user.findFirst({
        where: {
            account_number: { equals: accountNumber.trim(), mode: "insensitive" },
        },
        select: {
            id: true,
            account_number: true,
            name: true,
        },
    })

    return customer
}

export type TUnpaidBill = {
    id: string
    billing_period: string | null
    due_date: string | null
    amount: string | null
    status: string | null
}

export type TCustomerLookupResult = {
    id: string
    created_at: string
    account_number: string
    name: string | null
    facebook_name: string
    facebook_id: string | null
    contact_number: string | null
    email: string | null
    address: string | null
    status: string | null
    billing_day: number | null
    plan: {
        id: string
        name: string
        monthly_fee: string
        speed: string
        status: string
    } | null
    unpaid_bills: TUnpaidBill[] | null
}

export async function findCustomersByNameOrFacebookName(query: string): Promise<TCustomerLookupResult[]> {
    await markOverdueBillings()

    const customers = await prisma.user.findMany({
        where: {
            OR: [
                { name: { contains: query, mode: "insensitive" } },
                { facebook_name: { contains: query, mode: "insensitive" } },
            ],
        },
        include: {
            plans: true,
            billing: {
                where: {
                    status: { in: ["PENDING", "OVERDUE"] },
                },
                orderBy: {
                    due_date: "asc",
                },
            },
        },
        take: 25,
    })

    return customers.map((customer) => ({
        id: customer.id,
        created_at: customer.created_at.toISOString(),
        account_number: customer.account_number,
        name: customer.name,
        facebook_name: customer.facebook_name,
        facebook_id: customer.facebook_id,
        contact_number: customer.contact_number,
        email: customer.email,
        address: customer.address,
        status: customer.status,
        billing_day: customer.billing_day,
        plan: customer.plans
            ? {
                  id: customer.plans.id.toString(),
                  name: customer.plans.name,
                  monthly_fee: customer.plans.monthly_fee,
                  speed: customer.plans.speed,
                  status: customer.plans.status,
              }
            : null,
        unpaid_bills:
            customer.billing.length > 0
                ? customer.billing.map((billing) => ({
                      id: billing.id.toString(),
                      billing_period: billing.billing_period,
                      due_date: billing.due_date ? billing.due_date.toISOString() : null,
                      amount: billing.amount,
                      status: billing.status,
                  }))
                : null,
    }))
}

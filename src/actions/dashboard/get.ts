"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"

export type TRevenueTrendPoint = {
    period: string
    billed: number
    collected: number
}

export type TPlanBreakdown = {
    planName: string
    subscriberCount: number
    revenue: number
}

export type TDashboardMetrics = {
    currentPeriod: string
    totalBilledThisPeriod: number
    totalCollectedThisPeriod: number
    collectionRatePercent: number
    outstandingAmount: number
    overdueCount: number
    overdueAmount: number
    pendingVerificationCount: number
    revenueTrend: TRevenueTrendPoint[]
    planBreakdown: TPlanBreakdown[]
    ticketStatusCounts: Record<string, number>
}

function toNumber(value: string | null): number {
    const parsed = Number(value)
    return Number.isFinite(parsed) ? parsed : 0
}

function lastNPeriods(n: number): string[] {
    const periods: string[] = []
    const now = new Date()
    for (let i = n - 1; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
        periods.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`)
    }
    return periods
}

export async function getDashboardMetrics(): Promise<TActionResponse<TDashboardMetrics>> {
    try {
        const now = new Date()
        const currentPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`

        const [billings, tickets, activeCustomers] = await Promise.all([
            prisma.billing.findMany({
                select: {
                    amount: true,
                    status: true,
                    billing_period: true,
                    customer_id: true,
                },
            }),
            prisma.ticket.findMany({
                select: { status: true },
            }),
            prisma.user.findMany({
                where: { status: "active" },
                select: {
                    id: true,
                    plan: true,
                    plans: { select: { id: true, name: true } },
                },
            }),
        ])

        const nonVoidBillings = billings.filter((b) => b.status !== "VOID")

        const totalBilledThisPeriod = nonVoidBillings
            .filter((b) => b.billing_period === currentPeriod)
            .reduce((sum, b) => sum + toNumber(b.amount), 0)

        const totalCollectedThisPeriod = billings
            .filter((b) => b.billing_period === currentPeriod && b.status === "PAID")
            .reduce((sum, b) => sum + toNumber(b.amount), 0)

        const collectionRatePercent =
            totalBilledThisPeriod > 0
                ? Math.round((totalCollectedThisPeriod / totalBilledThisPeriod) * 1000) / 10
                : 0

        const outstandingBillings = billings.filter((b) => b.status === "PENDING" || b.status === "OVERDUE")
        const outstandingAmount = outstandingBillings.reduce((sum, b) => sum + toNumber(b.amount), 0)

        const overdueBillings = billings.filter((b) => b.status === "OVERDUE")
        const overdueCount = overdueBillings.length
        const overdueAmount = overdueBillings.reduce((sum, b) => sum + toNumber(b.amount), 0)

        const pendingVerificationCount = await prisma.payments.count({
            where: { verification_status: "PENDING" },
        })

        const periods = lastNPeriods(6)
        const revenueTrend: TRevenueTrendPoint[] = periods.map((period) => ({
            period,
            billed: nonVoidBillings
                .filter((b) => b.billing_period === period)
                .reduce((sum, b) => sum + toNumber(b.amount), 0),
            collected: billings
                .filter((b) => b.billing_period === period && b.status === "PAID")
                .reduce((sum, b) => sum + toNumber(b.amount), 0),
        }))

        const planMap = new Map<string, TPlanBreakdown>()
        for (const customer of activeCustomers) {
            if (!customer.plans) continue
            const key = customer.plans.name
            const existing = planMap.get(key) ?? { planName: key, subscriberCount: 0, revenue: 0 }
            existing.subscriberCount += 1
            planMap.set(key, existing)
        }
        for (const billing of billings) {
            if (billing.billing_period !== currentPeriod || billing.status !== "PAID") continue
            const customer = activeCustomers.find((c) => c.id === billing.customer_id)
            if (!customer?.plans) continue
            const existing = planMap.get(customer.plans.name)
            if (existing) {
                existing.revenue += toNumber(billing.amount)
            }
        }
        const planBreakdown = Array.from(planMap.values()).sort((a, b) => b.subscriberCount - a.subscriberCount)

        const ticketStatusCounts: Record<string, number> = {}
        for (const ticket of tickets) {
            ticketStatusCounts[ticket.status] = (ticketStatusCounts[ticket.status] ?? 0) + 1
        }

        return {
            success: true,
            message: "Fetched dashboard metrics",
            data: {
                currentPeriod,
                totalBilledThisPeriod,
                totalCollectedThisPeriod,
                collectionRatePercent,
                outstandingAmount,
                overdueCount,
                overdueAmount,
                pendingVerificationCount,
                revenueTrend,
                planBreakdown,
                ticketStatusCounts,
            },
        }
    } catch (error) {
        console.error("Failed fetching dashboard metrics", error)
        return {
            success: false,
            message: "Failed to fetch dashboard metrics",
        }
    }
}

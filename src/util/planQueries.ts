import { prisma } from "@/lib/prisma"

export type TPlanLookupResult = {
    id: string
    created_at: string
    name: string
    monthly_fee: string
    plan_id: string
    status: string
    speed: string
}

export async function getPlansByStatus(status: "active" | "inactive" | "all"): Promise<TPlanLookupResult[]> {
    const plans = await prisma.plans.findMany({
        where: status === "all" ? {} : { status },
        orderBy: {
            created_at: "desc",
        },
    })

    return plans.map((plan) => ({
        id: plan.id.toString(),
        created_at: plan.created_at.toISOString(),
        name: plan.name,
        monthly_fee: plan.monthly_fee,
        plan_id: plan.plan_id,
        status: plan.status,
        speed: plan.speed,
    }))
}

export async function findActivePlanById(id: string): Promise<TPlanLookupResult | null> {
    let planId: bigint
    try {
        planId = BigInt(id)
    } catch {
        return null
    }

    const plan = await prisma.plans.findFirst({
        where: { id: planId, status: "active" },
    })

    if (!plan) return null

    return {
        id: plan.id.toString(),
        created_at: plan.created_at.toISOString(),
        name: plan.name,
        monthly_fee: plan.monthly_fee,
        plan_id: plan.plan_id,
        status: plan.status,
        speed: plan.speed,
    }
}

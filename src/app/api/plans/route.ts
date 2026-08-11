import { NextRequest, NextResponse } from "next/server"
import { plansLookupSchema } from "@/schemas/servicePlanSchema"
import { getPlansByStatus } from "@/util/planQueries"
import { isAuthorizedRequest } from "@/util/apiAuth"

export async function GET(request: NextRequest) {
    if (!isAuthorizedRequest(request)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const parsed = plansLookupSchema.safeParse({
        status: request.nextUrl.searchParams.get("status") ?? undefined,
    })

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid query parameters" },
            { status: 400 }
        )
    }

    try {
        const plans = await getPlansByStatus(parsed.data.status)

        return NextResponse.json({
            success: true,
            message: `Fetched ${plans.length} plan(s)`,
            data: {
                plans,
                count: plans.length,
            },
        })
    } catch (error) {
        console.error("Failed to fetch plans via API", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch plans" },
            { status: 500 }
        )
    }
}

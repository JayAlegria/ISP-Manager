import { NextRequest, NextResponse } from "next/server"
import { generateBillingSchema } from "@/schemas/billingSchema"
import { generateBillingForPeriod } from "@/util/billingGeneration"
import { isAuthorizedRequest } from "@/util/apiAuth"

export async function POST(request: NextRequest) {
    if (!isAuthorizedRequest(request)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = generateBillingSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request body" },
            { status: 400 }
        )
    }

    try {
        const result = await generateBillingForPeriod(parsed.data.billing_period)

        return NextResponse.json({
            success: true,
            message: `Generated ${result.created.length} billing record(s), skipped ${result.skipped.length} for ${result.billing_period}`,
            data: {
                billing_period: result.billing_period,
                created: result.created,
                skipped: result.skipped,
                summary: {
                    created_count: result.created.length,
                    skipped_count: result.skipped.length,
                },
            },
        })
    } catch (error) {
        console.error("Failed to generate billing via API", error)
        return NextResponse.json(
            { success: false, message: error instanceof Error ? error.message : "Failed to generate billing" },
            { status: 500 }
        )
    }
}

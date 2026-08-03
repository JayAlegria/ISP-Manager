import { NextRequest, NextResponse } from "next/server"
import { billingLookupSchema } from "@/schemas/billingSchema"
import { getBillingByAccountAndPeriod } from "@/util/billingQueries"
import { isAuthorizedRequest } from "@/util/apiAuth"

export async function GET(request: NextRequest) {
    if (!isAuthorizedRequest(request)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const parsed = billingLookupSchema.safeParse({
        account_number: request.nextUrl.searchParams.get("account_number"),
        billing_period: request.nextUrl.searchParams.get("billing_period"),
    })

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid query parameters" },
            { status: 400 }
        )
    }

    try {
        const billing = await getBillingByAccountAndPeriod(parsed.data.account_number, parsed.data.billing_period)

        if (!billing) {
            return NextResponse.json(
                { success: false, message: "No billing record found for this account number and billing period" },
                { status: 404 }
            )
        }

        return NextResponse.json({
            success: true,
            message: "Billing record found",
            data: billing,
        })
    } catch (error) {
        console.error("Failed to fetch billing via API", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch billing record" },
            { status: 500 }
        )
    }
}

import { NextRequest, NextResponse } from "next/server"
import { getActiveBillingRecords } from "@/util/billingQueries"
import { isAuthorizedRequest } from "@/util/apiAuth"

export async function GET(request: NextRequest) {
    if (!isAuthorizedRequest(request)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    try {
        const billing = await getActiveBillingRecords()

        return NextResponse.json({
            success: true,
            message: `Fetched ${billing.length} active billing record(s)`,
            data: {
                billing,
                count: billing.length,
            },
        })
    } catch (error) {
        console.error("Failed to fetch active billing via API", error)
        return NextResponse.json(
            { success: false, message: "Failed to fetch active billing records" },
            { status: 500 }
        )
    }
}

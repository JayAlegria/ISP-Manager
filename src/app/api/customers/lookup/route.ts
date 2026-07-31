import { NextRequest, NextResponse } from "next/server"
import { findCustomersByNameOrFacebookName } from "@/util/customerQueries"
import { isAuthorizedRequest } from "@/util/apiAuth"

export async function GET(request: NextRequest) {
    if (!isAuthorizedRequest(request)) {
        return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
    }

    const query = request.nextUrl.searchParams.get("q")?.trim()

    if (!query) {
        return NextResponse.json(
            { success: false, message: "Query parameter 'q' is required (matches against name or facebook_name)" },
            { status: 400 }
        )
    }

    try {
        const customers = await findCustomersByNameOrFacebookName(query)

        return NextResponse.json({
            success: true,
            message: `Found ${customers.length} matching customer(s)`,
            data: {
                customers,
                count: customers.length,
            },
        })
    } catch (error) {
        console.error("Failed to look up customers via API", error)
        return NextResponse.json({ success: false, message: "Failed to look up customers" }, { status: 500 })
    }
}

import { NextRequest, NextResponse } from "next/server"
import { findCustomerByAccountNumber } from "@/util/customerQueries"

export async function GET(request: NextRequest) {
    const accountNumber = request.nextUrl.searchParams.get("account_number")?.trim()

    if (!accountNumber) {
        return NextResponse.json(
            { success: false, message: "account_number is required" },
            { status: 400 }
        )
    }

    const customer = await findCustomerByAccountNumber(accountNumber)

    return NextResponse.json({
        success: true,
        message: customer ? "Account found" : "Account not found",
        data: {
            exists: !!customer,
            name: customer?.name ?? null,
        },
    })
}

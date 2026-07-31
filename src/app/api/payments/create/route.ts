import { NextRequest, NextResponse } from "next/server"
import { createPaymentApiSchema } from "@/schemas/billingSchema"
import { createPaymentForBilling } from "@/util/paymentCreation"
import { isAuthorizedRequest } from "@/util/apiAuth"

function statusForError(message: string): number {
    if (message.includes("not found")) return 404
    if (
        message.includes("already been paid") ||
        message.includes("voided bill") ||
        message.includes("already has a payment")
    ) {
        return 409
    }
    return 400
}

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

    const parsed = createPaymentApiSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request body" },
            { status: 400 }
        )
    }

    try {
        const payment = await createPaymentForBilling(parsed.data)

        return NextResponse.json({
            success: true,
            message: payment.duplicate
                ? "Payment recorded, but this reference number was already used on another payment — flagged as duplicate for review"
                : "Payment recorded and pending verification",
            data: payment,
        })
    } catch (error) {
        console.error("Failed to create payment via API", error)
        const message = error instanceof Error ? error.message : "Failed to create payment"
        return NextResponse.json({ success: false, message }, { status: statusForError(message) })
    }
}

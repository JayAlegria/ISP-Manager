import { NextRequest, NextResponse } from "next/server"
import { ACCEPTED_RECEIPT_TYPES, MAX_RECEIPT_SIZE_BYTES, paymentReceiptFieldsSchema } from "@/schemas/paymentReceiptSchema"
import { findCustomerByAccountNumber } from "@/util/customerQueries"

export async function POST(request: NextRequest) {
    const webhookUrl = process.env.N8N_PAYMENT_WEBHOOK_URL

    if (!webhookUrl) {
        console.error("N8N_PAYMENT_WEBHOOK_URL is not configured")
        return NextResponse.json(
            { success: false, message: "Payment submission is temporarily unavailable. Please try again later." },
            { status: 503 }
        )
    }

    let incoming: FormData
    try {
        incoming = await request.formData()
    } catch {
        return NextResponse.json({ success: false, message: "Invalid form submission" }, { status: 400 })
    }

    const parsed = paymentReceiptFieldsSchema.safeParse({
        account_number: incoming.get("account_number"),
        billing_period: incoming.get("billing_period"),
        payment_method: incoming.get("payment_method"),
    })

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid form data" },
            { status: 400 }
        )
    }

    const customer = await findCustomerByAccountNumber(parsed.data.account_number)

    if (!customer) {
        return NextResponse.json(
            { success: false, message: "Account number not found. Please check and try again." },
            { status: 400 }
        )
    }

    const receipt = incoming.get("receipt")

    if (!(receipt instanceof File) || receipt.size === 0) {
        return NextResponse.json({ success: false, message: "Receipt image is required" }, { status: 400 })
    }

    if (receipt.size > MAX_RECEIPT_SIZE_BYTES) {
        return NextResponse.json({ success: false, message: "Receipt image must be smaller than 5MB" }, { status: 400 })
    }

    if (!ACCEPTED_RECEIPT_TYPES.includes(receipt.type)) {
        return NextResponse.json(
            { success: false, message: "Receipt must be an image (JPEG, PNG, WEBP, or HEIC)" },
            { status: 400 }
        )
    }

    const forwardData = new FormData()
    forwardData.append("account_number", parsed.data.account_number)
    forwardData.append("billing_period", parsed.data.billing_period)
    forwardData.append("payment_method", parsed.data.payment_method)
    forwardData.append("submitted_at", new Date().toISOString())
    forwardData.append("receipt", receipt, receipt.name)

    try {
        const webhookResponse = await fetch(webhookUrl, {
            method: "POST",
            body: forwardData,
        })

        if (!webhookResponse.ok) {
            console.error("n8n webhook responded with an error", webhookResponse.status)
            return NextResponse.json(
                { success: false, message: "We couldn't process your submission right now. Please try again shortly." },
                { status: 502 }
            )
        }
    } catch (error) {
        console.error("Failed to forward payment receipt to n8n", error)
        return NextResponse.json(
            { success: false, message: "We couldn't process your submission right now. Please try again shortly." },
            { status: 502 }
        )
    }

    return NextResponse.json({
        success: true,
        message: "Your payment receipt has been submitted for review.",
    })
}

import { NextRequest, NextResponse } from "next/server"
import { installationRequestSchema } from "@/schemas/installationRequestSchema"
import { findActivePlanById } from "@/util/planQueries"

export async function POST(request: NextRequest) {
    const webhookUrl = process.env.N8N_INSTALLATION_REQUEST_WEBHOOK_URL

    if (!webhookUrl) {
        console.error("N8N_INSTALLATION_REQUEST_WEBHOOK_URL is not configured")
        return NextResponse.json(
            { success: false, message: "Installation requests are temporarily unavailable. Please try again later." },
            { status: 503 }
        )
    }

    let body: unknown
    try {
        body = await request.json()
    } catch {
        return NextResponse.json({ success: false, message: "Invalid JSON body" }, { status: 400 })
    }

    const parsed = installationRequestSchema.safeParse(body)

    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request body" },
            { status: 400 }
        )
    }

    const plan = await findActivePlanById(parsed.data.plan_id)

    if (!plan) {
        return NextResponse.json(
            { success: false, message: "Selected plan is no longer available. Please choose another plan." },
            { status: 400 }
        )
    }

    try {
        const webhookResponse = await fetch(webhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: parsed.data.name,
                contact_number: parsed.data.contact_number,
                email: parsed.data.email,
                address: parsed.data.address,
                plan_id: plan.id,
                plan_name: plan.name,
                monthly_fee: plan.monthly_fee,
                submitted_at: new Date().toISOString(),
            }),
        })

        if (!webhookResponse.ok) {
            console.error("n8n webhook responded with an error", webhookResponse.status)
            return NextResponse.json(
                { success: false, message: "We couldn't process your request right now. Please try again shortly." },
                { status: 502 }
            )
        }
    } catch (error) {
        console.error("Failed to forward installation request to n8n", error)
        return NextResponse.json(
            { success: false, message: "We couldn't process your request right now. Please try again shortly." },
            { status: 502 }
        )
    }

    return NextResponse.json({
        success: true,
        message: "Your installation request has been submitted. We'll contact you shortly.",
    })
}

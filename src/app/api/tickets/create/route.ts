import { NextRequest, NextResponse } from "next/server"
import { createTicketApiSchema } from "@/schemas/ticketSchema"
import { createTicketRecord } from "@/util/ticketCreation"
import { findCustomerByAccountNumber } from "@/util/customerQueries"
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

    const parsed = createTicketApiSchema.safeParse(body)
    if (!parsed.success) {
        return NextResponse.json(
            { success: false, message: parsed.error.issues[0]?.message ?? "Invalid request body" },
            { status: 400 }
        )
    }

    let customerId: string | null = null

    if (parsed.data.account_number) {
        const customer = await findCustomerByAccountNumber(parsed.data.account_number)

        if (!customer) {
            return NextResponse.json(
                { success: false, message: "Account number not found" },
                { status: 404 }
            )
        }

        customerId = customer.id
    }

    try {
        const ticket = await createTicketRecord({
            customer_id: customerId,
            guest_name: parsed.data.guest_name,
            guest_contact_number: parsed.data.guest_contact_number,
            category: parsed.data.category,
            description: parsed.data.description,
        })

        return NextResponse.json({
            success: true,
            message: "Ticket created successfully",
            data: ticket,
        })
    } catch (error) {
        console.error("Failed to create ticket via API", error)
        return NextResponse.json(
            { success: false, message: "Failed to create ticket" },
            { status: 500 }
        )
    }
}

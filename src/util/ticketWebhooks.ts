import { TTicketWithRelations } from "@/types/tickets"

async function postToWebhook(url: string | undefined, payload: unknown, context: string): Promise<void> {
    if (!url) return

    try {
        const res = await fetch(url, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        })

        if (!res.ok) {
            console.error(`n8n ${context} webhook responded with an error`, res.status)
        }
    } catch (error) {
        console.error(`Failed to notify n8n of ${context}`, error)
    }
}

export async function notifyTicketCreated(ticket: TTicketWithRelations): Promise<void> {
    await postToWebhook(
        process.env.N8N_TICKET_CREATED_WEBHOOK_URL,
        {
            event: "ticket.created",
            ticket_id: ticket.id,
            ticket_number: ticket.ticket_number,
            category: ticket.category,
            description: ticket.description,
            status: ticket.status,
            created_at: ticket.created_at,
            customer: ticket.user ?? null,
            guest: ticket.user
                ? null
                : { name: ticket.guest_name, contact_number: ticket.guest_contact_number },
        },
        "ticket-created"
    )
}

export async function notifyTicketAssigned(ticket: TTicketWithRelations): Promise<void> {
    await postToWebhook(
        process.env.N8N_TICKET_ASSIGNED_WEBHOOK_URL,
        {
            event: "ticket.assigned",
            ticket_id: ticket.id,
            ticket_number: ticket.ticket_number,
            category: ticket.category,
            description: ticket.description,
            status: ticket.status,
            assigned_at: ticket.assigned_at,
            customer: ticket.user ?? null,
            guest: ticket.user
                ? null
                : { name: ticket.guest_name, contact_number: ticket.guest_contact_number },
            technician: ticket.technician ?? null,
        },
        "ticket-assigned"
    )
}

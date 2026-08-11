import { prisma } from "@/lib/prisma"
import { TTicketWithRelations } from "@/types/tickets"
import { serializePrisma } from "@/util/serialize"
import { generateTicketNumber } from "@/util/ticketNumber"
import { notifyTicketCreated } from "@/util/ticketWebhooks"

export type TCreateTicketInput = {
    customer_id?: string | null
    guest_name?: string | null
    guest_contact_number?: string | null
    category: string
    description: string
}

export async function createTicketRecord(input: TCreateTicketInput): Promise<TTicketWithRelations> {
    const ticketNumber = await generateTicketNumber()

    const ticket = await prisma.ticket.create({
        data: {
            ticket_number: ticketNumber,
            customer_id: input.customer_id || undefined,
            guest_name: input.customer_id ? undefined : input.guest_name || undefined,
            guest_contact_number: input.customer_id ? undefined : input.guest_contact_number || undefined,
            category: input.category,
            description: input.description,
            status: "OPEN",
        },
        include: {
            user: {
                select: {
                    id: true,
                    account_number: true,
                    name: true,
                    contact_number: true,
                    address: true,
                },
            },
            technician: {
                select: {
                    id: true,
                    employee_id: true,
                    name: true,
                    email: true,
                },
            },
        },
    })

    const result = serializePrisma({
        ...ticket,
        id: ticket.id.toString(),
    }) as TTicketWithRelations

    await notifyTicketCreated(result)

    return result
}

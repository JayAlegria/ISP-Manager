"use server"

import { TActionResponse } from "@/types/response"
import { TTicketWithRelations } from "@/types/tickets"
import { createTicketSchema } from "@/schemas/ticketSchema"
import { createTicketRecord } from "@/util/ticketCreation"

export async function createTicket(data: unknown): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const validatedData = createTicketSchema.parse(data)

        const ticket = await createTicketRecord(validatedData)

        return {
            success: true,
            message: "Ticket created successfully",
            data: ticket,
        }
    } catch (error) {
        console.error("Failed creating ticket", error)
        return {
            success: false,
            message: "Failed to create ticket",
        }
    }
}

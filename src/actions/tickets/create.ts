"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTicketWithRelations } from "@/types/tickets"
import { createTicketSchema } from "@/schemas/ticketSchema"
import { serializePrisma } from "@/util/serialize"
import { generateTicketNumber } from "@/util/ticketNumber"

export async function createTicket(data: unknown): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const validatedData = createTicketSchema.parse(data)

        const ticketNumber = await generateTicketNumber()

        const ticket = await prisma.ticket.create({
            data: {
                ticket_number: ticketNumber,
                customer_id: validatedData.customer_id,
                category: validatedData.category,
                description: validatedData.description,
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
                    },
                },
            },
        })

        return {
            success: true,
            message: "Ticket created successfully",
            data: serializePrisma({
                ...ticket,
                id: ticket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed creating ticket", error)
        return {
            success: false,
            message: "Failed to create ticket",
        }
    }
}

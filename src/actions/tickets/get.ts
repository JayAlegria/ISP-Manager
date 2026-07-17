"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTicketWithRelations } from "@/types/tickets"
import { serializePrisma } from "@/util/serialize"

export async function getTickets(): Promise<TActionResponse<TTicketWithRelations[]>> {
    try {
        const tickets = await prisma.ticket.findMany({
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
            orderBy: {
                created_at: "desc",
            },
        })

        return {
            success: true,
            message: "Fetch all tickets successful",
            data: serializePrisma(
                tickets.map((t) => ({
                    ...t,
                    id: t.id.toString(),
                }))
            ) as TTicketWithRelations[],
        }
    } catch (error) {
        console.error("Failed fetching tickets", error)
        return {
            success: false,
            message: "Failed to fetch tickets",
        }
    }
}

export async function getTicketById(id: string): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(id) },
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

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        return {
            success: true,
            message: "Fetch ticket successful",
            data: serializePrisma({
                ...ticket,
                id: ticket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed fetching ticket", error)
        return {
            success: false,
            message: "Failed to fetch ticket",
        }
    }
}

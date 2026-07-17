"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTicketWithRelations } from "@/types/tickets"
import { updateTicketSchema, assignTechnicianSchema, updateStatusSchema, resolveTicketSchema } from "@/schemas/ticketSchema"
import { serializePrisma } from "@/util/serialize"
import { isValidStatusTransition } from "@/util/ticketNumber"

export async function updateTicket(
    id: string,
    data: unknown
): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const validatedData = updateTicketSchema.parse(data)

        const ticket = await prisma.ticket.update({
            where: { id: BigInt(id) },
            data: {
                category: validatedData.category,
                description: validatedData.description,
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
            message: "Ticket updated successfully",
            data: serializePrisma({
                ...ticket,
                id: ticket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed updating ticket", error)
        return {
            success: false,
            message: "Failed to update ticket",
        }
    }
}

export async function assignTechnician(
    ticketId: string,
    technicianId: string
): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(ticketId) },
        })

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        if (ticket.status !== "OPEN" && ticket.status !== "ASSIGNED") {
            return {
                success: false,
                message: "Can only assign technician to OPEN or ASSIGNED tickets",
            }
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: {
                technician_id: technicianId,
                status: "ASSIGNED",
                assigned_at: new Date(),
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
            message: "Technician assigned successfully",
            data: serializePrisma({
                ...updatedTicket,
                id: updatedTicket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed assigning technician", error)
        return {
            success: false,
            message: "Failed to assign technician",
        }
    }
}

export async function updateTicketStatus(
    ticketId: string,
    newStatus: string
): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(ticketId) },
        })

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        if (!isValidStatusTransition(ticket.status, newStatus)) {
            return {
                success: false,
                message: `Cannot transition from ${ticket.status} to ${newStatus}`,
            }
        }

        const updateData: any = { status: newStatus }

        if (newStatus === "RESOLVED") {
            updateData.resolved_at = new Date()
        } else if (newStatus === "CLOSED") {
            updateData.closed_at = new Date()
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: updateData,
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
            message: `Ticket status updated to ${newStatus}`,
            data: serializePrisma({
                ...updatedTicket,
                id: updatedTicket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed updating ticket status", error)
        return {
            success: false,
            message: "Failed to update ticket status",
        }
    }
}

export async function resolveTicket(
    ticketId: string,
    resolutionNotes?: string
): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(ticketId) },
        })

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        if (ticket.status !== "IN_PROGRESS") {
            return {
                success: false,
                message: "Only IN_PROGRESS tickets can be resolved",
            }
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: {
                status: "RESOLVED",
                resolved_at: new Date(),
                resolution_notes: resolutionNotes || null,
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
            message: "Ticket resolved successfully",
            data: serializePrisma({
                ...updatedTicket,
                id: updatedTicket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed resolving ticket", error)
        return {
            success: false,
            message: "Failed to resolve ticket",
        }
    }
}

export async function closeTicket(ticketId: string): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(ticketId) },
        })

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        if (ticket.status !== "RESOLVED") {
            return {
                success: false,
                message: "Only RESOLVED tickets can be closed",
            }
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: {
                status: "CLOSED",
                closed_at: new Date(),
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
            message: "Ticket closed successfully",
            data: serializePrisma({
                ...updatedTicket,
                id: updatedTicket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed closing ticket", error)
        return {
            success: false,
            message: "Failed to close ticket",
        }
    }
}

export async function cancelTicket(ticketId: string): Promise<TActionResponse<TTicketWithRelations>> {
    try {
        const ticket = await prisma.ticket.findUnique({
            where: { id: BigInt(ticketId) },
        })

        if (!ticket) {
            return {
                success: false,
                message: "Ticket not found",
            }
        }

        if (ticket.status === "CLOSED" || ticket.status === "CANCELLED") {
            return {
                success: false,
                message: `Cannot cancel a ${ticket.status} ticket`,
            }
        }

        const updatedTicket = await prisma.ticket.update({
            where: { id: BigInt(ticketId) },
            data: {
                status: "CANCELLED",
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
            message: "Ticket cancelled successfully",
            data: serializePrisma({
                ...updatedTicket,
                id: updatedTicket.id.toString(),
            }) as TTicketWithRelations,
        }
    } catch (error) {
        console.error("Failed cancelling ticket", error)
        return {
            success: false,
            message: "Failed to cancel ticket",
        }
    }
}

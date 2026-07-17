import { prisma } from "@/lib/prisma"

export async function generateTicketNumber(): Promise<string> {
    const totalTickets = await prisma.ticket.count()

    const sequence = String(totalTickets + 1).padStart(5, "0")
    return `TKT-${sequence}`
}

export function isValidStatusTransition(
    from: string,
    to: string
): boolean {
    const validTransitions: Record<string, string[]> = {
        OPEN: ["ASSIGNED", "CANCELLED"],
        ASSIGNED: ["IN_PROGRESS", "CANCELLED"],
        IN_PROGRESS: ["RESOLVED", "CANCELLED"],
        RESOLVED: ["CLOSED", "CANCELLED"],
        CLOSED: [],
        CANCELLED: [],
    }

    return validTransitions[from]?.includes(to) ?? false
}

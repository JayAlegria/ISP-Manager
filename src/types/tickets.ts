export type TTicketCategory = "internet_problem" | "billing_problem" | "relocation" | "installation"
export type TTicketStatus = "OPEN" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED" | "CLOSED" | "CANCELLED"

export const ticketStatusLabels: Record<string, string> = {
    OPEN: "Open",
    ASSIGNED: "Assigned",
    IN_PROGRESS: "In Progress",
    RESOLVED: "Resolved",
    CLOSED: "Closed",
    CANCELLED: "Cancelled",
}

export type TCustomerInfo = {
    id: string
    account_number: string
    name: string | null
    contact_number: string | null
    address: string | null
}

export type TTechnicianInfo = {
    id: string
    employee_id: string
    name: string
}

export type TTicket = {
    id: string
    created_at: string
    updated_at: string
    ticket_number: string
    customer_id: string
    technician_id: string | null
    category: string
    status: TTicketStatus | string
    description: string
    assigned_at: string | null
    resolved_at: string | null
    closed_at: string | null
    resolution_notes: string | null
}

export type TTicketWithRelations = TTicket & {
    user?: TCustomerInfo
    technician?: TTechnicianInfo | null
}

export type TTicketFilter = {
    status?: TTicketStatus | string
    category?: TTicketCategory | string
    technician_id?: string
}

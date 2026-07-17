import { z } from "zod"

export const createTicketSchema = z.object({
    customer_id: z.string().min(1, "Customer is required"),
    category: z.enum(["internet_problem", "billing_problem", "relocation", "installation"], {
        error: "Please select a category",
    }),
    description: z.string().min(10, "Description must be at least 10 characters"),
})

export const updateTicketSchema = z.object({
    category: z.enum(["internet_problem", "billing_problem", "relocation", "installation"], {
        error: "Please select a category",
    }),
    description: z.string().min(10, "Description must be at least 10 characters"),
})

export const assignTechnicianSchema = z.object({
    technician_id: z.string().min(1, "Technician is required"),
})

export const updateStatusSchema = z.object({
    status: z.enum(["OPEN", "ASSIGNED", "IN_PROGRESS", "RESOLVED", "CLOSED", "CANCELLED"], {
        error: "Invalid status",
    }),
})

export const resolveTicketSchema = z.object({
    resolution_notes: z.string().optional(),
})

export type CreateTicketInput = z.input<typeof createTicketSchema>
export type CreateTicketOutput = z.output<typeof createTicketSchema>
export type UpdateTicketInput = z.input<typeof updateTicketSchema>
export type UpdateTicketOutput = z.output<typeof updateTicketSchema>
export type AssignTechnicianInput = z.input<typeof assignTechnicianSchema>
export type AssignTechnicianOutput = z.output<typeof assignTechnicianSchema>
export type ResolveTicketInput = z.input<typeof resolveTicketSchema>
export type ResolveTicketOutput = z.output<typeof resolveTicketSchema>

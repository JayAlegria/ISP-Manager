import { z } from 'zod'

export const technicianSchema = z.object({
    employee_id: z.string().min(1, "Employee ID is required"),
    name: z.string().min(1, "Name is required"),
    contact_number: z.string().min(1, "Contact number is required"),
    email: z.string().email("Invalid email address"),
    status: z.enum(["active", "inactive"], { error: "Please select status" }),
    specialization: z.string().optional(),
})

export type TechnicianFormInput = z.input<typeof technicianSchema>
export type TechnicianFormOutput = z.output<typeof technicianSchema>

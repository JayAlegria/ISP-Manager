import { z } from "zod"

export const installationRequestSchema = z.object({
    name: z.string().min(1, "Full name is required"),
    contact_number: z.string().min(1, "Contact number is required"),
    email: z.string().min(1, "Email is required").email("Please enter a valid email address"),
    address: z.string().min(1, "Complete address is required"),
    plan_id: z.string().min(1, "Please select a plan"),
})

export type InstallationRequestInput = z.input<typeof installationRequestSchema>
export type InstallationRequestOutput = z.output<typeof installationRequestSchema>

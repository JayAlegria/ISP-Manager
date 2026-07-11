import { z } from 'zod'

export const servicePlanSchema = z.object({
    name: z.string().min(1, "Plan name is required"),
    monthly_fee: z.string().min(1, "Monthly fee is required"),
    speed: z.string()
        .min(1, "Speed must be greater than 0"),
    status: z.enum(["active", "inactive"], {
        error: "Please select a status",
    }),
})

export type FormValues = z.infer<typeof servicePlanSchema>;
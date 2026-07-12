import {z} from 'zod'

export const userSchema = z.object({
    account_number: z.string().min(1, "Account number is required"),
    name: z.string().min(1, "Name is required"),
    facebook_name: z.string(),
    address: z.string(),
    status: z.enum(["active","inactive"], {error: "Please select status"}),
    plan: z.string().min(1, "Plan required"),
    email: z.email(),
    billing_day: z.coerce.number().min(1, "Min number is 1").max(31, "Max number is 31")
})

export type UserFormInput = z.input<typeof userSchema>;
export type UserFormOutput = z.output<typeof userSchema>;
import { prisma } from "@/lib/prisma"

export async function generateAccountNumber(): Promise<string> {
    const totalCustomers = await prisma.user.count()

    const sequence = String(totalCustomers + 1).padStart(4, "0")
    return `ISP${sequence}`
}

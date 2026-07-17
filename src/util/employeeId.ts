import { prisma } from "@/lib/prisma"

export async function generateEmployeeId(): Promise<string> {
    const totalTechnicians = await prisma.technician.count()

    const sequence = String(totalTechnicians + 1).padStart(3, "0")
    return `EMP${sequence}`
}

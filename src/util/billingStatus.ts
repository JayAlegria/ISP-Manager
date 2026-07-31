import { prisma } from "@/lib/prisma"

export async function markOverdueBillings() {
    await prisma.billing.updateMany({
        where: {
            status: "PENDING",
            due_date: { lt: new Date() },
        },
        data: { status: "OVERDUE" },
    })
}

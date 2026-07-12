"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function deleteCustomer(id: string): Promise<TActionResponse> {
    try {
        const customer = await prisma.user.findUnique({
            where: { id },
            include: {
                billing: { select: { id: true } },
                payments: { select: { id: true } },
                reference_numbers: { select: { id: true } }
            }
        })

        if (!customer) {
            return {
                success: false,
                message: "Customer not found."
            }
        }

        const hasRecords =
            customer.billing.length > 0 ||
            customer.payments.length > 0 ||
            customer.reference_numbers.length > 0

        if (hasRecords) {
            return {
                success: false,
                message: `Cannot delete "${customer.name}" because billing or payment records exist for this customer.`
            }
        }

        const deleted = await prisma.user.delete({ where: { id } })
        revalidatePath("/customers")
        return {
            success: true,
            message: `${deleted.name} successfully deleted`
        }
    } catch (error) {
        console.error("Failed to delete customer", error)
        return {
            success: false,
            message: "Failed to delete customer"
        }
    }
}

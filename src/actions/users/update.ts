"use server"

import { prisma } from "@/lib/prisma"
import { UserFormOutput } from "@/schemas/userSchema"
import { TActionResponse } from "@/types/response"
import { revalidatePath } from "next/cache"

export async function updateCustomer(formData: UserFormOutput, id: string): Promise<TActionResponse> {
    try {
        const duplicate = await prisma.user.findMany({
            where: {
                id: { not: id },
                OR: [
                    { name: formData.name },
                    { account_number: formData.account_number }
                ]
            }
        })

        if (duplicate.length !== 0) {
            return {
                success: false,
                message: "Username or Account number already exists"
            }
        }

        const updated = await prisma.user.update({
            where: { id },
            data: {
                account_number: formData.account_number,
                name: formData.name,
                facebook_name: formData.facebook_name,
                contact_number: formData.contact_number,
                address: formData.address,
                status: formData.status,
                plan: Number(formData.plan),
                email: formData.email,
                billing_day: formData.billing_day
            }
        })
        revalidatePath("/customers")
        return {
            success: true,
            message: `${updated.name} updated`
        }
    } catch (error) {
        console.error("Error updating the customer", error)
        return {
            success: false,
            message: "Error updating the customer"
        }
    }
}

export async function updateCustomerStatus(id: string, status: "active" | "inactive"): Promise<TActionResponse> {
    try {
        const updated = await prisma.user.update({
            where: { id },
            data: { status }
        })
        revalidatePath("/customers")
        return {
            success: true,
            message: `${updated.name} ${status === "active" ? "reconnected" : "disconnected"}`
        }
    } catch (error) {
        console.error("Error updating customer status", error)
        return {
            success: false,
            message: "Error updating customer status"
        }
    }
}

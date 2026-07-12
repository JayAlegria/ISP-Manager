"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TCustomer } from "@/types/customers"
import { serializePrisma } from "@/util/serialize"

export async function getCustomers(): Promise<TActionResponse<TCustomer[]>> {
    try {
        const customers = await prisma.user.findMany({
            include: {
                plans: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        })
        return {
            success: true,
            message: "Fetch all customers successful",
            data: serializePrisma(customers)
        }
    } catch (error) {
        console.error("Failed fetching customers", error)
        return {
            success: false,
            message: "Failed to fetch customers"
        }
    }
}

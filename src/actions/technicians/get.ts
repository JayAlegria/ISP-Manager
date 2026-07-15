"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTechnician } from "@/types/technicians"
import { serializePrisma } from "@/util/serialize"

export async function getTechnicians(): Promise<TActionResponse<TTechnician[]>> {
    try {
        const technicians = await prisma.technician.findMany({
            orderBy: {
                created_at: "desc",
            },
        })
        return {
            success: true,
            message: "Fetch all technicians successful",
            data: serializePrisma(technicians) as TTechnician[],
        }
    } catch (error) {
        console.error("Failed fetching technicians", error)
        return {
            success: false,
            message: "Failed to fetch technicians",
        }
    }
}

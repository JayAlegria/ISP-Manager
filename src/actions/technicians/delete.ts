"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"

export async function deleteTechnician(id: string): Promise<TActionResponse<void>> {
    try {
        const technician = await prisma.technician.findUnique({
            where: { id },
        })

        if (!technician) {
            return {
                success: false,
                message: "Technician not found",
            }
        }

        await prisma.technician.delete({
            where: { id },
        })

        return {
            success: true,
            message: "Technician deleted successfully",
        }
    } catch (error) {
        console.error("Failed deleting technician", error)
        return {
            success: false,
            message: "Failed to delete technician",
        }
    }
}

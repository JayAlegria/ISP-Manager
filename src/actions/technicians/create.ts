"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTechnician } from "@/types/technicians"
import { technicianSchema } from "@/schemas/technicianSchema"
import { serializePrisma } from "@/util/serialize"

export async function createTechnician(
    data: unknown
): Promise<TActionResponse<TTechnician>> {
    try {
        const validatedData = technicianSchema.parse(data)

        const existingTechnician = await prisma.technician.findUnique({
            where: { employee_id: validatedData.employee_id },
        })

        if (existingTechnician) {
            return {
                success: false,
                message: "Employee ID already exists",
            }
        }

        const technician = await prisma.technician.create({
            data: {
                employee_id: validatedData.employee_id,
                name: validatedData.name,
                contact_number: validatedData.contact_number,
                email: validatedData.email,
                status: validatedData.status,
                specialization: validatedData.specialization || null,
            },
        })

        return {
            success: true,
            message: "Technician created successfully",
            data: serializePrisma(technician) as TTechnician,
        }
    } catch (error) {
        console.error("Failed creating technician", error)
        return {
            success: false,
            message: error instanceof Error && error.message.includes("Unique constraint failed")
                ? "Employee ID already exists"
                : "Failed to create technician",
        }
    }
}

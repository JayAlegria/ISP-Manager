"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTechnician } from "@/types/technicians"
import { technicianSchema } from "@/schemas/technicianSchema"
import { serializePrisma } from "@/util/serialize"

export async function updateTechnician(
    id: string,
    data: unknown
): Promise<TActionResponse<TTechnician>> {
    try {
        const validatedData = technicianSchema.parse(data)

        const existingTechnician = await prisma.technician.findUnique({
            where: { id },
        })

        if (!existingTechnician) {
            return {
                success: false,
                message: "Technician not found",
            }
        }

        if (validatedData.employee_id !== existingTechnician.employee_id) {
            const duplicateCheck = await prisma.technician.findUnique({
                where: { employee_id: validatedData.employee_id },
            })

            if (duplicateCheck) {
                return {
                    success: false,
                    message: "Employee ID already exists",
                }
            }
        }

        const technician = await prisma.technician.update({
            where: { id },
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
            message: "Technician updated successfully",
            data: serializePrisma(technician) as TTechnician,
        }
    } catch (error) {
        console.error("Failed updating technician", error)
        return {
            success: false,
            message: "Failed to update technician",
        }
    }
}

export async function updateTechnicianStatus(
    id: string,
    status: "active" | "inactive"
): Promise<TActionResponse<TTechnician>> {
    try {
        const technician = await prisma.technician.update({
            where: { id },
            data: { status },
        })

        return {
            success: true,
            message: `Technician ${status === "active" ? "activated" : "deactivated"} successfully`,
            data: serializePrisma(technician) as TTechnician,
        }
    } catch (error) {
        console.error("Failed updating technician status", error)
        return {
            success: false,
            message: "Failed to update technician status",
        }
    }
}

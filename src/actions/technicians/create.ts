"use server"

import { prisma } from "@/lib/prisma"
import { TActionResponse } from "@/types/response"
import { TTechnician } from "@/types/technicians"
import { technicianSchema } from "@/schemas/technicianSchema"
import { serializePrisma } from "@/util/serialize"
import { generateEmployeeId } from "@/util/employeeId"

export async function createTechnician(
    data: unknown
): Promise<TActionResponse<TTechnician>> {
    try {
        const validatedData = technicianSchema.parse(data)

        const employeeId = await generateEmployeeId()

        const technician = await prisma.technician.create({
            data: {
                employee_id: employeeId,
                name: validatedData.name,
                contact_number: validatedData.contact_number,
                email: validatedData.email,
                status: validatedData.status,
                specialization: validatedData.specialization || null,
            },
        })

        return {
            success: true,
            message: `Technician created successfully (Employee ID ${technician.employee_id})`,
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

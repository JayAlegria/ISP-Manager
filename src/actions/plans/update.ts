"use server"

import { prisma } from "@/lib/prisma"
import { FormValues } from "@/schemas/servicePlanSchema"
import { TActionResponse } from "@/types/response"
import { plans } from "@prisma/client"
import { revalidatePath } from "next/cache"

export async function updateServicePlan(formData: FormValues, id: string):Promise<TActionResponse<plans>> {
    try {
        const updatedPlan = await prisma.plans.update({
            where: {
                id: BigInt(id)
            },
            data: {
                name: formData.name,
                speed: Number(formData.speed),
                monthly_fee: formData.monthly_fee,
                plan_id: formData.name.toLowerCase().replace(/\s+/g, "_") || "",
                status: formData.status
            }
        })
        revalidatePath("/plans")
        return {
            success: true,
            message: `${updatedPlan.name} updated`,
        }
    } catch (error) {
        console.error("Error updating the plan", error)
        return {
            success: true,
            message: `Error updating the plan`,
        }
    }
}
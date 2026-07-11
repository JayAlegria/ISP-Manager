"use server"
import { prisma } from "@/lib/prisma";
import { FormValues } from "@/schemas/servicePlanSchema";
import { TActionResponse } from "@/types/response";
import { plans } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function createServicePlan(
    formData: FormValues
): Promise<TActionResponse<plans>> {
    try {
        const plan = await prisma.plans.findMany({
            where: { name: formData.name }
        })

        if (plan.length !== 0) {
            return {
                success: false,
                message: "Plan name already exists"
            }
        }
        const res = await prisma.plans.create({
            data: {
                name: formData.name,
                speed: formData.speed ? Number(formData.speed) : null,
                monthly_fee: formData.monthly_fee,
                status: formData.status,
                plan_id: formData.name.toLowerCase().replace(/\s+/g, "_") || ""
            }
        })
        revalidatePath("/plans")
        return {
            success: true,
            message: "Plan added successfully",
        }
    } catch (error) {
        console.error("Failed to create plan", error)
        return {
            success: false,
            message: "Failed to create new plan"
        }
    }

}
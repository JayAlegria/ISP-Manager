"use server"
import { prisma } from "@/lib/prisma";
import { TActionResponse } from "@/types/response";
import { plans } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function deleteServicePlan(id: string): Promise<TActionResponse<plans>> {
    try {
        const plan = await prisma.plans.findUnique({
            where: {
                id: BigInt(id),
            },
            include: {
                user: {
                    select: {
                        id: true,
                    },
                },
            },
        });

        if (!plan) {
            return {
                success: false,
                message: "Service plan not found.",
            };
        }

        if (plan.user.length > 0) {
            return {
                success: false,
                message: `Cannot delete "${plan.name}" because it is currently assigned to ${plan.user.length} customer(s).`,
            };
        }
        const deleteServicePlan = await prisma.plans.delete({
            where: {
                id: BigInt(id)
            }
        })
        revalidatePath("/plans")
        return {
            success: true,
            message: `${deleteServicePlan.name} successfully deleted`,
        }
    } catch (error) {
        console.error("Failed to delete record", error)
        return {
            success: false,
            message: `Failed to delete service plan`,
        }
    }
}
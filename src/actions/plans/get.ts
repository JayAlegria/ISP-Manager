"use server"

import { prisma } from "@/lib/prisma"
import { serializePrisma } from "@/util/serialize"

export async function getServicePlans() {
    try {
        const plans = await prisma.plans.findMany() 
        return {
            success: true,
            message: "Fetch all plans successfull",
            data: serializePrisma(plans)
        }
    } catch (error) {
        console.error("Failed fetching plans", error)
        return {
            success: false,
            message: "Failed to fetch plans"
        }
    }
}
"use server"

import { TActionResponse } from "@/types/response"
import { generateBillingForPeriod } from "@/util/billingGeneration"

export async function generateMonthlyBilling(billingPeriod: string): Promise<TActionResponse<{ generated: number }>> {
    try {
        const result = await generateBillingForPeriod(billingPeriod)

        return {
            success: true,
            message: `Generated ${result.created.length} billing record(s) for ${billingPeriod}`,
            data: { generated: result.created.length },
        }
    } catch (error) {
        console.error("Failed to generate monthly billing", error)
        return {
            success: false,
            message: error instanceof Error ? error.message : "Failed to generate monthly billing",
        }
    }
}

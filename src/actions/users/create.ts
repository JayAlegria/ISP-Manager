"use server"

import { prisma } from "@/lib/prisma";
import { UserFormOutput } from "@/schemas/userSchema";
import { TActionResponse } from "@/types/response";
import { success } from "zod";

export async function createUser(formData: UserFormOutput): Promise<TActionResponse<UserFormOutput>> {
    try {
        const user = await prisma.user.findMany({
            where: {
                OR: [
                    { name: formData.name },
                    { account_number: formData.account_number }
                ]
            }
        })
        if (user.length !== 0) {
            return {
                success: false,
                message: "Username or Account number already exists"
            }
        }
        const userInfo = await prisma.user.create({
            data: {
                account_number: formData.account_number,
                name: formData.name,
                facebook_name: formData.facebook_name,
                address: formData.address,
                status: formData.status,
                plan: Number(formData.plan),
                email: formData.email,
                billing_day: formData.billing_day

            }
        })
        return {
            success: true,
            message: `Custer ${userInfo.name} added to the record`
        }
    } catch (error) {
        console.error("Error creating customer", error)
        return {
            success: false,
            message: "Error creating new customer"
        }
    }
}
"use server"

import { prisma } from "@/lib/prisma";
import { UserFormOutput } from "@/schemas/userSchema";
import { TActionResponse } from "@/types/response";
import { revalidatePath } from "next/cache";
import { generateAccountNumber } from "@/util/accountNumber";

export async function createUser(formData: UserFormOutput): Promise<TActionResponse<UserFormOutput>> {
    try {
        const user = await prisma.user.findFirst({
            where: { name: formData.name }
        })
        if (user) {
            return {
                success: false,
                message: "Username already exists"
            }
        }

        const accountNumber = await generateAccountNumber()

        const userInfo = await prisma.user.create({
            data: {
                account_number: accountNumber,
                name: formData.name,
                facebook_name: formData.facebook_name,
                contact_number: formData.contact_number,
                address: formData.address,
                status: formData.status,
                plan: Number(formData.plan),
                email: formData.email,
                billing_day: formData.billing_day

            }
        })
        revalidatePath("/customers")
        return {
            success: true,
            message: `Customer ${userInfo.name} added to the record (Account #${userInfo.account_number})`
        }
    } catch (error) {
        console.error("Error creating customer", error)
        return {
            success: false,
            message: "Error creating new customer"
        }
    }
}
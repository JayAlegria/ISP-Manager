"use server"

import { createClient } from "@/lib/supabase/server"
import { TActionResponse } from "@/types/response"

export async function updatePassword(formData: FormData): Promise<TActionResponse> {
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirm_password") as string

    if (!password || password.length < 6) {
        return { success: false, message: "Password must be at least 6 characters" }
    }

    if (password !== confirmPassword) {
        return { success: false, message: "Passwords do not match" }
    }

    const supabase = await createClient()

    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { success: false, message: "Your reset link has expired. Please request a new one." }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        console.error("Failed to update password", error)
        return { success: false, message: "Something went wrong. Please try again." }
    }

    return { success: true, message: "Password updated successfully. You can now log in." }
}

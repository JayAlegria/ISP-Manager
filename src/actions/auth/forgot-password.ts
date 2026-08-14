"use server";

import { createClient } from "@/lib/supabase/server";
import { TActionResponse } from "@/types/response";

export async function forgotPassword(formData: FormData): Promise<TActionResponse> {
    const email = formData.get("email") as string;

    if (!email) {
        return { success: false, message: "Email is required" };
    }

    const supabase = await createClient();
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
        console.error("Failed to send password reset email", error);
        return { success: false, message: "Something went wrong. Please try again." };
    }

    return {
        success: true,
        message: "If an account exists with that email, we've sent a password reset link.",
    };
}

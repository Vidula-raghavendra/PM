"use server";

import { z } from "zod";
import { redirect } from "next/navigation";
// import { createSession } from "@/auth/session"; // Removed
import { requireUser } from "@/auth/guard";
import { UserService } from "@/services/user.service";

const profileSchema = z.object({
    phone: z.string().min(10, { message: "Phone number is required" }),
    gender: z.string().min(1, { message: "Gender is required" }),
    sector: z.string().min(1, { message: "Sector is required" }),
    purpose: z.string().min(1, { message: "Purpose is required" }),
});

export async function updateProfile(prevState: any, formData: FormData) {
    const userId = await requireUser();

    const result = profileSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { phone, gender, sector, purpose } = result.data;

    try {
        await UserService.updateProfile(userId, {
            phone,
            gender,
            sector,
            purpose,
        });
    } catch (error: any) {
        console.error("Profile Update Error:", error);
        return {
            message: `Failed to update profile: ${error.message}`,
        };
    }

    // Session update not needed for Supabase auth as profile is DB based
    // await createSession(userId, true); // Removed
    redirect("/dashboard");
}

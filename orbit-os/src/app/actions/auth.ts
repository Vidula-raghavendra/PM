"use server";

// ... imports
import { z } from "zod";
import { redirect } from "next/navigation";
// import { saltAndHashPassword, verifyPassword } from "@/auth/password"; // Removed
import { createSession, deleteSession } from "@/auth/session";
// import { UserService } from "@/services/user.service"; // Removed for Auth Step 1
import { supabase } from "@/lib/supabaseClient";

const signupSchema = z.object({
    name: z.string().min(2, { message: "Name must be at least 2 characters long." }).optional(),
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z
        .string()
        .min(8, { message: "Be at least 8 characters long" })
        .regex(/[a-zA-Z]/, { message: "Contain at least one letter." })
        .regex(/[0-9]/, { message: "Contain at least one number." })
        .regex(/[^a-zA-Z0-9]/, { message: "Contain at least one special character." })
        .trim(),
});

const loginSchema = z.object({
    email: z.string().email({ message: "Please enter a valid email." }).trim(),
    password: z.string().min(1, { message: "Password is required" }),
});

export async function signup(prevState: any, formData: FormData) {
    const result = signupSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password, name } = result.data;

    // Step 1: Supabase Signup
    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: name,
            }
        }
    });

    if (error) {
        console.error("Signup error:", error.message);
        return {
            // Map some common errors for better UX if needed
            message: error.message || "Failed to create user.",
        };
    }

    if (data.session) {
        await createSession(data.session.access_token, data.session.refresh_token);

        // Step 2: Auto-Create User Profile
        // We use the admin client to ensure we can write to the profiles table regardless of public RLS
        const { createAdminClient } = await import("@/lib/supabaseClient");
        const adminSupabase = createAdminClient();

        await adminSupabase.from("profiles").insert({
            id: data.user?.id,
            email: email,
            full_name: name || "",
            // Default values
            sector: "",
            purpose: "",
        });
    }

    // We will handle Profile creation in Step 2 (next tool call or implicit here? User said Step 2 is AFTER Step 1)
    // For now, satisfy Step 1.

    redirect("/dashboard");
}

export async function login(prevState: any, formData: FormData) {
    const result = loginSchema.safeParse(Object.fromEntries(formData));

    if (!result.success) {
        return {
            errors: result.error.flatten().fieldErrors,
        };
    }

    const { email, password } = result.data;

    // Step 1: Supabase Login
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
    });

    if (error) {
        console.log("Login failed:", error.message);
        return {
            message: "Invalid credentials.",
        };
    }

    if (data.session) {
        await createSession(data.session.access_token, data.session.refresh_token);
    }

    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    // Also sign out from Supabase if we had a client-side session, but this is server action
    await supabase.auth.signOut();
    redirect("/login");
}

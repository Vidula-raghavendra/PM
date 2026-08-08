"use server";

// ... imports
import { z } from "zod";
import { redirect } from "next/navigation";
import { createSession, deleteSession } from "@/auth/session";
import { getSupabase } from "@/lib/supabaseClient";

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

    const { data, error } = await getSupabase().auth.signUp({
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
            message: error.message || "Failed to create user.",
        };
    }

    // If Supabase has "Confirm email" enabled and no session is returned yet,
    // tell the user to check their inbox.
    if (!data.session) {
        return {
            info: "Check your email to confirm your account, then sign in.",
        };
    }

    // The profile row is created by the on_auth_user_created trigger
    // (see supabase/migrations/0001_init.sql), so there is nothing to insert here.
    await createSession(data.session.access_token, data.session.refresh_token);

    redirect("/onboarding");
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
    const { data, error } = await getSupabase().auth.signInWithPassword({
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
    await getSupabase().auth.signOut();
    redirect("/login");
}

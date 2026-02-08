"use server";

import { z } from "zod";

import { redirect } from "next/navigation";
import { saltAndHashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession, deleteSession } from "@/lib/auth/session";

import { prisma } from "@/lib/prisma";

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

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email },
    });

    if (existingUser) {
        return {
            errors: {
                email: ["User with this email already exists."],
            },
        };
    }

    // Hash password
    const hashedPassword = saltAndHashPassword(password);

    // Create user
    try {
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || undefined,
                role: "USER",
            },
        });

        await createSession(user.id);
    } catch (error) {
        if (error instanceof Error) {
            console.error(error.message);
        }
        return {
            message: "Database Error: Failed to Create User.",
        };
    }

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

    // Find user
    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        return {
            message: "Invalid credentials.",
        };
    }

    // Verify password
    const isValid = verifyPassword(password, user.password);

    if (!isValid) {
        return {
            message: "Invalid credentials.",
        };
    }

    await createSession(user.id);
    redirect("/dashboard");
}

export async function logout() {
    await deleteSession();
    redirect("/login");
}

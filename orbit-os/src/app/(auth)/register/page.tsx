"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OrbitMark } from "@/components/landing/orbit-mark";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="h-11 w-full rounded-full text-[13px] font-semibold"
            disabled={pending}
        >
            {pending ? "Creating account..." : "Create account"}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, action] = useActionState(signup, undefined);

    return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden p-5 sm:p-6">
            {/* Same landscape as the marketing hero, so signing in feels
                like the same place rather than a different product. */}
            <Image
                src="/hero-field-wide.jpg"
                alt=""
                fill
                priority
                sizes="100vw"
                unoptimized
                className="object-cover object-center"
                aria-hidden="true"
            />
            <div
                className="absolute inset-0"
                style={{ background: "rgba(26,30,16,0.42)" }}
                aria-hidden="true"
            />
            <div className="relative z-10 w-full max-w-[420px] animate-page-rise">
                <div className="rounded-xl border border-white/15 bg-white/95 p-7 shadow-xl backdrop-blur-xl sm:p-9">
                <div className="mb-8">
                    <Link
                        href="/"
                        className="mb-8 inline-flex items-center gap-2 text-[17px] font-bold tracking-[-0.02em] text-foreground transition-opacity duration-150 hover:opacity-80"
                    >
                        <OrbitMark className="h-6 w-6" />
                        Orbit
                    </Link>
                    <h1 className="mb-1.5 font-display text-[30px] font-medium italic leading-[1.15] tracking-[-0.01em]">Create your account</h1>
                    <p className="text-[13px] text-muted-foreground">
                        Start managing projects in under a minute.
                    </p>
                </div>

                <form action={action} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[13px] font-medium">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Your name"
                        />
                        {state?.errors?.name && (
                            <p className="text-xs text-destructive" role="alert">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[13px] font-medium">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                        />
                        {state?.errors?.email && (
                            <p className="text-xs text-destructive" role="alert">{state.errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[13px] font-medium">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="••••••••"
                        />
                        {/* Mirrors the zod rules in actions/auth.ts — letter,
                            number, special char. The old copy said "uppercase",
                            which is not what the validator checks. */}
                        <p className="text-[12px] text-muted-foreground">8+ characters, with a number and a special character.</p>
                        {state?.errors?.password && (
                            <div className="text-xs text-destructive space-y-1" role="alert">
                                <ul className="list-disc pl-4 space-y-0.5">
                                    {state.errors.password.map((error: string) => (
                                        <li key={error}>{error}</li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>

                    {state?.message && (
                        <p className="text-[13px] text-destructive text-center" role="alert">{state.message}</p>
                    )}

                    <div className="pt-2">
                        <SubmitButton />
                    </div>
                </form>

                <p className="text-center text-[13px] text-muted-foreground mt-6">
                    Have an account?{" "}
                    <Link href="/login" className="font-semibold text-accent-ink underline-offset-4 hover:underline">
                        Sign in
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}

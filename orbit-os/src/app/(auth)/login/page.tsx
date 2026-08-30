"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
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
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    );
}

export default function LoginPage() {
    const [state, action] = useActionState(login, undefined);

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
                    <h1 className="mb-1.5 font-display text-[30px] font-medium italic leading-[1.15] tracking-[-0.01em]">Welcome back</h1>
                    <p className="text-[13px] text-muted-foreground">
                        Sign in to your workspace.
                    </p>
                </div>

                <form action={action} className="space-y-4">
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
                            autoComplete="current-password"
                            placeholder="••••••••"
                        />
                        {state?.errors?.password && (
                            <p className="text-xs text-destructive" role="alert">{state.errors.password}</p>
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
                    No account?{" "}
                    <Link href="/register" className="font-semibold text-accent-ink underline-offset-4 hover:underline">
                        Create one
                    </Link>
                </p>
                </div>
            </div>
        </div>
    );
}

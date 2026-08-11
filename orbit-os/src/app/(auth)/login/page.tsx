
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full h-[38px] rounded-[10px] text-[13px] font-medium"
            disabled={pending}
        >
            {pending ? "Signing in..." : "Sign in"}
        </Button>
    );
}

export default function LoginPage() {
    const [state, action] = useActionState(login, undefined);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-[360px]">
                <div className="mb-8">
                    <Link href="/" className="font-serif text-lg tracking-tight inline-block mb-8 text-muted-foreground hover:text-foreground transition-colors duration-[100ms]">
                        Orbit
                    </Link>
                    <h1 className="font-serif text-display-sm mb-1.5">Welcome back</h1>
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
                            className="h-[38px] rounded-[10px] text-[14px] bg-card"
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
                            className="h-[38px] rounded-[10px] text-[14px] bg-card"
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
                    <Link href="/register" className="text-accent hover:underline underline-offset-4">
                        Create one
                    </Link>
                </p>
            </div>
        </div>
    );
}


"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button
            type="submit"
            className="w-full h-11 rounded-full text-[14px] font-medium"
            disabled={pending}
        >
            {pending ? "Creating account..." : "Create account"}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, action] = useActionState(signup, undefined);

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-6">
            <div className="w-full max-w-[360px]">
                <div className="mb-10">
                    <Link href="/" className="text-[15px] font-semibold tracking-tight inline-block mb-10 text-muted-foreground hover:text-foreground transition-colors">
                        Orbit
                    </Link>
                    <h1 className="text-2xl font-serif tracking-tight mb-1.5">Create your account</h1>
                    <p className="text-muted-foreground text-[14px]">
                        Start managing projects in under a minute.
                    </p>
                </div>

                <form action={action} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="name" className="text-[13px]">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            type="text"
                            required
                            autoComplete="name"
                            placeholder="Your name"
                            className="h-10 rounded-lg text-[14px]"
                        />
                        {state?.errors?.name && (
                            <p className="text-xs text-destructive" role="alert">{state.errors.name}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="email" className="text-[13px]">Email</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            required
                            autoComplete="email"
                            placeholder="you@example.com"
                            className="h-10 rounded-lg text-[14px]"
                        />
                        {state?.errors?.email && (
                            <p className="text-xs text-destructive" role="alert">{state.errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-1.5">
                        <Label htmlFor="password" className="text-[13px]">Password</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            required
                            autoComplete="new-password"
                            placeholder="••••••••"
                            className="h-10 rounded-lg text-[14px]"
                        />
                        <p className="text-[12px] text-muted-foreground">8+ characters, one uppercase, one number.</p>
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
                        <p className="text-sm text-destructive text-center" role="alert">{state.message}</p>
                    )}

                    <div className="pt-3">
                        <SubmitButton />
                    </div>
                </form>

                <p className="text-center text-[13px] text-muted-foreground mt-6">
                    Have an account?{" "}
                    <Link href="/login" className="text-foreground hover:text-accent transition-colors">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}


"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Orbit, Key } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[13px] tracking-widest uppercase font-bold" disabled={pending}>
            {pending ? "Authenticating..." : "Enter Workspace"}
        </Button>
    );
}

export default function LoginPage() {
    const [state, action] = useActionState(login, undefined);

    return (
        <div className="flex min-h-screen bg-background items-center justify-center p-6 selection:bg-accent selection:text-white">
            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/50 bg-background shadow-2xl overflow-hidden rounded-sm">

                {/* Visual Side */}
                <div className="hidden lg:block relative bg-[#E5E0D8]">
                    <img
                        src="https://images.unsplash.com/photo-1498409785341-5b4d38de758a?auto=format&fit=crop&q=80&w=1000"
                        alt="Workspace Focus"
                        className="object-cover w-full h-full grayscale-[0.4]"
                    />
                    <div className="absolute inset-0 bg-primary/20 mix-blend-overlay" />
                    <div className="absolute top-12 left-12 right-12 text-white">
                        <p className="text-[11px] tracking-[0.3em] uppercase font-bold mb-4 opacity-70">Access Portal</p>
                        <h2 className="text-5xl font-serif leading-tight">Welcome Back to <br /> Your Digital Space</h2>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 sm:p-16 flex flex-col justify-center">
                    <div className="mb-12">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-primary/5 mb-6">
                            <Orbit className="h-5 w-5 text-primary opacity-50" />
                        </div>
                        <h1 className="text-4xl font-serif mb-3 italic tracking-tight">System Login</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Resuming your sessions for intentional productivity and clarity.
                        </p>
                    </div>

                    <form action={action} className="space-y-10">
                        <div className="space-y-6">
                            {/* Email */}
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="your@email.com"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg"
                                />
                                {state?.errors?.email && (
                                    <p className="text-xs text-destructive">{state.errors.email}</p>
                                )}
                            </div>

                            {/* Password */}
                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Account Password</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg font-mono placeholder:font-sans"
                                />
                                {state?.errors?.password && (
                                    <p className="text-xs text-destructive">{state.errors.password}</p>
                                )}
                            </div>
                        </div>

                        {state?.message && (
                            <p className="text-sm text-destructive text-center p-3 bg-destructive/5 rounded-sm">{state.message}</p>
                        )}

                        <div className="space-y-6">
                            <SubmitButton />

                            <p className="text-center text-[11px] tracking-widest uppercase font-bold opacity-40">
                                New to the system?{" "}
                                <Link href="/register" className="text-accent underline-offset-4 hover:underline">
                                    Join Space
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

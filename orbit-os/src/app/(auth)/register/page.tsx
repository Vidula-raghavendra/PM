
"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { signup } from "@/app/actions/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowRight, Orbit } from "lucide-react";

function SubmitButton() {
    const { pending } = useFormStatus();

    return (
        <Button type="submit" className="w-full h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[13px] tracking-widest uppercase font-bold" disabled={pending}>
            {pending ? "Creating Space..." : "Begin Your Journey"}
        </Button>
    );
}

export default function RegisterPage() {
    const [state, action] = useActionState(signup, undefined);

    return (
        <div className="flex min-h-screen bg-background items-center justify-center p-6 selection:bg-accent selection:text-white">
            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/50 bg-background shadow-2xl overflow-hidden rounded-sm">

                {/* Visual Side */}
                <div className="hidden lg:block relative bg-[#F5F2ED]">
                    <img
                        src="https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=1000"
                        alt="Architectural Focus"
                        className="object-cover w-full h-full grayscale-[0.3]"
                    />
                    <div className="absolute inset-0 bg-accent/5 mix-blend-multiply" />
                    <div className="absolute top-12 left-12 right-12 text-white">
                        <p className="text-[11px] tracking-[0.3em] uppercase font-bold mb-4 opacity-70">Step 01 — Initiation</p>
                        <h2 className="text-5xl font-serif leading-tight">Architecture of <br /> Digital Focus</h2>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 sm:p-16 flex flex-col justify-center">
                    <div className="mb-12">
                        <div className="h-10 w-10 flex items-center justify-center rounded-full bg-accent/10 mb-6">
                            <Orbit className="h-5 w-5 text-accent" />
                        </div>
                        <h1 className="text-4xl font-serif mb-3 italic tracking-tight">Access the OS</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Create your personalized environment for project management and financial clarity.
                        </p>
                    </div>

                    <form action={action} className="space-y-8">
                        <div className="space-y-6">
                            {/* Name */}
                            <div className="space-y-2">
                                <Label htmlFor="name" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Identity</Label>
                                <Input
                                    id="name"
                                    name="name"
                                    type="text"
                                    placeholder="Enter your name"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg"
                                />
                                {state?.errors?.name && (
                                    <p className="text-xs text-destructive">{state.errors.name}</p>
                                )}
                            </div>

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
                                <Label htmlFor="password" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Secure Key</Label>
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="••••••••"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg font-mono placeholder:font-sans"
                                />
                                {state?.errors?.password && (
                                    <div className="text-xs text-destructive space-y-1 mt-1">
                                        <p className="font-semibold">Security Requirement:</p>
                                        <ul className="list-disc pl-4 space-y-0.5 opacity-80">
                                            {state.errors.password.map((error: string) => (
                                                <li key={error}>{error}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        {state?.message && (
                            <p className="text-sm text-destructive text-center p-3 bg-destructive/5 rounded-sm">{state.message}</p>
                        )}

                        <div className="space-y-6">
                            <SubmitButton />

                            <p className="text-center text-[11px] tracking-widest uppercase font-bold opacity-40">
                                Already a resident?{" "}
                                <Link href="/login" className="text-accent underline-offset-4 hover:underline">
                                    Sign In
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

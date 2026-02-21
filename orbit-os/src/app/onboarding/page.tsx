
"use client";

import { useActionState } from "react";
import { updateProfile } from "@/app/actions/user";
import { logout } from "@/app/actions/auth";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, UserCircle } from "lucide-react";

export default function OnboardingPage() {
    const [state, action, isPending] = useActionState(updateProfile, undefined);

    return (
        <div className="flex min-h-screen bg-background items-center justify-center p-6 selection:bg-accent selection:text-white">
            <div className="w-full max-w-[1000px] grid grid-cols-1 lg:grid-cols-2 gap-0 border border-border/50 bg-background shadow-2xl overflow-hidden rounded-sm">

                {/* Visual Side */}
                <div className="hidden lg:block relative bg-[#E5E0D8]">
                    <img
                        src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80&w=1000"
                        alt="Onboarding"
                        className="object-cover w-full h-full grayscale-[0.3]"
                    />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-multiply" />
                    <div className="absolute top-12 left-12 right-12 text-white">
                        <p className="text-[11px] tracking-[0.3em] uppercase font-bold mb-4 opacity-70">Step 02 — Configuration</p>
                        <h2 className="text-5xl font-serif leading-tight">Define Your <br /> Workspace Context</h2>
                    </div>
                </div>

                {/* Form Side */}
                <div className="p-8 sm:p-16 flex flex-col justify-center">
                    <div className="mb-12">
                        <UserCircle className="h-10 w-10 text-accent mb-6" />
                        <h1 className="text-4xl font-serif mb-3 italic">Personalize Orbit</h1>
                        <p className="text-muted-foreground leading-relaxed">
                            Tailor your dashboard by sharing a bit more about how you intend to use the OS.
                        </p>
                    </div>

                    <form action={action} className="space-y-8">
                        <div className="grid gap-6">
                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Direct Contact</Label>
                                <Input
                                    id="phone"
                                    name="phone"
                                    type="tel"
                                    placeholder="+1 (555) 000-0000"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg"
                                />
                                {state?.errors?.phone && (
                                    <p className="text-xs text-destructive">{state.errors.phone}</p>
                                )}
                            </div>

                            {/* Gender & Sector Row */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div className="space-y-2 text-left">
                                    <Label htmlFor="gender" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Identity</Label>
                                    <Select name="gender">
                                        <SelectTrigger id="gender" className="border-0 border-b border-border rounded-none px-0 focus:ring-0 shadow-none bg-transparent">
                                            <SelectValue placeholder="Select" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Male">Male</SelectItem>
                                            <SelectItem value="Female">Female</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                            <SelectItem value="Prefer not to say">N/A</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2 text-left">
                                    <Label htmlFor="sector" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Industry</Label>
                                    <Select name="sector">
                                        <SelectTrigger id="sector" className="border-0 border-b border-border rounded-none px-0 focus:ring-0 shadow-none bg-transparent">
                                            <SelectValue placeholder="Focus" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Technology">Technology</SelectItem>
                                            <SelectItem value="Finance">Finance / VC</SelectItem>
                                            <SelectItem value="Creative">Design / Creative</SelectItem>
                                            <SelectItem value="Education">Education</SelectItem>
                                            <SelectItem value="Other">External</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            {/* Purpose */}
                            <div className="space-y-2">
                                <Label htmlFor="purpose" className="text-[11px] tracking-widest uppercase font-bold opacity-50">Primary Utilization</Label>
                                <Input
                                    id="purpose"
                                    name="purpose"
                                    placeholder="e.g. Scaling Creative Projects"
                                    className="border-0 border-b border-border rounded-none px-0 focus-visible:ring-0 focus-visible:border-accent transition-all bg-transparent text-lg"
                                />
                                {state?.errors?.purpose && (
                                    <p className="text-xs text-destructive">{state.errors.purpose}</p>
                                )}
                            </div>
                        </div>

                        {state?.message && (
                            <p className="text-sm text-destructive text-center">{state.message}</p>
                        )}

                        <div className="flex flex-col gap-4 pt-4">
                            <Button type="submit" className="w-full h-14 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 text-[13px] tracking-widest uppercase font-bold" disabled={isPending}>
                                {isPending ? "Configuring..." : "Complete Setup"}
                            </Button>

                            <form action={logout}>
                                <Button variant="link" className="w-full text-[11px] tracking-widest uppercase font-bold opacity-40 hover:opacity-100 transition-opacity">
                                    Sign out
                                </Button>
                            </form>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

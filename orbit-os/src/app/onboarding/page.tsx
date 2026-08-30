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
import { ArrowRight } from "lucide-react";

export default function OnboardingPage() {
    const [state, action, isPending] = useActionState(updateProfile, undefined);

    return (
        <div className="flex min-h-screen bg-background items-center justify-center p-6 grain-overlay">
            {/* Ambient warmth — same as auth pages */}
            <div
                className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 -translate-y-1/4"
                style={{
                    width: "min(90vw, 900px)",
                    height: "min(90vw, 900px)",
                    background: "radial-gradient(circle, hsl(31 74% 53% / 0.06) 0%, transparent 70%)",
                    filter: "blur(40px)",
                }}
                aria-hidden="true"
            />

            <div className="w-full max-w-[480px] animate-page-rise relative">
                <div className="mb-10">
                    <p className="eyebrow text-muted-foreground mb-5">
                        Step 2 — Profile setup
                    </p>
                    <h1 className="text-display-md mb-3">
                        Personalize <em className="italic">Orbit</em>
                    </h1>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        Tell us a bit about yourself so we can set up your workspace.
                    </p>
                </div>

                <form action={action} className="space-y-6">
                    {/* Phone */}
                    <div className="space-y-1.5">
                        <Label htmlFor="phone" className="text-[13px] font-medium">Phone Number</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            placeholder="+1 (555) 000-0000"
                            className="h-[42px] rounded-xl text-[14px] bg-card/60 backdrop-blur-sm border-border/50"
                        />
                        {state?.errors?.phone && (
                            <p className="text-xs text-destructive">{state.errors.phone}</p>
                        )}
                    </div>

                    {/* Gender & Sector */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="gender" className="text-[13px] font-medium">Gender</Label>
                            <Select name="gender">
                                <SelectTrigger id="gender" className="h-[42px] rounded-xl bg-card/60 backdrop-blur-sm border-border/50">
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

                        <div className="space-y-1.5">
                            <Label htmlFor="sector" className="text-[13px] font-medium">Industry</Label>
                            <Select name="sector">
                                <SelectTrigger id="sector" className="h-[42px] rounded-xl bg-card/60 backdrop-blur-sm border-border/50">
                                    <SelectValue placeholder="Focus" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="Technology">Technology</SelectItem>
                                    <SelectItem value="Finance">Finance / VC</SelectItem>
                                    <SelectItem value="Creative">Design / Creative</SelectItem>
                                    <SelectItem value="Education">Education</SelectItem>
                                    <SelectItem value="Consulting">Consulting</SelectItem>
                                    <SelectItem value="Other">Other</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Purpose */}
                    <div className="space-y-1.5">
                        <Label htmlFor="purpose" className="text-[13px] font-medium">How will you use Orbit?</Label>
                        <Input
                            id="purpose"
                            name="purpose"
                            placeholder="e.g. Managing client projects"
                            className="h-[42px] rounded-xl text-[14px] bg-card/60 backdrop-blur-sm border-border/50"
                        />
                        {state?.errors?.purpose && (
                            <p className="text-xs text-destructive">{state.errors.purpose}</p>
                        )}
                    </div>

                    {state?.message && (
                        <p className="text-[13px] text-destructive text-center" role="alert">{state.message}</p>
                    )}

                    <div className="pt-2">
                        <Button
                            type="submit"
                            className="w-full h-12 rounded-full text-[13px] font-semibold"
                            disabled={isPending}
                        >
                            {isPending ? "Saving..." : "Complete Setup"}
                            {!isPending && <ArrowRight className="ml-2 h-4 w-4" strokeWidth={2} />}
                        </Button>
                    </div>
                </form>

                <form action={logout} className="mt-4">
                    <button
                        type="submit"
                        className="w-full text-center text-[13px] text-muted-foreground hover:text-foreground transition-colors duration-[100ms] py-2"
                    >
                        Sign out
                    </button>
                </form>
            </div>
        </div>
    );
}

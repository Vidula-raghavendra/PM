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

export default function OnboardingPage() {
    const [state, action, isPending] = useActionState(updateProfile, undefined);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Welcome to OrbitOS</CardTitle>
                        <CardDescription>
                            Let's get to know you better to personalize your experience.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={action} className="space-y-4">
                            {/* Phone */}
                            <div className="space-y-2">
                                <Label htmlFor="phone">Phone Number</Label>
                                <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+1 (555) 000-0000" />
                                {state?.errors?.phone && (
                                    <p className="text-sm text-red-500">{state.errors.phone}</p>
                                )}
                            </div>

                            {/* Gender */}
                            <div className="space-y-2">
                                <Label htmlFor="gender">Gender</Label>
                                <Select name="gender">
                                    <SelectTrigger id="gender">
                                        <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Male">Male</SelectItem>
                                        <SelectItem value="Female">Female</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                        <SelectItem value="Prefer not to say">Prefer not to say</SelectItem>
                                    </SelectContent>
                                </Select>
                                {state?.errors?.gender && (
                                    <p className="text-sm text-red-500">{state.errors.gender}</p>
                                )}
                            </div>

                            {/* Sector */}
                            <div className="space-y-2">
                                <Label htmlFor="sector">Sector</Label>
                                <Select name="sector">
                                    <SelectTrigger id="sector">
                                        <SelectValue placeholder="Select your industry" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Technology">Technology</SelectItem>
                                        <SelectItem value="Finance">Finance</SelectItem>
                                        <SelectItem value="Healthcare">Healthcare</SelectItem>
                                        <SelectItem value="Education">Education</SelectItem>
                                        <SelectItem value="Creative">Creative / Design</SelectItem>
                                        <SelectItem value="Other">Other</SelectItem>
                                    </SelectContent>
                                </Select>
                                {state?.errors?.sector && (
                                    <p className="text-sm text-red-500">{state.errors.sector}</p>
                                )}
                            </div>

                            {/* Purpose */}
                            <div className="space-y-2">
                                <Label htmlFor="purpose">Purpose of using OrbitOS</Label>
                                <Input id="purpose" name="purpose" autoComplete="on" placeholder="e.g. Project Management, Financial Tracking" />
                                {state?.errors?.purpose && (
                                    <p className="text-sm text-red-500">{state.errors.purpose}</p>
                                )}
                            </div>

                            {state?.message && (
                                <p className="text-sm text-red-500 text-center">{state.message}</p>
                            )}

                            <Button type="submit" className="w-full" disabled={isPending}>
                                {isPending ? "Saving..." : "Complete Setup"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <form action={logout}>
                        <Button variant="link" className="text-muted-foreground">
                            Sign out and try again
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}

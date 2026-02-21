"use client";

import { useActionState, useState, useEffect } from "react";
import { logTime } from "@/app/actions/dashboard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface Project {
    id: string;
    title: string;
}

export function DailyLogWidget({ projects }: { projects: Project[] }) {
    const [state, action, isPending] = useActionState(logTime, undefined);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedSeconds, setElapsedSeconds] = useState(0);
    const [durationMinutes, setDurationMinutes] = useState("");

    // Timer logic
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isTracking && startTime) {
            interval = setInterval(() => {
                const now = Date.now();
                setElapsedSeconds(Math.floor((now - startTime) / 1000));
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTracking, startTime]);

    const handleToggleTimer = () => {
        if (isTracking) {
            // Stop logic
            setIsTracking(false);
            const minutes = Math.ceil(elapsedSeconds / 60);
            setDurationMinutes(minutes.toString());
            setStartTime(null);
        } else {
            // Start logic
            setStartTime(Date.now());
            setElapsedSeconds(0);
            setIsTracking(true);
        }
    };

    const formatTime = (seconds: number) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Daily Log</CardTitle>
                <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <form action={action} className="space-y-3">
                    <div className="space-y-1">
                        <Select name="projectId" required disabled={isTracking}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select Project" />
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((p) => (
                                    <SelectItem key={p.id} value={p.id}>
                                        {p.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {state?.errors?.projectId && (
                            <p className="text-xs text-red-500">{state.errors.projectId}</p>
                        )}
                    </div>

                    {/* Timer Display */}
                    <div className="flex flex-col items-center py-2 space-y-2">
                        <div className="text-3xl font-mono font-bold text-primary">
                            {formatTime(elapsedSeconds)}
                        </div>
                        <Button
                            type="button"
                            variant={isTracking ? "destructive" : "default"}
                            className="w-full"
                            onClick={handleToggleTimer}
                        >
                            {isTracking ? "Stop Timer" : "Start Timer"}
                        </Button>
                    </div>

                    <div className="flex gap-2">
                        <div className="flex-1">
                            <Input
                                name="duration"
                                type="number"
                                placeholder="Mins"
                                min="1"
                                required
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                readOnly={isTracking}
                            />
                        </div>
                        <div className="flex-[2]">
                            <Input name="description" placeholder="Description (optional)" />
                        </div>
                    </div>
                    {state?.errors?.duration && (
                        <p className="text-xs text-red-500">{state.errors.duration}</p>
                    )}

                    <Button size="sm" type="submit" className="w-full" disabled={isPending || isTracking}>
                        {isPending ? "Logging..." : "Log Time"}
                    </Button>

                    {state?.message && (
                        <p className="text-xs text-green-600 text-center">{state.message}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

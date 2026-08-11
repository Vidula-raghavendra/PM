"use client";

import { useActionState, useState, useEffect, memo } from "react";
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

function formatTime(seconds: number) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
}

const TimerDisplay = memo(function TimerDisplay({ startTime, isTracking }: { startTime: number | null; isTracking: boolean }) {
    const [elapsed, setElapsed] = useState(0);

    useEffect(() => {
        if (!isTracking || !startTime) {
            setElapsed(0);
            return;
        }
        const interval = setInterval(() => {
            setElapsed(Math.floor((Date.now() - startTime) / 1000));
        }, 1000);
        return () => clearInterval(interval);
    }, [isTracking, startTime]);

    return (
        <div className="text-3xl font-mono font-bold text-primary" aria-live="off" aria-label={`Timer: ${formatTime(elapsed)}`}>
            {formatTime(elapsed)}
        </div>
    );
});

export function DailyLogWidget({ projects }: { projects: Project[] }) {
    const [state, action, isPending] = useActionState(logTime, undefined);
    const [isTracking, setIsTracking] = useState(false);
    const [startTime, setStartTime] = useState<number | null>(null);
    const [durationMinutes, setDurationMinutes] = useState("");

    const handleToggleTimer = () => {
        if (isTracking && startTime) {
            setIsTracking(false);
            const elapsed = Math.floor((Date.now() - startTime) / 1000);
            const minutes = Math.ceil(elapsed / 60);
            setDurationMinutes(minutes.toString());
            setStartTime(null);
        } else {
            setStartTime(Date.now());
            setIsTracking(true);
        }
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
                            <SelectTrigger aria-label="Select project">
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
                            <p className="text-xs text-destructive" role="alert">{state.errors.projectId}</p>
                        )}
                    </div>

                    <div className="flex flex-col items-center py-2 space-y-2">
                        <TimerDisplay startTime={startTime} isTracking={isTracking} />
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
                                aria-label="Duration in minutes"
                                value={durationMinutes}
                                onChange={(e) => setDurationMinutes(e.target.value)}
                                readOnly={isTracking}
                            />
                        </div>
                        <div className="flex-[2]">
                            <Input name="description" placeholder="Description (optional)" aria-label="Time log description" />
                        </div>
                    </div>
                    {state?.errors?.duration && (
                        <p className="text-xs text-destructive" role="alert">{state.errors.duration}</p>
                    )}

                    <Button size="sm" type="submit" className="w-full" disabled={isPending || isTracking}>
                        {isPending ? "Logging..." : "Log Time"}
                    </Button>

                    {state?.message && (
                        <p className="text-xs text-accent text-center" role="status">{state.message}</p>
                    )}
                </form>
            </CardContent>
        </Card>
    );
}

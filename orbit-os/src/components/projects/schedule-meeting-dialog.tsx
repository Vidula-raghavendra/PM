"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarPlus } from "lucide-react";
import { scheduleMeeting } from "@/app/actions/meetings";
import type { Collaborator } from "@/lib/mappers";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Scheduling..." : "Schedule Meeting"}
        </Button>
    );
}

export function ScheduleMeetingDialog({
    projectId,
    collaborators,
}: {
    projectId: string;
    collaborators: Collaborator[];
}) {
    const [state, action] = useActionState(scheduleMeeting, undefined);
    const [open, setOpen] = useState(false);
    const [selectedEmails, setSelectedEmails] = useState<string[]>([]);

    if (state?.success && open) {
        setOpen(false);
    }

    const toggleEmail = (email: string) => {
        setSelectedEmails(prev =>
            prev.includes(email) ? prev.filter(e => e !== email) : [...prev, email]
        );
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <CalendarPlus className="h-4 w-4 mr-2" /> Schedule Meeting
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Schedule a Meeting</DialogTitle>
                    <DialogDescription>
                        Set up a meeting and notify collaborators.
                    </DialogDescription>
                </DialogHeader>
                <form action={action} className="space-y-4">
                    <input type="hidden" name="projectId" value={projectId} />
                    <input type="hidden" name="attendees" value={JSON.stringify(selectedEmails)} />

                    <div className="space-y-2">
                        <Label htmlFor="meeting-title">Title</Label>
                        <Input id="meeting-title" name="title" placeholder="e.g. Weekly Sync" required />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meeting-desc">Description</Label>
                        <Input id="meeting-desc" name="description" placeholder="Agenda or notes (optional)" />
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                            <Label htmlFor="meeting-date">Date</Label>
                            <Input id="meeting-date" name="date" type="date" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meeting-start">Start</Label>
                            <Input id="meeting-start" name="startTime" type="time" required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="meeting-end">End</Label>
                            <Input id="meeting-end" name="endTime" type="time" required />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="meeting-link">Meeting Link (optional)</Label>
                        <Input id="meeting-link" name="meetingLink" type="url" placeholder="https://meet.google.com/..." />
                    </div>

                    {/* Attendee selection */}
                    {collaborators.length > 0 && (
                        <div className="space-y-2">
                            <Label>Invite Collaborators</Label>
                            <div className="flex flex-wrap gap-2">
                                {collaborators.map((c) => {
                                    const isSelected = selectedEmails.includes(c.email);
                                    return (
                                        <button
                                            key={c.id}
                                            type="button"
                                            onClick={() => toggleEmail(c.email)}
                                            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${
                                                isSelected
                                                    ? "border-primary bg-primary/10 text-primary"
                                                    : "border-border bg-background text-muted-foreground hover:bg-muted"
                                            }`}
                                        >
                                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                                            {c.user?.fullName || c.email}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {state?.message && (
                        <p className="text-sm text-destructive">{state.message}</p>
                    )}

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}

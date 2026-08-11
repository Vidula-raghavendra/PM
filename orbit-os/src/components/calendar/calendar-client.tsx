"use client";

import { useState, useTransition, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
    format,
    startOfMonth,
    endOfMonth,
    startOfWeek,
    endOfWeek,
    eachDayOfInterval,
    isSameMonth,
    isSameDay,
    addMonths,
    subMonths,
    isToday,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { CalendarEvent, createEvent } from "@/app/actions/calendar";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface CalendarClientProps {
    initialDate: Date;
    events: CalendarEvent[];
}

export function CalendarClient({ initialDate, events }: CalendarClientProps) {
    const router = useRouter();
    const [currentDate, setCurrentDate] = useState(initialDate);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isPending, startTransition] = useTransition();

    const handlePrevMonth = () => {
        const newDate = subMonths(currentDate, 1);
        setCurrentDate(newDate);
        router.push(`/dashboard/calendar?date=${format(newDate, "yyyy-MM-dd")}`);
    };

    const handleNextMonth = () => {
        const newDate = addMonths(currentDate, 1);
        setCurrentDate(newDate);
        router.push(`/dashboard/calendar?date=${format(newDate, "yyyy-MM-dd")}`);
    };

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
        setIsDialogOpen(true);
    };

    const handleDayKeyDown = useCallback((e: React.KeyboardEvent, date: Date) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleDateClick(date);
        }
    }, []);

    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const calendarDays = eachDayOfInterval({
        start: startDate,
        end: endDate,
    });

    const getDayEvents = (date: Date) => {
        return events.filter((event) =>
            isSameDay(event.start, date) ||
            (event.start <= date && event.end >= date)
        );
    };

    const getEventColor = (type: string) => {
        switch (type) {
            case "PROJECT": return "bg-primary/10 text-primary border-primary/20";
            case "MILESTONE": return "bg-accent/10 text-accent border-accent/20";
            case "TASK": return "bg-secondary text-secondary-foreground border-border";
            case "EVENT": return "bg-muted text-muted-foreground border-border";
            default: return "bg-muted text-muted-foreground";
        }
    };

    async function handleCreateEvent(formData: FormData) {
        if (!selectedDate) return;

        startTransition(async () => {
            const result = await createEvent(null, formData);
            if (result?.message === "Event created successfully") {
                setIsDialogOpen(false);
                router.refresh();
            }
        });
    }

    return (
        <div className="flex flex-col h-[calc(100vh-120px)]">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        {format(currentDate, "MMMM yyyy")}
                    </h2>
                    <div className="flex items-center rounded-md border bg-background shadow-sm">
                        <Button variant="ghost" size="icon" onClick={handlePrevMonth} className="h-8 w-8" aria-label="Previous month">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={handleNextMonth} className="h-8 w-8" aria-label="Next month">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <Button onClick={() => { setSelectedDate(new Date()); setIsDialogOpen(true); }}>
                        <Plus className="mr-2 h-4 w-4" /> New Event
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden border shadow-sm flex-1" role="grid" aria-label="Calendar">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="bg-muted/50 p-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider" role="columnheader">
                        {day}
                    </div>
                ))}
                {calendarDays.map((day) => {
                    const dayEvents = getDayEvents(day);
                    return (
                        <div
                            key={day.toString()}
                            role="gridcell"
                            tabIndex={0}
                            aria-label={`${format(day, "PPPP")}${dayEvents.length > 0 ? `, ${dayEvents.length} event${dayEvents.length > 1 ? 's' : ''}` : ''}`}
                            className={cn(
                                "bg-background p-2 min-h-[100px] flex flex-col gap-1 cursor-pointer hover:bg-accent/50 transition-colors relative group focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset focus-visible:outline-none",
                                !isSameMonth(day, monthStart) && "text-muted-foreground bg-muted/10",
                                isToday(day) && "bg-accent/20"
                            )}
                            onClick={() => handleDateClick(day)}
                            onKeyDown={(e) => handleDayKeyDown(e, day)}
                        >
                            <div className={cn(
                                "text-sm font-medium w-6 h-6 flex items-center justify-center rounded-full",
                                isToday(day) && "bg-primary text-primary-foreground"
                            )}>
                                {format(day, "d")}
                            </div>

                            <div className="flex-1 flex flex-col gap-1 overflow-y-auto max-h-[100px] no-scrollbar">
                                {dayEvents.map((event) => (
                                    <Popover key={event.id}>
                                        <PopoverTrigger asChild>
                                            <div
                                                onClick={(e) => e.stopPropagation()}
                                                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); e.stopPropagation(); } }}
                                                role="button"
                                                tabIndex={0}
                                                aria-label={`Event: ${event.title}`}
                                                className={cn(
                                                    "text-xs px-1.5 py-0.5 rounded border truncate cursor-pointer",
                                                    getEventColor(event.type)
                                                )}
                                            >
                                                {event.title}
                                            </div>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-80 p-3" align="start">
                                            <div className="space-y-2">
                                                <h4 className="font-medium leading-none">{event.title}</h4>
                                                <div className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <CalendarIcon className="h-3 w-3" />
                                                    {format(event.start, "PPP")}
                                                </div>
                                                {event.projectName && (
                                                    <div className="text-xs font-medium bg-secondary/50 px-1.5 py-0.5 rounded w-fit">
                                                        {event.projectName}
                                                    </div>
                                                )}
                                                {event.status && (
                                                    <div className="text-xs text-muted-foreground">
                                                        Status: {event.status}
                                                    </div>
                                                )}
                                            </div>
                                        </PopoverContent>
                                    </Popover>
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Event</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreateEvent} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Event Title</Label>
                            <Input id="title" name="title" required placeholder="Meeting with Client" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select name="type" defaultValue="MEETING">
                                    <SelectTrigger id="type">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="MEETING">Meeting</SelectItem>
                                        <SelectItem value="CALL">Call</SelectItem>
                                        <SelectItem value="DEADLINE">Deadline</SelectItem>
                                        <SelectItem value="BLOCK">Block</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="projectId">Project (Optional)</Label>
                                <Input id="projectId" name="projectId" placeholder="Project ID" />
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="startTime">Start Time</Label>
                                <Input
                                    id="startTime"
                                    name="startTime"
                                    type="datetime-local"
                                    defaultValue={selectedDate ? `${format(selectedDate, "yyyy-MM-dd")}T09:00` : ""}
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="endTime">End Time</Label>
                                <Input
                                    id="endTime"
                                    name="endTime"
                                    type="datetime-local"
                                    defaultValue={selectedDate ? `${format(selectedDate, "yyyy-MM-dd")}T10:00` : ""}
                                    required
                                />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" placeholder="Details..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit" disabled={isPending}>{isPending ? "Creating..." : "Create Event"}</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

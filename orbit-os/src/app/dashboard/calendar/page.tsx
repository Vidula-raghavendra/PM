import { CalendarClient } from "@/components/calendar/calendar-client";
import { getCalendarEvents } from "@/app/actions/calendar";
import { parseISO } from "date-fns";

export default async function CalendarPage({
    searchParams,
}: {
    searchParams: Promise<{ date?: string }>;
}) {
    const params = await searchParams;
    const initialDate = params.date ? parseISO(params.date) : new Date();

    // Validate date if parsing fails
    const validatedDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

    const events = await getCalendarEvents(validatedDate);

    return (
        <div className="h-full flex flex-col space-y-4">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Calendar</h1>
            </div>

            <CalendarClient initialDate={validatedDate} events={events} />
        </div>
    );
}

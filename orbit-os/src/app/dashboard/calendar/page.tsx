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

    const validatedDate = isNaN(initialDate.getTime()) ? new Date() : initialDate;

    const events = await getCalendarEvents(validatedDate);

    return (
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div>
                <p className="text-overline uppercase text-muted-foreground mb-3">Schedule</p>
                <h2 className="font-serif text-display-md">Calendar</h2>
            </div>

            <CalendarClient initialDate={validatedDate} events={events} />
        </div>
    );
}

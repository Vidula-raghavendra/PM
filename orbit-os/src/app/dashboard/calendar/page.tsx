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
        <div className="mx-auto max-w-[1200px] animate-page-rise space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            <div>
                <p className="eyebrow mb-2 text-accent-ink">Schedule</p>
                <h2 className="font-display text-[32px] font-medium italic leading-[1.15] tracking-[-0.01em]">Calendar</h2>
            </div>

            <CalendarClient initialDate={validatedDate} events={events} />
        </div>
    );
}

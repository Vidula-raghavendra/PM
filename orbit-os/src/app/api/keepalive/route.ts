import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabaseClient";

// Supabase pauses free-tier projects after 7 days without database activity,
// and recovering from a pause needs a manual restore in the dashboard. A
// scheduled real query keeps the project awake. See vercel.json for the cron.
//
// This must hit Postgres to count — pinging a cached page or the API gateway
// does not register as activity.
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
    const secret = process.env.CRON_SECRET;

    // Vercel signs cron invocations with CRON_SECRET. Without this the route
    // would be a public endpoint anyone could hammer.
    if (secret && request.headers.get("authorization") !== `Bearer ${secret}`) {
        return new NextResponse("Unauthorized", { status: 401 });
    }

    try {
        const supabase = createAdminClient();
        const { error } = await supabase
            .from("profiles")
            .select("id", { count: "exact", head: true });

        if (error) {
            return NextResponse.json(
                { ok: false, error: error.message },
                { status: 500 }
            );
        }

        return NextResponse.json({ ok: true, at: new Date().toISOString() });
    } catch (e) {
        const message = e instanceof Error ? e.message : "Unknown error";
        return NextResponse.json({ ok: false, error: message }, { status: 500 });
    }
}

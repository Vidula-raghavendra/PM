import { Card } from "@/components/ui/card";
import { Clock } from "lucide-react";

import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";

async function getTimeLogs() {
    const userId = await requireUser();
    return await DashboardService.getRecentTimeLogs(userId);
}

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

export default async function TimePage() {
    const logs = await getTimeLogs();

    return (
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div>
                <p className="text-overline uppercase text-muted-foreground mb-3">Time</p>
                <h2 className="font-serif text-display-md">Time Tracking</h2>
            </div>

            <Card>
                {logs.length === 0 ? (
                    <div className="text-center px-6 py-16">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                            <Clock className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                        </div>
                        <h3 className="font-serif text-display-sm mb-2">No time logged</h3>
                        <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
                            Start a timer from the dashboard to track your work hours.
                        </p>
                    </div>
                ) : (
                    <div>
                        {/* Table header */}
                        <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 border-b text-overline uppercase text-muted-foreground">
                            <span>Description</span>
                            <span className="text-right">Duration</span>
                            <span className="text-right w-24">Date</span>
                        </div>
                        {logs.map((log) => (
                            <div key={log.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-3.5 border-b last:border-0 hover:bg-secondary/50 transition-colors duration-[100ms]">
                                <div>
                                    <p className="text-[15px] font-medium">{log.description || "No description"}</p>
                                    <p className="text-[13px] text-muted-foreground">{log.project?.title ?? "Unknown project"}</p>
                                </div>
                                <span className="font-serif text-[15px] tabular-nums text-right">
                                    {formatDuration(log.duration)}
                                </span>
                                <span className="text-[13px] text-muted-foreground tabular-nums text-right w-24">
                                    {log.startTime?.toLocaleDateString() ?? "—"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}

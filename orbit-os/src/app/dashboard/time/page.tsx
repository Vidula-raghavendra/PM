import { StatCard } from "@/components/dashboard/stat-card";
import {
    PageShell,
    PageHeader,
    Panel,
    EmptyState,
    DataTable,
    DataRow,
} from "@/components/dashboard/page-shell";

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

    const totalMinutes = logs.reduce((sum, l) => sum + (l.duration || 0), 0);
    const sessions = logs.length;
    const avgMinutes = sessions > 0 ? Math.round(totalMinutes / sessions) : 0;

    return (
        <PageShell>
            <PageHeader eyebrow="Time" title="Time Tracking" />

            <div className="grid gap-4 sm:grid-cols-3 stagger-children">
                <StatCard
                    label="Total Logged"
                    value={formatDuration(totalMinutes)}
                    caption="Across all projects"
                    fill={Math.min(Math.round(totalMinutes / 60), 100)}
                    tone="info"
                />
                <StatCard
                    label="Sessions"
                    value={sessions}
                    caption="Recent entries"
                    fill={Math.min(sessions * 2, 100)}
                    tone="accent"
                />
                <StatCard
                    label="Average Session"
                    value={formatDuration(avgMinutes)}
                    caption="Per entry"
                    fill={Math.min(avgMinutes, 100)}
                    tone="success"
                />
            </div>

            <Panel title="Recent activity">
                {logs.length === 0 ? (
                    <EmptyState
                        title="No time logged"
                        description="Start a timer from the dashboard to track your work hours."
                    />
                ) : (
                    <DataTable
                        columns={[
                            { label: "Description" },
                            { label: "Duration", className: "text-right" },
                            { label: "Date", className: "w-24 text-right" },
                        ]}
                    >
                        {logs.map((log) => (
                            <DataRow key={log.id}>
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-medium">
                                        {log.description || "No description"}
                                    </p>
                                    <p className="truncate text-[12px] text-muted-foreground">
                                        {log.project?.title ?? "Unknown project"}
                                    </p>
                                </div>
                                <span className="text-right text-[14px] font-semibold tabular-nums">
                                    {formatDuration(log.duration)}
                                </span>
                                <span className="w-24 text-right text-[12px] tabular-nums text-muted-foreground">
                                    {log.startTime?.toLocaleDateString() ?? "—"}
                                </span>
                            </DataRow>
                        ))}
                    </DataTable>
                )}
            </Panel>
        </PageShell>
    );
}

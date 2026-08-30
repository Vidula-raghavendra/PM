import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";
import { Activity } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { DailyLogWidget } from "@/components/dashboard/daily-log";
import { NextTaskWidget } from "@/components/dashboard/next-task";
import { StatCard } from "@/components/dashboard/stat-card";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { RevenueDonut } from "@/components/dashboard/revenue-donut";

async function getDashboardData() {
    const userId = await requireUser();

    const [stats, activeProjectList, nextTask, timeStats, revenue] = await Promise.all([
        DashboardService.getStats(userId),
        DashboardService.getActiveProjects(userId),
        DashboardService.getNextTask(userId),
        DashboardService.getTimeLogs(userId),
        DashboardService.getRevenueBreakdown(userId),
    ]);

    return {
        totalRevenue: stats.revenueNum,
        pendingRevenue: stats.pendingRevenueNum,
        activeProjects: stats.activeProjects,
        totalMilestones: stats.totalMilestones,
        paidMilestones: stats.paidMilestones,
        openMilestones: stats.openMilestones,
        totalHours: Math.round(Number(timeStats._sum.duration || 0) / 60),
        activeProjectList,
        nextTask,
        revenue,
    };
}

/** Month-over-month change from the trailing series, or null if there is
 *  nothing meaningful to compare against yet. */
function monthDelta(series: { value: number }[]) {
    if (series.length < 2) return null;
    const current = series[series.length - 1].value;
    const previous = series[series.length - 2].value;
    if (previous === 0) return current > 0 ? 100 : null;
    return Math.round(((current - previous) / previous) * 100);
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (!data) return <div>Please log in</div>;

    const pct = (part: number, whole: number) =>
        whole > 0 ? Math.round((part / whole) * 100) : 0;

    return (
        <div className="mx-auto max-w-[1200px] animate-page-rise space-y-6 px-5 py-6 sm:px-8 sm:py-8">
            {/* Page heading */}
            <div>
                <p className="eyebrow mb-2 text-accent-ink">Overview</p>
                <h2 className="font-display text-[32px] font-medium italic leading-[1.15] tracking-[-0.01em]">Welcome back</h2>
            </div>

            {/* KPI row */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
                <StatCard
                    label="Total Milestones"
                    value={data.totalMilestones}
                    caption={`${data.paidMilestones} paid`}
                    fill={pct(data.paidMilestones, data.totalMilestones)}
                    tone="accent"
                />
                <StatCard
                    label="Revenue"
                    value={formatMoney(data.totalRevenue)}
                    caption="Paid milestones, all time"
                    delta={monthDelta(data.revenue.series)}
                    fill={pct(
                        data.totalRevenue,
                        data.totalRevenue + data.pendingRevenue
                    )}
                    tone="success"
                />
                <StatCard
                    label="Time Logged"
                    value={`${data.totalHours}h`}
                    caption="Total tracked"
                    fill={Math.min(data.totalHours, 100)}
                    tone="info"
                />
                <StatCard
                    label="Open Invoices"
                    value={data.openMilestones}
                    caption={formatMoney(data.pendingRevenue) + " outstanding"}
                    fill={pct(data.openMilestones, data.totalMilestones)}
                    tone="accent"
                />
            </div>

            {/* Charts */}
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
                <RevenueChart series={data.revenue.series} />
                <RevenueDonut
                    breakdown={data.revenue.breakdown}
                    total={data.revenue.total}
                />
            </div>

            {/* Secondary content */}
            <div className="grid gap-4 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <NextTaskWidget task={data.nextTask as any} />
                </div>

                <div className="lg:col-span-1">
                    <DailyLogWidget projects={data.activeProjectList} />
                </div>

                <div className="lg:col-span-1">
                    <div className="surface-card flex h-full min-h-[280px] flex-col items-center justify-center p-6 text-center">
                        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-[hsl(var(--background-alt))] ring-1 ring-border">
                            <Activity className="h-5 w-5 text-accent-ink" strokeWidth={1.75} />
                        </div>
                        <h3 className="mb-2 text-[16px] font-semibold tracking-[-0.01em]">
                            Activity feed
                        </h3>
                        <p className="mx-auto max-w-[240px] text-[13px] leading-[1.6] text-muted-foreground">
                            Your recent project activity will appear here as you work.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

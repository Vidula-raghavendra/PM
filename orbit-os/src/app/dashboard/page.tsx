import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Wallet, FolderOpen, Clock, Activity } from "lucide-react";
import { formatMoney } from "@/lib/utils";
import { DailyLogWidget } from "@/components/dashboard/daily-log";
import { NextTaskWidget } from "@/components/dashboard/next-task";

async function getDashboardData() {
    const userId = await requireUser();

    const [stats, activeProjectList, nextTask, timeStats] = await Promise.all([
        DashboardService.getStats(userId),
        DashboardService.getActiveProjects(userId),
        DashboardService.getNextTask(userId),
        DashboardService.getTimeLogs(userId)
    ]);

    return {
        totalRevenue: stats.revenueNum,
        activeProjects: stats.activeProjects,
        totalHours: Math.round(Number(timeStats._sum.duration || 0) / 60),
        activeProjectList,
        nextTask
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    if (!data) return <div>Please log in</div>;

    return (
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            {/* Page heading */}
            <div>
                <p className="text-overline uppercase text-muted-foreground mb-3">Overview</p>
                <h2 className="font-serif text-display-md">Welcome back</h2>
            </div>

            {/* Stat cards — design system §5.3 */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Total Revenue</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Wallet className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-stat tabular-nums">{formatMoney(data.totalRevenue)}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">All time</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Active Projects</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <FolderOpen className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-stat tabular-nums">{data.activeProjects}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">In progress</p>
                </Card>

                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Hours Logged</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Clock className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-stat tabular-nums">{data.totalHours}h</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Total tracked</p>
                </Card>

                <NextTaskWidget task={data.nextTask as any} />
            </div>

            {/* Secondary content */}
            <div className="grid gap-8 lg:grid-cols-7">
                <div className="lg:col-span-3">
                    <p className="text-overline uppercase text-muted-foreground mb-4">Time Tracking</p>
                    <DailyLogWidget projects={data.activeProjectList} />
                </div>

                <div className="lg:col-span-4">
                    <p className="text-overline uppercase text-muted-foreground mb-4">Recent Activity</p>
                    <Card className="min-h-[360px] flex flex-col items-center justify-center">
                        <div className="text-center px-6 py-16">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                                <Activity className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-display-sm mb-2">Activity feed</h3>
                            <p className="text-[13px] text-muted-foreground max-w-[240px] mx-auto">
                                Your recent project activity will appear here as you work.
                            </p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}

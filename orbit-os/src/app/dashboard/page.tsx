import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Briefcase, Clock, Activity } from "lucide-react";
import Link from "next/link";
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
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>

            {/* Stats Row */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">Lifetime earnings</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">Currently in progress</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalHours}h</div>
                        <p className="text-xs text-muted-foreground">Total work time</p>
                    </CardContent>
                </Card>

                {/* Next Task Widget (Replaces Quick Actions/Recent) */}
                <div className="col-span-1">
                    <NextTaskWidget task={data.nextTask as any} />
                </div>
            </div>

            {/* Main Content Area */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                {/* Daily Log Widget - Prominent */}
                <div className="col-span-3">
                    <DailyLogWidget projects={data.activeProjectList} />
                </div>

                {/* Maybe keep recent projects or something else here? 
                    User asked to replace recent project with next task. 
                    I put next task in the top row. 
                    Let's put a "Calendar Snapshot" or something here later.
                    For now, I will leave it empty or show a placeholder.
                */}
                <div className="col-span-4">
                    <Card className="h-full">
                        <CardHeader>
                            <CardTitle>Project Activity</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">
                                Activity feed coming soon.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

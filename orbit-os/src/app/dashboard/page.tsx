import { requireUser } from "@/auth/guard";
import { DashboardService } from "@/services/dashboard.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
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
        <div className="space-y-12 max-w-[1400px] mx-auto py-8">
            <div className="flex flex-col gap-2">
                <p className="text-[11px] tracking-[0.4em] uppercase font-bold opacity-30">Pulse Overview</p>
                <h2 className="text-5xl font-serif leading-tight">Welcome to <br /> Your Command Space</h2>
            </div>

            {/* Stats Grid */}
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                <Card className="border-border/30 bg-[#FBF9F6] shadow-none group hover:bg-[#F5F2ED] transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] tracking-widest uppercase font-bold opacity-50">Liquidity / Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif tracking-tight">₹{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground mt-2 opacity-50">Lifetime Accumulation</p>
                    </CardContent>
                </Card>

                <Card className="border-border/30 bg-[#FBF9F6] shadow-none group hover:bg-[#F5F2ED] transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] tracking-widest uppercase font-bold opacity-50">Active Contexts</CardTitle>
                        <Briefcase className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif tracking-tight">{data.activeProjects}</div>
                        <p className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground mt-2 opacity-50">Current Iterations</p>
                    </CardContent>
                </Card>

                <Card className="border-border/30 bg-[#FBF9F6] shadow-none group hover:bg-[#F5F2ED] transition-all duration-500">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-[11px] tracking-widest uppercase font-bold opacity-50">Effort Logged</CardTitle>
                        <Clock className="h-4 w-4 text-accent transition-transform group-hover:scale-110" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-4xl font-serif tracking-tight">{data.totalHours}h</div>
                        <p className="text-[10px] tracking-widest uppercase font-bold text-muted-foreground mt-2 opacity-50">Total Temporal Input</p>
                    </CardContent>
                </Card>

                <div className="col-span-1">
                    <NextTaskWidget task={data.nextTask as any} />
                </div>
            </div>

            {/* Content Secondary */}
            <div className="grid gap-12 lg:grid-cols-7">
                <div className="lg:col-span-3">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-[11px] tracking-[0.2em] uppercase font-bold opacity-30">Temporal Pulse</p>
                    </div>
                    <DailyLogWidget projects={data.activeProjectList} />
                </div>

                <div className="lg:col-span-4">
                    <div className="flex justify-between items-center mb-6">
                        <p className="text-[11px] tracking-[0.2em] uppercase font-bold opacity-30">Ambient Activity</p>
                    </div>
                    <Card className="h-[400px] border-border/30 bg-[#FBF9F6] shadow-none relative overflow-hidden flex flex-col items-center justify-center">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-accent/30 to-transparent" />
                        <CardHeader className="text-center group">
                            <CardTitle className="font-serif italic text-2xl group-hover:text-accent transition-colors">Visualizing Inertia</CardTitle>
                            <CardDescription className="max-w-[200px] mx-auto tracking-tight">Active activity streams will congregate here.</CardDescription>
                        </CardHeader>
                        <CardContent className="mt-8 flex gap-4 opacity-10">
                            {[1, 2, 3, 4].map(i => <div key={i} className="w-1.5 h-16 bg-primary rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />)}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

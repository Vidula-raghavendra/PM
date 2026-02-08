
import { decrypt } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, Briefcase, Clock, Activity } from "lucide-react";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

async function getDashboardData() {
    const session = await decrypt((await cookies()).get("session")?.value);
    if (!session?.userId) return null;

    const userId = session.userId as string;

    const [
        totalRevenueResult,
        activeProjectsCount,
        timeLogsResult,
        recentProjects
    ] = await Promise.all([
        prisma.milestone.aggregate({
            where: { project: { userId }, status: "PAID" },
            _sum: { amount: true }
        }),
        prisma.project.count({
            where: { userId, status: "ACTIVE" }
        }),
        prisma.timeLog.aggregate({
            where: { userId },
            _sum: { duration: true }
        }),
        prisma.project.findMany({
            where: { userId },
            take: 5,
            orderBy: { updatedAt: "desc" },
            include: { tasks: true }
        })
    ]);

    return {
        totalRevenue: totalRevenueResult._sum.amount || 0,
        activeProjects: activeProjectsCount,
        totalHours: Math.round((timeLogsResult._sum.duration || 0) / 60),
        recentProjects
    };
}

export default async function DashboardPage() {
    const data = await getDashboardData();

    // Minimal fallback if session fails or DB error (though getDashboardData handles null session)
    if (!data) return <div>Please log in</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground">
                            Lifetime earnings
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
                        <Briefcase className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.activeProjects}</div>
                        <p className="text-xs text-muted-foreground">
                            Currently in progress
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                        <Clock className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{data.totalHours}h</div>
                        <p className="text-xs text-muted-foreground">
                            Total work time
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Quick Actions</CardTitle>
                        <Activity className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent className="flex gap-2">
                        <Link href="/dashboard/projects/new" className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded hover:bg-primary/90">
                            New Project
                        </Link>
                        <Link href="/dashboard/time" className="text-xs bg-secondary text-secondary-foreground px-2 py-1 rounded hover:bg-secondary/80">
                            Log Time
                        </Link>
                    </CardContent>
                </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>Recent Projects</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {data.recentProjects.length === 0 ? (
                                <p className="text-sm text-muted-foreground">No projects yet.</p>
                            ) : (
                                data.recentProjects.map(project => (
                                    <div key={project.id} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="font-medium">{project.title}</div>
                                            {project.client && <span className="text-muted-foreground">- {project.client}</span>}
                                        </div>
                                        <div className="text-muted-foreground">{new Date(project.updatedAt).toLocaleDateString()}</div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

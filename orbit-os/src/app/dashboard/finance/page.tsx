

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IndianRupee, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";

import { requireUser } from "@/auth/guard";
import { FinanceService } from "@/services/finance.service";

async function getFinanceData() {
    const userId = await requireUser();

    const milestones = await FinanceService.getMilestones(userId);

    const totalRevenue = milestones
        .filter((m: any) => m.status === "PAID")
        .reduce((acc: number, m: any) => acc + m.amount, 0);

    const pendingRevenue = milestones
        .filter((m: any) => m.status === "PENDING")
        .reduce((acc: number, m: any) => acc + m.amount, 0);

    return { milestones, totalRevenue, pendingRevenue };
}

export default async function FinancePage() {
    const data = await getFinanceData();

    if (!data) return <div>Access Denied</div>;

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">Finance Overview</h1>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.totalRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center pt-1">
                            <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" /> Paid Milestones
                        </p>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Pending Invoices</CardTitle>
                        <IndianRupee className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">₹{data.pendingRevenue.toLocaleString()}</div>
                        <p className="text-xs text-muted-foreground flex items-center pt-1">
                            <ArrowDownRight className="h-3 w-3 text-orange-500 mr-1" /> Outstanding
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-semibold">Recent Milestones</h2>
                <div className="rounded-md border">
                    <div className="p-4">
                        {data.milestones.length === 0 ? (
                            <p className="text-center text-muted-foreground py-4">No milestones found.</p>
                        ) : (
                            <div className="space-y-4">
                                {data.milestones.map((milestone) => (
                                    <div key={milestone.id} className="flex items-center justify-between border-b last:border-0 pb-4 last:pb-0">
                                        <div>
                                            <p className="font-medium">{milestone.title}</p>
                                            <p className="text-sm text-muted-foreground">{milestone.project.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-medium">₹{milestone.amount.toLocaleString()}</p>
                                            <Badge variant={milestone.status === 'PAID' ? 'secondary' : 'outline'} className="mt-1">
                                                {milestone.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

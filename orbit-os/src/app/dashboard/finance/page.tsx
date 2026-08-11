import { Card } from "@/components/ui/card";
import { Wallet, Clock3, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";

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
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div>
                <p className="text-overline uppercase text-muted-foreground mb-3">Finance</p>
                <h2 className="font-serif text-display-md">Revenue Overview</h2>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Total Revenue</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Wallet className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-stat tabular-nums">{formatMoney(data.totalRevenue)}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Paid milestones</p>
                </Card>
                <Card className="p-6">
                    <div className="flex items-start justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Pending</p>
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                            <Clock3 className="h-4 w-4 text-accent" strokeWidth={1.5} />
                        </div>
                    </div>
                    <p className="mt-4 font-serif text-stat tabular-nums">{formatMoney(data.pendingRevenue)}</p>
                    <p className="mt-1 text-[12px] text-muted-foreground">Outstanding</p>
                </Card>
            </div>

            <div>
                <p className="text-overline uppercase text-muted-foreground mb-4">Milestones</p>
                <Card>
                    {data.milestones.length === 0 ? (
                        <div className="text-center px-6 py-16">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                                <Wallet className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-display-sm mb-2">No milestones yet</h3>
                            <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
                                Add milestones to your projects to start tracking payments.
                            </p>
                        </div>
                    ) : (
                        <div>
                            {/* Table header */}
                            <div className="grid grid-cols-[1fr_auto_auto] gap-4 px-6 py-3 border-b text-overline uppercase text-muted-foreground">
                                <span>Milestone</span>
                                <span className="text-right">Amount</span>
                                <span className="text-right w-20">Status</span>
                            </div>
                            {data.milestones.map((milestone) => (
                                <div key={milestone.id} className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-6 py-3.5 border-b last:border-0 hover:bg-secondary/50 transition-colors duration-[100ms]">
                                    <div>
                                        <p className="text-[15px] font-medium">{milestone.title}</p>
                                        <p className="text-[13px] text-muted-foreground">{milestone.project?.title ?? "—"}</p>
                                    </div>
                                    <span className="font-serif text-[15px] tabular-nums text-right">
                                        {formatMoney(milestone.amount)}
                                    </span>
                                    <div className="text-right w-20">
                                        <Badge variant={milestone.status === 'PAID' ? 'paid' : milestone.status === 'PENDING' ? 'pending' : 'overdue'}>
                                            {milestone.status}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
}

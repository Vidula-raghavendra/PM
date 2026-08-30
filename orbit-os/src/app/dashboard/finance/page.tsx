import { Badge } from "@/components/ui/badge";
import { formatMoney } from "@/lib/utils";
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

    const paidCount = milestones.filter((m: any) => m.status === "PAID").length;

    return { milestones, totalRevenue, pendingRevenue, paidCount };
}

export default async function FinancePage() {
    const data = await getFinanceData();

    if (!data) return <div>Access Denied</div>;

    const contracted = data.totalRevenue + data.pendingRevenue;
    const pct = (part: number, whole: number) =>
        whole > 0 ? Math.round((part / whole) * 100) : 0;

    return (
        <PageShell>
            <PageHeader eyebrow="Finance" title="Revenue Overview" />

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 stagger-children">
                <StatCard
                    label="Total Revenue"
                    value={formatMoney(data.totalRevenue)}
                    caption="Paid milestones"
                    fill={pct(data.totalRevenue, contracted)}
                    tone="success"
                />
                <StatCard
                    label="Pending"
                    value={formatMoney(data.pendingRevenue)}
                    caption="Outstanding"
                    fill={pct(data.pendingRevenue, contracted)}
                    tone="accent"
                />
                <StatCard
                    label="Contracted"
                    value={formatMoney(contracted)}
                    caption="Across all milestones"
                    fill={100}
                    tone="info"
                />
                <StatCard
                    label="Milestones"
                    value={data.milestones.length}
                    caption={`${data.paidCount} paid`}
                    fill={pct(data.paidCount, data.milestones.length)}
                    tone="accent"
                />
            </div>

            <Panel title="Milestones">
                {data.milestones.length === 0 ? (
                    <EmptyState
                        title="No milestones yet"
                        description="Add milestones to your projects to start tracking payments."
                    />
                ) : (
                    <DataTable
                        columns={[
                            { label: "Milestone" },
                            { label: "Amount", className: "text-right" },
                            { label: "Status", className: "w-20 text-right" },
                        ]}
                    >
                        {data.milestones.map((milestone) => (
                            <DataRow key={milestone.id}>
                                <div className="min-w-0">
                                    <p className="truncate text-[14px] font-medium">
                                        {milestone.title}
                                    </p>
                                    <p className="truncate text-[12px] text-muted-foreground">
                                        {milestone.project?.title ?? "—"}
                                    </p>
                                </div>
                                <span className="text-right text-[14px] font-semibold tabular-nums">
                                    {formatMoney(milestone.amount)}
                                </span>
                                <div className="flex w-20 justify-end">
                                    <Badge
                                        variant={
                                            milestone.status === "PAID"
                                                ? "paid"
                                                : milestone.status === "PENDING"
                                                  ? "pending"
                                                  : "overdue"
                                        }
                                    >
                                        {milestone.status}
                                    </Badge>
                                </div>
                            </DataRow>
                        ))}
                    </DataTable>
                )}
            </Panel>
        </PageShell>
    );
}

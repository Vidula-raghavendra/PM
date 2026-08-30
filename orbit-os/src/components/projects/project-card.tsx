import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar } from "lucide-react";
import { formatMoney } from "@/lib/utils";

interface ProjectCardProps {
    id: string;
    title: string;
    client: string | null;
    status: string;
    totalBudget: number | null;
    currency: string;
    endDate: Date | null;
    progress: number;
}

const statusVariant: Record<string, "paid" | "pending" | "overdue" | "archived"> = {
    ACTIVE: "pending",
    COMPLETED: "paid",
    ARCHIVED: "archived",
};

export function ProjectCard({ project }: { project: ProjectCardProps }) {
    return (
        <Link href={`/dashboard/projects/${project.id}`} className="group block">
            {/* Hover/elevation lives in .liquid on Card — the card must
                not restate it, or the two transitions fight. */}
            <Card className="h-full cursor-pointer p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    {/* min-w-0 lets line-clamp actually clamp instead of
                        forcing the badge out of the row. */}
                    <h3 className="line-clamp-1 min-w-0 text-[15px] font-semibold tracking-tight">
                        {project.title}
                    </h3>
                    <Badge
                        variant={statusVariant[project.status] ?? "archived"}
                        className="shrink-0"
                    >
                        {project.status}
                    </Badge>
                </div>

                <p className="mb-4 line-clamp-1 text-[13px] text-muted-foreground">
                    {project.client || "No client"}
                </p>

                <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <Wallet className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="truncate font-semibold text-[15px] tabular-nums text-foreground">
                            {formatMoney(project.totalBudget ?? 0, project.currency)}
                        </span>
                    </div>
                    <div className="flex min-w-0 items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                        <span className="truncate tabular-nums">
                            {project.endDate
                                ? project.endDate.toLocaleDateString()
                                : "No deadline"}
                        </span>
                    </div>
                </div>

                <div className="mt-5">
                    <div className="mb-1.5 flex items-center justify-between text-[11px] text-muted-foreground">
                        <span>Progress</span>
                        <span className="tabular-nums">{project.progress}%</span>
                    </div>
                    <div
                        className="h-1.5 w-full overflow-hidden rounded-full bg-[hsl(0_0%_94%)]"
                        role="progressbar"
                        aria-valuenow={project.progress}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${project.title} progress`}
                    >
                        <div
                            className="h-full rounded-full bg-accent transition-[width] duration-500 ease-out"
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </div>
            </Card>
        </Link>
    );
}

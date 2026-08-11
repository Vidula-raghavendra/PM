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
        <Link href={`/dashboard/projects/${project.id}`}>
            <Card className="p-6 hover:border-[hsl(30_36%_65%)] hover:shadow-sm cursor-pointer">
                <div className="flex items-start justify-between mb-3">
                    <h3 className="text-[15px] font-semibold tracking-tight line-clamp-1">
                        {project.title}
                    </h3>
                    <Badge variant={statusVariant[project.status] ?? "archived"}>
                        {project.status}
                    </Badge>
                </div>

                <p className="text-[13px] text-muted-foreground mb-4">
                    {project.client || "No Client"}
                </p>

                <div className="grid grid-cols-2 gap-4 text-[13px]">
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Wallet className="h-4 w-4" strokeWidth={1.5} />
                        <span className="font-serif text-[15px] text-foreground tabular-nums">
                            {formatMoney(project.totalBudget ?? 0, project.currency)}
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" strokeWidth={1.5} />
                        <span className="tabular-nums">
                            {project.endDate
                                ? project.endDate.toLocaleDateString()
                                : "No Deadline"}
                        </span>
                    </div>
                </div>

                <div className="mt-4 h-1.5 w-full bg-secondary rounded-full overflow-hidden">
                    <div
                        className="h-full bg-accent rounded-full transition-all duration-[240ms]"
                        style={{ width: `${project.progress}%` }}
                    />
                </div>
            </Card>
        </Link>
    );
}

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, Calendar } from "lucide-react";
import { cn, formatMoney } from "@/lib/utils";

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

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
    ACTIVE: "default",
    COMPLETED: "secondary",
    ARCHIVED: "outline",
};

export function ProjectCard({ project }: { project: ProjectCardProps }) {
    return (
        <Link href={`/dashboard/projects/${project.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                        {project.title}
                    </CardTitle>
                    <Badge variant={statusVariant[project.status] ?? "outline"}>
                        {project.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        {project.client || "No Client"}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <Wallet className="h-4 w-4 text-muted-foreground" />
                            <span>{formatMoney(project.totalBudget ?? 0, project.currency)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {project.endDate
                                    ? project.endDate.toLocaleDateString()
                                    : "No Deadline"}
                            </span>
                        </div>
                    </div>
                    <div className="mt-4 h-2 w-full bg-secondary rounded-full overflow-hidden">
                        <div
                            className={cn("h-full bg-primary")}
                            style={{ width: `${project.progress}%` }}
                        />
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupee, Calendar, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
    id: string;
    title: string;
    client: string | null;
    status: string;
    priority: string;
    totalBudget: number | null;
    endDate: Date | null;
    progress: number;
}

export function ProjectCard({ project }: { project: ProjectCardProps }) {
    const statusColors: Record<string, string> = {
        ACTIVE: "default",
        COMPLETED: "success",
        ARCHIVED: "secondary",
    };

    return (
        <Link href={`/dashboard/projects/${project.id}`}>
            <Card className="hover:bg-muted/50 transition-colors">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-semibold">
                        {project.title}
                    </CardTitle>
                    <Badge variant={statusColors[project.status] as any || "outline"}>
                        {project.status}
                    </Badge>
                </CardHeader>
                <CardContent>
                    <div className="text-sm text-muted-foreground mb-4">
                        {project.client || "No Client"}
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                            <IndianRupee className="h-4 w-4 text-muted-foreground" />
                            <span>{project.totalBudget?.toLocaleString("en-IN") || "0"}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {project.endDate
                                    ? new Date(project.endDate).toLocaleDateString()
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

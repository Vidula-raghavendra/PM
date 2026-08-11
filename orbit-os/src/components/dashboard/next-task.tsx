import { Card } from "@/components/ui/card";
import { Target, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Task {
    id: string;
    title: string;
    priority: string;
    dueDate: Date | null;
    project: {
        title: string;
    };
}

const priorityStyle: Record<string, string> = {
    HIGH: "bg-[hsl(11_55%_95%)] text-[hsl(10_61%_40%)]",
    MEDIUM: "bg-[hsl(36_87%_93%)] text-[hsl(38_74%_31%)]",
    LOW: "bg-[hsl(74_37%_90%)] text-[hsl(74_37%_29%)]",
};

export function NextTaskWidget({ task }: { task: Task | null }) {
    return (
        <Card className="p-6">
            <div className="flex items-start justify-between">
                <p className="text-overline uppercase text-muted-foreground">Next Task</p>
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                    <Target className="h-4 w-4 text-accent" strokeWidth={1.5} />
                </div>
            </div>

            {task ? (
                <div className="mt-4 space-y-3">
                    <div>
                        <p className="text-[15px] font-semibold tracking-tight line-clamp-1">{task.title}</p>
                        <p className="mt-0.5 text-[13px] text-muted-foreground line-clamp-1">
                            {task.project.title}
                        </p>
                    </div>

                    <div className="flex items-center justify-between">
                        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ${priorityStyle[task.priority] ?? priorityStyle.MEDIUM}`}>
                            {task.priority || "MEDIUM"}
                        </span>
                        {task.dueDate && (
                            <span className="text-[12px] text-muted-foreground tabular-nums">
                                {new Date(task.dueDate).toLocaleDateString()}
                            </span>
                        )}
                    </div>

                    <Link
                        href={`/dashboard/projects/${task.id}`}
                        className="inline-flex items-center text-[13px] text-accent font-medium hover:underline underline-offset-4 transition-colors duration-[100ms]"
                    >
                        View Details <ArrowRight className="ml-1 h-3.5 w-3.5" strokeWidth={1.5} />
                    </Link>
                </div>
            ) : (
                <div className="mt-4 text-center py-4">
                    <p className="text-[13px] text-muted-foreground">No pending tasks.</p>
                    <Link
                        href="/dashboard/projects/new"
                        className="inline-block mt-2 text-[13px] text-accent font-medium hover:underline underline-offset-4"
                    >
                        Create Project
                    </Link>
                </div>
            )}
        </Card>
    );
}

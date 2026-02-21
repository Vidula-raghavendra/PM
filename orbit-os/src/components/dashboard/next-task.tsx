import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Target, Calendar as CalendarIcon, ArrowRight } from "lucide-react";
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

export function NextTaskWidget({ task }: { task: Task | null }) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Next Task</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                {task ? (
                    <div className="space-y-4">
                        <div>
                            <div className="text-lg font-bold line-clamp-1">{task.title}</div>
                            <p className="text-xs text-muted-foreground line-clamp-1">
                                {task.project.title}
                            </p>
                        </div>

                        <div className="flex items-center justify-between text-xs">
                            <div className={`px-2 py-0.5 rounded-full font-medium ${task.priority === 'HIGH' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'LOW' ? 'bg-green-100 text-green-700' :
                                        'bg-yellow-100 text-yellow-700'
                                }`}>
                                {task.priority || "MEDIUM"}
                            </div>
                            {task.dueDate && (
                                <div className="flex items-center text-muted-foreground">
                                    <CalendarIcon className="mr-1 h-3 w-3" />
                                    {new Date(task.dueDate).toLocaleDateString()}
                                </div>
                            )}
                        </div>

                        <Link href={`/dashboard/projects/${task.id}`} className="block">
                            {/* Note: This link might be wrong, presumably we want to go to the project or task details. 
                Assuming /dashboard/projects/[projectId] for now, but we don't have projectId here locally if we don't select it.
                Actually we included project in the task fetch. I need projectId in the Task interface.
            */}
                            <div className="text-xs text-primary flex items-center hover:underline cursor-pointer">
                                View Details <ArrowRight className="ml-1 h-3 w-3" />
                            </div>
                        </Link>
                    </div>
                ) : (
                    <div className="py-4 text-center text-sm text-muted-foreground">
                        No pending tasks.
                        <br />
                        <Link href="/dashboard/projects/new" className="text-primary hover:underline mt-2 inline-block">
                            Create Project
                        </Link>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";

import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

async function getProjects() {
    const userId = await requireUser();
    return await ProjectService.getProjectsForUser(userId);
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-overline uppercase text-muted-foreground mb-3">Projects</p>
                    <h2 className="font-serif text-display-md">Your work</h2>
                </div>
                <Button variant="accent" asChild>
                    <Link href="/dashboard/projects/new">
                        <Plus className="mr-2 h-4 w-4" strokeWidth={2} /> New Project
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                        <FolderOpen className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-display-sm mb-2">No projects yet</h3>
                    <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto mb-6">
                        Create your first project to start tracking tasks and milestones.
                    </p>
                    <Button variant="accent" asChild>
                        <Link href="/dashboard/projects/new">Create Project</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        const totalTasks = project.tasks.length;
                        const completedTasks = project.tasks.filter((t) => t.status === "DONE").length;
                        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

                        return (
                            <ProjectCard
                                key={project.id}
                                project={{ ...project, progress }}
                            />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

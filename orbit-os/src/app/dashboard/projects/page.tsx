import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, FolderOpen } from "lucide-react";
import { PageShell, PageHeader, EmptyState } from "@/components/dashboard/page-shell";

import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

async function getProjects() {
    const userId = await requireUser();
    return await ProjectService.getProjectsForUser(userId);
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <PageShell>
            <PageHeader
                eyebrow="Projects"
                title="Your work"
                action={
                    <Button variant="accent" asChild>
                        <Link href="/dashboard/projects/new">
                            <Plus className="h-4 w-4" strokeWidth={2} /> New Project
                        </Link>
                    </Button>
                }
            />

            {projects.length === 0 ? (
                <div className="surface-card">
                    <EmptyState
                        icon={FolderOpen}
                        title="No projects yet"
                        description="Create your first project to start tracking tasks and milestones."
                        action={
                            <Button variant="accent" asChild>
                                <Link href="/dashboard/projects/new">Create Project</Link>
                            </Button>
                        }
                    />
                </div>
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 stagger-children">
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
        </PageShell>
    );
}

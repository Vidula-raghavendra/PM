
import { decrypt } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { ProjectCard } from "@/components/projects/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus } from "lucide-react";

import { prisma } from "@/lib/prisma";

async function getProjects() {
    const session = await decrypt((await cookies()).get("session")?.value);
    if (!session?.userId) return [];

    return await prisma.project.findMany({
        where: { userId: session.userId as string },
        orderBy: { updatedAt: "desc" },
        include: {
            tasks: { select: { status: true } }, // Minimal selection for progress calc
        }
    });
}

export default async function ProjectsPage() {
    const projects = await getProjects();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                <Button asChild>
                    <Link href="/dashboard/projects/new">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Link>
                </Button>
            </div>

            {projects.length === 0 ? (
                <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center animate-in fade-in-50">
                    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <Plus className="h-6 w-6 text-foreground" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold">No projects yet</h3>
                    <p className="mb-4 mt-2 text-sm text-muted-foreground">
                        Create your first project to start tracking tasks and milestones.
                    </p>
                    <Button asChild>
                        <Link href="/dashboard/projects/new">Create Project</Link>
                    </Button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {projects.map((project) => {
                        const totalTasks = project.tasks.length;
                        const completedTasks = project.tasks.filter(t => t.status === 'DONE').length;
                        const progress = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

                        return (
                            <ProjectCard key={project.id} project={{ ...project, progress }} />
                        );
                    })}
                </div>
            )}
        </div>
    );
}

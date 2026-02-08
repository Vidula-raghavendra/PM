
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { deleteProject } from "@/app/actions/projects";

import { prisma } from "@/lib/prisma";

async function getProject(id: string) {
    const project = await prisma.project.findUnique({
        where: { id },
        include: {
            tasks: true,
            milestones: true,
            timeLogs: true,
        },
    });
    return project;
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/projects">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                    <Badge variant="outline">{project.status}</Badge>
                </div>
                <div className="flex gap-2">
                    {/* Using a form for delete because it's a server action */}
                    <form action={deleteProject.bind(null, project.id)}>
                        <Button variant="destructive" size="icon" type="submit">
                            <Trash className="h-4 w-4" />
                        </Button>
                    </form>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Client:</span>
                            <span className="font-medium">{project.client || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Priority:</span>
                            <span className="font-medium">{project.priority}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Total Budget:</span>
                            <span className="font-medium">₹{project.totalBudget?.toLocaleString() || "0"}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">End Date:</span>
                            <span className="font-medium">{project.endDate ? project.endDate.toLocaleDateString() : "N/A"}</span>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Description</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-sm text-muted-foreground">
                            {project.description || "No description provided."}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Stats</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Tasks:</span>
                            <span className="font-medium">{project.tasks.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Milestones:</span>
                            <span className="font-medium">{project.milestones.length}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Time Logs:</span>
                            <span className="font-medium">{project.timeLogs.length}</span>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Tabs for Tasks, Milestones, TimeLogs could go here */}
        </div>
    );
}

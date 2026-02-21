
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Edit, Trash, FileText, Download } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProject } from "@/app/actions/projects";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";

async function getProject(id: string) {
    const userId = await requireUser();
    return await ProjectService.getById(id, userId);
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const project = await getProject(id);

    if (!project) {
        notFound();
    }

    // Finance Calculations
    const totalMilestoneAmount = project.milestones.reduce((sum: number, m: any) => sum + m.amount, 0);
    const paidAmount = project.milestones.filter((m: any) => m.status === 'PAID').reduce((sum: number, m: any) => sum + m.amount, 0);
    const pendingAmount = project.milestones.filter((m: any) => m.status === 'PENDING').reduce((sum: number, m: any) => sum + m.amount, 0);

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                    <Button variant="outline" size="icon" asChild>
                        <Link href="/dashboard/projects">
                            <ChevronLeft className="h-4 w-4" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                        <div className="flex items-center gap-2 text-muted-foreground mt-1">
                            <Badge variant="outline">{project.status}</Badge>
                            <span>{project.client}</span>
                        </div>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* @ts-ignore */}
                    <form action={deleteProject.bind(null, project.id)}>
                        <Button variant="destructive" size="sm" type="submit">
                            <Trash className="h-4 w-4 mr-2" /> Delete
                        </Button>
                    </form>
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                    <TabsTrigger value="team">Team & Docs</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-3">
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">{project.currency} {project.totalBudget?.toLocaleString()}</div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Log Hours</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(project.timeLogs.reduce((acc: number, log: any) => acc + (log.duration || 0), 0) / 60)}h
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Remaining Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {project.tasks.filter((t: any) => t.status !== 'DONE').length}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                                {project.description || "No description provided."}
                            </p>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* FINANCE TAB */}
                <TabsContent value="finance" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Payment Breakdown</CardTitle>
                                <CardDescription>Milestone status and amounts</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.milestones.map((m: any) => (
                                    <div key={m.id} className="flex items-center justify-between border-b last:border-0 pb-2 last:pb-0">
                                        <div>
                                            <div className="font-medium">{m.title}</div>
                                            <div className="text-xs text-muted-foreground">Due: {m.dueDate ? m.dueDate.toLocaleDateString() : "N/A"}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold">{project.currency} {m.amount.toLocaleString()}</div>
                                            <Badge variant={m.status === 'PAID' ? 'default' : 'secondary'}>{m.status}</Badge>
                                        </div>
                                    </div>
                                ))}
                                {project.milestones.length === 0 && <p className="text-sm text-muted-foreground">No milestones defined.</p>}
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader>
                                <CardTitle>Financial Summary</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm">Total Budget</span>
                                    <span className="font-bold">{project.currency} {project.totalBudget?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-green-600">
                                    <span className="text-sm">Collected</span>
                                    <span className="font-bold">+{project.currency} {paidAmount.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-muted-foreground">
                                    <span className="text-sm">Pending</span>
                                    <span className="font-bold">{project.currency} {pendingAmount.toLocaleString()}</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* TEAM Tab */}
                <TabsContent value="team" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Collaborators</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.collaborators.map((c: any) => (
                                    <div key={c.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.color }}>
                                                {c.user.name?.[0] || c.user.email[0].toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium">{c.user.name || c.user.email}</div>
                                                <div className="text-xs text-muted-foreground">{c.role}</div>
                                            </div>
                                        </div>
                                        <div className="text-sm font-bold">
                                            {c.splitPercentage}% Split
                                        </div>
                                    </div>
                                ))}
                                {project.collaborators.length === 0 && <p className="text-sm text-muted-foreground">No collaborators added.</p>}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {project.documents.map((d: any) => (
                                    <div key={d.id} className="flex items-center justify-between p-2 border rounded hover:bg-slate-50">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{d.title}</span>
                                        </div>
                                        {/* In real app, download link would be d.url */}
                                        <Button variant="ghost" size="icon" asChild>
                                            <Link href={d.url || "#"} target="_blank">
                                                <Download className="h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </div>
                                ))}
                                {project.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

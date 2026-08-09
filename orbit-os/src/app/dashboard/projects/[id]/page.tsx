
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trash, FileText, Download, ExternalLink, Video } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProject } from "@/app/actions/projects";
import { removeCollaboratorFromProject } from "@/app/actions/collaborators";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { CalendarService } from "@/services/calendar.service";
import { AddCollaboratorDialog } from "@/components/projects/add-collaborator-dialog";
import { ScheduleMeetingDialog } from "@/components/projects/schedule-meeting-dialog";

async function getProject(id: string) {
    const userId = await requireUser();
    return { project: await ProjectService.getById(id, userId), userId };
}

export default async function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const { project, userId } = await getProject(id);

    if (!project) {
        notFound();
    }

    const isOwner = project.ownerId === userId;
    const meetings = await CalendarService.getMeetingsForProject(id);

    // Finance Calculations
    const paidAmount = project.milestones
        .filter((m) => m.status === 'PAID')
        .reduce((sum, m) => sum + m.amount, 0);
    const pendingAmount = project.milestones
        .filter((m) => m.status === 'PENDING')
        .reduce((sum, m) => sum + m.amount, 0);

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
                    {isOwner && (
                        /* @ts-ignore */
                        <form action={deleteProject.bind(null, project.id)}>
                            <Button variant="destructive" size="sm" type="submit">
                                <Trash className="h-4 w-4 mr-2" /> Delete
                            </Button>
                        </form>
                    )}
                </div>
            </div>

            <Tabs defaultValue="overview" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                    <TabsTrigger value="team">Team & Docs</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
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
                                <CardTitle className="text-sm font-medium">Hours Logged</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {Math.round(project.timeLogs.reduce((acc, log) => acc + log.duration, 0) / 60)}h
                                </div>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-sm font-medium">Remaining Tasks</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {project.tasks.filter((t) => t.status !== 'DONE').length}
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
                                {project.milestones.map((m) => (
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

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-4">
                    <div className="grid gap-4 md:grid-cols-2">
                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <CardTitle>Collaborators</CardTitle>
                                {isOwner && <AddCollaboratorDialog projectId={project.id} />}
                            </CardHeader>
                            <CardContent className="space-y-4">
                                {project.collaborators.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ backgroundColor: c.color }}>
                                                {(c.user?.fullName ?? c.email)[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-medium">{c.user?.fullName || c.email}</span>
                                                    <Badge
                                                        variant={c.status === "ACCEPTED" ? "default" : c.status === "DECLINED" ? "destructive" : "secondary"}
                                                        className="text-[10px] px-1.5 py-0"
                                                    >
                                                        {c.status === "ACCEPTED" ? "Active" : c.status === "DECLINED" ? "Declined" : "Pending"}
                                                    </Badge>
                                                </div>
                                                <div className="text-xs text-muted-foreground">{c.role} · {c.splitPercentage}% split</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {isOwner && (
                                                /* @ts-ignore */
                                                <form action={removeCollaboratorFromProject.bind(null, c.id, project.id)}>
                                                    <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-muted-foreground hover:text-destructive">
                                                        <Trash className="h-3.5 w-3.5" />
                                                    </Button>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                ))}
                                {project.collaborators.length === 0 && (
                                    <p className="text-sm text-muted-foreground">No collaborators yet. Click "Invite" to add someone.</p>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Documents</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                {project.documents.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between p-2 border rounded hover:bg-slate-50">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-medium">{d.title}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" asChild>
                                            <a href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer">
                                                <Download className="h-4 w-4" />
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                                {project.documents.length === 0 && <p className="text-sm text-muted-foreground">No documents uploaded.</p>}
                            </CardContent>
                        </Card>
                    </div>
                </TabsContent>

                {/* MEETINGS TAB */}
                <TabsContent value="meetings" className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Scheduled Meetings</h3>
                        <ScheduleMeetingDialog projectId={project.id} collaborators={project.collaborators} />
                    </div>

                    {meetings.length === 0 && (
                        <Card>
                            <CardContent className="py-12 text-center">
                                <Video className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                                <p className="text-sm text-muted-foreground">No meetings scheduled yet.</p>
                                <p className="text-xs text-muted-foreground mt-1">Schedule a meeting to notify your team.</p>
                            </CardContent>
                        </Card>
                    )}

                    <div className="space-y-3">
                        {meetings.map((m) => (
                            <Card key={m.id}>
                                <CardContent className="py-4">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h4 className="font-semibold">{m.title}</h4>
                                            {m.description && <p className="text-sm text-muted-foreground mt-0.5">{m.description}</p>}
                                            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                                                <span>
                                                    {m.startTime?.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" })}
                                                </span>
                                                <span>
                                                    {m.startTime?.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                                    {" – "}
                                                    {m.endTime?.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })}
                                                </span>
                                                <span>{m.attendees.length} attendee{m.attendees.length !== 1 ? "s" : ""}</span>
                                            </div>
                                        </div>
                                        {m.meetingLink && (
                                            <Button variant="outline" size="sm" asChild>
                                                <a href={m.meetingLink} target="_blank" rel="noreferrer">
                                                    <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Join
                                                </a>
                                            </Button>
                                        )}
                                    </div>
                                    {/* Attendee pills */}
                                    {m.attendees.length > 0 && (
                                        <div className="flex flex-wrap gap-1.5 mt-3">
                                            {m.attendees.map((a) => (
                                                <span key={a.id} className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                                                    {a.email}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

import { notFound } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ChevronLeft, Trash, FileText, Download, ExternalLink, Video, Wallet, Clock, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteProject } from "@/app/actions/projects";
import { removeCollaboratorFromProject } from "@/app/actions/collaborators";
import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { CalendarService } from "@/services/calendar.service";
import { AddCollaboratorDialog } from "@/components/projects/add-collaborator-dialog";
import { ScheduleMeetingDialog } from "@/components/projects/schedule-meeting-dialog";
import { formatMoney } from "@/lib/utils";

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

    const paidAmount = project.milestones
        .filter((m) => m.status === 'PAID')
        .reduce((sum, m) => sum + m.amount, 0);
    const pendingAmount = project.milestones
        .filter((m) => m.status === 'PENDING')
        .reduce((sum, m) => sum + m.amount, 0);

    return (
        <div className="space-y-8 max-w-[1120px] mx-auto px-8 py-12">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                    <Button variant="outline" size="icon" asChild className="mt-1">
                        <Link href="/dashboard/projects" aria-label="Back to projects">
                            <ChevronLeft className="h-4 w-4" strokeWidth={1.5} />
                        </Link>
                    </Button>
                    <div>
                        <p className="text-overline uppercase text-muted-foreground mb-1">Project</p>
                        <h1 className="font-serif text-display-md">{project.title}</h1>
                        <div className="flex items-center gap-2 mt-2">
                            <Badge variant={project.status === 'ACTIVE' ? 'pending' : project.status === 'COMPLETED' ? 'paid' : 'archived'}>
                                {project.status}
                            </Badge>
                            {project.client && <span className="text-[13px] text-muted-foreground">{project.client}</span>}
                        </div>
                    </div>
                </div>
                {isOwner && (
                    /* @ts-ignore */
                    <form action={deleteProject.bind(null, project.id)}>
                        <Button variant="destructive" size="sm" type="submit">
                            <Trash className="h-4 w-4 mr-2" strokeWidth={1.5} /> Delete
                        </Button>
                    </form>
                )}
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
                <TabsList>
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="finance">Finance</TabsTrigger>
                    <TabsTrigger value="team">Team & Docs</TabsTrigger>
                    <TabsTrigger value="meetings">Meetings</TabsTrigger>
                </TabsList>

                {/* OVERVIEW TAB */}
                <TabsContent value="overview" className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-3">
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <p className="text-overline uppercase text-muted-foreground">Total Budget</p>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                                    <Wallet className="h-4 w-4 text-accent" strokeWidth={1.5} />
                                </div>
                            </div>
                            <p className="mt-4 font-serif text-stat tabular-nums">
                                {formatMoney(project.totalBudget ?? 0, project.currency)}
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <p className="text-overline uppercase text-muted-foreground">Hours Logged</p>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                                    <Clock className="h-4 w-4 text-accent" strokeWidth={1.5} />
                                </div>
                            </div>
                            <p className="mt-4 font-serif text-stat tabular-nums">
                                {Math.round(project.timeLogs.reduce((acc, log) => acc + log.duration, 0) / 60)}h
                            </p>
                        </Card>
                        <Card className="p-6">
                            <div className="flex items-start justify-between">
                                <p className="text-overline uppercase text-muted-foreground">Remaining Tasks</p>
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent/10">
                                    <Target className="h-4 w-4 text-accent" strokeWidth={1.5} />
                                </div>
                            </div>
                            <p className="mt-4 font-serif text-stat tabular-nums">
                                {project.tasks.filter((t) => t.status !== 'DONE').length}
                            </p>
                        </Card>
                    </div>

                    {project.description && (
                        <Card className="p-6">
                            <p className="text-overline uppercase text-muted-foreground mb-3">Description</p>
                            <p className="text-[15px] text-muted-foreground leading-relaxed whitespace-pre-wrap">
                                {project.description}
                            </p>
                        </Card>
                    )}
                </TabsContent>

                {/* FINANCE TAB */}
                <TabsContent value="finance" className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card>
                            <div className="px-6 pt-6 pb-3">
                                <p className="text-overline uppercase text-muted-foreground mb-1">Payment Breakdown</p>
                                <p className="text-[13px] text-muted-foreground">Milestone status and amounts</p>
                            </div>
                            <div>
                                {project.milestones.map((m) => (
                                    <div key={m.id} className="flex items-center justify-between px-6 py-3.5 border-b last:border-0">
                                        <div>
                                            <p className="text-[15px] font-medium">{m.title}</p>
                                            <p className="text-[12px] text-muted-foreground tabular-nums">
                                                Due: {m.dueDate ? m.dueDate.toLocaleDateString() : "N/A"}
                                            </p>
                                        </div>
                                        <div className="text-right flex items-center gap-3">
                                            <span className="font-serif text-[15px] tabular-nums">
                                                {formatMoney(m.amount, project.currency)}
                                            </span>
                                            <Badge variant={m.status === 'PAID' ? 'paid' : m.status === 'PENDING' ? 'pending' : 'overdue'}>
                                                {m.status}
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                                {project.milestones.length === 0 && (
                                    <p className="text-[13px] text-muted-foreground px-6 py-8 text-center">No milestones defined.</p>
                                )}
                            </div>
                        </Card>
                        <Card className="p-6">
                            <p className="text-overline uppercase text-muted-foreground mb-6">Financial Summary</p>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center">
                                    <span className="text-[13px] text-muted-foreground">Total Budget</span>
                                    <span className="font-serif text-[15px] tabular-nums">{formatMoney(project.totalBudget ?? 0, project.currency)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[13px] text-[hsl(74_37%_29%)]">Collected</span>
                                    <span className="font-serif text-[15px] tabular-nums text-[hsl(74_37%_29%)]">+{formatMoney(paidAmount, project.currency)}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-[13px] text-muted-foreground">Pending</span>
                                    <span className="font-serif text-[15px] tabular-nums text-muted-foreground">{formatMoney(pendingAmount, project.currency)}</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* TEAM TAB */}
                <TabsContent value="team" className="space-y-8">
                    <div className="grid gap-6 md:grid-cols-2">
                        <Card className="p-6">
                            <div className="flex items-center justify-between mb-4">
                                <p className="text-overline uppercase text-muted-foreground">Collaborators</p>
                                {isOwner && <AddCollaboratorDialog projectId={project.id} />}
                            </div>
                            <div className="space-y-4">
                                {project.collaborators.map((c) => (
                                    <div key={c.id} className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-semibold" style={{ backgroundColor: c.color, color: '#FFFDFB' }}>
                                                {(c.user?.fullName ?? c.email)[0]?.toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[15px] font-medium">{c.user?.fullName || c.email}</span>
                                                    <Badge
                                                        variant={c.status === "ACCEPTED" ? "paid" : c.status === "DECLINED" ? "overdue" : "pending"}
                                                    >
                                                        {c.status === "ACCEPTED" ? "Active" : c.status === "DECLINED" ? "Declined" : "Pending"}
                                                    </Badge>
                                                </div>
                                                <p className="text-[12px] text-muted-foreground tabular-nums">{c.role} · {c.splitPercentage}% split</p>
                                            </div>
                                        </div>
                                        {isOwner && (
                                            /* @ts-ignore */
                                            <form action={removeCollaboratorFromProject.bind(null, c.id, project.id)}>
                                                <Button variant="ghost" size="icon" type="submit" className="h-8 w-8 text-muted-foreground hover:text-destructive" aria-label={`Remove ${c.user?.fullName || c.email}`}>
                                                    <Trash className="h-3.5 w-3.5" strokeWidth={1.5} />
                                                </Button>
                                            </form>
                                        )}
                                    </div>
                                ))}
                                {project.collaborators.length === 0 && (
                                    <p className="text-[13px] text-muted-foreground text-center py-4">No collaborators yet. Click &ldquo;Invite&rdquo; to add someone.</p>
                                )}
                            </div>
                        </Card>

                        <Card className="p-6">
                            <p className="text-overline uppercase text-muted-foreground mb-4">Documents</p>
                            <div className="space-y-2">
                                {project.documents.map((d) => (
                                    <div key={d.id} className="flex items-center justify-between p-3 rounded-lg border hover:border-[hsl(30_36%_65%)] hover:shadow-sm transition-all duration-[120ms]">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-accent" strokeWidth={1.5} />
                                            <span className="text-[13px] font-medium">{d.title}</span>
                                        </div>
                                        <Button variant="ghost" size="icon" asChild className="h-8 w-8">
                                            <a href={`/api/documents/${d.id}`} target="_blank" rel="noreferrer" aria-label={`Download ${d.title}`}>
                                                <Download className="h-4 w-4" strokeWidth={1.5} />
                                            </a>
                                        </Button>
                                    </div>
                                ))}
                                {project.documents.length === 0 && <p className="text-[13px] text-muted-foreground text-center py-4">No documents uploaded.</p>}
                            </div>
                        </Card>
                    </div>
                </TabsContent>

                {/* MEETINGS TAB */}
                <TabsContent value="meetings" className="space-y-6">
                    <div className="flex items-center justify-between">
                        <p className="text-overline uppercase text-muted-foreground">Scheduled Meetings</p>
                        <ScheduleMeetingDialog projectId={project.id} collaborators={project.collaborators} />
                    </div>

                    {meetings.length === 0 && (
                        <div className="text-center py-16">
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                                <Video className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                            </div>
                            <h3 className="font-serif text-display-sm mb-2">No meetings yet</h3>
                            <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
                                Schedule a meeting to notify your team.
                            </p>
                        </div>
                    )}

                    <div className="space-y-3">
                        {meetings.map((m) => (
                            <Card key={m.id} className="p-6">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h4 className="text-[15px] font-semibold tracking-tight">{m.title}</h4>
                                        {m.description && <p className="text-[13px] text-muted-foreground mt-0.5">{m.description}</p>}
                                        <div className="flex items-center gap-4 mt-2 text-[12px] text-muted-foreground tabular-nums">
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
                                                <ExternalLink className="h-3.5 w-3.5 mr-1.5" strokeWidth={1.5} /> Join
                                            </a>
                                        </Button>
                                    )}
                                </div>
                                {m.attendees.length > 0 && (
                                    <div className="flex flex-wrap gap-1.5 mt-3">
                                        {m.attendees.map((a) => (
                                            <span key={a.id} className="text-[11px] px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                                                {a.email}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

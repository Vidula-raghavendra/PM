import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users } from "lucide-react";
import { PageShell, PageHeader, EmptyState } from "@/components/dashboard/page-shell";

export default async function PeoplePage() {
    const userId = await requireUser();

    const projects = await ProjectService.getProjectsForUser(userId);

    type Person = {
        email: string;
        name: string | null;
        phone: string | null;
        sector: string | null;
        purpose: string | null;
        pending: boolean;
        projects: { id: string; title: string; role: string }[];
    };

    const peopleMap = new Map<string, Person>();

    projects.forEach((project) => {
        project.collaborators.forEach((collaborator) => {
            if (collaborator.userId === userId) return;

            const key = collaborator.email.toLowerCase();

            if (!peopleMap.has(key)) {
                peopleMap.set(key, {
                    email: collaborator.email,
                    name: collaborator.user?.fullName ?? null,
                    phone: collaborator.user?.phone ?? null,
                    sector: collaborator.user?.sector ?? null,
                    purpose: collaborator.user?.purpose ?? null,
                    pending: !collaborator.userId,
                    projects: [],
                });
            }

            const entry = peopleMap.get(key)!;
            if (!entry.projects.some((p) => p.id === project.id)) {
                entry.projects.push({
                    id: project.id,
                    title: project.title,
                    role: collaborator.role,
                });
            }
        });
    });

    const people = Array.from(peopleMap.values());

    return (
        <PageShell>
            <PageHeader eyebrow="Team" title="People" />

            {people.length === 0 ? (
                <div className="surface-card">
                    <EmptyState
                        icon={Users}
                        title="No collaborators yet"
                        description="Add team members to your projects to see them here."
                    />
                </div>
            ) : (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 stagger-children">
                    {people.map((person) => (
                        <Card key={person.email} className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-full bg-[hsl(var(--background-alt))] ring-1 ring-border flex items-center justify-center text-accent-ink font-bold text-[14px]">
                                    {(person.name ?? person.email)[0]?.toUpperCase()}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-[15px] font-semibold tracking-tight truncate">
                                            {person.name || person.email}
                                        </p>
                                        {person.pending && (
                                            <Badge variant="archived">Invited</Badge>
                                        )}
                                    </div>
                                    <div className="text-[13px] text-muted-foreground flex items-center gap-1.5 mt-0.5">
                                        <Mail className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                                        <span className="truncate">{person.email}</span>
                                    </div>
                                    {person.phone && (
                                        <div className="text-[13px] text-muted-foreground flex items-center gap-1.5">
                                            <Phone className="h-3 w-3 shrink-0" strokeWidth={1.5} />
                                            {person.phone}
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="border-t border-border pt-4">
                                <p className="eyebrow text-muted-foreground mb-2">Shared Projects</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {person.projects.map(p => (
                                        <Badge key={p.id} variant="secondary" className="text-[11px]">
                                            {p.title} · {p.role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {(person.sector || person.purpose) && (
                                <div className="mt-4 space-y-0.5 border-t border-border pt-4 text-[12px] text-muted-foreground">
                                    {person.sector && <span className="block">Sector: {person.sector}</span>}
                                    {person.purpose && <span className="block">Purpose: {person.purpose}</span>}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </PageShell>
    );
}

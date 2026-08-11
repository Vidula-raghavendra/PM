import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Users } from "lucide-react";

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
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div>
                <p className="text-overline uppercase text-muted-foreground mb-3">Team</p>
                <h2 className="font-serif text-display-md">People</h2>
            </div>

            {people.length === 0 ? (
                <div className="text-center py-16">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                        <Users className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                    </div>
                    <h3 className="font-serif text-display-sm mb-2">No collaborators yet</h3>
                    <p className="text-[13px] text-muted-foreground max-w-[280px] mx-auto">
                        Add team members to your projects to see them here.
                    </p>
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                        <Card key={person.email} className="p-6">
                            <div className="flex items-center gap-4 mb-4">
                                <div className="h-10 w-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-semibold text-[15px]">
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

                            <div className="pt-4 border-t">
                                <p className="text-overline uppercase text-muted-foreground mb-2">Shared Projects</p>
                                <div className="flex flex-wrap gap-1.5">
                                    {person.projects.map(p => (
                                        <Badge key={p.id} variant="secondary" className="text-[11px]">
                                            {p.title} · {p.role}
                                        </Badge>
                                    ))}
                                </div>
                            </div>

                            {(person.sector || person.purpose) && (
                                <div className="mt-4 pt-4 border-t text-[12px] text-muted-foreground space-y-0.5">
                                    {person.sector && <span className="block">Sector: {person.sector}</span>}
                                    {person.purpose && <span className="block">Purpose: {person.purpose}</span>}
                                </div>
                            )}
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

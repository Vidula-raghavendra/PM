import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Briefcase } from "lucide-react";

export default async function PeoplePage() {
    const userId = await requireUser();

    // Fetch projects where I am owner or collaborator
    const projects = await ProjectService.getProjectsForUser(userId);

    // Group collaborators across projects. Invited-but-not-yet-registered
    // people have no linked profile, so key on email, which is always present.
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
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">People</h1>

            {people.length === 0 ? (
                <div className="text-center py-10 text-muted-foreground">
                    No collaborators found. Add team members to your projects to see them here.
                </div>
            ) : (
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {people.map((person) => (
                        <Card key={person.email}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {(person.name ?? person.email)[0]?.toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base flex items-center gap-2">
                                        {person.name || person.email}
                                        {person.pending && (
                                            <Badge variant="outline" className="font-normal">Invited</Badge>
                                        )}
                                    </CardTitle>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {person.email}
                                    </div>
                                    {person.phone && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {person.phone}
                                        </div>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="mt-4 space-y-2">
                                    <div className="text-sm font-medium flex items-center gap-2">
                                        <Briefcase className="h-4 w-4" />
                                        Shared Projects
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {person.projects.map(p => (
                                            <Badge key={p.id} variant="secondary">
                                                {p.title} ({p.role})
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {(person.sector || person.purpose) && (
                                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                        {person.sector && <span className="block">Sector: {person.sector}</span>}
                                        {person.purpose && <span className="block">Purpose: {person.purpose}</span>}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

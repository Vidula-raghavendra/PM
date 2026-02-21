import { requireUser } from "@/auth/guard";
import { ProjectService } from "@/services/project.service";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Briefcase } from "lucide-react";

export default async function PeoplePage() {
    const userId = await requireUser();

    // Fetch projects where I am owner or collaborator
    const projects = await ProjectService.getProjectsForUser(userId);

    // Group collaborators by user ID
    // @ts-ignore
    const peopleMap = new Map<string, { user: any, projects: { id: string, title: string, role: string }[] }>();

    projects.forEach(project => {
        project.collaborators.forEach((collaborator: any) => {
            // Skip myself
            if (collaborator.userId === userId) return;

            if (!peopleMap.has(collaborator.userId)) {
                peopleMap.set(collaborator.userId, {
                    user: collaborator.user,
                    projects: []
                });
            }

            const personEntry = peopleMap.get(collaborator.userId);
            // Avoid duplicate projects for the same person (though unlikely in this query structure unless multiple roles)
            if (!personEntry?.projects.find(p => p.id === project.id)) {
                personEntry?.projects.push({
                    id: project.id,
                    title: project.title,
                    role: collaborator.role
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
                    {people.map(({ user, projects }) => (
                        <Card key={user.id}>
                            <CardHeader className="flex flex-row items-center gap-4 space-y-0 pb-2">
                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">
                                    {user.name?.[0] || user.email[0].toUpperCase()}
                                </div>
                                <div className="flex flex-col">
                                    <CardTitle className="text-base">{user.name || "Unknown"}</CardTitle>
                                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                                        <Mail className="h-3 w-3" />
                                        {user.email}
                                    </div>
                                    {user.phone && (
                                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                                            <Phone className="h-3 w-3" />
                                            {user.phone}
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
                                        {projects.map(p => (
                                            <Badge key={p.id} variant="secondary">
                                                {p.title} ({p.role})
                                            </Badge>
                                        ))}
                                    </div>
                                </div>
                                {(user.sector || user.purpose) && (
                                    <div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
                                        {user.sector && <span className="block">Sector: {user.sector}</span>}
                                        {user.purpose && <span className="block">Purpose: {user.purpose}</span>}
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

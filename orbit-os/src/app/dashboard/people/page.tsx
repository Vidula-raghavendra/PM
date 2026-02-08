import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";


import { prisma } from "@/lib/prisma";

export default async function PeoplePage() {
    const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
    });

    return (
        <div className="space-y-6">
            <h1 className="text-3xl font-bold tracking-tight">People</h1>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {users.map(user => (
                    <Card key={user.id}>
                        <CardHeader className="flex flex-row items-center gap-4">
                            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                {user.name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div>
                                <CardTitle className="text-base">{user.name || "User"}</CardTitle>
                                <p className="text-xs text-muted-foreground">{user.role}</p>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-muted-foreground">{user.email}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

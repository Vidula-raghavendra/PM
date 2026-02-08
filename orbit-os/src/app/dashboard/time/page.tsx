
import { decrypt } from "@/lib/auth/session";
import { cookies } from "next/headers";
import { Card, CardContent } from "@/components/ui/card";
import { Clock } from "lucide-react";

import { prisma } from "@/lib/prisma";

async function getTimeLogs() {
    const session = await decrypt((await cookies()).get("session")?.value);
    if (!session?.userId) return [];

    return await prisma.timeLog.findMany({
        where: { userId: session.userId as string },
        include: { project: { select: { title: true } } },
        orderBy: { startTime: "desc" },
        take: 50,
    });
}

function formatDuration(minutes: number) {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
}

export default async function TimePage() {
    const logs = await getTimeLogs();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Time Tracking</h1>
                {/* Add Log Time Button Component Here */}
            </div>

            <div className="rounded-md border">
                <div className="p-4">
                    {logs.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground">
                            <Clock className="h-10 w-10 mb-4 opacity-20" />
                            <p>No time logs recorded yet.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {logs.map((log) => (
                                <Card key={log.id} className="shadow-none border-b rounded-none last:border-0">
                                    <CardContent className="p-4 flex items-center justify-between">
                                        <div>
                                            <p className="font-medium">{log.description || "No description"}</p>
                                            <p className="text-sm text-muted-foreground">{log.project.title}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold font-mono">{formatDuration(log.duration || 0)}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {new Date(log.startTime).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Check, MoreVertical, Trash, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { createGoal, deleteGoal, toggleGoalStatus } from "@/app/actions/goals";
import { cn } from "@/lib/utils";

interface Goal {
    id: string;
    title: string;
    description: string | null;
    targetDate: Date | null;
    status: string;
}

export function GoalsClient({ goals }: { goals: Goal[] }) {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    async function handleCreate(formData: FormData) {
        setIsDialogOpen(false);
        const result = await createGoal(null, formData);
        if (result?.message === "Goal created successfully") {
            router.refresh();
        }
    }

    async function handleToggle(id: string) {
        startTransition(async () => {
            await toggleGoalStatus(id);
        });
    }

    async function handleDelete(id: string) {
        if (!confirm("Delete this goal?")) return;
        startTransition(async () => {
            await deleteGoal(id);
        });
    }

    const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS');
    const achievedGoals = goals.filter(g => g.status === 'ACHIEVED');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Target className="h-6 w-6 text-primary" />
                    <h1 className="text-3xl font-bold tracking-tight">Goals</h1>
                </div>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" /> New Goal
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {/* Active Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Active</span>
                            <Badge>{activeGoals.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {activeGoals.map(goal => (
                            <div key={goal.id} className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors group">
                                <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggle(goal.id)}
                                            className="h-5 w-5 rounded-full border border-primary flex items-center justify-center hover:bg-primary/10 transition-colors"
                                            disabled={isPending}
                                        >
                                            {/* Empty circle for todo */}
                                        </button>
                                        <span className={cn(isPending && "opacity-50")}>{goal.title}</span>
                                    </div>
                                    {goal.description && <p className="text-xs text-muted-foreground ml-7">{goal.description}</p>}
                                    {goal.targetDate && (
                                        <div className="text-xs text-muted-foreground ml-7">
                                            Target: {format(new Date(goal.targetDate), 'PPP')}
                                        </div>
                                    )}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity" onClick={() => handleDelete(goal.id)}>
                                    <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                        {activeGoals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No active goals.</p>}
                    </CardContent>
                </Card>

                {/* Achieved Goals */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center justify-between">
                            <span>Achieved</span>
                            <Badge variant="secondary">{achievedGoals.length}</Badge>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {achievedGoals.map(goal => (
                            <div key={goal.id} className="flex items-start justify-between p-3 border rounded-lg bg-muted/20 opacity-75">
                                <div className="space-y-1">
                                    <div className="font-medium flex items-center gap-2">
                                        <button
                                            onClick={() => handleToggle(goal.id)}
                                            className="h-5 w-5 rounded-full bg-primary flex items-center justify-center text-primary-foreground hover:bg-primary/90 transition-colors"
                                            disabled={isPending}
                                        >
                                            <Check className="h-3 w-3" />
                                        </button>
                                        <span className="line-through text-muted-foreground">{goal.title}</span>
                                    </div>
                                    {goal.description && <p className="text-xs text-muted-foreground ml-7">{goal.description}</p>}
                                </div>
                                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleDelete(goal.id)}>
                                    <Trash className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                                </Button>
                            </div>
                        ))}
                        {achievedGoals.length === 0 && <p className="text-sm text-muted-foreground text-center py-4">No achieved goals yet.</p>}
                    </CardContent>
                </Card>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>New Goal</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreate} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Goal Title</Label>
                            <Input id="title" name="title" required placeholder="Launch MVP" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="targetDate">Target Date</Label>
                            <Input id="targetDate" name="targetDate" type="date" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <Input id="description" name="description" placeholder="Success criteria..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Goal</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}

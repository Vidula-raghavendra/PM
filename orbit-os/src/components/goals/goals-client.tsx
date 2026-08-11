"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Plus, Check, Trash, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Card } from "@/components/ui/card";
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
    const [deleteTarget, setDeleteTarget] = useState<{ id: string; title: string } | null>(null);

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

    function handleDeleteConfirm() {
        if (!deleteTarget) return;
        startTransition(async () => {
            await deleteGoal(deleteTarget.id);
            setDeleteTarget(null);
        });
    }

    const activeGoals = goals.filter(g => g.status === 'IN_PROGRESS');
    const achievedGoals = goals.filter(g => g.status === 'ACHIEVED');

    return (
        <div className="space-y-16 max-w-[1120px] mx-auto px-8 py-12">
            <div className="flex items-end justify-between">
                <div>
                    <p className="text-overline uppercase text-muted-foreground mb-3">Goals</p>
                    <h2 className="font-serif text-display-md">Stay on track</h2>
                </div>
                <Button variant="accent" onClick={() => setIsDialogOpen(true)}>
                    <Plus className="mr-2 h-4 w-4" strokeWidth={2} /> New Goal
                </Button>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Active Goals */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-overline uppercase text-muted-foreground">Active</p>
                        <Badge variant="warning">{activeGoals.length}</Badge>
                    </div>
                    <div className="space-y-3">
                        {activeGoals.map(goal => (
                            <Card key={goal.id} className="p-4 hover:border-[hsl(30_36%_65%)] hover:shadow-sm group">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <button
                                            onClick={() => handleToggle(goal.id)}
                                            className="h-8 w-8 min-w-[32px] mt-0.5 rounded-full border border-border flex items-center justify-center hover:border-accent hover:bg-accent/10 transition-colors duration-[100ms]"
                                            disabled={isPending}
                                            aria-label={`Mark "${goal.title}" as achieved`}
                                        />
                                        <div className="min-w-0">
                                            <p className={cn("text-[15px] font-medium tracking-tight", isPending && "opacity-50")}>{goal.title}</p>
                                            {goal.description && <p className="text-[13px] text-muted-foreground mt-0.5">{goal.description}</p>}
                                            {goal.targetDate && (
                                                <p className="text-[12px] text-muted-foreground mt-1 tabular-nums">
                                                    Target: {format(new Date(goal.targetDate), 'PPP')}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[100ms]"
                                        onClick={() => setDeleteTarget({ id: goal.id, title: goal.title })}
                                        aria-label={`Delete goal "${goal.title}"`}
                                    >
                                        <Trash className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        {activeGoals.length === 0 && (
                            <div className="text-center py-12">
                                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary mx-auto mb-4">
                                    <Target className="h-5 w-5 text-muted-foreground" strokeWidth={1.5} />
                                </div>
                                <h3 className="font-serif text-display-sm mb-2">No active goals</h3>
                                <p className="text-[13px] text-muted-foreground">Set a goal to start tracking your progress.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Achieved Goals */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-overline uppercase text-muted-foreground">Achieved</p>
                        <Badge variant="success">{achievedGoals.length}</Badge>
                    </div>
                    <div className="space-y-3">
                        {achievedGoals.map(goal => (
                            <Card key={goal.id} className="p-4 bg-secondary/30 group">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex items-start gap-3 min-w-0">
                                        <button
                                            onClick={() => handleToggle(goal.id)}
                                            className="h-8 w-8 min-w-[32px] mt-0.5 rounded-full bg-accent flex items-center justify-center text-accent-foreground hover:bg-accent/90 transition-colors duration-[100ms]"
                                            disabled={isPending}
                                            aria-label={`Mark "${goal.title}" as in progress`}
                                        >
                                            <Check className="h-3.5 w-3.5" strokeWidth={2} />
                                        </button>
                                        <div className="min-w-0">
                                            <p className="text-[15px] font-medium tracking-tight line-through text-muted-foreground">{goal.title}</p>
                                            {goal.description && <p className="text-[13px] text-muted-foreground mt-0.5">{goal.description}</p>}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-[100ms]"
                                        onClick={() => setDeleteTarget({ id: goal.id, title: goal.title })}
                                        aria-label={`Delete goal "${goal.title}"`}
                                    >
                                        <Trash className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                                    </Button>
                                </div>
                            </Card>
                        ))}
                        {achievedGoals.length === 0 && (
                            <p className="text-[13px] text-muted-foreground text-center py-8">No achieved goals yet.</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Create Goal Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-serif text-display-sm">New Goal</DialogTitle>
                    </DialogHeader>
                    <form action={handleCreate} className="space-y-4">
                        <div className="space-y-1.5">
                            <Label htmlFor="title" className="text-[13px] font-medium">Goal Title</Label>
                            <Input id="title" name="title" required placeholder="Launch MVP" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="targetDate" className="text-[13px] font-medium">Target Date</Label>
                            <Input id="targetDate" name="targetDate" type="date" />
                        </div>
                        <div className="space-y-1.5">
                            <Label htmlFor="description" className="text-[13px] font-medium">Description</Label>
                            <Input id="description" name="description" placeholder="Success criteria..." />
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Create Goal</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="font-serif text-display-sm">Delete Goal</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &ldquo;{deleteTarget?.title}&rdquo;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => setDeleteTarget(null)}>Cancel</Button>
                        <Button type="button" variant="destructive" onClick={handleDeleteConfirm} disabled={isPending}>
                            {isPending ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}

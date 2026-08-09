"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { addCollaboratorToProject } from "@/app/actions/collaborators";
import { useState } from "react";

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button type="submit" disabled={pending} className="w-full">
            {pending ? "Adding..." : "Add Collaborator"}
        </Button>
    );
}

export function AddCollaboratorDialog({ projectId }: { projectId: string }) {
    const [state, action] = useActionState(addCollaboratorToProject, undefined);
    const [open, setOpen] = useState(false);

    // Close dialog on success
    if (state?.success && open) {
        setOpen(false);
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Plus className="h-4 w-4 mr-2" /> Invite
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Invite Collaborator</DialogTitle>
                    <DialogDescription>
                        Add someone to this project by email. If they have an account, they'll be notified immediately.
                    </DialogDescription>
                </DialogHeader>
                <form action={action} className="space-y-4">
                    <input type="hidden" name="projectId" value={projectId} />
                    <div className="space-y-2">
                        <Label htmlFor="collab-email">Email</Label>
                        <Input id="collab-email" name="email" type="email" placeholder="colleague@example.com" required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="collab-role">Role</Label>
                            <Input id="collab-role" name="role" defaultValue="MEMBER" placeholder="e.g. Designer, Lead" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="collab-split">Revenue Split %</Label>
                            <Input id="collab-split" name="splitPercentage" type="number" defaultValue="0" min="0" max="100" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="collab-color">Color</Label>
                        <Input id="collab-color" name="color" type="color" defaultValue="#3b82f6" className="h-10 w-full p-1 cursor-pointer" />
                    </div>

                    {state?.message && (
                        <p className="text-sm text-destructive">{state.message}</p>
                    )}

                    <SubmitButton />
                </form>
            </DialogContent>
        </Dialog>
    );
}

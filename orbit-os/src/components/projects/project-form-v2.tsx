"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Plus, Trash2, Calendar, FileText, Users, IndianRupee, HandCoins } from "lucide-react";
import { createDetailedProject } from "@/app/actions/projects-v2";

type Milestone = {
    id: string;
    title: string;
    amount: number;
    percentage: number;
    startDate: string;
    dueDate: string;
    checklist: string[];
};

type Collaborator = {
    id: string;
    email: string;
    role: string;
    color: string;
    splitPercentage: number;
};

export function ProjectFormV2() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form Data
    const [basics, setBasics] = useState({ title: "", client: "", description: "", type: "", area: "" });
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [finance, setFinance] = useState({ totalBudget: 0, currency: "INR" });
    const [contract, setContract] = useState<File | null>(null);

    // Helper: Add Milestone
    const addMilestone = () => {
        setMilestones([
            ...milestones,
            { id: crypto.randomUUID(), title: "", amount: 0, percentage: 0, startDate: "", dueDate: "", checklist: [] }
        ]);
    };

    // Helper: Remove Milestone
    const removeMilestone = (id: string) => {
        setMilestones(milestones.filter(m => m.id !== id));
    };

    // Helper: Update Milestone
    const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
        setMilestones(milestones.map(m => {
            if (m.id === id) {
                const updated = { ...m, [field]: value };
                // Auto-calc amount/percentage if budget exists
                if (field === 'percentage' && finance.totalBudget > 0) {
                    updated.amount = (finance.totalBudget * Number(value)) / 100;
                }
                if (field === 'amount' && finance.totalBudget > 0) {
                    updated.percentage = (Number(value) / finance.totalBudget) * 100;
                }
                return updated;
            }
            return m;
            return m;
        }));
    };

    // Helper: Add Checklist Item
    const addChecklistItem = (milestoneId: string, item: string) => {
        if (!item.trim()) return;
        setMilestones(milestones.map(m =>
            m.id === milestoneId ? { ...m, checklist: [...(m.checklist || []), item] } : m
        ));
    };

    // Helper: Remove Checklist Item
    const removeChecklistItem = (milestoneId: string, index: number) => {
        setMilestones(milestones.map(m =>
            m.id === milestoneId ? { ...m, checklist: m.checklist.filter((_, i) => i !== index) } : m
        ));
    };

    // Helper: Add Collaborator
    const addCollaborator = () => {
        setCollaborators([
            ...collaborators,
            { id: crypto.randomUUID(), email: "", role: "MEMBER", color: "#3b82f6", splitPercentage: 0 }
        ]);
    };

    // Helper: Update Collab
    const updateCollaborator = (id: string, field: keyof Collaborator, value: any) => {
        setCollaborators(collaborators.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", basics.title);
        formData.append("client", basics.client);
        formData.append("description", basics.description); // Scope of Work
        formData.append("type", basics.type);
        formData.append("area", basics.area);
        formData.append("totalBudget", finance.totalBudget.toString());
        formData.append("currency", finance.currency);
        formData.append("milestones", JSON.stringify(milestones));
        formData.append("collaborators", JSON.stringify(collaborators));
        if (contract) {
            formData.append("contract", contract);
        }

        const result = await createDetailedProject(null, formData);
        if (result?.message) {
            setError(result.message);
            setIsSubmitting(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Progress Steps */}
            <div className="flex justify-between mb-8 px-4">
                {[1, 2, 3, 4, 5].map((s) => (
                    <div key={s} className={`flex items-center ${s <= step ? "text-primary font-bold" : "text-muted-foreground"}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center border mr-2 ${s <= step ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            {s}
                        </div>
                        <span className="hidden sm:inline text-sm">
                            {s === 1 && "Start"}
                            {s === 2 && "Timeline"}
                            {s === 3 && "Finance"}
                            {s === 4 && "Team"}
                            {s === 5 && "Finish"}
                        </span>
                    </div>
                ))}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Project Basics - Scope & Details"}
                        {step === 2 && "Project Phases (Milestones)"}
                        {step === 3 && "Financial Setup"}
                        {step === 4 && "Team & Collaborators"}
                        {step === 5 && "Review & Contract"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "Let's start with the core details."}
                        {step === 2 && "Define the project phases and checklists."}
                        {step === 3 && "Set the Overall Income and Partners Share."}
                        {step === 4 && "Who are you working with?"}
                        {step === 5 && "Upload contracts and finalize."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* STEP 1: BASICS */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="project-title">Project Title</Label>
                                <Input id="project-title" value={basics.title} onChange={(e) => setBasics({ ...basics, title: e.target.value })} placeholder="e.g. Website Redesign" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client-name">Client Name</Label>
                                <Input id="client-name" value={basics.client} onChange={(e) => setBasics({ ...basics, client: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project-desc">Scope of Work</Label>
                                <textarea
                                    id="project-desc"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={basics.description}
                                    onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                                    placeholder="Detailed scope of work..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="project-type">Project Type</Label>
                                    <Input id="project-type" value={basics.type} onChange={(e) => setBasics({ ...basics, type: e.target.value })} placeholder="e.g. Residential, Commercial" />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project-area">Project Area</Label>
                                    <Input id="project-area" value={basics.area} onChange={(e) => setBasics({ ...basics, area: e.target.value })} placeholder="e.g. 5000 sqft" />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* STEP 2: TIMELINE */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {milestones.map((m, idx) => (
                                <div key={m.id} className="grid gap-4 p-4 border rounded-md sm:grid-cols-12 items-end bg-slate-50">
                                    <div className="sm:col-span-5 space-y-2">
                                        <Label htmlFor={`milestone-title-${m.id}`}>Milestone {idx + 1}</Label>
                                        <Input id={`milestone-title-${m.id}`} value={m.title} onChange={(e) => updateMilestone(m.id, 'title', e.target.value)} placeholder="Phase Name" />
                                    </div>
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor={`milestone-start-${m.id}`}>Start Date</Label>
                                        <Input id={`milestone-start-${m.id}`} type="date" value={m.startDate} onChange={(e) => updateMilestone(m.id, 'startDate', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor={`milestone-due-${m.id}`}>Due Date</Label>
                                        <Input id={`milestone-due-${m.id}`} type="date" value={m.dueDate} onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <Button variant="ghost" size="icon" onClick={() => removeMilestone(m.id)}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                    <div className="sm:col-span-12 mt-4">
                                        <Label>Phase Checklist</Label>
                                        <div className="space-y-2 mt-2">
                                            {m.checklist?.map((item, i) => (
                                                <div key={i} className="flex items-center gap-2">
                                                    <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                    <span className="text-sm flex-1">{item}</span>
                                                    <Button variant="ghost" size="icon" onClick={() => removeChecklistItem(m.id, i)} className="h-6 w-6">
                                                        <Trash2 className="h-3 w-3 text-muted-foreground" />
                                                    </Button>
                                                </div>
                                            ))}
                                            <div className="flex gap-2">
                                                <Input
                                                    placeholder="Add to-do item..."
                                                    className="h-8 text-sm"
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter') {
                                                            e.preventDefault();
                                                            addChecklistItem(m.id, e.currentTarget.value);
                                                            e.currentTarget.value = '';
                                                        }
                                                    }}
                                                />
                                                <Button size="sm" variant="outline" type="button" onClick={(e) => {
                                                    const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                                    addChecklistItem(m.id, input.value);
                                                    input.value = '';
                                                }}>Add</Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addMilestone} className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Project Phase
                            </Button>
                        </div>
                    )}

                    {/* STEP 3: FINANCE */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="total-budget">Overall Income from Project ({finance.currency})</Label>
                                <Input id="total-budget" type="number" value={finance.totalBudget} onChange={(e) => setFinance({ ...finance, totalBudget: Number(e.target.value) })} />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <Card className="bg-slate-50">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium">Partners Share</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold">
                                            {finance.currency} {((finance.totalBudget * collaborators.reduce((acc, c) => acc + c.splitPercentage, 0)) / 100).toLocaleString()}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            {collaborators.reduce((acc, c) => acc + c.splitPercentage, 0)}% of Overall Income
                                        </p>
                                    </CardContent>
                                </Card>
                                <Card className="bg-slate-50 border-primary/20">
                                    <CardHeader className="pb-2">
                                        <CardTitle className="text-sm font-medium text-primary">Your Revenue</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-2xl font-bold text-primary">
                                            {finance.currency} {(finance.totalBudget * (1 - collaborators.reduce((acc, c) => acc + c.splitPercentage, 0) / 100)).toLocaleString()}
                                        </div>
                                        <p className="text-xs text-muted-foreground">
                                            Remaining {100 - collaborators.reduce((acc, c) => acc + c.splitPercentage, 0)}%
                                        </p>
                                    </CardContent>
                                </Card>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-md space-y-4">
                                <h4 className="font-semibold text-sm flex items-center"><HandCoins className="h-4 w-4 mr-2" /> Payment Breakdown</h4>
                                {milestones.length === 0 && <p className="text-sm text-muted-foreground">Go back to add phases first.</p>}
                                {milestones.map((m) => (
                                    <div key={m.id} className="grid grid-cols-2 gap-4 items-center">
                                        <span className="text-sm truncate">{m.title || "Untitled Phase"}</span>
                                        <div className="flex gap-2">
                                            <div className="relative">
                                                <Input type="number" className="w-20" value={m.percentage} onChange={(e) => updateMilestone(m.id, 'percentage', e.target.value)} />
                                                <span className="absolute right-2 top-2 text-xs text-muted-foreground">%</span>
                                            </div>
                                            <div className="relative">
                                                <Input type="number" className="w-24" value={m.amount} onChange={(e) => updateMilestone(m.id, 'amount', e.target.value)} />
                                                <span className="absolute right-2 top-2 text-xs text-muted-foreground">{finance.currency}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* STEP 4: TEAM */}
                    {step === 4 && (
                        <div className="space-y-4">
                            {collaborators.map((c, idx) => (
                                <div key={c.id} className="grid gap-4 p-4 border rounded-md sm:grid-cols-12 items-end bg-slate-50">
                                    <div className="sm:col-span-4 space-y-2">
                                        <Label htmlFor={`collab-email-${c.id}`}>Email</Label>
                                        <Input id={`collab-email-${c.id}`} type="email" value={c.email} onChange={(e) => updateCollaborator(c.id, 'email', e.target.value)} placeholder="collab@example.com" />
                                    </div>
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label htmlFor={`collab-role-${c.id}`}>Role</Label>
                                        <Input id={`collab-role-${c.id}`} value={c.role} onChange={(e) => updateCollaborator(c.id, 'role', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor={`collab-color-${c.id}`}>Color</Label>
                                        <Input id={`collab-color-${c.id}`} type="color" value={c.color} onChange={(e) => updateCollaborator(c.id, 'color', e.target.value)} className="h-10 w-full p-1 cursor-pointer" />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label htmlFor={`collab-split-${c.id}`}>Split %</Label>
                                        <Input id={`collab-split-${c.id}`} type="number" value={c.splitPercentage} onChange={(e) => updateCollaborator(c.id, 'splitPercentage', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-1">
                                        <Button variant="ghost" size="icon" onClick={() => setCollaborators(collaborators.filter(cb => cb.id !== c.id))}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addCollaborator} className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Collaborator
                            </Button>
                        </div>
                    )}

                    {/* STEP 5: REVIEW */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="contract-file">Upload Contract (PDF)</Label>
                                <Input id="contract-file" type="file" accept=".pdf" onChange={(e) => setContract(e.target.files?.[0] || null)} />
                                <p className="text-xs text-muted-foreground">Optional, but recommended.</p>
                            </div>

                            <div className="bg-slate-100 p-4 rounded-md space-y-2 text-sm">
                                <h4 className="font-bold">Summary</h4>
                                <div className="grid grid-cols-2">
                                    <span>Project:</span> <span className="font-medium">{basics.title}</span>
                                    <span>Budget:</span> <span className="font-medium">{finance.currency} {finance.totalBudget}</span>
                                    <span>Milestones:</span> <span className="font-medium">{milestones.length}</span>
                                    <span>Team:</span> <span className="font-medium">{collaborators.length + 1} (including you)</span>
                                </div>
                            </div>
                        </div>
                    )}

                    {error && <p className="text-red-500 text-sm mt-4">{error}</p>}

                </CardContent>
                <CardFooter className="flex justify-between">
                    {step > 1 ? (
                        <Button variant="outline" onClick={() => setStep(step - 1)}>Back</Button>
                    ) : (
                        <div /> // Spacer
                    )}

                    {step < 5 ? (
                        <Button onClick={() => setStep(step + 1)}>Next</Button>
                    ) : (
                        <Button onClick={handleSubmit} disabled={isSubmitting}>
                            {isSubmitting ? "Creating Project..." : "Create Project"}
                        </Button>
                    )}
                </CardFooter>
            </Card>
        </div>
    );
}

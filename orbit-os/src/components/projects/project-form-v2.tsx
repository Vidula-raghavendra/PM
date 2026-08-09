"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, Trash2, ChevronDown, ChevronUp, HandCoins } from "lucide-react";
import { createDetailedProject } from "@/app/actions/projects-v2";

type Milestone = {
    id: string;
    title: string;
    description: string;
    amount: number;
    percentage: number;
    startDate: string;
    dueDate: string;
    checklist: string[];
    assignedCollaborators: string[]; // collaborator IDs active in this phase
};

type Collaborator = {
    id: string;
    email: string;
    role: string;
    color: string;
    splitPercentage: number;
};

/** Parse a numeric string, stripping leading zeros. Returns 0 for empty/invalid. */
function parseNum(raw: string): number {
    if (raw === "" || raw === "-") return 0;
    const n = Number(raw);
    return Number.isNaN(n) ? 0 : n;
}

/** Format a number for display in inputs — avoids leading zeros like "01000". */
function numDisplay(n: number): string {
    return n === 0 ? "" : String(n);
}

export function ProjectFormV2() {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expandedPhase, setExpandedPhase] = useState<string | null>(null);

    // Form Data
    const [basics, setBasics] = useState({ title: "", client: "", description: "", type: "", category: "" });
    const [milestones, setMilestones] = useState<Milestone[]>([]);
    const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
    const [finance, setFinance] = useState({ totalBudget: 0, currency: "INR" });
    const [contract, setContract] = useState<File | null>(null);

    const stepLabels = ["Details", "Phases", "Team", "Budget", "Review"];

    // --- Milestone helpers ---
    const addMilestone = () => {
        const m: Milestone = {
            id: crypto.randomUUID(), title: "", description: "",
            amount: 0, percentage: 0, startDate: "", dueDate: "", checklist: [],
            assignedCollaborators: []
        };
        setMilestones([...milestones, m]);
        setExpandedPhase(m.id);
    };

    const removeMilestone = (id: string) => {
        setMilestones(milestones.filter(m => m.id !== id));
        if (expandedPhase === id) setExpandedPhase(null);
    };

    const updateMilestone = (id: string, field: keyof Milestone, value: any) => {
        setMilestones(milestones.map(m => {
            if (m.id !== id) return m;
            const updated = { ...m, [field]: value };
            if (field === 'percentage' && finance.totalBudget > 0) {
                updated.amount = Math.round((finance.totalBudget * Number(value)) / 100);
            }
            if (field === 'amount' && finance.totalBudget > 0) {
                updated.percentage = Math.round((Number(value) / finance.totalBudget) * 100 * 100) / 100;
            }
            return updated;
        }));
    };

    const addChecklistItem = (milestoneId: string, item: string) => {
        if (!item.trim()) return;
        setMilestones(milestones.map(m =>
            m.id === milestoneId ? { ...m, checklist: [...(m.checklist || []), item] } : m
        ));
    };

    const removeChecklistItem = (milestoneId: string, index: number) => {
        setMilestones(milestones.map(m =>
            m.id === milestoneId ? { ...m, checklist: m.checklist.filter((_, i) => i !== index) } : m
        ));
    };

    // --- Collaborator helpers ---
    const addCollaborator = () => {
        setCollaborators([
            ...collaborators,
            { id: crypto.randomUUID(), email: "", role: "MEMBER", color: "#3b82f6", splitPercentage: 0 }
        ]);
    };

    const updateCollaborator = (id: string, field: keyof Collaborator, value: any) => {
        setCollaborators(collaborators.map(c => c.id === id ? { ...c, [field]: value } : c));
    };

    const totalCollabSplit = collaborators.reduce((acc, c) => acc + c.splitPercentage, 0);

    const handleSubmit = async () => {
        setIsSubmitting(true);
        setError(null);

        const formData = new FormData();
        formData.append("title", basics.title);
        formData.append("client", basics.client);
        formData.append("description", basics.description);
        formData.append("type", basics.type);
        formData.append("area", basics.category);
        formData.append("totalBudget", finance.totalBudget.toString());
        formData.append("currency", finance.currency);
        formData.append("milestones", JSON.stringify(milestones));
        formData.append("collaborators", JSON.stringify(collaborators));
        if (contract) formData.append("contract", contract);

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
                {stepLabels.map((label, i) => {
                    const s = i + 1;
                    return (
                        <div key={s} className={`flex items-center ${s <= step ? "text-primary font-bold" : "text-muted-foreground"}`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border mr-2 ${s <= step ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                                {s}
                            </div>
                            <span className="hidden sm:inline text-sm">{label}</span>
                        </div>
                    );
                })}
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>
                        {step === 1 && "Project Details"}
                        {step === 2 && "Project Phases"}
                        {step === 3 && "Team & Collaborators"}
                        {step === 4 && "Budget & Payment Split"}
                        {step === 5 && "Review & Contract"}
                    </CardTitle>
                    <CardDescription>
                        {step === 1 && "What's this project about?"}
                        {step === 2 && "Break the project into phases with deliverables."}
                        {step === 3 && "Add your team — you'll split the budget in the next step."}
                        {step === 4 && "Set the total budget and how it's divided."}
                        {step === 5 && "Upload contracts and finalize."}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">

                    {/* ─── STEP 1: DETAILS ─── */}
                    {step === 1 && (
                        <div className="grid gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="project-title">Project Title</Label>
                                <Input id="project-title" value={basics.title} onChange={(e) => setBasics({ ...basics, title: e.target.value })} placeholder="e.g. Website Redesign for Acme" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="client-name">Client Name</Label>
                                <Input id="client-name" value={basics.client} onChange={(e) => setBasics({ ...basics, client: e.target.value })} placeholder="e.g. Acme Corp" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="project-type">Project Type</Label>
                                    <Select value={basics.type} onValueChange={(v) => setBasics({ ...basics, type: v })}>
                                        <SelectTrigger id="project-type">
                                            <SelectValue placeholder="Select type" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Consulting">Consulting</SelectItem>
                                            <SelectItem value="Development">Development</SelectItem>
                                            <SelectItem value="Design">Design</SelectItem>
                                            <SelectItem value="Marketing">Marketing</SelectItem>
                                            <SelectItem value="Research">Research</SelectItem>
                                            <SelectItem value="Operations">Operations</SelectItem>
                                            <SelectItem value="Other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="project-category">Category</Label>
                                    <Select value={basics.category} onValueChange={(v) => setBasics({ ...basics, category: v })}>
                                        <SelectTrigger id="project-category">
                                            <SelectValue placeholder="Select category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="One-time">One-time</SelectItem>
                                            <SelectItem value="Retainer">Retainer / Ongoing</SelectItem>
                                            <SelectItem value="Fixed-price">Fixed Price</SelectItem>
                                            <SelectItem value="Hourly">Hourly</SelectItem>
                                            <SelectItem value="Milestone-based">Milestone-based</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="project-desc">Description</Label>
                                <textarea
                                    id="project-desc"
                                    className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                    value={basics.description}
                                    onChange={(e) => setBasics({ ...basics, description: e.target.value })}
                                    placeholder="What does this project involve? Key goals, deliverables, constraints..."
                                />
                            </div>
                        </div>
                    )}

                    {/* ─── STEP 2: PHASES ─── */}
                    {step === 2 && (
                        <div className="space-y-4">
                            {milestones.map((m, idx) => {
                                const isExpanded = expandedPhase === m.id;
                                return (
                                    <div key={m.id} className="border rounded-md bg-slate-50 overflow-hidden">
                                        {/* Phase header — always visible */}
                                        <div className="flex items-center gap-3 p-4">
                                            <button
                                                type="button"
                                                onClick={() => setExpandedPhase(isExpanded ? null : m.id)}
                                                className="text-muted-foreground hover:text-primary"
                                            >
                                                {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                                            </button>
                                            <div className="flex-1 grid gap-3 sm:grid-cols-12 items-end">
                                                <div className="sm:col-span-4 space-y-1">
                                                    <Label className="text-xs">Phase {idx + 1}</Label>
                                                    <Input value={m.title} onChange={(e) => updateMilestone(m.id, 'title', e.target.value)} placeholder="Phase name" />
                                                </div>
                                                <div className="sm:col-span-3 space-y-1">
                                                    <Label className="text-xs">Start</Label>
                                                    <Input type="date" value={m.startDate} onChange={(e) => updateMilestone(m.id, 'startDate', e.target.value)} />
                                                </div>
                                                <div className="sm:col-span-3 space-y-1">
                                                    <Label className="text-xs">Due</Label>
                                                    <Input type="date" value={m.dueDate} onChange={(e) => updateMilestone(m.id, 'dueDate', e.target.value)} />
                                                </div>
                                                <div className="sm:col-span-2 flex justify-end">
                                                    <Button variant="ghost" size="icon" onClick={() => removeMilestone(m.id)}>
                                                        <Trash2 className="h-4 w-4 text-red-500" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Expanded detail */}
                                        {isExpanded && (
                                            <div className="px-4 pb-4 pt-0 space-y-4 border-t mx-4 mt-0 pt-4">
                                                <div className="space-y-2">
                                                    <Label>Phase Description</Label>
                                                    <textarea
                                                        className="flex min-h-[60px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                                        value={m.description}
                                                        onChange={(e) => updateMilestone(m.id, 'description', e.target.value)}
                                                        placeholder="What happens in this phase? Key deliverables, dependencies, notes..."
                                                    />
                                                </div>

                                                {/* Assigned collaborators for this phase */}
                                                {collaborators.length > 0 && (
                                                    <div className="space-y-2">
                                                        <Label>Who's involved in this phase?</Label>
                                                        <div className="flex flex-wrap gap-2">
                                                            {collaborators.map((c) => {
                                                                const isAssigned = m.assignedCollaborators.includes(c.id);
                                                                return (
                                                                    <button
                                                                        key={c.id}
                                                                        type="button"
                                                                        onClick={() => {
                                                                            const next = isAssigned
                                                                                ? m.assignedCollaborators.filter(id => id !== c.id)
                                                                                : [...m.assignedCollaborators, c.id];
                                                                            updateMilestone(m.id, 'assignedCollaborators', next);
                                                                        }}
                                                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm transition-colors ${isAssigned ? "border-primary bg-primary/10 text-primary" : "border-border bg-background text-muted-foreground hover:bg-muted"}`}
                                                                    >
                                                                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                                                                        {c.email || c.role || "Unnamed"}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <Label>Checklist</Label>
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
                                                                placeholder="Add a deliverable or task..."
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
                                        )}
                                    </div>
                                );
                            })}
                            <Button variant="outline" onClick={addMilestone} className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Phase
                            </Button>
                        </div>
                    )}

                    {/* ─── STEP 3: TEAM (moved before budget) ─── */}
                    {step === 3 && (
                        <div className="space-y-4">
                            {collaborators.map((c) => (
                                <div key={c.id} className="grid gap-4 p-4 border rounded-md sm:grid-cols-12 items-end bg-slate-50">
                                    <div className="sm:col-span-5 space-y-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={c.email} onChange={(e) => updateCollaborator(c.id, 'email', e.target.value)} placeholder="collab@example.com" />
                                    </div>
                                    <div className="sm:col-span-3 space-y-2">
                                        <Label>Role</Label>
                                        <Input value={c.role} onChange={(e) => updateCollaborator(c.id, 'role', e.target.value)} />
                                    </div>
                                    <div className="sm:col-span-2 space-y-2">
                                        <Label>Color</Label>
                                        <Input type="color" value={c.color} onChange={(e) => updateCollaborator(c.id, 'color', e.target.value)} className="h-10 w-full p-1 cursor-pointer" />
                                    </div>
                                    <div className="sm:col-span-2 flex justify-end">
                                        <Button variant="ghost" size="icon" onClick={() => setCollaborators(collaborators.filter(cb => cb.id !== c.id))}>
                                            <Trash2 className="h-4 w-4 text-red-500" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                            <Button variant="outline" onClick={addCollaborator} className="w-full border-dashed">
                                <Plus className="h-4 w-4 mr-2" /> Add Collaborator
                            </Button>
                            {collaborators.length === 0 && (
                                <p className="text-sm text-muted-foreground text-center py-4">No collaborators yet. You can skip this step if you're working solo.</p>
                            )}
                        </div>
                    )}

                    {/* ─── STEP 4: BUDGET & SPLIT ─── */}
                    {step === 4 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="total-budget">Total Project Budget ({finance.currency})</Label>
                                <Input
                                    id="total-budget"
                                    type="text"
                                    inputMode="numeric"
                                    value={numDisplay(finance.totalBudget)}
                                    placeholder="0"
                                    onChange={(e) => setFinance({ ...finance, totalBudget: parseNum(e.target.value) })}
                                />
                            </div>

                            {/* Split cards — only show if there are collaborators */}
                            {collaborators.length > 0 && (
                                <>
                                    <div className="space-y-3">
                                        <h4 className="font-semibold text-sm">Revenue Split</h4>
                                        {collaborators.map((c) => (
                                            <div key={c.id} className="flex items-center gap-4 p-3 border rounded-md bg-slate-50">
                                                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: c.color }} />
                                                <span className="text-sm flex-1 truncate">{c.email || "Unnamed"}</span>
                                                <div className="flex items-center gap-2">
                                                    <Input
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="w-20 text-right"
                                                        value={numDisplay(c.splitPercentage)}
                                                        placeholder="0"
                                                        onChange={(e) => updateCollaborator(c.id, 'splitPercentage', parseNum(e.target.value))}
                                                    />
                                                    <span className="text-xs text-muted-foreground w-4">%</span>
                                                    <span className="text-sm font-medium w-28 text-right">
                                                        {finance.currency} {Math.round(finance.totalBudget * c.splitPercentage / 100).toLocaleString()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <Card className="bg-slate-50">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium">Team Share</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold">
                                                    {finance.currency} {Math.round(finance.totalBudget * totalCollabSplit / 100).toLocaleString()}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{totalCollabSplit}% of budget</p>
                                            </CardContent>
                                        </Card>
                                        <Card className="bg-slate-50 border-primary/20">
                                            <CardHeader className="pb-2">
                                                <CardTitle className="text-sm font-medium text-primary">Your Revenue</CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="text-2xl font-bold text-primary">
                                                    {finance.currency} {Math.round(finance.totalBudget * (1 - totalCollabSplit / 100)).toLocaleString()}
                                                </div>
                                                <p className="text-xs text-muted-foreground">{100 - totalCollabSplit}% remaining</p>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </>
                            )}

                            {/* Phase payment breakdown */}
                            {milestones.length > 0 && (
                                <div className="bg-slate-50 p-4 rounded-md space-y-4">
                                    <h4 className="font-semibold text-sm flex items-center"><HandCoins className="h-4 w-4 mr-2" /> Payment by Phase</h4>
                                    {milestones.map((m) => (
                                        <div key={m.id} className="grid grid-cols-12 gap-4 items-center">
                                            <span className="col-span-6 text-sm truncate">{m.title || "Untitled Phase"}</span>
                                            <div className="col-span-3 flex items-center gap-1">
                                                <Input
                                                    type="text"
                                                    inputMode="numeric"
                                                    className="w-20"
                                                    value={numDisplay(m.percentage)}
                                                    placeholder="0"
                                                    onChange={(e) => updateMilestone(m.id, 'percentage', parseNum(e.target.value))}
                                                />
                                                <span className="text-xs text-muted-foreground">%</span>
                                            </div>
                                            <div className="col-span-3 text-sm font-medium text-right">
                                                {finance.currency} {Math.round(finance.totalBudget * m.percentage / 100).toLocaleString()}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* ─── STEP 5: REVIEW ─── */}
                    {step === 5 && (
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="contract-file">Upload Contract (PDF)</Label>
                                <Input id="contract-file" type="file" accept=".pdf" onChange={(e) => setContract(e.target.files?.[0] || null)} />
                                <p className="text-xs text-muted-foreground">Optional, but recommended.</p>
                            </div>

                            <div className="bg-slate-100 p-4 rounded-md space-y-3 text-sm">
                                <h4 className="font-bold">Summary</h4>
                                <div className="grid grid-cols-2 gap-1">
                                    <span className="text-muted-foreground">Project:</span> <span className="font-medium">{basics.title || "—"}</span>
                                    <span className="text-muted-foreground">Client:</span> <span className="font-medium">{basics.client || "—"}</span>
                                    <span className="text-muted-foreground">Type:</span> <span className="font-medium">{basics.type || "—"}</span>
                                    <span className="text-muted-foreground">Category:</span> <span className="font-medium">{basics.category || "—"}</span>
                                    <span className="text-muted-foreground">Budget:</span> <span className="font-medium">{finance.currency} {finance.totalBudget.toLocaleString()}</span>
                                    <span className="text-muted-foreground">Phases:</span> <span className="font-medium">{milestones.length}</span>
                                    <span className="text-muted-foreground">Team:</span> <span className="font-medium">{collaborators.length + 1} (including you)</span>
                                    {collaborators.length > 0 && (
                                        <>
                                            <span className="text-muted-foreground">Your share:</span>
                                            <span className="font-medium text-primary">
                                                {finance.currency} {Math.round(finance.totalBudget * (1 - totalCollabSplit / 100)).toLocaleString()} ({100 - totalCollabSplit}%)
                                            </span>
                                        </>
                                    )}
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
                        <div />
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

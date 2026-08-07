// The database uses snake_case and returns dates as ISO strings; the UI works
// in camelCase with Date objects. Mapping in one place stops pages from
// reaching into raw rows, which is what caused the project detail page to
// crash on `m.dueDate.toLocaleDateString()` (dueDate was undefined, and
// due_date was a string).

const toDate = (value: unknown): Date | null =>
    typeof value === "string" || value instanceof Date
        ? new Date(value as string)
        : null;

const toNumber = (value: unknown): number => Number(value ?? 0) || 0;

export type Milestone = {
    id: string;
    projectId: string;
    title: string;
    description: string | null;
    checklist: string[];
    amount: number;
    percentage: number;
    status: "PENDING" | "PAID" | "OVERDUE";
    startDate: Date | null;
    dueDate: Date | null;
    paidAt: Date | null;
};

export function mapMilestone(row: any): Milestone {
    return {
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        description: row.description ?? null,
        checklist: Array.isArray(row.checklist) ? row.checklist : [],
        amount: toNumber(row.amount),
        percentage: toNumber(row.percentage),
        status: row.status ?? "PENDING",
        startDate: toDate(row.start_date),
        dueDate: toDate(row.due_date),
        paidAt: toDate(row.paid_at),
    };
}

export type Task = {
    id: string;
    projectId: string;
    title: string;
    status: "TODO" | "IN_PROGRESS" | "DONE";
    priority: "LOW" | "MEDIUM" | "HIGH";
    dueDate: Date | null;
};

export function mapTask(row: any): Task {
    return {
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        status: row.status ?? "TODO",
        priority: row.priority ?? "MEDIUM",
        dueDate: toDate(row.due_date),
    };
}

export type Person = {
    id: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    sector: string | null;
    purpose: string | null;
};

export function mapProfile(row: any): Person | null {
    if (!row) return null;
    return {
        id: row.id,
        email: row.email ?? "",
        fullName: row.full_name ?? null,
        phone: row.phone ?? null,
        sector: row.sector ?? null,
        purpose: row.purpose ?? null,
    };
}

export type Collaborator = {
    id: string;
    projectId: string;
    userId: string | null;
    email: string;
    role: string;
    color: string;
    splitPercentage: number;
    /** Null until the invited person signs up. */
    user: Person | null;
};

export function mapCollaborator(row: any): Collaborator {
    return {
        id: row.id,
        projectId: row.project_id,
        userId: row.user_id ?? null,
        email: row.email ?? "",
        role: row.role ?? "MEMBER",
        color: row.color ?? "#3b82f6",
        splitPercentage: toNumber(row.split_percentage),
        user: mapProfile(row.user),
    };
}

export type TimeLog = {
    id: string;
    projectId: string;
    userId: string;
    startTime: Date | null;
    endTime: Date | null;
    duration: number;
    description: string | null;
    project?: { title: string } | null;
    user?: Person | null;
};

export function mapTimeLog(row: any): TimeLog {
    return {
        id: row.id,
        projectId: row.project_id,
        userId: row.user_id,
        startTime: toDate(row.start_time),
        endTime: toDate(row.end_time),
        duration: toNumber(row.duration),
        description: row.description ?? null,
        project: row.project ? { title: row.project.title } : null,
        user: mapProfile(row.user),
    };
}

export type ProjectDocument = {
    id: string;
    projectId: string;
    title: string;
    storagePath: string;
    type: "CONTRACT" | "INVOICE" | "OTHER";
};

export function mapDocument(row: any): ProjectDocument {
    return {
        id: row.id,
        projectId: row.project_id,
        title: row.title,
        storagePath: row.storage_path,
        type: row.type ?? "OTHER",
    };
}

export type Project = {
    id: string;
    title: string;
    description: string | null;
    client: string | null;
    type: string | null;
    area: string | null;
    status: "ACTIVE" | "COMPLETED" | "ARCHIVED";
    startDate: Date | null;
    endDate: Date | null;
    totalBudget: number;
    currency: string;
    ownerId: string;
    milestones: Milestone[];
    tasks: Task[];
    collaborators: Collaborator[];
    documents: ProjectDocument[];
    timeLogs: TimeLog[];
};

export function mapProject(row: any): Project {
    return {
        id: row.id,
        title: row.title,
        description: row.description ?? null,
        client: row.client ?? null,
        type: row.type ?? null,
        area: row.area ?? null,
        status: row.status ?? "ACTIVE",
        startDate: toDate(row.start_date),
        endDate: toDate(row.end_date),
        totalBudget: toNumber(row.total_budget),
        currency: row.currency ?? "INR",
        ownerId: row.owner_id,
        milestones: (row.milestones ?? []).map(mapMilestone),
        tasks: (row.tasks ?? []).map(mapTask),
        collaborators: (row.collaborators ?? []).map(mapCollaborator),
        documents: (row.documents ?? []).map(mapDocument),
        timeLogs: (row.time_logs ?? []).map(mapTimeLog),
    };
}

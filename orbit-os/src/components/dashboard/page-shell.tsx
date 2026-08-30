import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/**
 * Shared dashboard chrome. Every page in the app uses these so the grid,
 * rhythm and card treatment are defined once — the difference between a
 * product that looks designed and one that looks assembled page by page.
 */

export function PageShell({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div
            className={cn(
                "mx-auto max-w-[1200px] animate-page-rise space-y-6 px-5 py-6 sm:px-8 sm:py-8",
                className
            )}
        >
            {children}
        </div>
    );
}

export function PageHeader({
    eyebrow,
    title,
    description,
    action,
}: {
    eyebrow: string;
    title: string;
    description?: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="min-w-0">
                <p className="eyebrow mb-2 text-accent-ink">{eyebrow}</p>
                <h2 className="font-display text-[32px] font-medium italic leading-[1.15] tracking-[-0.01em]">{title}</h2>
                {description && (
                    <p className="mt-2 max-w-[520px] text-[14px] leading-[1.6] text-muted-foreground">
                        {description}
                    </p>
                )}
            </div>
            {action && <div className="shrink-0 self-start sm:self-auto">{action}</div>}
        </div>
    );
}

/** A titled card container for a table or list. */
export function Panel({
    title,
    action,
    children,
    className,
    bodyClassName,
}: {
    title?: string;
    action?: ReactNode;
    children: ReactNode;
    className?: string;
    bodyClassName?: string;
}) {
    return (
        <div className={cn("surface-card overflow-hidden", className)}>
            {title && (
                <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4 sm:px-6">
                    <p className="text-[15px] font-semibold tracking-[-0.01em]">{title}</p>
                    {action}
                </div>
            )}
            <div className={bodyClassName}>{children}</div>
        </div>
    );
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    action,
}: {
    icon?: LucideIcon;
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            {Icon && (
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--background-alt))] ring-1 ring-border">
                    <Icon className="h-5 w-5 text-accent-ink" strokeWidth={1.75} />
                </div>
            )}
            <h3 className="mb-2 text-[17px] font-semibold tracking-[-0.015em]">{title}</h3>
            <p className="mx-auto max-w-[300px] text-[13px] leading-[1.6] text-muted-foreground">
                {description}
            </p>
            {action && <div className="mt-6">{action}</div>}
        </div>
    );
}

/**
 * Table primitives. Rows share one grid template with their header, so
 * columns stay aligned without a table element and still collapse
 * gracefully on narrow screens.
 */
export function DataTable({
    columns,
    children,
}: {
    columns: { label: string; className?: string }[];
    children: ReactNode;
}) {
    return (
        <div className="overflow-x-auto">
            <div className="min-w-[560px]">
                <div className="grid grid-cols-[1fr_auto_auto] gap-4 border-b border-border bg-[hsl(var(--background-alt))] px-5 py-2.5 sm:px-6">
                    {columns.map((c) => (
                        <span
                            key={c.label}
                            className={cn("eyebrow text-[10px] text-muted-foreground", c.className)}
                        >
                            {c.label}
                        </span>
                    ))}
                </div>
                {children}
            </div>
        </div>
    );
}

export function DataRow({ children }: { children: ReactNode }) {
    return (
        <div className="grid grid-cols-[1fr_auto_auto] items-center gap-4 border-b border-border px-5 py-3.5 transition-colors duration-150 last:border-0 hover:bg-[hsl(var(--background-alt))] sm:px-6">
            {children}
        </div>
    );
}

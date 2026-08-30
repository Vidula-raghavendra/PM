import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold leading-[1.4] transition-colors duration-[100ms] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-[hsl(var(--neutral-bg))] text-[hsl(var(--neutral-fg))]",
                destructive:
                    "border-transparent bg-destructive-bg text-destructive",
                outline: "text-foreground",
                success: "border-transparent bg-success-bg text-success",
                warning: "border-transparent bg-warning-bg text-warning",
                paid: "border-transparent bg-success-bg text-success",
                pending: "border-transparent bg-warning-bg text-warning",
                overdue: "border-transparent bg-destructive-bg text-destructive",
                archived: "border-transparent bg-[hsl(var(--neutral-bg))] text-[hsl(var(--neutral-fg))]",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }

import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors duration-[100ms] focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
    {
        variants: {
            variant: {
                default:
                    "border-transparent bg-primary text-primary-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                destructive:
                    "border-transparent bg-[hsl(11_55%_95%)] text-destructive",
                outline: "text-foreground",
                success: "border-transparent bg-[hsl(74_37%_90%)] text-[hsl(74_37%_29%)]",
                warning: "border-transparent bg-[hsl(36_87%_93%)] text-[hsl(38_74%_31%)]",
                paid: "border-transparent bg-[hsl(74_37%_90%)] text-[hsl(74_37%_29%)]",
                pending: "border-transparent bg-[hsl(36_87%_93%)] text-[hsl(38_74%_31%)]",
                overdue: "border-transparent bg-[hsl(11_55%_95%)] text-[hsl(10_61%_40%)]",
                archived: "border-transparent bg-secondary text-muted-foreground",
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

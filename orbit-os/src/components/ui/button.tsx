import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const buttonVariants = cva(
    // active:scale gives every button the same tactile press. Motion on
    // transform+color only — never on layout properties.
    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full text-[13px] font-semibold ring-offset-background transition-[background-color,box-shadow,transform,color,border-color] duration-200 ease-out hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:hover:translate-y-0",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground shadow-sm hover:bg-[hsl(0_0%_16%)] hover:shadow-card",
                accent:
                    "bg-accent text-accent-foreground shadow-sm hover:bg-[hsl(79_98%_44%)] hover:shadow-glow",
                destructive:
                    "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90 hover:shadow-card",
                outline:
                    "border border-border bg-card hover:border-[hsl(0_0%_82%)] hover:bg-secondary hover:shadow-sm",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-[hsl(0_0%_92%)]",
                ghost: "hover:bg-secondary hover:text-foreground hover:translate-y-0",
                link: "text-primary underline-offset-4 hover:translate-y-0 hover:text-accent-ink hover:underline",
            },
            size: {
                default: "h-10 px-5 py-2",
                sm: "h-8 px-3",
                lg: "h-12 px-7 text-[14px]",
                icon: "h-10 w-10 rounded-lg",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : "button"
        return (
            <Comp
                className={cn(buttonVariants({ variant, size, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button, buttonVariants }

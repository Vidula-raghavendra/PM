import type { ReactNode } from "react";
import { ScrollReveal } from "./scroll-reveal";

/**
 * Alternating image-and-copy block. The reference repeats this pattern with
 * the sides flipped each time, which is what gives a long page rhythm without
 * needing new layouts.
 */
export function SplitFeature({
    overline,
    title,
    body,
    visual,
    reverse = false,
}: {
    overline: string;
    title: ReactNode;
    body: string;
    visual: ReactNode;
    reverse?: boolean;
}) {
    return (
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <ScrollReveal className={reverse ? "lg:order-2" : undefined}>
                <div className="max-w-[440px]">
                    <p className="text-overline uppercase text-muted-foreground mb-5">
                        {overline}
                    </p>
                    <h2 className="font-serif text-display-md sm:text-display-lg leading-[1.02] tracking-[-0.02em] mb-6">
                        {title}
                    </h2>
                    <p className="text-[15px] text-muted-foreground leading-relaxed">
                        {body}
                    </p>
                </div>
            </ScrollReveal>

            <ScrollReveal delay={120} className={reverse ? "lg:order-1" : undefined}>
                {visual}
            </ScrollReveal>
        </div>
    );
}

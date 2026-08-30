import type { ReactNode } from "react";
import { Reveal } from "./reveal";

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
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
            <Reveal direction={reverse ? "right" : "left"} className={reverse ? "lg:order-2" : undefined}>
                <div className="max-w-[440px]">
                    <p className="eyebrow mb-5 text-accent-ink">{overline}</p>
                    <h2 className="mb-6 font-display text-[clamp(2rem,4vw,2.875rem)] font-medium italic leading-[1.12] tracking-[-0.01em]">
                        {title}
                    </h2>
                    <p className="text-[16px] leading-[1.6] text-muted-foreground">
                        {body}
                    </p>
                </div>
            </Reveal>

            <Reveal delay={140} scale direction={reverse ? "left" : "right"} className={reverse ? "lg:order-1" : undefined}>
                {visual}
            </Reveal>
        </div>
    );
}

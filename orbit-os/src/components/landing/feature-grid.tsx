import { Reveal } from "./reveal";

const features = [
    {
        title: "Project Phases",
        desc: "Break work into milestones with deadlines, checklists, and real-time progress.",
    },
    {
        title: "Payment Milestones",
        desc: "Tie payments to deliverables. Track pending, paid, and overdue in one view.",
    },
    {
        title: "Revenue Splits",
        desc: "Add collaborators, assign roles, split revenue per project automatically.",
    },
    {
        title: "Time Tracking",
        desc: "One-click timer. Log hours per project. Export timesheets instantly.",
    },
    {
        title: "Calendar",
        desc: "Deadlines, milestones, and meetings — color-coded and always in sync.",
    },
    {
        title: "Goals",
        desc: "Set targets with deadlines. Track active vs achieved. Stay accountable.",
    },
];

/**
 * Six capabilities as an open editorial grid. No cards and no decorative
 * icons: a hairline rule and the typography carry the structure, which is
 * what keeps this from reading as a generated feature-tile wall.
 */
export function FeatureGrid() {
    return (
        <div className="grid grid-cols-1 gap-x-14 gap-y-1 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f, i) => (
                <Reveal key={f.title} delay={i * 70}>
                    <div className="border-t border-border py-9">
                        <h3 className="text-[17px] font-semibold tracking-[-0.015em]">
                            {f.title}
                        </h3>
                        <p className="mt-2.5 max-w-[34ch] text-[14px] leading-[1.65] text-muted-foreground">
                            {f.desc}
                        </p>
                    </div>
                </Reveal>
            ))}
        </div>
    );
}

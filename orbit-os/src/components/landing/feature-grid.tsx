"use client";

import { useRef, useState, useCallback } from "react";
import { ScrollReveal } from "./scroll-reveal";

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

function FeatureCard({ title, desc, index }: { title: string; desc: string; index: number }) {
    const cardRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = useCallback((e: React.MouseEvent) => {
        const rect = cardRef.current?.getBoundingClientRect();
        if (!rect) return;
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        });
    }, []);

    return (
        <ScrollReveal delay={index * 70}>
            <div
                ref={cardRef}
                className="relative group p-6 rounded-lg border border-transparent transition-all duration-[160ms] ease-out hover:border-border hover:shadow-sm hover:-translate-y-px cursor-default bg-card"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            >
                {/* Mouse-following warm glow */}
                <div
                    className="pointer-events-none absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-[240ms]"
                    style={{
                        background: isHovered
                            ? `radial-gradient(300px circle at ${mousePos.x}px ${mousePos.y}px, hsl(31 74% 53% / 0.06), transparent 70%)`
                            : "none",
                    }}
                />

                <div className="relative">
                    <h3 className="text-[15px] font-semibold tracking-tight mb-1.5 group-hover:text-accent transition-colors duration-[100ms]">
                        {title}
                    </h3>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {desc}
                    </p>
                </div>
            </div>
        </ScrollReveal>
    );
}

export function FeatureGrid() {
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {features.map((f, i) => (
                <FeatureCard key={f.title} title={f.title} desc={f.desc} index={i} />
            ))}
        </div>
    );
}

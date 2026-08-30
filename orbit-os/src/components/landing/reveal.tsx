"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Direction = "up" | "left" | "right" | "none";

const OFFSET: Record<Direction, string> = {
    up: "translate3d(0, 28px, 0)",
    left: "translate3d(-32px, 0, 0)",
    right: "translate3d(32px, 0, 0)",
    none: "none",
};

/**
 * Scroll-triggered reveal with directional entrance and optional scale.
 *
 * Deliberately reveals on any intersection (threshold 0) rather than a
 * fractional ratio: a block taller than the viewport can never reach
 * 0.15, which would leave it invisible forever. The timeout is a
 * belt-and-braces failsafe for environments where the observer never
 * fires at all (print, resized-viewport captures).
 */
export function Reveal({
    children,
    className,
    delay = 0,
    direction = "up",
    scale = false,
    duration = 700,
}: {
    children: React.ReactNode;
    className?: string;
    delay?: number;
    direction?: Direction;
    scale?: boolean;
    duration?: number;
}) {
    const ref = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        // Honour reduced-motion by showing content immediately, with no
        // transform to animate away from.
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setShown(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setShown(true);
                    observer.unobserve(el);
                }
            },
            { threshold: 0, rootMargin: "0px 0px -8% 0px" }
        );

        observer.observe(el);
        const failsafe = setTimeout(() => setShown(true), 1200);

        return () => {
            observer.disconnect();
            clearTimeout(failsafe);
        };
    }, []);

    const hidden = scale
        ? `${OFFSET[direction] === "none" ? "" : OFFSET[direction]} scale(0.97)`.trim()
        : OFFSET[direction];

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: shown ? 1 : 0,
                transform: shown ? "none" : hidden,
                filter: shown ? "blur(0px)" : "blur(6px)",
                transition: `opacity ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms, filter ${duration}ms cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
                willChange: shown ? "auto" : "opacity, transform, filter",
            }}
        >
            {children}
        </div>
    );
}

/**
 * Counts a number up when it scrolls into view. Used for the hero's
 * social-proof figure and stat callouts — motion that carries meaning
 * rather than decorating.
 */
export function CountUp({
    to,
    suffix = "",
    duration = 1400,
    className,
}: {
    to: number;
    suffix?: string;
    duration?: number;
    className?: string;
}) {
    const ref = useRef<HTMLSpanElement>(null);
    const [value, setValue] = useState(0);
    const done = useRef(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;

        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
            setValue(to);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting || done.current) return;
                done.current = true;

                const start = performance.now();
                const tick = (now: number) => {
                    const t = Math.min((now - start) / duration, 1);
                    // Ease-out cubic: fast start, gentle settle.
                    const eased = 1 - Math.pow(1 - t, 3);
                    setValue(Math.round(to * eased));
                    if (t < 1) requestAnimationFrame(tick);
                };
                requestAnimationFrame(tick);
            },
            { threshold: 0 }
        );

        observer.observe(el);
        return () => observer.disconnect();
    }, [to, duration]);

    return (
        <span ref={ref} className={cn("tabular-nums", className)}>
            {value.toLocaleString()}
            {suffix}
        </span>
    );
}

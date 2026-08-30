/**
 * Logo mark. One of the few places solid lime is allowed to sit as a
 * fill on white — it is a shape, not text, so the contrast rule for
 * small type does not apply.
 */
export function OrbitMark({ className = "h-6 w-6" }: { className?: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={className}
            aria-hidden="true"
            fill="none"
        >
            <rect width="24" height="24" rx="7" fill="url(#orbit-mark-fill)" />
            <circle cx="12" cy="12" r="2.6" fill="#111111" />
            <ellipse
                cx="12"
                cy="12"
                rx="7.4"
                ry="3.4"
                stroke="#111111"
                strokeWidth="1.5"
                transform="rotate(-28 12 12)"
            />
            <defs>
                <linearGradient id="orbit-mark-fill" x1="0" y1="0" x2="24" y2="24">
                    <stop stopColor="#8BF202" />
                    <stop offset="1" stopColor="#5F8F02" />
                </linearGradient>
            </defs>
        </svg>
    );
}

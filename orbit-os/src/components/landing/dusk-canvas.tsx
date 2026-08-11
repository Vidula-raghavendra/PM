/**
 * The reference's hero is a lamp photographed at golden hour on a dune — the
 * subject matters less than the light. This reproduces that light natively:
 * a layered gradient horizon, a bloom around the source, and film grain.
 *
 * Pure CSS/SVG rather than a photograph — no licensing exposure, no image
 * payload, and it scales to any viewport without art direction.
 */
export function DuskCanvas({ className = "" }: { className?: string }) {
    return (
        <div className={`absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
            {/* Sky. The amber band sits in the upper third and resolves back to
                deep espresso at the base — the headline is anchored bottom-left,
                so the darkest part of the frame has to be behind the text.
                A sunset gradient running light-at-the-bottom would leave white
                type on #F7C67E at 1.6:1. */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "linear-gradient(180deg, #51200E 0%, #985131 18%, #C4691F 32%, #7A3F18 52%, #3D2716 74%, #1A1008 100%)",
                }}
            />

            {/* Light source — high in the frame, well clear of the type */}
            <div
                className="absolute left-[58%] -translate-x-1/2"
                style={{
                    top: "6%",
                    width: "min(62vw, 640px)",
                    height: "min(62vw, 640px)",
                    background:
                        "radial-gradient(circle, hsl(38 95% 78% / 0.7) 0%, hsl(33 88% 66% / 0.32) 26%, transparent 66%)",
                    filter: "blur(14px)",
                }}
            />

            {/* Atmospheric haze around the light source */}
            <div
                className="absolute inset-x-0"
                style={{
                    top: 0,
                    height: "52%",
                    background:
                        "radial-gradient(110% 75% at 58% 12%, hsl(31 80% 58% / 0.45) 0%, transparent 68%)",
                }}
            />

            {/* Dune ridge — a horizon beneath the light. Two soft silhouettes
                for depth; detail would fight the type. */}
            <svg
                className="absolute inset-x-0 w-full"
                viewBox="0 0 1440 260"
                preserveAspectRatio="none"
                style={{ top: "38%", height: "30%" }}
            >
                <path
                    d="M0 150 C 220 92, 380 128, 560 108 S 900 52, 1120 92 S 1330 140, 1440 118 L1440 260 L0 260 Z"
                    fill="#3D2716"
                    opacity="0.5"
                />
                <path
                    d="M0 196 C 260 150, 460 184, 680 168 S 1080 122, 1440 172 L1440 260 L0 260 Z"
                    fill="#2B1A0E"
                    opacity="0.8"
                />
            </svg>

            {/* Vignette — pulls the eye toward the light */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(120% 90% at 58% 30%, transparent 38%, hsl(30 54% 6% / 0.6) 100%)",
                }}
            />

            {/* Legibility scrim. Guarantees the headline and body copy clear
                4.5:1 regardless of how the gradient renders at a given viewport
                height — the composition should not be the only thing keeping
                the text readable. */}
            <div
                className="absolute inset-x-0 bottom-0"
                style={{
                    height: "62%",
                    background:
                        "linear-gradient(180deg, transparent 0%, hsl(30 54% 6% / 0.45) 45%, hsl(30 54% 6% / 0.82) 100%)",
                }}
            />

            {/* Film grain. The reference reads as photography largely because of
                sensor noise; without this the gradients look synthetic. */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.14] mix-blend-overlay">
                <filter id="dusk-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.8"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#dusk-grain)" />
            </svg>
        </div>
    );
}

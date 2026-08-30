import Image from "next/image";

/**
 * Hero backdrop: a single wide landscape with a high horizon, the frame the
 * reference photographs share. One figure, one desk, an enormous amount of
 * empty field above them — the negative space is the composition, and the
 * headline sits inside it rather than on top of it.
 *
 * `photo` takes a path under /public. Without one, the same composition is
 * rendered in CSS so the page is never broken while the asset is missing —
 * the horizon, grade and grain are identical either way, so swapping the
 * photo in changes the texture, not the layout.
 */
export function HeroBackdrop({ photo }: { photo?: string }) {
    return (
        <div className="layer-decor overflow-hidden" aria-hidden="true">
            {photo ? (
                /* The section is sized to this frame's 16:9 ratio, so the
                   whole photograph is visible with no crop and no letterbox.
                   `unoptimized` skips re-encoding a small source, which only
                   costs sharpness. */
                <>
                    {/* The frame keeps its own 16:9 ratio at the top of the
                        section; the ground below continues its lowest tone so
                        there is no seam if the content runs taller. */}
                    <div className="absolute inset-0 bg-[#3E5A32]" />
                    <div className="absolute inset-x-0 top-0 aspect-[16/9] w-full">
                        <Image
                            src={photo}
                            alt=""
                            fill
                            priority
                            unoptimized
                            sizes="100vw"
                            className="object-cover object-center"
                        />
                    </div>
                </>
            ) : (
                <CodedField />
            )}

            {/* ── Grade ────────────────────────────────────────────────
                A real photograph arrives with its own colour and haze, so
                these layers do only what the type needs: darken the upper
                band enough to hold white text, and settle the frame into
                the page at the bottom. */}

            {/* Legibility bloom behind the type block. Centred and soft, so
                the sky stays a sky instead of turning into a grey band. */}
            <div
                className="absolute inset-x-0 top-0 h-[54%]"
                style={{
                    background:
                        "radial-gradient(62% 52% at 50% 28%, rgba(16,22,34,0.34) 0%, rgba(16,22,34,0.16) 56%, transparent 80%)",
                }}
            />

            {/* Vignette — holds the eye on the centre column */}
            <div
                className="absolute inset-0"
                style={{
                    background:
                        "radial-gradient(115% 78% at 50% 34%, transparent 40%, rgba(24,26,14,0.30) 100%)",
                }}
            />

            {/* Bottom fade into the page ground so the section has no seam */}
            <div
                className="absolute inset-x-0 bottom-0 h-[15%]"
                style={{
                    background:
                        "linear-gradient(180deg, transparent 0%, rgba(255,255,255,0.55) 62%, #FFFFFF 100%)",
                }}
            />

            {/* 35mm grain */}
            <svg className="absolute inset-0 h-full w-full opacity-[0.07] mix-blend-overlay">
                <filter id="hero-grain">
                    <feTurbulence
                        type="fractalNoise"
                        baseFrequency="0.82"
                        numOctaves="3"
                        stitchTiles="stitch"
                    />
                    <feColorMatrix type="saturate" values="0" />
                </filter>
                <rect width="100%" height="100%" filter="url(#hero-grain)" />
            </svg>
        </div>
    );
}

/**
 * CSS stand-in for the photograph. Same horizon placement and colour
 * response as the reference frames, so the type composition above it is
 * tuned once and holds when the real image arrives.
 */
function CodedField() {
    return (
        <div className="absolute inset-0">
            {/* Sky — pale, washed, almost colourless at the horizon */}
            <div
                className="absolute inset-x-0 top-0 h-[46%]"
                style={{
                    background:
                        "linear-gradient(180deg, #9DB3A8 0%, #BFC9AE 40%, #D9DABA 76%, #E6E2C6 100%)",
                }}
            />

            {/* Field — the horizon sits high, as in every reference frame */}
            <div
                className="absolute inset-x-0 bottom-0 h-[58%]"
                style={{
                    background:
                        "linear-gradient(180deg, #7E9445 0%, #6E8A3A 26%, #5C7B30 62%, #4C6A28 100%)",
                }}
            />

            {/* The crest itself — a very shallow curve, not a straight line */}
            <svg
                className="absolute inset-x-0 w-full"
                viewBox="0 0 1440 120"
                preserveAspectRatio="none"
                style={{ top: "40%", height: "10%" }}
            >
                <path
                    d="M0 78 C 320 46, 560 62, 820 52 S 1230 30, 1440 44 L1440 120 L0 120 Z"
                    fill="#7E9445"
                />
            </svg>

            {/* Atmospheric haze at the horizon. Without this the sky and
                field meet on a hard line, which is the single clearest
                tell that a landscape was drawn rather than photographed. */}
            <div
                className="absolute inset-x-0"
                style={{
                    top: "36%",
                    height: "16%",
                    background:
                        "linear-gradient(180deg, rgba(232,232,206,0) 0%, rgba(226,228,198,0.75) 45%, rgba(150,170,120,0.35) 72%, transparent 100%)",
                    filter: "blur(10px)",
                }}
            />

            {/* Mown banding across the grass, fading with distance */}
            <div
                className="absolute inset-x-0"
                style={{
                    top: "44%",
                    bottom: 0,
                    backgroundImage:
                        "repeating-linear-gradient(178deg, rgba(255,255,255,0.06) 0px, rgba(255,255,255,0.06) 2px, transparent 2px, transparent 22px)",
                    maskImage:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 18%, #000 55%)",
                    WebkitMaskImage:
                        "linear-gradient(180deg, transparent 0%, rgba(0,0,0,0.5) 18%, #000 55%)",
                }}
            />
        </div>
    );
}

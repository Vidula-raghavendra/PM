import Image from "next/image";

/**
 * The landscape persists behind the whole page, not just the hero. It is
 * fixed, heavily blurred and dimmed, so scrolling feels like moving down
 * through one continuous scene rather than passing between unrelated
 * light and dark bands.
 *
 * Sections above it are translucent; the ones that were near-black now
 * read as the same field seen through deeper atmosphere.
 */
export function PageBackdrop({ photo }: { photo: string }) {
    return (
        <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <Image
                src={photo}
                alt=""
                fill
                loading="eager"
                unoptimized
                sizes="100vw"
                className="scale-110 object-cover object-center blur-[64px]"
            />
            {/* Push the whole plate darker and cooler so white type reads
                over it and the page ground stays calm behind content. */}
            <div className="absolute inset-0 bg-[#0C1A18]/72" />
        </div>
    );
}

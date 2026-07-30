import Image from "next/image";
import type { MaterialsCopy } from "@/lib/materials";

// Wide, aspect-ratio-locked hero band — the container ratio matches the
// source photograph's native ratio (1183:795) exactly, so the full
// composition (both antler ends, the complete flute) is always visible,
// scaled proportionally rather than cropped, on desktop, tablet, and mobile.
// object-contain guarantees zero cropping even if lg:max-h caps the height
// on very large screens (it letterboxes into the dark background instead).
export default function MaterialsHero({ copy }: { copy: MaterialsCopy }) {
  return (
    <section className="relative w-full aspect-[1183/795] lg:max-h-[85vh] overflow-hidden bg-brand-dark">
      <Image
        src={copy.heroImage.src}
        alt={copy.heroImage.alt}
        fill
        priority
        unoptimized
        className="absolute inset-0 z-0 object-contain object-center"
        sizes="100vw"
      />

      {/* Thin bottom fade — soft transition into the content below only,
          kept minimal so it never obscures the photograph. */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 inset-x-0 z-[1] h-10 sm:h-16 bg-gradient-to-t from-brand-dark to-transparent"
      />
    </section>
  );
}

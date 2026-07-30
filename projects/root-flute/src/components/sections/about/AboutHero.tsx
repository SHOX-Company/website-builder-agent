import Image from "next/image";

// Wide, aspect-ratio-locked hero band — the container ratio matches the
// source photograph's native ratio (1269:678) exactly, so the full
// composition (the elephant, Daniel, and the trunk wrapped around his head)
// is always visible, scaled proportionally rather than cropped, on desktop,
// tablet, and mobile. No text overlay — heading and intro copy render in
// AboutIntro immediately below. object-contain guarantees zero cropping
// even if lg:max-h caps the height on very large screens (it letterboxes
// into the dark background instead).
export default function AboutHero({ image }: { image: { src: string; alt: string } }) {
  return (
    <section className="relative w-full aspect-[1269/678] lg:max-h-[85vh] overflow-hidden bg-brand-dark">
      <Image
        src={image.src}
        alt={image.alt}
        fill
        priority
        unoptimized
        className="absolute inset-0 z-0 object-contain object-center"
        sizes="100vw"
      />

      {/* Subtle top fade — keeps the transparent nav readable against a bright sky/frame */}
      <div
        aria-hidden="true"
        className="absolute top-0 inset-x-0 z-[1] h-16 sm:h-24 bg-gradient-to-b from-black/40 to-transparent"
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

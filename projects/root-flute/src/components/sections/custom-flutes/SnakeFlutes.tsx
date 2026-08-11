import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/snake-flutes-1) — price note and the sold-piece
// caption are Daniel's original words, not rewritten. The source's "MADE TO
// ORER" typo and "2400$" formatting were corrected per explicit operator
// instruction (price displayed as "$2,400", label as "MADE TO ORDER"). The
// standalone
// RootFlute logo graphic present on the old page was intentionally not
// migrated (site chrome, not Snake-Flute-specific content — same rule
// established for every prior Custom Flutes section). One video was a
// self-hosted Squarespace native video; recovered from its publicly-served
// HLS stream and stored locally as mp4 (same method as Drone Flutes / Four
// Chamber Mayan Chord). The other two videos are direct YouTube embeds.
// Only the first photograph had a legitimate caption; the rest had no
// individual captions (just raw filenames/empty alt text), so none were
// invented.
const videos = [
  {
    type: "native" as const,
    src: "/videos/custom-flutes/snake-flutes/snake-flutes-video-1.mp4",
  },
  {
    type: "youtube" as const,
    id: "OxT6aF_pgKw",
    title: "Rainbow Serpent",
  },
  {
    type: "youtube" as const,
    id: "eJzCxocdG6s",
    title: "Triple triple tri harmonic drone snake flute.",
  },
];

const images = [
  { src: "/images/custom-flutes/snake-flutes/snake-flute-1.jpg", caption: "interstellar serpent sold for 3800$" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-2.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-3.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-4.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-5.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-6.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-7.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-8.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-9.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-10.png" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-11.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-12.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-13.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-14.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-15.jpg" },
  { src: "/images/custom-flutes/snake-flutes/snake-flute-16.jpg" },
];

export default function SnakeFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Snake Flutes
          </h2>
          <p className="text-brand-muted text-sm">starting at $2,400</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {/* Videos */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {videos.map((video) =>
            video.type === "native" ? (
              <div key={video.src} className="aspect-[9/16] w-full border border-brand-border overflow-hidden bg-black">
                <video
                  controls
                  preload="none"
                  poster="/videos/custom-flutes/snake-flutes/snake-flutes-video-1-poster.jpg"
                  className="w-full h-full object-contain"
                >
                  <source src={video.src} type="video/mp4" />
                </video>
              </div>
            ) : (
              <div key={video.id} className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${video.id}`}
                  title={video.title}
                  allowFullScreen
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                />
              </div>
            )
          )}
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {images.map((image) => (
            <div key={image.src} className="flex flex-col gap-3">
              <div className="relative aspect-square border border-brand-border overflow-hidden">
                <Image
                  src={image.src}
                  alt={image.caption ?? "Snake Flute"}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 640px) 50vw, 25vw"
                />
              </div>
              {image.caption && (
                <p className="text-center text-brand-muted text-xs uppercase tracking-widest font-sans">
                  {image.caption}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

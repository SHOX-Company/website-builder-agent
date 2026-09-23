import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/mayan-harmony-flutes) — "MADE TO ORDER" label is
// Daniel's original words, not rewritten. The standalone RootFlute logo
// graphic present on the old page was intentionally not migrated (site
// chrome, not Mayan-Harmony-specific content — same rule established for
// Bell Flutes, Point Flutes, and Drone Flutes). The source images had no
// legitimate individual captions (just raw filenames/empty alt text), so
// none were invented.
//
// Customer-facing name updated from "Harmony Flutes" to "Double Harmony
// Flutes" and starting price updated from $2,200 to $2,600 (2026-09-23
// canonical production update). The internal file/directory naming
// ("mayan-harmony-flutes") and the route slug are unchanged — only the
// rendered customer-facing text changed, and the existing shared URL
// (/custom-flutes/mayan-harmony-flutes) keeps working.
//
// Video 1 (mayan-harmony-flutes-video-1.mp4) replaces the prior YouTube
// embed with the approved supplied clip, self-hosted from /public the same
// way as every other native <video> in this section (Drone Flutes, Snake
// Flutes, Four Chamber Mayan Chord) — no Blob involved for this static
// marketing section. Poster frame extracted directly from the video via
// ffmpeg (no AI-generated media).
const images = [
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-1.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-2.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-3.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-4.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-5.jpg",
  "/images/custom-flutes/mayan-harmony-flutes/mayan-harmony-flute-6.jpg",
];

export default function MayanHarmonyFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Double Harmony Flutes
          </h2>
          <p className="text-brand-muted text-sm">Starting at $2,600</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <video
            controls
            preload="metadata"
            poster="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-1-poster.jpg"
            aria-label="Double Harmony flute, by RootFlute"
            className="w-full h-full object-contain"
          >
            <source
              src="/videos/custom-flutes/mayan-harmony-flutes/mayan-harmony-flutes-video-1.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Double Harmony Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

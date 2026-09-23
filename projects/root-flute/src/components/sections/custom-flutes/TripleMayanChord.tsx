import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/triple-mayan-chord-flutes) — "MADE TO ORDER"
// label and materials line are Daniel's original words, not rewritten. The
// standalone RootFlute logo graphic present on the old page was
// intentionally not migrated (site chrome, not Triple-Mayan-Chord content —
// same rule established for every prior Custom Flutes section). The
// remaining source images had no legitimate individual captions (just raw
// filenames/empty alt text), so none were invented.
//
// Customer-facing name updated from "Triple Mayan Chord Flutes" to "Triple
// Chord Flutes" ("Mayan" removed) and the single $3,300 starting price
// replaced with two configurations, Small ($3,600, rooted in F#–E) and
// Large ($4,200, rooted in D–C) (2026-09-23 canonical production update).
// The internal file/directory naming ("triple-mayan-chord") and the route
// slug (/custom-flutes/triple-mayan-chord-flutes) are unchanged — only the
// rendered customer-facing text changed, so the existing shared URL keeps
// working.
//
// Video 1 (triple-mayan-chord-video-1.mp4) replaces the prior YouTube embed
// with the approved supplied clip, self-hosted from /public the same way as
// every other native <video> in this section — no Blob involved for this
// static marketing section. Poster frame extracted directly from the video
// via ffmpeg (no AI-generated media).
const images = [
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-1.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-2.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-3.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-4.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-5.jpg",
];

const configurations = [
  { label: "Small", price: "$3,600", root: "F#–E" },
  { label: "Large", price: "$4,200", root: "D–C" },
];

export default function TripleMayanChord() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Triple Chord Flutes
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-1 mb-1">
            {configurations.map((c) => (
              <p key={c.label} className="text-brand-muted text-sm">
                {c.label} — {c.price} · Rooted in {c.root}
              </p>
            ))}
          </div>
          <p className="text-brand-muted text-sm mb-4">MADE TO ORDER</p>
          <p className="text-brand-muted text-sm max-w-2xl mx-auto">
            Mammoth tusk, fossil walrus, Dino egg shell, black tourmaline, Romanian cave bear
            tooth, Ammonite, wild shed elk antler.
          </p>
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <video
            controls
            preload="metadata"
            poster="/videos/custom-flutes/triple-mayan-chord/triple-mayan-chord-video-1-poster.jpg"
            aria-label="Triple Chord Flutes, by RootFlute"
            className="w-full h-full object-contain"
          >
            <source
              src="/videos/custom-flutes/triple-mayan-chord/triple-mayan-chord-video-1.mp4"
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
                alt="Triple Chord Flute"
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

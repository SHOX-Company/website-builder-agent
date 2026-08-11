import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/4-chamber-mayan-chord) — price note and
// "MADE TO ORDER" label are Daniel's original words, not rewritten. The
// standalone RootFlute logo graphic present on the old page was
// intentionally not migrated (site chrome, not Four-Chamber-Mayan-Chord
// content — same rule established for every prior Custom Flutes section).
// Video 1 was a self-hosted Squarespace native video; recovered from its
// publicly-served HLS stream and stored locally as mp4 (same method as
// Drone Flutes, see CF-3.1). Video 2 is a direct YouTube embed. The source
// images had no legitimate individual captions (just raw filenames/empty
// alt text), so none were invented.
const images = [
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-1.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-2.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-3.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-4.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-5.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-6.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-7.jpg",
  "/images/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-8.jpg",
];

export default function FourChamberMayanChord() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Four Chamber Mayan Chord Flutes
          </h2>
          <p className="text-brand-muted text-sm">starting at 4200$</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {/* Videos */}
        <div className="grid sm:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <video controls preload="metadata" className="w-full h-full object-contain">
              <source
                src="/videos/custom-flutes/four-chamber-mayan-chord/four-chamber-mayan-chord-video-1.mp4"
                type="video/mp4"
              />
            </video>
          </div>
          <div className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
            <iframe
              className="w-full h-full"
              src="https://www.youtube.com/embed/qxdsgcZcFSU"
              title="Enchanting Antler Flute Music at Volcán de Fuego | Rootflute"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            />
          </div>
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Four Chamber Mayan Chord Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 25vw"
              />
            </div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}

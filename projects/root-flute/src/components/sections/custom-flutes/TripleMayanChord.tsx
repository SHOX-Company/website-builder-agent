import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/triple-mayan-chord-flutes) — price note,
// "MADE TO ORDER" label, and materials line are Daniel's original words,
// not rewritten. The standalone RootFlute logo graphic present on the old
// page was intentionally not migrated (site chrome, not Triple-Mayan-Chord
// content — same rule established for every prior Custom Flutes section).
// The remaining source images had no legitimate individual captions (just
// raw filenames/empty alt text), so none were invented.
const images = [
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-1.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-2.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-3.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-4.jpg",
  "/images/custom-flutes/triple-mayan-chord/triple-mayan-chord-5.jpg",
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
            Triple Mayan Chord Flutes
          </h2>
          <p className="text-brand-muted text-sm">starting at 3300$</p>
          <p className="text-brand-muted text-sm mb-4">MADE TO ORDER</p>
          <p className="text-brand-muted text-sm max-w-2xl mx-auto">
            Mammoth tusk, fossil walrus, Dino egg shell, black tourmaline, Romanian cave bear
            tooth, Ammonite, wild shed elk antler.
          </p>
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/BMNqOjPdr9g"
            title="Triple Mayan Chord Flutes"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Triple Mayan Chord Flute"
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

import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/mayan-harmony-flutes) — price note and "MADE TO
// ORDER" label are Daniel's original words, not rewritten. The standalone
// RootFlute logo graphic present on the old page was intentionally not
// migrated (site chrome, not Mayan-Harmony-specific content — same rule
// established for Bell Flutes, Point Flutes, and Drone Flutes). The source
// images had no legitimate individual captions (just raw filenames/empty
// alt text), so none were invented.
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
            Mayan Harmony Flutes
          </h2>
          <p className="text-brand-muted text-sm">Starting at 2200$</p>
          <p className="text-brand-muted text-sm">MADE TO ORDER</p>
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/c5PTpSC_5MY"
            title="Double Harmony flute, by RootFlute"
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
                alt="Mayan Harmony Flute"
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

import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/fossil-flutes — linked from the Custom Flutes
// landing page under the label "Mammoth tusk flutes") — price note is
// Daniel's original words, not rewritten. The source page had no "MADE TO
// ORDER" label and no materials/details text. The standalone RootFlute logo
// graphic present on the old page was intentionally not migrated (site
// chrome, not Mammoth-Tusk-Flute-specific content — same rule established
// for every prior Custom Flutes section). The video is a direct YouTube
// embed. The source images had no legitimate individual captions (just raw
// filenames/empty alt text), so none were invented.
const images = [
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-1.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-2.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-3.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-4.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-5.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-6.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-7.jpg",
  "/images/custom-flutes/mammoth-tusk-flutes/mammoth-tusk-flute-8.jpg",
];

export default function MammothTuskFlutes() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Mammoth Tusk Flute
          </h2>
          <p className="text-brand-muted text-sm">price upon request</p>
        </div>

        {/* Video */}
        <div className="aspect-video w-full max-w-2xl mx-auto mb-16 border border-brand-border overflow-hidden bg-black">
          <iframe
            className="w-full h-full"
            src="https://www.youtube.com/embed/EeDpGdQVeVg"
            title="Wooly Mammoth Tusk Flute"
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Mammoth Tusk Flute"
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

import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";
import CustomFluteInquiryCTA from "./CustomFluteInquiryCTA";

// Content migrated verbatim from the old RootFlute site
// (https://www.rootflute.com/rack-flutes) — price note is Daniel's original
// words, not rewritten. The source page had no "MADE TO ORDER" label and no
// materials/details text (unlike some other sections). The standalone
// RootFlute logo graphic present on the old page was intentionally not
// migrated (site chrome, not Rack-Flute-specific content — same rule
// established for every prior Custom Flutes section). All three videos are
// direct YouTube embeds. The source images had no legitimate individual
// captions (just raw filenames/empty alt text), so none were invented.
const videos = [
  { id: "aLtf9-UbJyY", title: "Triple Drone Harmony Flute made from Elk Antler" },
  { id: "66Q-p8ssihA", title: 'Custom "triple rack flute" by RootFlute' },
  { id: "QEWxIhIM28Q", title: 'Custom "Triple Rack Flute" by RootFlute' },
];

const images = [
  "/images/custom-flutes/rack-flute/rack-flute-1.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-2.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-3.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-4.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-5.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-6.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-7.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-8.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-9.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-10.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-11.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-12.jpg",
  "/images/custom-flutes/rack-flute/rack-flute-13.jpg",
];

export default function RackFlute() {
  return (
    <SectionWrapper className="bg-brand-surface-2">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-14">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-4">
            Custom Flute Style
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-light text-brand-text mb-4">
            Rack Flutes
          </h2>
          <p className="text-brand-muted text-sm">Starting at 6500$</p>
        </div>

        {/* Acquisition inquiry (2026-09-23) — "Starting at" is not yet an authorized firm
            checkout price (no shipping/deposit terms have been published for this design),
            so this is the existing certified inquiry pathway, not a Stripe checkout. This
            LONG page (13 photographs) carries this CTA both here (upper) and again after
            the photo grid below (lower) — see CustomFluteInquiryCTA.tsx for the full
            reasoning. */}
        <div className="flex justify-center mb-16">
          <CustomFluteInquiryCTA design="Rack Flutes" />
        </div>

        {/* Videos */}
        <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          {videos.map((video) => (
            <div key={video.id} className="aspect-video w-full border border-brand-border overflow-hidden bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube.com/embed/${video.id}`}
                title={video.title}
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              />
            </div>
          ))}
        </div>

        {/* Photographs */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 mb-16">
          {images.map((src) => (
            <div key={src} className="relative aspect-square border border-brand-border overflow-hidden">
              <Image
                src={src}
                alt="Rack Flute"
                fill
                className="object-cover object-center"
                sizes="(max-width: 640px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>

        {/* Lower acquisition inquiry — see the upper one above for the full reasoning. */}
        <div className="flex justify-center">
          <CustomFluteInquiryCTA design="Rack Flutes" />
        </div>
      </div>
    </SectionWrapper>
  );
}

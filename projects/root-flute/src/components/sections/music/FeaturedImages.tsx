import Image from "next/image";
import SectionWrapper from "@/components/ui/SectionWrapper";

export default function FeaturedImages() {
  return (
    <SectionWrapper className="bg-brand-surface-2 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
        {/* Featured Image 1: Pier with Volcano */}
        <div className="aspect-[4/5] relative overflow-hidden rounded-sm">
          <Image
            src="/images/featured/featured-image-1.jpg"
            alt="RootFlute on the pier with volcano in background"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Featured Image 2: Serpent Flute */}
        <div className="aspect-[4/5] relative overflow-hidden rounded-sm">
          <Image
            src="/images/featured/featured-image-2.jpg"
            alt="RootFlute playing the serpent flute"
            fill
            className="object-cover"
            priority
          />
        </div>
      </div>
    </SectionWrapper>
  );
}

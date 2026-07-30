// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import VideoPageHero from "@/components/sections/videos/VideoPageHero";
import VideoGrid from "@/components/videos/VideoGrid";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import { getPublicVideos } from "@/lib/videoStore";

export const metadata = buildPageMetadata("instrumentVideos");
export const dynamic = "force-dynamic";

export default async function InstrumentVideosPage() {
  const videos = await getPublicVideos("instruments");

  return (
    <main>
      <VideoPageHero
        eyebrow="Videos"
        title="Instrument"
        accent="Demos"
        description="Handcrafted instruments in motion — close-up looks, builds, and the sound each one carries."
        count={videos.length}
      />
      <SectionWrapper className="bg-brand-surface-2">
        <VideoGrid videos={videos} />
      </SectionWrapper>
      <Footer />
    </main>
  );
}

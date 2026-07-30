// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import VideoPageHero from "@/components/sections/videos/VideoPageHero";
import VideoGrid from "@/components/videos/VideoGrid";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import { getPublicVideos } from "@/lib/videoStore";

export const metadata = buildPageMetadata("rootfluteLive");
export const dynamic = "force-dynamic";

export default async function RootFluteLivePage() {
  const videos = await getPublicVideos("rootflute-live");

  return (
    <main>
      <VideoPageHero
        eyebrow="Videos"
        title="RootFlute"
        accent="Live"
        description="Live looping performances, festival sets, and outdoor concerts — sound carried by presence, captured in the moment."
        count={videos.length}
      />
      <SectionWrapper className="bg-brand-surface-2">
        <VideoGrid videos={videos} />
      </SectionWrapper>
      <Footer />
    </main>
  );
}

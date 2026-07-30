// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import VideoPageHero from "@/components/sections/videos/VideoPageHero";
import VideoGrid from "@/components/videos/VideoGrid";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import { getPublicVideos } from "@/lib/videoStore";

export const metadata = buildPageMetadata("lucidMeditation");
export const dynamic = "force-dynamic";

export default async function LucidMeditationPage() {
  const videos = await getPublicVideos("lucid-meditation");

  return (
    <main>
      <VideoPageHero
        eyebrow="Videos"
        title="Lucid"
        accent="Meditation"
        description="Guided sound journeys led by breath, tone, and the flute — recorded sessions to enter the practice."
        count={videos.length}
      />
      <SectionWrapper className="bg-brand-surface-2">
        <VideoGrid videos={videos} />
      </SectionWrapper>
      <Footer />
    </main>
  );
}

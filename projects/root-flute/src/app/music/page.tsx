// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY buildPageMetadata
// or src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import MusicStory from "@/components/sections/music/MusicStory";
import HeroVideo from "@/components/sections/music/HeroVideo";
import PressKitCTA from "@/components/sections/music/PressKitCTA";
import IntroTextAndVideos from "@/components/sections/music/IntroTextAndVideos";
import FeaturedVideosFirst from "@/components/sections/music/FeaturedVideosFirst";
import PreviousYears from "@/components/sections/music/PreviousYears";
import FeaturedImages from "@/components/sections/music/FeaturedImages";
import PastEvents from "@/components/sections/music/PastEvents";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import type { MusicCopy } from "@/lib/music";
import copy from "@/content/music/music-copy.json";

export const metadata = buildPageMetadata("music");
export const dynamic = "force-dynamic";

export default async function MusicPage() {
  const musicCopy = copy as MusicCopy;

  return (
    <main>
      {/* Hero Section: CTA + Video */}
      <SectionWrapper className="bg-brand-surface-2 py-10">
        <div className="max-w-4xl mx-auto space-y-6">
          <PressKitCTA />
          <HeroVideo />
        </div>
      </SectionWrapper>

      {/* Intro Text + Videos 2-3 */}
      <IntroTextAndVideos />

      {/* Story/Copy Section */}
      <MusicStory copy={musicCopy} />

      {/* Featured Videos Section - First Two Videos */}
      <FeaturedVideosFirst />

      {/* Previous Years Section */}
      <PreviousYears />

      <FeaturedImages />

      <PastEvents />

      <Footer />
    </main>
  );
}

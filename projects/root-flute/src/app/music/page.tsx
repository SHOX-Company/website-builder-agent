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

// Approved public Music line-up — a fixed, ordered list of YouTube videos that
// maps positionally onto the page's 4 fixed sections (Hero / Intro / Featured /
// Previous Years). Held here directly so the public page renders the approved
// set independently of the Studio Video library.
const featuredVideos: { id: string; title: string }[] = [
  { id: "2e6BSwQUHlw", title: "RootFlute instrument demonstration" },
  { id: "XOoVrNN7TB8", title: "Organic Downtempo Live Looping Fusion  in C# 432 Hz OM (RootFlute) studio sessions" },
  { id: "RuznuuEfp2s", title: "Organic Downtempo Live Looping Fusion by RootFlute" },
  { id: "a7typ5Kp1so", title: "Live Sound Meditation Album 5-11-24 by RootFlute" },
  { id: "fi1OjLrRmUc", title: "Rootflute Lucid meditation. Full session in previos vid" },
  { id: "pCqVA2i8rww", title: "RootFlute Lucid meditation  #194  5-8-24 (at 10:00 words stop )" },
  { id: "kDi-QEQIrXw", title: "RootFlute Live Looping Fusion | Handmade Instruments | Trancendance Festival, Playa del Carmen" },
  { id: "5DqLf8K0xbY", title: "Landjuweel Festival 2024 with RootFlute" },
  { id: "KrebMPoLeYE", title: "Rootflute Live at Samsara Music Festival BC | Epic Live Looping Fusion Set in Stunning Nature" },
];

export default async function MusicPage() {
  const musicCopy = copy as MusicCopy;

  const heroVideo = featuredVideos[0];
  const introVideos = featuredVideos.slice(1, 3);
  const featuredGridVideos = featuredVideos.slice(3, 6);
  const previousYearsVideos = featuredVideos.slice(6, 9);

  return (
    <main>
      {/* Hero Section: CTA + Video */}
      <SectionWrapper className="bg-brand-surface-2 py-10 !pb-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <PressKitCTA />
          <HeroVideo video={heroVideo} />
        </div>
      </SectionWrapper>

      {/* Intro Text + Videos 2-3 */}
      <IntroTextAndVideos videos={introVideos} />

      {/* Story/Copy Section */}
      <MusicStory copy={musicCopy} />

      {/* Featured Videos Section - First Two Videos */}
      <FeaturedVideosFirst videos={featuredGridVideos} />

      {/* Previous Years Section */}
      <PreviousYears videos={previousYearsVideos} />

      <FeaturedImages />

      <PastEvents />

      <Footer />
    </main>
  );
}

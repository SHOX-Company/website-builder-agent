// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Authority from "@/components/sections/Authority";
import SoundJourneys from "@/components/sections/SoundJourneys";
import CommunityTiers from "@/components/sections/CommunityTiers";
import Testimonials from "@/components/sections/Testimonials";
import PrimaryCTA from "@/components/sections/PrimaryCTA";
import Footer from "@/components/sections/Footer";

export const metadata = buildPageMetadata("society");

export default function SocietyPage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Authority />
      <SoundJourneys />
      <CommunityTiers />
      <Testimonials />
      <PrimaryCTA />
      <Footer />
    </main>
  );
}

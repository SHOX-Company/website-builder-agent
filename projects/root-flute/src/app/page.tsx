import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Authority from "@/components/sections/Authority";
import SoundJourneys from "@/components/sections/SoundJourneys";
import CommunityTiers from "@/components/sections/CommunityTiers";
import Testimonials from "@/components/sections/Testimonials";
import PrimaryCTA from "@/components/sections/PrimaryCTA";
import Footer from "@/components/sections/Footer";

export default function Home() {
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

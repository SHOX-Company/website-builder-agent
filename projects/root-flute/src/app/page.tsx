import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Authority from "@/components/sections/Authority";
import SoundJourneys from "@/components/sections/SoundJourneys";
import CommunityTiers from "@/components/sections/CommunityTiers";
import WhoIsItFor from "@/components/sections/WhoIsItFor";
import Testimonials from "@/components/sections/Testimonials";
import PrimaryCTA from "@/components/sections/PrimaryCTA";
import Flutes from "@/components/sections/Flutes";
import Footer from "@/components/sections/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Authority />
      <SoundJourneys />
      <CommunityTiers />
      <WhoIsItFor />
      <Testimonials />
      <PrimaryCTA />
      <Flutes />
      <Footer />
    </main>
  );
}

// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HeroFlutes from "@/components/sections/flutes/HeroFlutes";
import CurrentDrop from "@/components/sections/flutes/CurrentDrop";
import CraftsmanAuthority from "@/components/sections/flutes/CraftsmanAuthority";
import SoundDemo from "@/components/sections/flutes/SoundDemo";
import FluteFAQ from "@/components/sections/flutes/FluteFAQ";
import FinalCTAFlutes from "@/components/sections/flutes/FinalCTAFlutes";
import Footer from "@/components/sections/Footer";

export const metadata = buildPageMetadata("flutes");

export default function FlutesPage() {
  return (
    <main>
      <HeroFlutes />
      <CurrentDrop />
      <CraftsmanAuthority />
      <SoundDemo />
      <FluteFAQ />
      <FinalCTAFlutes />
      <Footer />
    </main>
  );
}

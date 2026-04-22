import type { Metadata } from "next";
import HeroFlutes from "@/components/sections/flutes/HeroFlutes";
import CurrentDrop from "@/components/sections/flutes/CurrentDrop";
import CraftsmanAuthority from "@/components/sections/flutes/CraftsmanAuthority";
import SoundDemo from "@/components/sections/flutes/SoundDemo";
import FluteFAQ from "@/components/sections/flutes/FluteFAQ";
import FinalCTAFlutes from "@/components/sections/flutes/FinalCTAFlutes";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  title: "RootFlute | Rare Handcrafted Instruments",
  description:
    "One-of-one ceremonial flutes carved from ancient Woolly Mammoth tusk by master craftsman Daniel. Rare instruments for collectors, healers, and those called to sacred sound.",
};

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

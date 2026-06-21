// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HeroJewelry from "@/components/sections/jewelry/HeroJewelry";
import JewelryCollection from "@/components/sections/jewelry/JewelryCollection";
import JewelryPhilosophy from "@/components/sections/jewelry/JewelryPhilosophy";
import FinalCTAJewelry from "@/components/sections/jewelry/FinalCTAJewelry";
import Footer from "@/components/sections/Footer";

export const metadata = buildPageMetadata("jewelry");

export default function JewelryPage() {
  return (
    <main>
      <HeroJewelry />
      <JewelryCollection />
      <JewelryPhilosophy />
      <FinalCTAJewelry />
      <Footer />
    </main>
  );
}

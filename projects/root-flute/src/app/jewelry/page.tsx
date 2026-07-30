// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HeroJewelry from "@/components/sections/jewelry/HeroJewelry";
import JewelryCollection from "@/components/sections/jewelry/JewelryCollection";
import JewelryPhilosophy from "@/components/sections/jewelry/JewelryPhilosophy";
import FinalCTAJewelry from "@/components/sections/jewelry/FinalCTAJewelry";
import Footer from "@/components/sections/Footer";
import { getPublicInventory } from "@/lib/inventoryStore";

export const metadata = buildPageMetadata("jewelry");
export const dynamic = "force-dynamic";

export default async function JewelryPage() {
  const items = await getPublicInventory("jewelry");

  return (
    <main>
      <HeroJewelry />
      <JewelryCollection items={items} />
      <JewelryPhilosophy />
      <FinalCTAJewelry />
      <Footer />
    </main>
  );
}

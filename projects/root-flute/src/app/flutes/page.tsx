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
import { getPublicInventory } from "@/lib/inventoryStore";

export const metadata = buildPageMetadata("flutes");
export const dynamic = "force-dynamic";

export default async function FlutesPage() {
  const items = await getPublicInventory("flute");

  return (
    <main>
      <HeroFlutes />
      <CurrentDrop items={items} />
      <CraftsmanAuthority />
      <SoundDemo />
      <FluteFAQ />
      <FinalCTAFlutes items={items} />
      <Footer />
    </main>
  );
}

// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HeroInstruments from "@/components/sections/instruments/HeroInstruments";
import InstrumentsCollection from "@/components/sections/instruments/InstrumentsCollection";
import FinalCTAInstruments from "@/components/sections/instruments/FinalCTAInstruments";
import Footer from "@/components/sections/Footer";
import { getPublicInventory } from "@/lib/inventoryStore";

export const metadata = buildPageMetadata("instruments");
export const dynamic = "force-dynamic";

export default async function InstrumentsPage() {
  const items = await getPublicInventory("instrument");

  return (
    <main>
      <HeroInstruments />
      <InstrumentsCollection items={items} />
      <FinalCTAInstruments />
      <Footer />
    </main>
  );
}

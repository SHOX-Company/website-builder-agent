// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HeroInstruments from "@/components/sections/instruments/HeroInstruments";
import InstrumentsCollection from "@/components/sections/instruments/InstrumentsCollection";
import FinalCTAInstruments from "@/components/sections/instruments/FinalCTAInstruments";
import Footer from "@/components/sections/Footer";

export const metadata = buildPageMetadata("instruments");

export default function InstrumentsPage() {
  return (
    <main>
      <HeroInstruments />
      <InstrumentsCollection />
      <FinalCTAInstruments />
      <Footer />
    </main>
  );
}

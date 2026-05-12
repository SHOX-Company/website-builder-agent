import type { Metadata } from "next";
import HeroInstruments from "@/components/sections/instruments/HeroInstruments";
import InstrumentsCollection from "@/components/sections/instruments/InstrumentsCollection";
import FinalCTAInstruments from "@/components/sections/instruments/FinalCTAInstruments";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rootflute.com"),
  title: "RootFlute | Handcrafted Ceremonial Instruments",
  description:
    "Six ceremonial instruments. Each handcrafted, each unrepeatable. Triton Violin. Wearable Cello. Lyre. Harp. Guitar. Shellivarious. Inquire directly.",
  openGraph: {
    title: "RootFlute | Handcrafted Ceremonial Instruments",
    description:
      "Six ceremonial instruments. Each handcrafted, each unrepeatable. Made once. Played for a lifetime.",
    url: "https://rootflute.com/instruments",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/instruments/instruments-hero.png",
        width: 1200,
        height: 630,
        alt: "RootFlute — handcrafted ceremonial instruments",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootFlute | Handcrafted Ceremonial Instruments",
    description:
      "Six ceremonial instruments. Each handcrafted, each unrepeatable. Made once. Played for a lifetime.",
    images: ["/images/instruments/instruments-hero.png"],
  },
};

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

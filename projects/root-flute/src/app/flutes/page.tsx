import type { Metadata } from "next";
import HeroFlutes from "@/components/sections/flutes/HeroFlutes";
import CurrentDrop from "@/components/sections/flutes/CurrentDrop";
import CraftsmanAuthority from "@/components/sections/flutes/CraftsmanAuthority";
import SoundDemo from "@/components/sections/flutes/SoundDemo";
import FluteFAQ from "@/components/sections/flutes/FluteFAQ";
import FinalCTAFlutes from "@/components/sections/flutes/FinalCTAFlutes";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://root-flute.vercel.app"),
  title: "RootFlute | Rare Handcrafted Instruments",
  description:
    "One-of-one ceremonial flutes carved from ancient Woolly Mammoth tusk by master craftsman Daniel. Rare instruments for collectors, healers, and those called to sacred sound.",
  openGraph: {
    title: "RootFlute | Rare Handcrafted Instruments",
    description:
      "One-of-one ceremonial flutes carved from ancient Woolly Mammoth tusk by master craftsman Daniel. Rare instruments for collectors, healers, and those called to sacred sound.",
    url: "https://root-flute.vercel.app/flutes",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/og-flutes.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel on dock holding rare antler flute — mountains and lake backdrop",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootFlute | Rare Handcrafted Instruments",
    description:
      "One-of-one ceremonial flutes carved from ancient Woolly Mammoth tusk by master craftsman Daniel. Rare instruments for collectors, healers, and those called to sacred sound.",
    images: ["/images/og-flutes.jpg"],
  },
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

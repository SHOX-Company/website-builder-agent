import type { Metadata } from "next";
import Hero from "@/components/sections/Hero";
import Manifesto from "@/components/sections/Manifesto";
import Authority from "@/components/sections/Authority";
import SoundJourneys from "@/components/sections/SoundJourneys";
import CommunityTiers from "@/components/sections/CommunityTiers";
import Testimonials from "@/components/sections/Testimonials";
import PrimaryCTA from "@/components/sections/PrimaryCTA";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rootflute.com"),
  title: "The RuteFlute Society | Private Community with Daniel",
  description:
    "Join Daniel's private community for live sound journeys, real conversation, and deeper access to the practice. Founding seats now open — $35/month, locked for life.",
  openGraph: {
    title: "The RuteFlute Society | Private Community with Daniel",
    description:
      "Join Daniel's private community for live sound journeys, real conversation, and deeper access to the practice. Founding seats now open — $35/month, locked for life.",
    url: "https://rootflute.com/society",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/og-community.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel playing ceremonial flute in sacred sound journey — RootFlute Society",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "The RuteFlute Society | Private Community with Daniel",
    description:
      "Join Daniel's private community for live sound journeys, real conversation, and deeper access to the practice. Founding seats now open — $35/month, locked for life.",
    images: ["/images/og-community.jpg"],
  },
};

export default function SocietyPage() {
  return (
    <main>
      <Hero />
      <Manifesto />
      <Authority />
      <SoundJourneys />
      <CommunityTiers />
      <Testimonials />
      <PrimaryCTA />
      <Footer />
    </main>
  );
}

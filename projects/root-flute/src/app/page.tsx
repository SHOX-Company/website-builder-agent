import type { Metadata } from "next";
import HomepageHero from "@/components/sections/HomepageHero";
import HomepagePathways from "@/components/sections/HomepagePathways";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rootflute.com"),
  title: "RootFlute | Sacred Sound. Handcrafted Instruments. Rare Adornment.",
  description:
    "Daniel's world — private community, handcrafted ceremonial flutes, and rare jewelry. Three pathways. One practice.",
  openGraph: {
    title: "RootFlute | Sacred Sound. Handcrafted Instruments. Rare Adornment.",
    description:
      "Daniel's world — private community, handcrafted ceremonial flutes, and rare jewelry. Three pathways. One practice.",
    url: "https://rootflute.com",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/og-community.jpg",
        width: 1200,
        height: 630,
        alt: "RootFlute — Sacred Sound, Handcrafted Instruments, Rare Adornment",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootFlute | Sacred Sound. Handcrafted Instruments. Rare Adornment.",
    description:
      "Daniel's world — private community, handcrafted ceremonial flutes, and rare jewelry. Three pathways. One practice.",
    images: ["/images/og-community.jpg"],
  },
};

export default function Home() {
  return (
    <main>
      <HomepageHero />
      <HomepagePathways />
      <Footer />
    </main>
  );
}

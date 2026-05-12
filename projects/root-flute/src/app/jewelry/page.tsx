import type { Metadata } from "next";
import HeroJewelry from "@/components/sections/jewelry/HeroJewelry";
import JewelryCollection from "@/components/sections/jewelry/JewelryCollection";
import JewelryPhilosophy from "@/components/sections/jewelry/JewelryPhilosophy";
import FinalCTAJewelry from "@/components/sections/jewelry/FinalCTAJewelry";
import Footer from "@/components/sections/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://rootflute.com"),
  title: "RootFlute | Handcrafted Ceremonial Jewelry",
  description:
    "Three ceremonial pieces. Each handcrafted, each unrepeatable. Pearl of Vision. Lavender Moonrise. Eye of Dragon. Inquire directly.",
  openGraph: {
    title: "RootFlute | Handcrafted Ceremonial Jewelry",
    description:
      "Three ceremonial pieces. Each handcrafted, each unrepeatable. Pearl of Vision. Lavender Moonrise. Eye of Dragon.",
    url: "https://rootflute.com/jewelry",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/jewelry/pearl-of-vision-1.png",
        width: 1200,
        height: 630,
        alt: "Pearl of Vision — handcrafted ceremonial adornment by RootFlute",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootFlute | Handcrafted Ceremonial Jewelry",
    description:
      "Three ceremonial pieces. Each handcrafted, each unrepeatable. Pearl of Vision. Lavender Moonrise. Eye of Dragon.",
    images: ["/images/jewelry/pearl-of-vision-1.png"],
  },
};

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

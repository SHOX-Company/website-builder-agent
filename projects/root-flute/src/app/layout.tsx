import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import "./globals.css";
import FloatingLogo from "@/components/FloatingLogo";
import StickyBar from "@/components/StickyBar";
import ScrollReset from "@/components/ScrollReset";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Root Flute | Sacred Sound Community with Dan",
  description:
    "Join Dan's private community for sound healers, flute players, and seekers of sacred music. Founding seats now open for Root Flute Sound Journeys.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} scroll-smooth`}
    >
      <body className="bg-brand-dark text-brand-text antialiased">
        <ScrollReset />
        <FloatingLogo />
        {children}
        <StickyBar />
      </body>
    </html>
  );
}

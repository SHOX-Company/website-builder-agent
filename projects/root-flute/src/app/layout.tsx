// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// See src/lib/siteMetadata.ts for the single source of truth.
// This layout sets metadataBase (inherited by all pages) and provides
// a site-level fallback. Page-specific metadata is in each page file.
import type { Metadata } from "next";
import { Inter, Cormorant_Garamond } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import StickyBar from "@/components/StickyBar";
import ScrollReset from "@/components/ScrollReset";
import MetaPixel from "@/components/MetaPixel";
import { SITE_URL, buildPageMetadata } from "@/lib/siteMetadata";

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

// PROTECTED — metadataBase must be set here in the root layout so all
// pages inherit it. Individual pages override via buildPageMetadata().
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  ...buildPageMetadata("home"),
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
        <Navbar />
        {children}
        <StickyBar />
        <Analytics />
        <MetaPixel />
      </body>
    </html>
  );
}

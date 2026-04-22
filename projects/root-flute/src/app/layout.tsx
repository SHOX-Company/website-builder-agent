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
  metadataBase: new URL("https://root-flute.vercel.app"),
  title: "RootFlute | Sacred Sound Community with Daniel",
  description:
    "Join Daniel's private community for sound healers, flute players, and seekers of sacred music. Founding seats now open for RootFlute Sound Journeys.",
  openGraph: {
    title: "RootFlute | Sacred Sound Community with Daniel",
    description:
      "Join Daniel's private community for sound healers, flute players, and seekers of sacred music. Founding seats now open for RootFlute Sound Journeys.",
    url: "https://root-flute.vercel.app",
    siteName: "RootFlute",
    images: [
      {
        url: "/images/og-community.jpg",
        width: 1200,
        height: 630,
        alt: "Daniel playing ceremonial flute in sacred sound journey — RootFlute Community",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "RootFlute | Sacred Sound Community with Daniel",
    description:
      "Join Daniel's private community for sound healers, flute players, and seekers of sacred music. Founding seats now open for RootFlute Sound Journeys.",
    images: ["/images/og-community.jpg"],
  },
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

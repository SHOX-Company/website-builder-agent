// ============================================================
// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// without explicit authorization from the project owner.
//
// This file is the SINGLE SOURCE OF TRUTH for all Open Graph,
// Twitter Card, and canonical URL metadata across the RootFlute
// site. Modifying or removing entries here will break social
// sharing previews on:
//   Android RCS · iMessage · Instagram DM · Facebook Messenger
//   Discord · X/Twitter · Slack
//
// HOW IT WORKS:
//   1. SITE_URL is the canonical base for all URLs
//   2. PAGE_META holds unique metadata per route
//   3. buildPageMetadata() constructs the full Next.js Metadata
//      object — import and call this in each page file
//   4. Root layout.tsx sets the metadataBase — do not duplicate
//
// DOMAIN NOTE:
//   www.rootflute.com is the intended production domain. Until
//   DNS is cut over to Vercel, SITE_URL must remain as
//   root-flute.vercel.app. Once DNS is updated, change SITE_URL
//   here ONLY — all pages update automatically.
// ============================================================

import type { Metadata } from "next";

// PROTECTED — canonical base URL. Change only when DNS is updated.
export const SITE_URL = "https://root-flute.vercel.app";

// PROTECTED — OG image dimensions used across all pages.
const OG_WIDTH = 1200;
const OG_HEIGHT = 630;

// PROTECTED — per-route metadata registry.
// Each route must have a unique title, description, ogImage, and path.
const PAGE_META = {
  home: {
    title: "RootFlute | Sacred Sound. Handcrafted Presence.",
    description: "Three pathways into the RootFlute world. Sound. Craft. Adornment.",
    // Static pre-rendered image — most reliable for all platforms.
    ogImage: `${SITE_URL}/og/rootflute-home-og-v14.png`,
    ogImageAlt: "RootFlute — Sacred Sound. Handcrafted Presence.",
    path: "/",
  },
  flutes: {
    title: "RootFlute Flutes | Breath · Resonance · Craft",
    description: "Handcrafted ceremonial flutes shaped by sound, ritual, and presence.",
    ogImage: `${SITE_URL}/api/og?page=flutes`,
    ogImageAlt: "RootFlute Flutes — Breath · Resonance · Craft",
    path: "/flutes",
  },
  instruments: {
    title: "RootFlute Instruments | Sound · Ritual · Presence",
    description: "One-of-one ceremonial instruments handcrafted for resonance and ritual.",
    ogImage: `${SITE_URL}/api/og?page=instruments`,
    ogImageAlt: "RootFlute Instruments — Sound · Ritual · Presence",
    path: "/instruments",
  },
  jewelry: {
    title: "RootFlute Adornment | Sacred Adornment",
    description: "Handcrafted ceremonial adornments created as one-of-one sacred pieces.",
    ogImage: `${SITE_URL}/api/og?page=jewelry`,
    ogImageAlt: "RootFlute Adornment — Sacred Adornment",
    path: "/jewelry",
  },
  society: {
    title: "RootFlute Society | Gather in Resonance",
    description: "Private sound journeys, teachings, ceremony, and community.",
    ogImage: `${SITE_URL}/api/og?page=community`,
    ogImageAlt: "RootFlute Society — Gather in Resonance",
    path: "/society",
  },
} as const;

export type PageKey = keyof typeof PAGE_META;

// ============================================================
// buildPageMetadata — PROTECTED EXPORT
// Call this in each page file's metadata export:
//   export const metadata = buildPageMetadata("flutes");
//
// DO NOT inline metadata in page files. All metadata must flow
// through this function to stay consistent and protected.
// ============================================================
export function buildPageMetadata(key: PageKey): Metadata {
  const { title, description, ogImage, ogImageAlt, path } = PAGE_META[key];
  const canonicalUrl = `${SITE_URL}${path === "/" ? "" : path}`;

  return {
    // metadataBase is inherited from layout.tsx — not set here to avoid duplication.
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: "RootFlute",
      locale: "en_US",
      images: [
        {
          url: ogImage,
          width: OG_WIDTH,
          height: OG_HEIGHT,
          alt: ogImageAlt,
          type: "image/png",
        },
      ],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
  };
}

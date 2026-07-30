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
    title: "RootFlute | Resonant Sound. Handcrafted Presence.",
    description: "Three pathways into the RootFlute world. Sound. Craft. Adornment.",
    // Static pre-rendered image — most reliable for all platforms.
    // Bumped to v15 (same image, new filename) to bust any stale negative
    // crawl cached by WhatsApp/Meta against the old v14 URL — same content,
    // fresh URL, forces a re-crawl.
    ogImage: `${SITE_URL}/og/rootflute-home-og-v15.png`,
    ogImageAlt: "RootFlute — Resonant Sound. Handcrafted Presence.",
    path: "/",
  },
  flutes: {
    title: "RootFlute Flutes | Breath · Resonance · Craft",
    description: "Handcrafted, intentional flutes shaped by sound, practice, and presence.",
    ogImage: `${SITE_URL}/api/og?page=flutes`,
    ogImageAlt: "RootFlute Flutes — Breath · Resonance · Craft",
    path: "/flutes",
  },
  instruments: {
    title: "RootFlute Instruments | Sound · Ritual · Presence",
    description: "One-of-one intentional instruments handcrafted for resonance and ritual.",
    ogImage: `${SITE_URL}/api/og?page=instruments`,
    ogImageAlt: "RootFlute Instruments — Sound · Ritual · Presence",
    path: "/instruments",
  },
  jewelry: {
    title: "RootFlute Adornment | Rare Adornment",
    description: "Handcrafted intentional adornments created as one-of-one rare pieces.",
    ogImage: `${SITE_URL}/api/og?page=jewelry`,
    ogImageAlt: "RootFlute Adornment — Rare Adornment",
    path: "/jewelry",
  },
  society: {
    title: "RootFlute Society | Gather in Resonance",
    description: "Private sound journeys, teachings, gatherings, and community.",
    ogImage: `${SITE_URL}/api/og?page=community`,
    ogImageAlt: "RootFlute Society — Gather in Resonance",
    path: "/society",
  },
  rootfluteLive: {
    title: "RootFlute Live | Live Looping Performances",
    description: "Live looping performances, festival sets, and outdoor concerts featuring handcrafted RootFlute instruments.",
    ogImage: `${SITE_URL}/api/og?page=rootfluteLive`,
    ogImageAlt: "RootFlute Live — Live Looping Performances",
    path: "/videos/rootflute-live",
  },
  instrumentVideos: {
    title: "Instrument Videos | RootFlute",
    description: "Handcrafted RootFlute instruments in action — demos, close-up looks, and behind-the-scenes builds.",
    ogImage: `${SITE_URL}/api/og?page=instrumentVideos`,
    ogImageAlt: "RootFlute Instrument Videos",
    path: "/videos/instruments",
  },
  lucidMeditation: {
    title: "Lucid Meditation | RootFlute",
    description: "Guided lucid meditation sessions led by RootFlute — breath, tone, and presence.",
    ogImage: `${SITE_URL}/api/og?page=lucidMeditation`,
    ogImageAlt: "RootFlute Lucid Meditation",
    path: "/videos/lucid-meditation",
  },
  music: {
    title: "Music | RootFlute",
    description: "Rise into rhythm with RootFlute's Organic Downtempo Live Looping Fusion — celestial soundscapes from self-made instruments.",
    ogImage: `${SITE_URL}/api/og?page=music`,
    ogImageAlt: "RootFlute Music — Organic Downtempo Live Looping Fusion",
    path: "/music",
  },
  "press-kit": {
    title: "Press Kit | RootFlute",
    description: "Professional media assets, biographies, and press kit materials for festivals, venues, and promoters.",
    ogImage: `${SITE_URL}/api/og?page=pressKit`,
    ogImageAlt: "RootFlute Press Kit — Media Assets",
    path: "/press-kit",
  },
  about: {
    title: "About Daniel Hansen | RootFlute",
    description: "Daniel Hansen is a flute inventor and sound meditation facilitator, crafting instruments from wild-shed antlers, agave stalks, and ancient materials.",
    ogImage: `${SITE_URL}/api/og?page=about`,
    ogImageAlt: "RootFlute — Daniel Hansen, Craftsman",
    path: "/about",
  },
  materials: {
    title: "Materials | RootFlute",
    description: "Wild shed elk antlers, vintage shells, and ancient fossils — the materials behind every RootFlute instrument.",
    ogImage: `${SITE_URL}/api/og?page=materials`,
    ogImageAlt: "RootFlute Materials",
    path: "/materials",
  },
  tickets: {
    title: "Tickets | RootFlute",
    description: "Upcoming RootFlute sound journeys, lucid meditations, and dance events.",
    ogImage: `${SITE_URL}/api/og?page=tickets`,
    ogImageAlt: "RootFlute Tickets",
    path: "/tickets",
  },
  testimonials: {
    title: "Testimonials | RootFlute",
    description: "Words from those who have sat in RootFlute's sound journeys and lucid meditations.",
    ogImage: `${SITE_URL}/api/og?page=testimonials`,
    ogImageAlt: "RootFlute Testimonials",
    path: "/testimonials",
  },
  contact: {
    title: "Contact | RootFlute",
    description: "Questions, collaborations, performances, private events, custom instruments, or general inquiries.",
    ogImage: `${SITE_URL}/api/og?page=contact`,
    ogImageAlt: "RootFlute Contact",
    path: "/contact",
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

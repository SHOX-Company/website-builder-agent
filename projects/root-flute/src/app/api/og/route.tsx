import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

const BASE = "https://root-flute.vercel.app";
const GOLD = "#C4973A";

type Page =
  | "home"
  | "community"
  | "flutes"
  | "instruments"
  | "jewelry"
  | "rootfluteLive"
  | "instrumentVideos"
  | "lucidMeditation"
  | "music"
  | "about"
  | "materials"
  | "tickets"
  | "testimonials"
  | "contact";

const CONFIGS: Record<Page, { label: string | null; tagline: string; bg: string; bgPosition?: string }> = {
  home: {
    label: null,
    tagline: "SOUND  ·  CRAFT  ·  ADORNMENT",
    bg: `${BASE}/og/rootflute-home-og-v8.png`,
    bgPosition: "center 30%",
  },
  community: {
    label: "COMMUNITY",
    tagline: "GATHER IN RESONANCE",
    bg: `${BASE}/images/community-hero.png`,
    bgPosition: "center 22%",
  },
  flutes: {
    label: "FLUTES",
    tagline: "BREATH  ·  RESONANCE  ·  CRAFT",
    bg: `${BASE}/images/og-flutes.jpg`,
  },
  instruments: {
    label: "INSTRUMENTS",
    tagline: "SOUND  ·  RITUAL  ·  PRESENCE",
    bg: `${BASE}/images/instruments/instruments-hero.png`,
  },
  jewelry: {
    label: "ADORNMENT",
    tagline: "RARE ADORNMENT",
    bg: `${BASE}/images/jewelry/pearl-of-vision-1.png`,
  },
  rootfluteLive: {
    label: "VIDEOS · ROOTFLUTE LIVE",
    tagline: "LIVE LOOPING PERFORMANCES",
    bg: `${BASE}/images/community-hero.png`,
    bgPosition: "center 22%",
  },
  instrumentVideos: {
    label: "VIDEOS · INSTRUMENTS",
    tagline: "SOUND · RITUAL · PRESENCE",
    bg: `${BASE}/images/instruments/instruments-hero.png`,
  },
  lucidMeditation: {
    label: "VIDEOS · LUCID MEDITATION",
    tagline: "BREATH · TONE · PRESENCE",
    bg: `${BASE}/images/homepage-community.jpg`,
    bgPosition: "center 30%",
  },
  music: {
    label: "MUSIC",
    tagline: "ORGANIC DOWNTEMPO LIVE LOOPING FUSION",
    bg: `${BASE}/images/homepage-flutes.jpg`,
    bgPosition: "center 25%",
  },
  about: {
    label: "ABOUT",
    tagline: "DANIEL HANSEN, CRAFTSMAN",
    bg: `${BASE}/images/about/daniel-hansen-elephant-hero-wide.jpg`,
    bgPosition: "center 40%",
  },
  materials: {
    label: "MATERIALS",
    tagline: "WILD SHED · ANCIENT · HONORED",
    bg: `${BASE}/images/materials/materials-antler-flute-hero-wide.jpg`,
    bgPosition: "center 35%",
  },
  tickets: {
    label: "TICKETS",
    tagline: "UPCOMING SOUND JOURNEYS",
    bg: `${BASE}/images/community-hero.png`,
    bgPosition: "center 22%",
  },
  testimonials: {
    label: "TESTIMONIALS",
    tagline: "WORDS FROM THE CIRCLE",
    bg: `${BASE}/images/homepage-community.jpg`,
    bgPosition: "center 30%",
  },
  contact: {
    label: "CONTACT",
    tagline: "SOUND  ·  CRAFT  ·  ADORNMENT",
    bg: `${BASE}/og/rootflute-home-og-v8.png`,
    bgPosition: "center 30%",
  },
};

export async function GET(request: NextRequest) {
  const raw = new URL(request.url).searchParams.get("page") ?? "home";
  const page: Page = raw in CONFIGS ? (raw as Page) : "home";
  const { label, tagline, bg, bgPosition = "center" } = CONFIGS[page];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "52px 60px",
          backgroundColor: "#07060B",
          position: "relative",
          overflow: "hidden",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        {/* Background image */}
        <img
          src={bg}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: bgPosition,
            opacity: 0.72,
          }}
        />

        {/* Cinematic gradient — heavy bottom darkening for legibility */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(to bottom, rgba(7,6,11,0.15) 0%, rgba(7,6,11,0.30) 50%, rgba(7,6,11,0.82) 100%)",
            display: "flex",
          }}
        />

        {/* Top-left section label */}
        <div style={{ display: "flex", position: "relative", zIndex: 2 }}>
          {label ? (
            <span
              style={{
                color: GOLD,
                fontSize: "15px",
                letterSpacing: "0.40em",
                fontWeight: 400,
                fontFamily: "'Helvetica Neue', Arial, sans-serif",
                textTransform: "uppercase",
              }}
            >
              {label}
            </span>
          ) : (
            <span style={{ display: "none" }} />
          )}
        </div>

        {/* Bottom-left: wordmark + tagline */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
            position: "relative",
            zIndex: 2,
          }}
        >
          <div style={{ display: "flex", alignItems: "baseline" }}>
            <span
              style={{
                fontSize: "58px",
                fontWeight: 300,
                color: "rgba(248, 244, 232, 0.92)",
                fontFamily: "Georgia, 'Times New Roman', serif",
                lineHeight: 1,
              }}
            >
              Root
            </span>
            <span
              style={{
                fontSize: "58px",
                fontWeight: 300,
                color: GOLD,
                fontFamily: "Georgia, 'Times New Roman', serif",
                lineHeight: 1,
              }}
            >
              Flute
            </span>
          </div>
          <span
            style={{
              color: "rgba(248, 244, 232, 0.52)",
              fontSize: "13px",
              letterSpacing: "0.32em",
              fontFamily: "'Helvetica Neue', Arial, sans-serif",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {tagline}
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      headers: {
        // Cache generated OG images at Vercel's edge for 24h so scrapers never
        // hit a cold-start edge function. stale-while-revalidate keeps it fresh.
        "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=604800",
      },
    }
  );
}

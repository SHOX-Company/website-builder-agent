// Shared video types — safe to import from both server and client code.

export type VideoCollectionId = "rootflute-live" | "instruments" | "lucid-meditation" | "music";

export interface VideoImage {
  url: string;
  alt: string;
}

export interface VideoItem {
  id: string;
  collection: VideoCollectionId;
  title: string;
  description: string;
  thumbnail: VideoImage | null;
  /** Uploaded, self-hosted video (Blob URL). Mutually exclusive with hostedUrl. */
  videoUrl: string | null;
  /** External link (YouTube, Vimeo, etc). Mutually exclusive with videoUrl. */
  hostedUrl: string | null;
  duration: string;
  featured: boolean;
  published: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type VideoItemInput = Omit<VideoItem, "id" | "createdAt" | "updatedAt">;

const YOUTUBE_URL_PATTERN = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{6,})/;

export function extractYouTubeId(url: string | null | undefined): string | null {
  if (!url) return null;
  const match = url.match(YOUTUBE_URL_PATTERN);
  return match ? match[1] : null;
}

// hqdefault is generated for virtually every YouTube upload, unlike
// maxresdefault/sddefault which only exist for sufficiently high-resolution
// sources and otherwise 404 (with a deceptive 120x90 grey placeholder body
// instead of a clean error) — the safe universal fallback.
export function youTubeThumbnailUrl(youTubeId: string): string {
  return `https://img.youtube.com/vi/${youTubeId}/hqdefault.jpg`;
}

interface VideoCollectionConfig {
  id: VideoCollectionId;
  label: string;
  tagline: string;
  publicPath: string;
  studioPath: string;
  fallbackCover: string;
}

export const VIDEO_COLLECTIONS: VideoCollectionConfig[] = [
  {
    id: "rootflute-live",
    label: "RootFlute Live",
    tagline: "Live looping performances, festival sets, and outdoor concerts.",
    publicPath: "/videos/rootflute-live",
    studioPath: "/studio/videos/rootflute-live",
    fallbackCover: "/images/community-hero.png",
  },
  {
    id: "instruments",
    label: "Instruments",
    tagline: "Handcrafted instruments in action — demos and behind-the-scenes builds.",
    publicPath: "/videos/instruments",
    studioPath: "/studio/videos/instruments",
    fallbackCover: "/images/instruments/instruments-hero.png",
  },
  {
    id: "lucid-meditation",
    label: "Lucid Meditation",
    tagline: "Guided lucid meditation sessions — breath, tone, and presence.",
    publicPath: "/videos/lucid-meditation",
    studioPath: "/studio/videos/lucid-meditation",
    fallbackCover: "/images/homepage-community.jpg",
  },
  {
    id: "music",
    label: "Music",
    tagline: "The curated video collection featured on the public Music page.",
    publicPath: "/music",
    studioPath: "/studio/music",
    fallbackCover: "/images/community-hero.png",
  },
];

export function getCollectionConfig(id: VideoCollectionId): VideoCollectionConfig {
  const config = VIDEO_COLLECTIONS.find((c) => c.id === id);
  if (!config) throw new Error(`Unknown video collection: ${id}`);
  return config;
}

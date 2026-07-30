// Shared Music-featured types — safe to import from both server and client
// code.
//
// The Music Studio editor is a curated, ordered view into the shared Video
// library (src/lib/video.ts) — never a copy. This document stores nothing
// but an ordered list of video IDs, so a video already published under
// RootFlute Live / Instruments / Lucid Meditation can also be featured on
// Music without ever being duplicated or moved out of its home collection.

export interface MusicFeaturedContent {
  videoIds: string[];
  updatedAt: string;
}

export const DEFAULT_MUSIC_FEATURED: MusicFeaturedContent = {
  videoIds: [
    "2e6BSwQUHlw", // RootFlute instrument demonstration
    "XOoVrNN7TB8", // Organic Downtempo Live Looping Fusion  in C# 432 Hz OM (RootFlute) studio sessions
    "RuznuuEfp2s", // Organic Downtempo Live Looping Fusion by RootFlute
    "a7typ5Kp1so", // Live Sound Meditation Album 5-11-24 by RootFlute
    "fi1OjLrRmUc", // Rootflute Lucid meditation. Full session in previos vid
    "pCqVA2i8rww", // RootFlute Lucid meditation  #194  5-8-24 (at 10:00 words stop )
    "kDi-QEQIrXw", // RootFlute Live Looping Fusion | Handmade Instruments | Trancendance Festival, Playa del Carmen
    "5DqLf8K0xbY", // Landjuweel Festival 2024 with RootFlute
    "KrebMPoLeYE", // Rootflute Live at Samsara Music Festival BC | Epic Live Looping Fusion Set in Stunning Nature
  ],
  updatedAt: new Date().toISOString(),
};

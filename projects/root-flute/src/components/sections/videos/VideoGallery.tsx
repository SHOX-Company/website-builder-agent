"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoEntry } from "@/lib/videos";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 sm:w-7 sm:h-7 ml-1">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

function VideoCard({ video }: { video: VideoEntry }) {
  const [thumbSrc, setThumbSrc] = useState(video.thumbnail);

  return (
    <a
      href={video.youtubeUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block focus-visible:outline-none"
      aria-label={`Watch "${video.title}" on YouTube — opens in a new tab`}
    >
      <div className="relative aspect-video overflow-hidden bg-brand-surface-2 border border-brand-border transition-colors duration-300 group-hover:border-brand-gold/50 group-focus-visible:border-brand-gold">
        <Image
          src={thumbSrc}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onLoad={(e) => {
            // YouTube 404s missing maxresdefault.jpg with a decodable 120x90 grey
            // placeholder (not a broken image), so onError never fires — detect
            // the placeholder by its fixed dimensions and fall back to hqdefault,
            // which is generated for virtually every upload.
            const img = e.currentTarget;
            const hq = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            if (img.naturalWidth === 120 && img.naturalHeight === 90 && thumbSrc !== hq) {
              setThumbSrc(hq);
            }
          }}
          onError={() => {
            const hq = `https://img.youtube.com/vi/${video.videoId}/hqdefault.jpg`;
            if (thumbSrc !== hq) setThumbSrc(hq);
          }}
        />

        {/* Darkening veil, deepens on hover for readability + drama */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

        {/* Centered play button */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-dark/55 text-brand-gold border border-brand-gold/50 backdrop-blur-sm transition-all duration-300 ease-out group-hover:bg-brand-gold group-hover:text-brand-dark group-hover:border-brand-gold group-hover:scale-110">
            <PlayIcon />
          </span>
        </div>
      </div>

      <h3 className="mt-4 font-sans text-sm sm:text-[0.95rem] text-brand-text/90 leading-snug transition-colors duration-200 group-hover:text-brand-gold">
        {video.title}
      </h3>
    </a>
  );
}

export default function VideoGallery({ videos }: { videos: VideoEntry[] }) {
  if (videos.length === 0) {
    return (
      <p className="text-center text-brand-muted text-sm py-16">
        New videos are on the way.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {videos.map((video) => (
        <VideoCard key={video.videoId} video={video} />
      ))}
    </div>
  );
}

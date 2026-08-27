"use client";

import { useState } from "react";
import Image from "next/image";
import type { VideoItem } from "@/lib/video";
import { extractYouTubeId, youTubeThumbnailUrl } from "@/lib/video";
import VideoLightbox from "./VideoLightbox";

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="w-6 h-6 sm:w-7 sm:h-7 ml-1">
      <path d="M8 5v14l11-7z" fill="currentColor" />
    </svg>
  );
}

// Same visual design as the public site's original VideoGallery card —
// reused here (and by the Studio Preview modal) so what Daniel edits is
// exactly what visitors see. Extended to also support self-hosted uploads
// (played inline via a lightbox) alongside the original "link out to a
// hosted URL" behavior.
export default function VideoCollectionCard({ video }: { video: VideoItem }) {
  const youTubeId = video.hostedUrl ? extractYouTubeId(video.hostedUrl) : null;
  // A missing thumbnail with a YouTube source recovers immediately; a
  // present-but-broken one (e.g. a dead maxresdefault URL) recovers via the
  // onLoad/onError handlers below. Only when neither exists does no <Image>
  // render at all, leaving the plain placeholder background.
  const [thumbSrc, setThumbSrc] = useState(
    video.thumbnail?.url || (youTubeId ? youTubeThumbnailUrl(youTubeId) : "")
  );
  const [playing, setPlaying] = useState(false);

  const card = (
    <div className="relative aspect-video overflow-hidden bg-brand-surface-2 border border-brand-border transition-colors duration-300 group-hover:border-brand-gold/50 group-focus-visible:border-brand-gold">
      {thumbSrc && (
        <Image
          src={thumbSrc}
          alt=""
          fill
          unoptimized
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          onLoad={(e) => {
            if (!youTubeId) return;
            // YouTube 404s missing maxresdefault.jpg with a decodable 120x90
            // grey placeholder — detect it by its fixed dimensions and fall
            // back to hqdefault, generated for virtually every upload.
            const img = e.currentTarget;
            const hq = youTubeThumbnailUrl(youTubeId);
            if (img.naturalWidth === 120 && img.naturalHeight === 90 && thumbSrc !== hq) {
              setThumbSrc(hq);
            }
          }}
          onError={() => {
            if (!youTubeId) return;
            const hq = youTubeThumbnailUrl(youTubeId);
            if (thumbSrc !== hq) setThumbSrc(hq);
          }}
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent transition-opacity duration-300 group-hover:from-black/80" />

      <div className="absolute inset-0 flex items-center justify-center">
        <span className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-brand-dark/55 text-brand-gold border border-brand-gold/50 backdrop-blur-sm transition-all duration-300 ease-out group-hover:bg-brand-gold group-hover:text-brand-dark group-hover:border-brand-gold group-hover:scale-110">
          <PlayIcon />
        </span>
      </div>

      {video.duration && (
        <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-brand-dark/80 text-brand-text/90 text-[11px] font-sans rounded">
          {video.duration}
        </span>
      )}
    </div>
  );

  const titleEl = (
    <h3 className="mt-4 font-sans text-sm sm:text-[0.95rem] text-brand-text/90 leading-snug transition-colors duration-200 group-hover:text-brand-gold">
      {video.title}
    </h3>
  );

  // Native YouTube embed — same pattern as the Music section: plays inline
  // via YouTube's own player/controls instead of linking out to a thumbnail.
  if (youTubeId) {
    return (
      <div className="group block">
        <div className="relative aspect-video overflow-hidden bg-brand-surface-2 border border-brand-border transition-colors duration-300 group-hover:border-brand-gold/50 group-focus-visible:border-brand-gold">
          <iframe
            className="absolute inset-0 w-full h-full"
            src={`https://www.youtube.com/embed/${youTubeId}?autoplay=0&rel=0`}
            title={video.title}
            allowFullScreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
          {video.duration && (
            <span className="absolute bottom-2 right-2 px-1.5 py-0.5 bg-brand-dark/80 text-brand-text/90 text-[11px] font-sans rounded">
              {video.duration}
            </span>
          )}
        </div>
        {titleEl}
      </div>
    );
  }

  if (video.hostedUrl) {
    return (
      <a
        href={video.hostedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="group block focus-visible:outline-none"
        aria-label={`Watch "${video.title}" — opens in a new tab`}
      >
        {card}
        {titleEl}
      </a>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="group block w-full text-left focus-visible:outline-none"
        aria-label={`Play "${video.title}"`}
      >
        {card}
        {titleEl}
      </button>
      {playing && video.videoUrl && (
        <VideoLightbox src={video.videoUrl} title={video.title} onClose={() => setPlaying(false)} />
      )}
    </>
  );
}

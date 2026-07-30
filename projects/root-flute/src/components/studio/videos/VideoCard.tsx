"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { VideoItem } from "@/lib/video";
import { extractYouTubeId, youTubeThumbnailUrl } from "@/lib/video";

// A clean visual gallery card — the same "browse, then tap to manage"
// philosophy as the Inventory gallery. No status pills, no inline actions:
// the only thing this card does is open the Edit drawer, where every real
// action (Save, Repost, Delete) lives.
export default function VideoCard({ video, onEdit }: { video: VideoItem; onEdit: () => void }) {
  const youTubeId = video.hostedUrl ? extractYouTubeId(video.hostedUrl) : null;
  // A missing thumbnail with a YouTube source recovers immediately; a
  // present-but-broken one (e.g. a dead maxresdefault URL) recovers via the
  // onLoad/onError handlers below. Only when neither exists does no <img>
  // render, leaving the plain placeholder background.
  const [thumbSrc, setThumbSrc] = useState(
    video.thumbnail?.url || (youTubeId ? youTubeThumbnailUrl(youTubeId) : "")
  );

  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex flex-col text-left bg-brand-surface border border-brand-border rounded-lg overflow-hidden hover:border-brand-gold/40 transition-colors duration-200"
    >
      <div className="relative aspect-video bg-brand-dark">
        {thumbSrc && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumbSrc}
            alt={video.thumbnail?.alt ?? video.title}
            className="w-full h-full object-cover"
            onLoad={(e) => {
              if (!youTubeId) return;
              // YouTube 404s missing maxresdefault.jpg with a decodable
              // 120x90 grey placeholder — detect it by its fixed dimensions
              // and fall back to hqdefault, generated for virtually every
              // upload.
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
      </div>

      <div className="flex flex-col gap-1 p-4">
        <h3 className="text-brand-text text-sm font-medium font-sans truncate">{video.title}</h3>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold font-sans text-brand-gold">
          Edit <ArrowRight className="w-3 h-3" strokeWidth={2} />
        </span>
      </div>
    </button>
  );
}

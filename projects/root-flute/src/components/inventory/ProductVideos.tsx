import type { InventoryVideo } from "@/lib/inventory";

// Playable product videos for a detail page. Deliberately plain: native
// controls, no autoplay, `preload="metadata"` (so a page with two ~30MB clips
// downloads almost nothing until a visitor presses play), and a size cap so
// portrait footage never overflows or dominates a phone screen.
export default function ProductVideos({ videos, heading = "Watch" }: { videos: InventoryVideo[]; heading?: string }) {
  if (videos.length === 0) return null;
  return (
    <section aria-label={heading} className="pt-16 sm:pt-20">
      <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans text-center mb-8">{heading}</p>
      <div className="flex flex-col sm:flex-row items-center sm:items-start justify-center gap-8">
        {videos.map((video) => (
          <figure key={video.url} className="w-full max-w-[320px] sm:max-w-[300px] lg:max-w-[340px] m-0">
            <video
              controls
              playsInline
              preload="metadata"
              poster={video.poster}
              title={video.title}
              aria-label={video.title}
              className="w-full max-h-[80vh] aspect-[9/16] bg-brand-dark border border-brand-border object-contain"
            >
              <source src={video.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </figure>
        ))}
      </div>
    </section>
  );
}

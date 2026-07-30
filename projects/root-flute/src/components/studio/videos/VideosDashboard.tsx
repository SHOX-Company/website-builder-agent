import Link from "next/link";
import { ArrowRight, Video as VideoIcon } from "lucide-react";
import type { VideoItem } from "@/lib/video";
import { VIDEO_COLLECTIONS } from "@/lib/video";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";

// A clean gallery of collections — cover image, title, video count, and a
// single "View Gallery" CTA. No other metadata or controls: choosing a
// collection is the only decision made here, everything else happens one
// level in.
export default function VideosDashboard({ allVideos }: { allVideos: VideoItem[] }) {
  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Videos"
        title="Videos"
        description="Manage the RootFlute Live, Instruments, Lucid Meditation, and Music video collections."
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {VIDEO_COLLECTIONS.map((collection) => {
          const items = allVideos.filter((v) => v.collection === collection.id);
          const sorted = [...items].sort((a, b) => a.order - b.order);
          const cover =
            sorted.find((v) => v.featured)?.thumbnail?.url ?? sorted[0]?.thumbnail?.url ?? collection.fallbackCover;

          return (
            <Link key={collection.id} href={collection.studioPath}>
              <Card hover padding="none" className="h-full flex flex-col overflow-hidden">
                <div className="relative aspect-video bg-brand-dark">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover} alt="" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/80 via-transparent to-transparent" />
                  <div className="absolute top-2.5 left-2.5 flex items-center gap-1.5 px-2 py-1 rounded-full bg-brand-dark/70 backdrop-blur-sm">
                    <VideoIcon className="w-3 h-3 text-brand-gold" strokeWidth={2} />
                    <span className="text-[11px] text-brand-text font-sans">
                      {items.length} video{items.length === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 p-5">
                  <h3 className="text-brand-text text-base font-medium font-sans truncate min-w-0">
                    {collection.label}
                  </h3>
                  <span className="flex items-center gap-1 text-xs font-semibold text-brand-gold font-sans flex-shrink-0">
                    View Gallery <ArrowRight className="w-3.5 h-3.5" strokeWidth={2} />
                  </span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

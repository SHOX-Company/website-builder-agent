import type { VideoItem } from "@/lib/video";
import VideoCollectionCard from "./VideoCollectionCard";

export default function VideoGrid({ videos }: { videos: VideoItem[] }) {
  if (videos.length === 0) {
    return <p className="text-center text-brand-muted text-sm py-16">New videos are on the way.</p>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-14">
      {videos.map((video) => (
        <VideoCollectionCard key={video.id} video={video} />
      ))}
    </div>
  );
}

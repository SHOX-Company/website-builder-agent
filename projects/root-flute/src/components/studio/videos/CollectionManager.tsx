"use client";

import { useState } from "react";
import { Plus, Video as VideoIcon } from "lucide-react";
import type { VideoCollectionId, VideoItem } from "@/lib/video";
import { getCollectionConfig } from "@/lib/video";
import PageHeader from "@/components/studio/ui/PageHeader";
import Breadcrumbs from "@/components/studio/ui/Breadcrumbs";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import VideoCard from "@/components/studio/videos/VideoCard";
import VideoItemDrawer from "@/components/studio/videos/VideoItemDrawer";

export default function CollectionManager({
  collection,
  initialVideos,
}: {
  collection: VideoCollectionId;
  initialVideos: VideoItem[];
}) {
  const config = getCollectionConfig(collection);
  const [videos, setVideos] = useState<VideoItem[]>([...initialVideos].sort((a, b) => a.order - b.order));

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);

  function openNewVideo() {
    setEditingVideo(null);
    setDrawerOpen(true);
  }

  function openEdit(video: VideoItem) {
    setEditingVideo(video);
    setDrawerOpen(true);
  }

  function handleSaved(video: VideoItem) {
    setVideos((prev) => {
      const exists = prev.some((v) => v.id === video.id);
      const next = exists ? prev.map((v) => (v.id === video.id ? video : v)) : [...prev, video];
      return next.filter((v) => v.collection === collection).sort((a, b) => a.order - b.order);
    });
    setDrawerOpen(false);
  }

  // Repost Video updates the record but keeps the drawer open, since the
  // gallery cards show no status badges — this is the only place Daniel
  // gets confirmation the action took effect.
  function handleUpdated(video: VideoItem) {
    setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
    setEditingVideo(video);
  }

  function handleDeleted(id: string) {
    setVideos((prev) => prev.filter((v) => v.id !== id));
  }

  return (
    <div className="flex flex-col gap-6">
      <Breadcrumbs items={[{ label: "Studio", href: "/studio" }, { label: "Videos", href: "/studio/videos" }, { label: config.label }]} />

      <PageHeader
        eyebrow="Videos"
        title={config.label}
        description={config.tagline}
        actions={
          <StudioButton onClick={openNewVideo} size="lg">
            <Plus className="w-4 h-4" strokeWidth={2} /> New Video
          </StudioButton>
        }
      />

      {videos.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={VideoIcon}
            title="No videos in this collection yet"
            description="Add the first video to see it appear here — and on the public website once published."
          >
            <StudioButton onClick={openNewVideo} className="mt-2">
              <Plus className="w-4 h-4" strokeWidth={2} /> New Video
            </StudioButton>
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onEdit={() => openEdit(video)} />
          ))}
        </div>
      )}

      <VideoItemDrawer
        open={drawerOpen}
        video={editingVideo}
        defaultCollection={collection}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

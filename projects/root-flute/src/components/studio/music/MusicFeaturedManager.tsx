"use client";

import { useState } from "react";
import { Plus, Music as MusicIcon } from "lucide-react";
import type { VideoItem } from "@/lib/video";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import VideoCard from "@/components/studio/videos/VideoCard";
import VideoItemDrawer from "@/components/studio/videos/VideoItemDrawer";

export default function MusicFeaturedManager({ initialVideos }: { initialVideos: VideoItem[] }) {
  const [videos, setVideos] = useState<VideoItem[]>(initialVideos);

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

  async function handleSaved(video: VideoItem) {
    const isNew = !videos.some((v) => v.id === video.id);
    setDrawerOpen(false);

    if (!isNew) {
      setVideos((prev) => prev.map((v) => (v.id === video.id ? video : v)));
      return;
    }

    // Newly created video — feature it on the Music page.
    const res = await fetch("/api/studio/music", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: video.id }),
    });
    const data = await res.json().catch(() => null);
    if (res.ok && data?.items) {
      setVideos(data.items as VideoItem[]);
    }
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
      <PageHeader
        eyebrow="Music"
        title="Music"
        description="The curated video collection featured on the public Music page — pulled live from your Video library."
        actions={
          <StudioButton onClick={openNewVideo} size="lg">
            <Plus className="w-4 h-4" strokeWidth={2} /> New Video
          </StudioButton>
        }
      />

      {videos.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={MusicIcon}
            title="No videos featured on Music yet"
            description="Add a new video, or feature an existing one from RootFlute Live, Instruments, or Lucid Meditation."
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
        defaultCollection="music"
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

import VideosDashboard from "@/components/studio/videos/VideosDashboard";
import { getVideos } from "@/lib/videoStore";

export const dynamic = "force-dynamic";

export default async function StudioVideosPage() {
  const allVideos = await getVideos();
  return <VideosDashboard allVideos={allVideos} />;
}

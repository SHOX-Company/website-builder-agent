import MusicFeaturedManager from "@/components/studio/music/MusicFeaturedManager";
import { getMusicFeaturedVideos } from "@/lib/musicFeaturedStore";

export const dynamic = "force-dynamic";

export default async function StudioMusicPage() {
  const videos = await getMusicFeaturedVideos();
  return <MusicFeaturedManager initialVideos={videos} />;
}

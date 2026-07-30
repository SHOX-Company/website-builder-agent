import CollectionManager from "@/components/studio/videos/CollectionManager";
import { getVideosByCollection } from "@/lib/videoStore";

export const dynamic = "force-dynamic";

export default async function StudioInstrumentVideosPage() {
  const videos = await getVideosByCollection("instruments");
  return <CollectionManager collection="instruments" initialVideos={videos} />;
}

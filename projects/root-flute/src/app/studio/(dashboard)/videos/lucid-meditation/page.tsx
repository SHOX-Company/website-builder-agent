import CollectionManager from "@/components/studio/videos/CollectionManager";
import { getVideosByCollection } from "@/lib/videoStore";

export const dynamic = "force-dynamic";

export default async function StudioLucidMeditationPage() {
  const videos = await getVideosByCollection("lucid-meditation");
  return <CollectionManager collection="lucid-meditation" initialVideos={videos} />;
}

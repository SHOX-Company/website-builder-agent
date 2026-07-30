import CollectionManager from "@/components/studio/videos/CollectionManager";
import { getVideosByCollection } from "@/lib/videoStore";

export const dynamic = "force-dynamic";

export default async function StudioRootFluteLivePage() {
  const videos = await getVideosByCollection("rootflute-live");
  return <CollectionManager collection="rootflute-live" initialVideos={videos} />;
}

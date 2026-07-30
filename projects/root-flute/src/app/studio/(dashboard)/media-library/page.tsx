import MediaLibrary from "@/components/studio/media/MediaLibrary";
import { getMediaAssets } from "@/lib/media";

export const dynamic = "force-dynamic";

export default async function StudioMediaLibraryPage() {
  const assets = await getMediaAssets();
  return <MediaLibrary initialAssets={assets} />;
}

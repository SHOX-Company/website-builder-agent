import AboutPageEditor from "@/components/studio/about/AboutPageEditor";
import { getAboutPage } from "@/lib/aboutPageStore";

export const dynamic = "force-dynamic";

export default async function StudioAboutPage() {
  const content = await getAboutPage();
  return <AboutPageEditor initialContent={content} />;
}

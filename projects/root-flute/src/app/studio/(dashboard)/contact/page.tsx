import ContactPageEditor from "@/components/studio/contact/ContactPageEditor";
import { getContactPage } from "@/lib/contactPageStore";

export const dynamic = "force-dynamic";

export default async function StudioContactPage() {
  const content = await getContactPage();
  return <ContactPageEditor initialContent={content} />;
}

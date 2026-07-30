import MaterialsStatementEditor from "@/components/studio/materials/MaterialsStatementEditor";
import { getMaterialsStatement } from "@/lib/materialStore";

export const dynamic = "force-dynamic";

export default async function StudioMaterialsPage() {
  const content = await getMaterialsStatement();
  return <MaterialsStatementEditor initialContent={content} />;
}

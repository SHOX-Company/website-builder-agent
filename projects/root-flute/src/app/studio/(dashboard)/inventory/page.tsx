import InventoryDashboard from "@/components/studio/inventory/InventoryDashboard";
import { getInventory } from "@/lib/inventoryStore";

export const dynamic = "force-dynamic";

export default async function StudioInventoryPage() {
  const items = await getInventory();
  return <InventoryDashboard initialItems={items} />;
}

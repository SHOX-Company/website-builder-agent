"use client";

import { useMemo, useState } from "react";
import { Plus, Package } from "lucide-react";
import type { InventoryCategory, InventoryItem } from "@/lib/inventory";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import EmptyState from "@/components/studio/ui/EmptyState";
import StudioButton from "@/components/studio/ui/Button";
import InventoryCard from "@/components/studio/inventory/InventoryCard";
import InventoryItemDrawer from "@/components/studio/inventory/InventoryItemDrawer";

type CategoryFilter = "all" | InventoryCategory;
type StatusFilter = "all" | "available" | "sold";

const CATEGORY_TABS: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "flute", label: "Flutes" },
  { value: "instrument", label: "Instruments" },
  { value: "jewelry", label: "Talismans" },
];

const STATUS_TABS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "available", label: "Available" },
  { value: "sold", label: "Sold" },
];

export default function InventoryDashboard({ initialItems }: { initialItems: InventoryItem[] }) {
  const [items, setItems] = useState<InventoryItem[]>(initialItems);
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);

  const filtered = useMemo(
    () =>
      items.filter(
        (item) =>
          (categoryFilter === "all" || item.category === categoryFilter) &&
          (statusFilter === "all" || item.status === statusFilter)
      ),
    [items, categoryFilter, statusFilter]
  );

  function openNewPiece() {
    setEditingItem(null);
    setDrawerOpen(true);
  }

  function openEdit(item: InventoryItem) {
    setEditingItem(item);
    setDrawerOpen(true);
  }

  function handleSaved(item: InventoryItem) {
    setItems((prev) => {
      const exists = prev.some((i) => i.id === item.id);
      return exists ? prev.map((i) => (i.id === item.id ? item : i)) : [item, ...prev];
    });
    setDrawerOpen(false);
  }

  // Mark as Sold / Relist update the record but keep the drawer open, since
  // the gallery cards show no status badges — this is the only place Daniel
  // gets confirmation the action took effect.
  function handleUpdated(item: InventoryItem) {
    setItems((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    setEditingItem(item);
  }

  function handleDeleted(id: string) {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }

  const availableCount = items.filter((i) => i.status === "available").length;

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Inventory"
        title="Inventory"
        description={`${availableCount} piece${availableCount === 1 ? "" : "s"} available across Flutes, Instruments & Talismans.`}
        actions={
          <StudioButton onClick={openNewPiece} size="lg">
            <Plus className="w-4 h-4" strokeWidth={2} /> New Piece
          </StudioButton>
        }
      />

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-md p-1">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setCategoryFilter(tab.value)}
              className={`px-3 py-1.5 rounded text-xs font-sans transition-colors duration-150 ${
                categoryFilter === tab.value
                  ? "bg-brand-gold/10 text-brand-gold"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1 bg-brand-surface border border-brand-border rounded-md p-1">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setStatusFilter(tab.value)}
              className={`px-3 py-1.5 rounded text-xs font-sans transition-colors duration-150 ${
                statusFilter === tab.value
                  ? "bg-brand-gold/10 text-brand-gold"
                  : "text-brand-muted hover:text-brand-text"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card padding="none">
          <EmptyState
            icon={Package}
            title="Nothing here yet"
            description="Create the first piece to see it appear here — and on the public website once it's available."
          >
            <StudioButton onClick={openNewPiece} className="mt-2">
              <Plus className="w-4 h-4" strokeWidth={2} /> New Piece
            </StudioButton>
          </EmptyState>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((item) => (
            <InventoryCard key={item.id} item={item} onEdit={() => openEdit(item)} />
          ))}
        </div>
      )}

      <InventoryItemDrawer
        open={drawerOpen}
        item={editingItem}
        allItems={items}
        defaultCategory={categoryFilter !== "all" ? categoryFilter : undefined}
        onClose={() => setDrawerOpen(false)}
        onSaved={handleSaved}
        onUpdated={handleUpdated}
        onDeleted={handleDeleted}
      />
    </div>
  );
}

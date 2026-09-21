import { ArrowRight } from "lucide-react";
import type { InventoryItem } from "@/lib/inventory";
import { CATEGORY_LABELS, formatPrice, isMadeToOrder, isShowcase } from "@/lib/inventory";

// The one thing the card says about an item's kind, so finite inventory, sold
// pieces, showcase examples and permanent made-to-order designs can be told
// apart without opening each one. Plain finite available items get no tag.
function kindTag(item: InventoryItem): string | null {
  if (isMadeToOrder(item)) return "Made to Order";
  if (isShowcase(item)) return "Showcase";
  if (item.status === "sold") return "Sold";
  return null;
}

// A clean, premium visual catalog — the same "browse, then tap to manage"
// philosophy as the Videos section. No status pills, no inline actions: the
// only thing this card does is open the Edit drawer, where every real
// action (Save, Mark as Sold, Relist, Delete) lives.
export default function InventoryCard({ item, onEdit }: { item: InventoryItem; onEdit: () => void }) {
  return (
    <button
      type="button"
      onClick={onEdit}
      className="flex flex-col text-left bg-brand-surface border border-brand-border rounded-lg overflow-hidden hover:border-brand-gold/40 transition-colors duration-200"
    >
      <div className="relative aspect-[4/3] bg-brand-dark">
        {item.featuredImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.featuredImage.url} alt={item.featuredImage.alt} className="w-full h-full object-cover" />
        )}
      </div>

      <div className="flex flex-col gap-1 p-4">
        <p className="text-brand-gold text-[10px] uppercase tracking-widest font-sans">
          {CATEGORY_LABELS[item.category]}
          {kindTag(item) && <span className="text-brand-muted"> · {kindTag(item)}</span>}
        </p>
        <h3 className="text-brand-text text-sm font-medium font-sans truncate">{item.name}</h3>
        <p className="text-brand-muted text-sm font-sans">{formatPrice(item.price)}</p>
        <span className="mt-2 inline-flex items-center gap-1 text-xs font-semibold font-sans text-brand-gold">
          Edit <ArrowRight className="w-3 h-3" strokeWidth={2} />
        </span>
      </div>
    </button>
  );
}

// Shared inventory types — safe to import from both server and client code.

export type InventoryCategory = "flute" | "instrument" | "jewelry";
export type InventoryStatus = "available" | "sold";

export interface InventoryImage {
  url: string;
  alt: string;
}

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  name: string;
  /** Dollars, whole number. `null` = "Pricing on inquiry". */
  price: number | null;
  status: InventoryStatus;
  published: boolean;
  featured: boolean;
  shortDescription: string;
  story: string;
  materials: string;
  specifications: string;
  featuredImage: InventoryImage | null;
  additionalImages: InventoryImage[];
  video: string | null;
  /**
   * 1-based position among this item's *active* (available + published)
   * category-mates — the single source of truth for listing order on the
   * public site. Always resolved to a valid, gapless sequence by the store
   * layer (see `inventoryStore.ts`), even for items that predate this
   * field, so every reader can treat it as present and correct.
   */
  order: number;
  createdAt: string;
  updatedAt: string;
  soldAt: string | null;
  /** The Stripe Checkout Session ID that won this item, if sold via Stripe. */
  stripeCheckoutSessionId: string | null;
}

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  flute: "Flute",
  instrument: "Instrument",
  jewelry: "Talismans",
};

export function formatPrice(price: number | null): string {
  if (price === null) return "Pricing on inquiry";
  return `$${price.toLocaleString("en-US")}`;
}

// Stripe Checkout Task S1: pure eligibility predicate. Items with no set
// price ("Pricing on inquiry") are never checkout-eligible — they only ever
// go through the inquiry flow. No Checkout Session exists yet, so nothing
// currently branches on `true`; later Stripe tasks wire that in.
export function isCheckoutEligible(item: InventoryItem): boolean {
  return item.price !== null;
}

// `order` is optional on input: omit it to auto-append at the end of its
// category, or pass an explicit 1-based position to place/move it there —
// the store cascades the shift across every other affected item.
export type InventoryItemInput = Omit<
  InventoryItem,
  "id" | "createdAt" | "updatedAt" | "soldAt" | "status" | "order" | "stripeCheckoutSessionId"
> & { order?: number };

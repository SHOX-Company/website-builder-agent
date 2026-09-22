// Shared inventory types — safe to import from both server and client code.

export type InventoryCategory = "flute" | "instrument" | "jewelry";
export type InventoryStatus = "available" | "sold";

export interface InventoryImage {
  url: string;
  alt: string;
}

/**
 * A purchasable size / configuration of a made-to-order design (e.g. the
 * Triton Shell Harp's "Large" and "Medium"). The server prices a checkout from
 * THIS record, never from anything the browser submits. Only honoured for a
 * permanent made-to-order design (see `getConfigurations`).
 */
export interface InventoryConfiguration {
  /** Stable machine id, e.g. "large". Lowercase letters, digits, hyphens. */
  id: string;
  /** Customer-facing label, e.g. "Large". */
  label: string;
  /** Full price of this configuration, whole dollars. */
  price: number;
}

/** A playable product video (self-hosted MP4) shown on the piece's detail page. */
export interface InventoryVideo {
  url: string;
  title: string;
  poster?: string;
}

export interface InventoryItem {
  id: string;
  category: InventoryCategory;
  name: string;
  /** Dollars, whole number. `null` = "Pricing on inquiry". */
  price: number | null;
  status: InventoryStatus;
  published: boolean;
  /**
   * Showcase / Made-to-Order Example. `true` = the piece stays publicly
   * visible as an example of RootFlute work, its price renders as a
   * "Reference price", and it can NEVER be purchased — the only CTA is a
   * made-to-order inquiry. This is deliberately NOT `status: "sold"`: sold
   * pieces are hidden from the public site; showcase pieces are not.
   * Optional so every record written before this field existed keeps behaving
   * exactly as it did (absent === false).
   */
  showcase?: boolean;
  /**
   * Permanent Made-to-Order design (Instruments and Flutes only). `true` = this listing
   * is a standing RootFlute design, NOT a finite physical piece: a purchase
   * creates an order and Daniel builds that customer's instrument, but the
   * listing stays live, is never marked Sold, and can be ordered again.
   * Mutually exclusive with `showcase` (which is non-purchasable) — see
   * `isMadeToOrder`, which is the only thing the rest of the code consults.
   * Optional so every record written before this field existed keeps
   * behaving exactly as it did (absent === false === finite inventory).
   */
  madeToOrder?: boolean;
  /**
   * Sizes / configurations of a made-to-order design, each with its own full
   * price. Absent or empty === a single-price piece (`price`). When present,
   * a checkout must name exactly one of them. `price` is kept as the default
   * (first) configuration's price so listings/orders that only know `price`
   * keep working.
   */
  configurations?: InventoryConfiguration[];
  /**
   * An exact, customer-facing "what comes with it" sentence, rendered verbatim
   * (never restyled, recased or rewritten) near the price. Optional.
   */
  inclusions?: string;
  /** Additional playable product videos for the detail page (`video` is the autoplay hero clip). */
  videos?: InventoryVideo[];
  /**
   * Which media type leads the gallery (the card thumbnail and the first
   * lightbox item) when a piece has both `videos` and images. Absent/"video"
   * === videos first, then images (the Shell Harp pattern: every existing
   * record with videos keeps behaving exactly as it does today). "image" ===
   * images first, then videos — for a piece whose primary photo is a static
   * shot rather than a video frame.
   */
  primaryMedia?: "image" | "video";
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

export function isShowcase(item: Pick<InventoryItem, "showcase">): boolean {
  return item.showcase === true;
}

/**
 * The categories whose listings can be permanent made-to-order designs (a
 * handcrafted Instrument or Mammoth Tusk Flute is built per order). Talismans
 * are deliberately NOT in this list: they are finite one-of-one pieces or
 * showcase/commission examples, never a standing design.
 */
export const MADE_TO_ORDER_CATEGORIES: readonly InventoryCategory[] = ["instrument", "flute"];

export function canBeMadeToOrder(category: InventoryCategory): boolean {
  return MADE_TO_ORDER_CATEGORIES.includes(category);
}

/**
 * The single definition of "permanent made-to-order design". Deliberately
 * fail-safe: it is only true for an Instrument or Flute that is explicitly
 * flagged AND is not a showcase example. A stray flag on a Talisman, or a
 * record flagged as both made-to-order and showcase, falls back to ordinary
 * finite / showcase behavior — so the one-of-one and inquiry-only commerce
 * rules for those can never be relaxed by accident.
 */
export function isMadeToOrder(
  item: Pick<InventoryItem, "madeToOrder" | "category" | "showcase">
): boolean {
  return item.madeToOrder === true && canBeMadeToOrder(item.category) && item.showcase !== true;
}

/** Label for a price that is context for the visitor, not an offer to buy. */
export const REFERENCE_PRICE_LABEL = "Reference price";

// What the inquiry form is told the visitor is asking about. A showcase piece
// is not for sale, so the inquiry must read as a request for a NEW
// made-to-order piece — never as a request to buy the photographed one. A
// made-to-order design IS the thing being ordered, so it is named directly.
export function inquiryContext(
  item: Pick<InventoryItem, "name" | "showcase" | "madeToOrder" | "category">
): string {
  if (isShowcase(item)) return `Made to order — inspired by ${item.name}`;
  if (isMadeToOrder(item)) return `Made to order — ${item.name}`;
  return item.name;
}

// Stripe Checkout Task S1: pure eligibility predicate. Items with no set
// price ("Pricing on inquiry") are never checkout-eligible — they only ever
// go through the inquiry flow. Showcase items are never eligible either,
// regardless of price: this is the single choke point every client CTA and
// /api/checkout-session consults.
export function isCheckoutEligible(item: InventoryItem): boolean {
  return item.price !== null && !isShowcase(item);
}

// `order` is optional on input: omit it to auto-append at the end of its
// category, or pass an explicit 1-based position to place/move it there —
// the store cascades the shift across every other affected item.
export type InventoryItemInput = Omit<
  InventoryItem,
  "id" | "createdAt" | "updatedAt" | "soldAt" | "status" | "order" | "stripeCheckoutSessionId"
> & { order?: number };

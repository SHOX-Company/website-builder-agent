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
  createdAt: string;
  updatedAt: string;
  soldAt: string | null;
}

export const CATEGORY_LABELS: Record<InventoryCategory, string> = {
  flute: "Flute",
  instrument: "Instrument",
  jewelry: "Jewelry",
};

export function formatPrice(price: number | null): string {
  if (price === null) return "Pricing on inquiry";
  return `$${price.toLocaleString("en-US")}`;
}

export type InventoryItemInput = Omit<InventoryItem, "id" | "createdAt" | "updatedAt" | "soldAt" | "status">;

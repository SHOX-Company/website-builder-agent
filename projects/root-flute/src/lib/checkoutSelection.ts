// Made-to-order checkout selection (size + payment option).
//
// The single pure resolver that turns "which piece, which size, full or
// deposit" into the ONLY amounts a Checkout Session may be created with. The
// browser never supplies a dollar amount — only ids — and everything here is
// derived from the trusted inventory record. Shared (dependency-free) so the
// server (authoritative) and the client (display only) can never disagree
// about the arithmetic.

import { isMadeToOrder, type InventoryConfiguration, type InventoryItem } from "@/lib/inventory";

export type PaymentMode = "full" | "deposit";

/** The one customer-facing sentence describing made-to-order payment terms. */
export const MADE_TO_ORDER_PAYMENT_TERMS =
  "Made-to-order pieces may be secured with 50% upfront, with the remaining 50% plus shipping due before shipment.";

/** Valid configurations of a made-to-order design; [] for anything else (fail-safe). */
export function getConfigurations(
  item: Pick<InventoryItem, "configurations" | "madeToOrder" | "category" | "showcase">
): InventoryConfiguration[] {
  if (!isMadeToOrder(item) || !Array.isArray(item.configurations)) return [];
  return item.configurations.filter(
    (c) =>
      !!c &&
      typeof c.id === "string" &&
      c.id.length > 0 &&
      typeof c.label === "string" &&
      c.label.length > 0 &&
      Number.isInteger(c.price) &&
      c.price > 0
  );
}

export type CheckoutSelection =
  | {
      ok: true;
      paymentMode: PaymentMode;
      configuration: InventoryConfiguration | null;
      /** Exactly what is being ordered, e.g. "Triton Shell Harp - Large". */
      displayName: string;
      /** Authoritative full price of the selected product/configuration, in cents. */
      fullPriceCents: number;
      /** What this Checkout Session charges NOW, in cents (full, or exactly half). */
      chargeCents: number;
      /** What is still owed after this charge, in cents (0 for full). Shipping is additional and NOT included. */
      balanceCents: number;
    }
  | { ok: false; error: string };

export function resolveCheckoutSelection(
  item: InventoryItem,
  selection: { configurationId?: unknown; paymentOption?: unknown } = {}
): CheckoutSelection {
  const { configurationId, paymentOption } = selection;

  let mode: PaymentMode = "full";
  if (paymentOption !== undefined && paymentOption !== null) {
    if (paymentOption !== "full" && paymentOption !== "deposit") {
      return { ok: false, error: "Invalid payment option." };
    }
    mode = paymentOption;
  }
  // A deposit only ever applies to a permanent made-to-order design — never to
  // a showcase piece, a finite one-of-one, or a sold one.
  if (mode === "deposit" && !isMadeToOrder(item)) {
    return { ok: false, error: "A deposit is not available for this item." };
  }

  const configurations = getConfigurations(item);
  let configuration: InventoryConfiguration | null = null;
  let fullPrice = item.price;
  if (configurations.length > 0) {
    if (typeof configurationId !== "string" || configurationId.length === 0) {
      return { ok: false, error: "Please select a size." };
    }
    configuration = configurations.find((c) => c.id === configurationId) ?? null;
    if (!configuration) return { ok: false, error: "Invalid size selection." };
    fullPrice = configuration.price;
  } else if (configurationId !== undefined && configurationId !== null && configurationId !== "") {
    return { ok: false, error: "Invalid size selection." };
  }

  if (typeof fullPrice !== "number" || !Number.isInteger(fullPrice) || fullPrice <= 0) {
    return { ok: false, error: "Item is not available for checkout." };
  }

  const fullPriceCents = fullPrice * 100;
  // Whole-dollar prices → half is always a whole number of cents.
  const chargeCents = mode === "deposit" ? fullPrice * 50 : fullPriceCents;
  return {
    ok: true,
    paymentMode: mode,
    configuration,
    displayName: configuration ? `${item.name} - ${configuration.label}` : item.name,
    fullPriceCents,
    chargeCents,
    balanceCents: fullPriceCents - chargeCents,
  };
}

/** "$1,600" for whole dollars, "$1,600.50" otherwise — customer-facing display. */
export function formatCents(cents: number): string {
  const dollars = cents / 100;
  return `$${dollars.toLocaleString("en-US", {
    minimumFractionDigits: Number.isInteger(dollars) ? 0 : 2,
    maximumFractionDigits: 2,
  })}`;
}

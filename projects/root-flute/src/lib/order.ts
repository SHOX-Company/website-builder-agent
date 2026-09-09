// Shared Order types — safe to import from both server and client code.
//
// A durable record of every completed Stripe purchase, written by the
// checkout webhook after the sale is authoritative (inventory marked Sold).
// Keyed by Stripe Checkout Session ID so webhook retries are idempotent.
// A flat, ordered-by-insertion list — same versioned-Blob scheme as
// leadStore.ts / testimonialStore.ts. This is the post-sale communication
// layer's source of truth; it never has transaction authority.
//
// Deliberately stores Stripe/Blob IDs and the customer-supplied contact /
// shipping details only — never card numbers, CVC, or payment-method secrets.

export interface Order {
  id: string;
  /** Stripe Checkout Session ID (cs_...). The idempotency key for this record. */
  stripeCheckoutSessionId: string;
  /** Stripe PaymentIntent ID (pi_...), if known. */
  stripePaymentIntentId: string | null;
  inventoryItemId: string;
  itemName: string;
  /** "flute" | "instrument" | "jewelry" */
  itemCategory: string;
  /** The listed acquisition price in whole dollars, or null. */
  itemPrice: number | null;
  /** Amount actually paid, in the currency's minor unit (cents), from Stripe. */
  amountTotal: number | null;
  currency: string | null;
  customerEmail: string | null;
  customerName: string | null;
  customerPhone: string | null;
  shippingName: string | null;
  /** Single-line formatted shipping address, as collected by Stripe Checkout. */
  shippingAddress: string | null;
  /** When the piece was marked Sold (the moment of sale). */
  soldAt: string;
  /** When this order record was first written. */
  createdAt: string;
  /** Whether the branded customer confirmation email has been confirmed sent. */
  confirmationEmailSent: boolean;
  confirmationEmailSentAt: string | null;
}

export type OrderInput = Omit<
  Order,
  "id" | "createdAt" | "confirmationEmailSent" | "confirmationEmailSentAt"
>;

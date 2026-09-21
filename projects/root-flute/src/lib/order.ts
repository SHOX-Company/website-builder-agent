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
  /**
   * Whether the internal merchant sale-notification email has been confirmed
   * sent. Deliberately independent of `confirmationEmailSent` — the customer
   * email and the internal notification are separate Resend sends with
   * separate failure modes, so one succeeding must never mask or skip a
   * retry of the other.
   */
  internalNotificationSent: boolean;
  internalNotificationSentAt: string | null;
  // Made-to-order payment context. All optional so every historical order
  // (written before these existed) stays valid and reads as a full payment.
  /** Selected size / configuration id and label (e.g. "large" / "Large"), if the design has sizes. */
  configurationId?: string | null;
  configurationLabel?: string | null;
  /** "full" (default when absent) or "deposit" (50% upfront). */
  paymentMode?: "full" | "deposit";
  /** Authoritative full price of the ordered product/configuration, in cents. */
  fullPriceCents?: number;
  /** Remaining product balance still owed, in cents (0 for a full payment). Shipping is additional and not included. */
  balanceDueCents?: number;
  /** True when shipping is still owed before shipment (deposit orders). Never carries an amount. */
  shippingDueBeforeShipment?: boolean;
}

export type OrderInput = Omit<
  Order,
  | "id"
  | "createdAt"
  | "confirmationEmailSent"
  | "confirmationEmailSentAt"
  | "internalNotificationSent"
  | "internalNotificationSentAt"
>;

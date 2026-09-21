import { NextRequest, NextResponse } from "next/server";
import { getInventoryItem } from "@/lib/inventoryStore";
import { isCheckoutEligible, isMadeToOrder, type InventoryCategory } from "@/lib/inventory";
import { resolveCheckoutSelection, formatCents } from "@/lib/checkoutSelection";
import { getStripeClient } from "@/lib/stripe";
import { SITE_URL } from "@/lib/siteMetadata";

// Where a cancelled checkout sends the customer back to browse — the same
// vertical they were purchasing from, not a dead end.
const CATEGORY_PATH: Record<InventoryCategory, string> = {
  flute: "/flutes",
  instrument: "/instruments",
  jewelry: "/jewelry",
};

// Stripe Checkout Task S2 — server-side Checkout Session creation only.
// The browser may submit nothing but a trusted inventory item ID; every
// other value (price, name, eligibility) is re-derived here from the
// inventory store, never trusted from the request body.
export async function POST(req: NextRequest) {
  let body: { itemId?: string; configurationId?: unknown; paymentOption?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const itemId = typeof body.itemId === "string" ? body.itemId.trim() : "";
  if (!itemId) {
    return NextResponse.json({ error: "Item ID is required." }, { status: 400 });
  }

  const item = await getInventoryItem(itemId);
  if (
    !item ||
    !item.published ||
    // A finite piece must still be on the shelf. A permanent made-to-order
    // design is orderable whatever its `status` says (it is never "consumed").
    (item.status !== "available" && !isMadeToOrder(item)) ||
    // Showcase / made-to-order examples do not physically exist as available
    // inventory — never create a Checkout Session for one, whatever the
    // client claims. (Also covered by isCheckoutEligible; explicit on purpose.)
    item.showcase === true ||
    item.price === null ||
    !isCheckoutEligible(item)
  ) {
    return NextResponse.json({ error: "Item is not available for checkout." }, { status: 400 });
  }

  // Server-derived selection: which size (if any), full vs 50% deposit, and
  // the exact amount to charge. Rejects arbitrary options, an unknown or
  // missing size, and a deposit on anything that is not a permanent
  // made-to-order design (showcase, finite one-of-one, sold).
  const selection = resolveCheckoutSelection(item, {
    configurationId: body.configurationId,
    paymentOption: body.paymentOption,
  });
  if (!selection.ok) {
    return NextResponse.json({ error: selection.error }, { status: 400 });
  }
  const deposit = selection.paymentMode === "deposit";
  const depositDescription = `50% deposit toward a made-to-order piece (full price ${formatCents(selection.fullPriceCents)}). The remaining ${formatCents(selection.balanceCents)} plus shipping is due before shipment.`;

  let stripe;
  try {
    stripe = getStripeClient();
  } catch {
    return NextResponse.json({ error: "Checkout is not configured." }, { status: 500 });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      payment_intent_data: { capture_method: "manual" },
      shipping_address_collection: { allowed_countries: ["US"] },
      phone_number_collection: { enabled: true },
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: selection.chargeCents,
            product_data: deposit
              ? { name: `${selection.displayName} - 50% Deposit`, description: depositDescription }
              : { name: selection.displayName },
          },
        },
      ],
      // Server-set only. The webhook re-validates these (charge vs. full price,
      // deposit === exactly half) before it captures anything.
      metadata: {
        inventoryItemId: item.id,
        ...(isMadeToOrder(item)
          ? {
              madeToOrder: "true",
              paymentMode: selection.paymentMode,
              fullPriceCents: String(selection.fullPriceCents),
              chargeCents: String(selection.chargeCents),
              ...(selection.configuration
                ? { configurationId: selection.configuration.id, configurationLabel: selection.configuration.label }
                : {}),
            }
          : {}),
      },
      success_url: `${SITE_URL}/checkout/success`,
      cancel_url: `${SITE_URL}${CATEGORY_PATH[item.category]}`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}

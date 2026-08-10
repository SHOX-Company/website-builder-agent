import { NextRequest, NextResponse } from "next/server";
import { getInventoryItem } from "@/lib/inventoryStore";
import { isCheckoutEligible } from "@/lib/inventory";
import { getStripeClient } from "@/lib/stripe";
import { SITE_URL } from "@/lib/siteMetadata";

// Stripe Checkout Task S2 — server-side Checkout Session creation only.
// The browser may submit nothing but a trusted inventory item ID; every
// other value (price, name, eligibility) is re-derived here from the
// inventory store, never trusted from the request body.
export async function POST(req: NextRequest) {
  let body: { itemId?: string };
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
    item.status !== "available" ||
    item.price === null ||
    !isCheckoutEligible(item)
  ) {
    return NextResponse.json({ error: "Item is not available for checkout." }, { status: 400 });
  }

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
            unit_amount: item.price * 100,
            product_data: { name: item.name },
          },
        },
      ],
      metadata: { inventoryItemId: item.id },
      success_url: `${SITE_URL}/?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/?checkout=cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch {
    return NextResponse.json({ error: "Could not start checkout." }, { status: 500 });
  }
}

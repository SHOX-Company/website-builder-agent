import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";
import { getInventoryItem, markInventoryItemSold } from "@/lib/inventoryStore";

// Stripe Checkout Task S4 — winner/loser transaction logic for the
// manual-capture Checkout flow. Only `checkout.session.completed` carries
// any side effects; every other verified event is acknowledged as a no-op.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  // Stripe signature verification requires the exact raw request body —
  // reading it as text here (rather than .json()) preserves that.
  const rawBody = await req.text();

  const stripe = getStripeClient();
  let event;
  try {
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  if (event.type !== "checkout.session.completed") {
    return NextResponse.json({ received: true, type: event.type });
  }

  const session = event.data.object;
  const inventoryItemId = session.metadata?.inventoryItemId;
  const paymentIntentId =
    typeof session.payment_intent === "string" ? session.payment_intent : session.payment_intent?.id;

  if (!inventoryItemId || !paymentIntentId) {
    return NextResponse.json({ received: true });
  }

  // Metadata is trusted (server-set at Checkout Session creation); the item
  // itself is re-read here rather than trusted from the session payload.
  const item = await getInventoryItem(inventoryItemId);
  if (!item) {
    return NextResponse.json({ received: true });
  }

  if (item.status === "sold") {
    if (item.stripeCheckoutSessionId === session.id) {
      // Same-session retry — already won and captured. Do nothing.
      return NextResponse.json({ received: true });
    }

    // Losing session: item sold under a different session (or manually).
    // Release this authorization; never capture it, never touch the winner.
    try {
      await stripe.paymentIntents.cancel(paymentIntentId);
    } catch {
      // Already canceled/finalized elsewhere — nothing further to do.
    }
    return NextResponse.json({ received: true });
  }

  // Candidate winner: item is still available.
  let paymentIntent;
  try {
    paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch {
    return NextResponse.json({ error: "Could not retrieve payment." }, { status: 500 });
  }

  if (paymentIntent.status === "requires_capture") {
    try {
      // Idempotency key scoped to this Checkout Session — a webhook retry
      // that reaches this branch again (e.g. because the inventory write
      // below failed last time) cannot cause a second capture.
      paymentIntent = await stripe.paymentIntents.capture(
        paymentIntentId,
        {},
        { idempotencyKey: `capture_${session.id}` }
      );
    } catch {
      return NextResponse.json({ error: "Capture failed." }, { status: 500 });
    }
  }

  if (paymentIntent.status !== "succeeded") {
    // Not actually captured (unexpected PaymentIntent state) — do not sell.
    return NextResponse.json({ received: true });
  }

  try {
    await markInventoryItemSold(item.id, session.id);
  } catch {
    // Capture succeeded but the inventory write failed. Return non-2xx so
    // Stripe retries the whole webhook; the retry finds paymentIntent.status
    // "succeeded" above and skips straight to this write without a second
    // capture attempt.
    return NextResponse.json({ error: "Could not update inventory." }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}

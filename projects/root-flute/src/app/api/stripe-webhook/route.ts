import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { getInventoryItem, markInventoryItemSold } from "@/lib/inventoryStore";
import { CATEGORY_LABELS, formatPrice, type InventoryItem } from "@/lib/inventory";
import { ensureOrder, markOrderConfirmationSent } from "@/lib/orderStore";
import { sendPurchaseConfirmationEmail } from "@/lib/email";

function formatStripeAddress(address: Stripe.Address | null | undefined): string | null {
  if (!address) return null;
  const parts = [
    address.line1,
    address.line2,
    address.city,
    address.state,
    address.postal_code,
    address.country,
  ].filter((p): p is string => Boolean(p));
  return parts.length > 0 ? parts.join(", ") : null;
}

// Post-sale customer communication. Runs ONLY after the sale is already
// authoritative (inventory marked Sold). Fully best-effort: this function
// never throws to its caller, so a failure here can never reverse the sale,
// unmark inventory, affect capture, or turn a completed transaction into a
// non-2xx webhook response. Email dedup is anchored to the durable order
// record's `confirmationEmailSent` flag (not the item's Sold state), plus a
// per-session Resend idempotency key — safe across webhook retries.
async function recordOrderAndNotify(
  session: Stripe.Checkout.Session,
  item: InventoryItem,
  soldAt: string
): Promise<void> {
  try {
    const shipping = session.collected_information?.shipping_details ?? null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    const order = await ensureOrder({
      stripeCheckoutSessionId: session.id,
      stripePaymentIntentId: paymentIntentId,
      inventoryItemId: item.id,
      itemName: item.name,
      itemCategory: item.category,
      itemPrice: item.price,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? null,
      customerName: session.customer_details?.name ?? null,
      customerPhone: session.customer_details?.phone ?? null,
      shippingName: shipping?.name ?? null,
      shippingAddress: formatStripeAddress(shipping?.address),
      soldAt,
    });

    if (order.confirmationEmailSent) return;

    if (!order.customerEmail) {
      console.error(
        `[webhook] order ${session.id} has no customer email — confirmation not sent; confirmationEmailSent stays false.`
      );
      return;
    }

    const amountFormatted =
      order.amountTotal != null
        ? `$${(order.amountTotal / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
        : formatPrice(order.itemPrice);
    const orderReference = `RF-${session.id.slice(-8).toUpperCase()}`;
    const shippingSummary =
      order.shippingName && order.shippingAddress
        ? `${order.shippingName}, ${order.shippingAddress}`
        : order.shippingAddress ?? null;

    const result = await sendPurchaseConfirmationEmail({
      to: order.customerEmail,
      customerName: order.customerName,
      itemName: order.itemName || "Your RootFlute piece",
      itemCategoryLabel: CATEGORY_LABELS[item.category],
      amountFormatted,
      orderReference,
      shippingSummary,
      idempotencyKey: `rf-purchase-confirmation-${session.id}`,
    });

    if (result.ok) {
      await markOrderConfirmationSent(session.id);
    } else {
      console.error(
        `[webhook] confirmation email not sent for ${session.id} (reason: ${result.reason}) — confirmationEmailSent stays false for later recovery.`
      );
    }
  } catch (err) {
    console.error(
      `[webhook] post-sale order/notify failed for ${session?.id} — the sale itself is unaffected:`,
      err
    );
  }
}

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

  const session = event.data.object as Stripe.Checkout.Session;
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
      // Same-session retry — already won and captured. The sale is done;
      // re-run only the best-effort post-sale communication so a prior
      // attempt that sold + captured but failed to email can still deliver.
      await recordOrderAndNotify(session, item, item.soldAt ?? new Date().toISOString());
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

  let soldItem: InventoryItem | null;
  try {
    soldItem = await markInventoryItemSold(item.id, session.id);
  } catch {
    // Capture succeeded but the inventory write failed. Return non-2xx so
    // Stripe retries the whole webhook; the retry finds paymentIntent.status
    // "succeeded" above and skips straight to this write without a second
    // capture attempt.
    return NextResponse.json({ error: "Could not update inventory." }, { status: 500 });
  }

  // Sale is authoritative. Everything below is best-effort and cannot affect
  // the transaction outcome or this response.
  await recordOrderAndNotify(
    session,
    soldItem ?? item,
    soldItem?.soldAt ?? new Date().toISOString()
  );

  return NextResponse.json({ received: true });
}

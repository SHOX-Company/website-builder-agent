import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { getInventoryItem, markInventoryItemSold } from "@/lib/inventoryStore";
import { CATEGORY_LABELS, formatPrice, type InventoryItem } from "@/lib/inventory";
import { ensureOrder, markOrderNotificationsSent } from "@/lib/orderStore";
import { sendPurchaseConfirmationEmail, sendInternalSaleNotificationEmail } from "@/lib/email";

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

// Post-sale communication. Runs ONLY after the sale is already authoritative
// (inventory marked Sold). Two independent best-effort notifications live
// here — the customer acquisition confirmation and the internal merchant
// sale notification — each with its own dedup flag on the durable order
// record and its own per-session Resend idempotency key, so either can fail
// or be retried without affecting the other. Neither can reverse the sale,
// unmark inventory, affect capture, or turn a completed transaction into a
// non-2xx webhook response — every step here is individually wrapped so one
// failing can never prevent the other from being attempted.
async function recordOrderAndNotify(
  session: Stripe.Checkout.Session,
  item: InventoryItem,
  soldAt: string
): Promise<void> {
  let order;
  try {
    const shipping = session.collected_information?.shipping_details ?? null;
    const paymentIntentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id ?? null;

    order = await ensureOrder({
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
  } catch (err) {
    console.error(
      `[webhook] post-sale order persistence failed for ${session?.id} — the sale itself is unaffected:`,
      err
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

  // Each notification is attempted independently below; only the *outcome*
  // (did it just succeed?) is collected here. Both flags are persisted in a
  // single combined write at the end — see markOrderNotificationsSent for
  // why two separate writes to the same order, moments apart, are unsafe.
  let confirmationJustSent = false;
  let internalNotificationJustSent = false;

  // Customer acquisition confirmation — independent, best-effort.
  if (!order.confirmationEmailSent) {
    try {
      if (!order.customerEmail) {
        console.error(
          `[webhook] order ${session.id} has no customer email — confirmation not sent; confirmationEmailSent stays false.`
        );
      } else {
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
          confirmationJustSent = true;
        } else {
          console.error(
            `[webhook] confirmation email not sent for ${session.id} (reason: ${result.reason}) — confirmationEmailSent stays false for later recovery.`
          );
        }
      }
    } catch (err) {
      console.error(
        `[webhook] customer confirmation attempt failed for ${session.id} — the sale itself is unaffected:`,
        err
      );
    }
  }

  // Internal merchant sale notification — independent, best-effort. Never
  // shares state with the customer confirmation above: one succeeding or
  // failing has no bearing on whether the other is attempted or retried.
  if (order.internalNotificationSent) {
    console.info(`[webhook] internal sale notification already sent for ${session.id} — skipping.`);
  } else {
    try {
      const result = await sendInternalSaleNotificationEmail({
        itemName: order.itemName || item.name,
        itemCategoryLabel: CATEGORY_LABELS[item.category],
        amountFormatted,
        orderReference,
        stripeCheckoutSessionId: session.id,
        purchaseTimestamp: order.soldAt,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingName: order.shippingName,
        shippingAddress: order.shippingAddress,
        idempotencyKey: `rf-internal-sale-notification-${session.id}`,
      });

      if (result.ok) {
        internalNotificationJustSent = true;
      } else {
        console.error(
          `[webhook] internal sale notification not sent for ${session.id} (reason: ${result.reason}) — internalNotificationSent stays false for later recovery.`
        );
      }
    } catch (err) {
      console.error(
        `[webhook] internal sale notification attempt failed for ${session.id} — the sale itself is unaffected:`,
        err
      );
    }
  }

  if (confirmationJustSent || internalNotificationJustSent) {
    try {
      await markOrderNotificationsSent(session.id, {
        confirmationEmailSent: confirmationJustSent,
        internalNotificationSent: internalNotificationJustSent,
      });
    } catch (err) {
      // The emails themselves already went out — only the dedup bookkeeping
      // failed to persist. Worst case on a future retry: Resend's per-session
      // idempotency key (set on both sends above) recognizes the repeat and
      // returns the original result without re-delivering.
      console.error(
        `[webhook] failed to persist notification-sent flags for ${session.id} — emails already sent; a retry is deduped by Resend's idempotency key, not this flag:`,
        err
      );
    }
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

import { NextRequest, NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripeClient } from "@/lib/stripe";
import { getInventoryItem, markInventoryItemSold } from "@/lib/inventoryStore";
import { CATEGORY_LABELS, formatPrice, isMadeToOrder, type InventoryItem } from "@/lib/inventory";
import { ensureOrder, getOrderBySession, markOrderNotificationsSent } from "@/lib/orderStore";
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

// What a made-to-order Checkout Session was for, re-derived from the
// server-set session metadata and cross-checked before anything is captured.
interface MadeToOrderPayment {
  mode: "full" | "deposit";
  configurationId: string | null;
  configurationLabel: string | null;
  /** Exactly what was ordered, e.g. "Triton Shell Harp - Large". */
  displayName: string;
  fullPriceCents: number;
  chargeCents: number;
  balanceCents: number;
}

function money(cents: number): string {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

// Sessions created before deposits existed carry no amount metadata: they are
// full payments of whatever Stripe says was charged. Sessions created since
// carry paymentMode / fullPriceCents / chargeCents; those must be internally
// consistent (a deposit is EXACTLY half the full price, and Stripe's own
// amount_total must equal the charge) or nothing may be captured.
function deriveMadeToOrderPayment(
  session: Stripe.Checkout.Session,
  item: InventoryItem
): { ok: true; payment: MadeToOrderPayment } | { ok: false; reason: string } {
  const md = session.metadata ?? {};
  const mode: "full" | "deposit" = md.paymentMode === "deposit" ? "deposit" : "full";
  const configurationId = md.configurationId ?? null;
  const configurationLabel = md.configurationLabel ?? null;
  const displayName = configurationLabel ? `${item.name} - ${configurationLabel}` : item.name;

  if (md.fullPriceCents === undefined && md.chargeCents === undefined) {
    if (mode === "deposit" || typeof session.amount_total !== "number" || session.amount_total <= 0) {
      return { ok: false, reason: "deposit/amount metadata missing" };
    }
    return {
      ok: true,
      payment: {
        mode: "full",
        configurationId,
        configurationLabel,
        displayName,
        fullPriceCents: session.amount_total,
        chargeCents: session.amount_total,
        balanceCents: 0,
      },
    };
  }

  const fullPriceCents = Number(md.fullPriceCents);
  const chargeCents = Number(md.chargeCents);
  const expectedCharge = mode === "deposit" ? fullPriceCents / 2 : fullPriceCents;
  if (
    !Number.isInteger(fullPriceCents) ||
    fullPriceCents <= 0 ||
    !Number.isInteger(chargeCents) ||
    chargeCents !== expectedCharge ||
    session.amount_total !== chargeCents
  ) {
    return { ok: false, reason: "charge does not match the recorded full price / payment mode" };
  }
  return {
    ok: true,
    payment: {
      mode,
      configurationId,
      configurationLabel,
      displayName,
      fullPriceCents,
      chargeCents,
      balanceCents: fullPriceCents - chargeCents,
    },
  };
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
//
// Returns whether the order record is durably persisted. Finite pieces ignore
// this (their sale is authoritative via the Sold flag, so the order record is
// best-effort). For a made-to-order design the order record IS the sale
// record — nothing is marked Sold — so that path passes `verifyPersisted` and
// answers Stripe non-2xx when the record can't be confirmed, making Stripe
// retry (safe: capture and order creation are both idempotent).
async function recordOrderAndNotify(
  session: Stripe.Checkout.Session,
  item: InventoryItem,
  soldAt: string,
  opts: { verifyPersisted?: boolean; payment?: MadeToOrderPayment } = {}
): Promise<boolean> {
  const payment = opts.payment;
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
      itemName: payment?.displayName ?? item.name,
      itemCategory: item.category,
      itemPrice: payment ? payment.fullPriceCents / 100 : item.price,
      amountTotal: session.amount_total,
      currency: session.currency,
      customerEmail: session.customer_details?.email ?? null,
      customerName: session.customer_details?.name ?? null,
      customerPhone: session.customer_details?.phone ?? null,
      shippingName: shipping?.name ?? null,
      shippingAddress: formatStripeAddress(shipping?.address),
      soldAt,
      ...(payment
        ? {
            configurationId: payment.configurationId,
            configurationLabel: payment.configurationLabel,
            paymentMode: payment.mode,
            fullPriceCents: payment.fullPriceCents,
            balanceDueCents: payment.balanceCents,
            shippingDueBeforeShipment: payment.mode === "deposit",
          }
        : {}),
    });
  } catch (err) {
    console.error(
      `[webhook] post-sale order persistence failed for ${session?.id} — the sale itself is unaffected:`,
      err
    );
    return false;
  }

  // The store is a read-modify-write over versioned blobs, so two orders
  // landing at the same moment could in theory overwrite each other. Re-read
  // to confirm THIS session's order really is in the list before relying on it.
  if (opts.verifyPersisted) {
    const confirmed = await getOrderBySession(session.id).catch(() => null);
    if (!confirmed) {
      console.error(
        `[webhook] order for ${session.id} could not be confirmed after write — asking Stripe to retry.`
      );
      return false;
    }
  }

  const amountFormatted =
    order.amountTotal != null
      ? `$${(order.amountTotal / 100).toLocaleString("en-US", { minimumFractionDigits: 2 })}`
      : formatPrice(order.itemPrice);
  const orderReference = `RF-${session.id.slice(-8).toUpperCase()}`;
  // Deposit wording is driven by the DURABLE order record (not the live
  // session), so a retried delivery describes the order exactly as it was
  // first recorded. Undefined for full payments → the certified emails.
  const depositSummary =
    order.paymentMode === "deposit" &&
    typeof order.fullPriceCents === "number" &&
    typeof order.balanceDueCents === "number" &&
    order.amountTotal != null
      ? {
          fullPriceFormatted: money(order.fullPriceCents),
          paidFormatted: money(order.amountTotal),
          balanceFormatted: money(order.balanceDueCents),
        }
      : undefined;
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
          madeToOrder: isMadeToOrder(item),
          deposit: depositSummary,
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
        madeToOrder: isMadeToOrder(item),
        deposit: depositSummary,
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

  return true;
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

  // Permanent made-to-order design (an Instrument): a purchase is an ORDER,
  // not the consumption of a finite piece. Capture, record the order, notify —
  // and leave the design exactly as it was (never Sold, never unpublished), so
  // it stays live and another customer can order it later. Concurrent orders
  // for the same design are all valid (no winner/loser); each Checkout Session
  // is its own idempotent unit, keyed by its session id. Every step is safe to
  // repeat: capture is idempotency-keyed and skipped once succeeded, the order
  // is create-or-fetch by session id, and each email has its own sent-flag plus
  // a per-session Resend idempotency key. A retried or replayed event (even
  // for a session whose order already exists) therefore changes nothing.
  if (isMadeToOrder(item)) {
    // Cross-check the server-set amounts before anything is captured. A
    // session whose charge doesn't match its recorded full price / payment
    // mode (a deposit that isn't exactly half, an amount Stripe didn't charge)
    // is never captured: the authorization is released and nothing is ordered.
    const derived = deriveMadeToOrderPayment(session, item);
    if (!derived.ok) {
      console.error(
        `[webhook] made-to-order session ${session.id} rejected (${derived.reason}) — authorization released, nothing captured.`
      );
      try {
        await stripe.paymentIntents.cancel(paymentIntentId);
      } catch {
        // Already canceled/finalized elsewhere — nothing further to do.
      }
      return NextResponse.json({ received: true });
    }

    let paymentIntent;
    try {
      paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    } catch {
      return NextResponse.json({ error: "Could not retrieve payment." }, { status: 500 });
    }

    if (paymentIntent.status === "requires_capture") {
      try {
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
      // Not actually captured (canceled / unexpected state) — no order.
      return NextResponse.json({ received: true });
    }

    const persisted = await recordOrderAndNotify(session, item, new Date().toISOString(), {
      verifyPersisted: true,
      payment: derived.payment,
    });
    if (!persisted) {
      // Payment is captured but the order record isn't confirmed — non-2xx
      // makes Stripe retry, which skips straight back to this write.
      return NextResponse.json({ error: "Could not record order." }, { status: 500 });
    }
    return NextResponse.json({ received: true });
  }

  // A deposit is only ever valid for a permanent made-to-order design. If the
  // item stopped being one while this session was open (converted to finite,
  // showcase, unpublished-and-reclassified…), a deposit must never flow into
  // the finite path — that would capture half the price and mark it Sold.
  if (session.metadata?.paymentMode === "deposit") {
    console.error(
      `[webhook] deposit session ${session.id} for ${item.id}, which is no longer a made-to-order design — authorization released, nothing captured.`
    );
    try {
      await stripe.paymentIntents.cancel(paymentIntentId);
    } catch {
      // Already canceled/finalized elsewhere — nothing further to do.
    }
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

  // Showcase / made-to-order example: this piece does not exist as available
  // inventory, so no sale may complete for it — even from a Checkout Session
  // that was opened before it became showcase (sessions stay payable for up
  // to ~24h). Release the authorization; never capture, never mark sold, never
  // send a customer confirmation. Placed AFTER the sold branch on purpose: a
  // sale that already completed and was captured under this exact session is
  // still finalized by that branch above, untouched by a later flag change.
  if (item.showcase === true) {
    console.error(
      `[webhook] showcase item ${item.id} received checkout session ${session.id} — authorization released, nothing captured.`
    );
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

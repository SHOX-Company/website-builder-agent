import { NextRequest, NextResponse } from "next/server";
import { getStripeClient } from "@/lib/stripe";

// Stripe Checkout Task S3 — webhook signature verification only.
// No transaction logic (capture / order creation / inventory mutation) yet;
// that lands once this foundation is confirmed working end-to-end.
export async function POST(req: NextRequest) {
  const signature = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !secret) {
    return NextResponse.json({ error: "Webhook is not configured." }, { status: 400 });
  }

  // Stripe signature verification requires the exact raw request body —
  // reading it as text here (rather than .json()) preserves that.
  const rawBody = await req.text();

  let event;
  try {
    const stripe = getStripeClient();
    event = stripe.webhooks.constructEvent(rawBody, signature, secret);
  } catch {
    return NextResponse.json({ error: "Invalid signature." }, { status: 400 });
  }

  return NextResponse.json({ received: true, type: event.type });
}

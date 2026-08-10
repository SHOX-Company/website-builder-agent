// Server-only Stripe client. Never import from a "use client" component.

import Stripe from "stripe";

let client: Stripe | null = null;

export function getStripeClient(): Stripe {
  if (client) return client;

  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    throw new Error("STRIPE_SECRET_KEY is not set — add it to your environment.");
  }

  client = new Stripe(key);
  return client;
}

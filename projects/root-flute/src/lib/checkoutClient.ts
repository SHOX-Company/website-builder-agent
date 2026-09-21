// Stripe Checkout Task S5 — thin client helper shared by every "Acquire"
// button. Sends only the item ID; price, name, and eligibility are
// re-derived server-side by /api/checkout-session and never trusted here.
// A made-to-order design may also send a size id and a payment option
// ("full" | "deposit") — still identifiers only, never a dollar amount.
export async function startCheckout(
  itemId: string,
  options: { configurationId?: string; paymentOption?: "full" | "deposit" } = {}
): Promise<string | null> {
  try {
    const res = await fetch("/api/checkout-session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId, ...options }),
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { url?: string };
    return data.url ?? null;
  } catch {
    return null;
  }
}

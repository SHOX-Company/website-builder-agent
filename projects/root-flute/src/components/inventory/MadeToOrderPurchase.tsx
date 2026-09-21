"use client";

import { useEffect, useState } from "react";
import type { InventoryItem } from "@/lib/inventory";
import {
  formatCents,
  getConfigurations,
  resolveCheckoutSelection,
  type PaymentMode,
} from "@/lib/checkoutSelection";
import { startCheckout } from "@/lib/checkoutClient";

// The purchase area for a permanent made-to-order design: pick a size (only if
// the design has sizes), choose Pay in Full or a 50% Deposit, then check out.
// Display only — every amount shown here comes from the same pure resolver the
// server runs, but the server re-derives everything from the inventory record
// and the browser only ever sends ids (item, size, payment option).
export default function MadeToOrderPurchase({
  item,
  noun,
  id,
}: {
  item: InventoryItem;
  /** "Instrument" | "Flute" — used in the button label. */
  noun: string;
  /** Anchor id, so other CTAs on the page can scroll here. */
  id?: string;
}) {
  const configurations = getConfigurations(item);
  // A single configuration is safely inferable; several must be chosen.
  const [configId, setConfigId] = useState<string | null>(
    configurations.length === 1 ? configurations[0].id : null
  );
  const [mode, setMode] = useState<PaymentMode>("full");
  const [status, setStatus] = useState<"idle" | "redirecting" | "error">("idle");
  const [notice, setNotice] = useState<string | null>(null);

  // Resets a stuck "Redirecting…" button when the customer returns via
  // browser Back and the page is restored from bfcache (no fresh mount).
  useEffect(() => {
    function handlePageShow(event: PageTransitionEvent) {
      if (event.persisted) setStatus("idle");
    }
    window.addEventListener("pageshow", handlePageShow);
    return () => window.removeEventListener("pageshow", handlePageShow);
  }, []);

  const full = resolveCheckoutSelection(item, { configurationId: configId ?? undefined, paymentOption: "full" });
  const deposit = resolveCheckoutSelection(item, { configurationId: configId ?? undefined, paymentOption: "deposit" });
  const chosen = mode === "deposit" ? deposit : full;

  async function handleOrder() {
    if (status === "redirecting") return;
    if (!chosen.ok) {
      setNotice(chosen.error);
      return;
    }
    setNotice(null);
    setStatus("redirecting");
    const url = await startCheckout(item.id, {
      ...(chosen.configuration ? { configurationId: chosen.configuration.id } : {}),
      paymentOption: mode,
    });
    if (url) {
      window.location.assign(url);
    } else {
      setStatus("error");
    }
  }

  const optionBase =
    "block cursor-pointer border px-4 py-3 transition-colors duration-200 peer-focus-visible:ring-2 peer-focus-visible:ring-brand-gold peer-checked:border-brand-gold peer-checked:bg-brand-gold/10 border-brand-border hover:border-brand-gold/50";

  return (
    <div id={id} className="flex flex-col gap-5 scroll-mt-24">
      {configurations.length > 1 && (
        <fieldset className="flex flex-col gap-2">
          <legend className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-2">Size</legend>
          <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Size">
            {configurations.map((c) => (
              <label key={c.id} className="relative">
                <input
                  type="radio"
                  name={`size-${item.id}`}
                  value={c.id}
                  checked={configId === c.id}
                  onChange={() => {
                    setConfigId(c.id);
                    setNotice(null);
                  }}
                  className="sr-only peer"
                />
                <span className={optionBase}>
                  <span className="block font-display text-xl text-brand-text">{c.label}</span>
                  <span className="block text-brand-muted text-sm">{formatCents(c.price * 100)}</span>
                </span>
              </label>
            ))}
          </div>
          {item.inclusions && (
            <p className="text-brand-muted text-sm leading-relaxed mt-1">{item.inclusions}</p>
          )}
        </fieldset>
      )}
      {configurations.length <= 1 && item.inclusions && (
        <p className="text-brand-muted text-sm leading-relaxed">{item.inclusions}</p>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans mb-2">Payment</legend>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Payment option">
          <label className="relative">
            <input
              type="radio"
              name={`payment-${item.id}`}
              value="full"
              checked={mode === "full"}
              onChange={() => setMode("full")}
              className="sr-only peer"
            />
            <span className={optionBase}>
              <span className="block font-display text-lg text-brand-text">Pay in full</span>
              <span className="block text-brand-muted text-sm">
                {full.ok ? formatCents(full.chargeCents) : "Full price"}
              </span>
            </span>
          </label>
          <label className="relative">
            <input
              type="radio"
              name={`payment-${item.id}`}
              value="deposit"
              checked={mode === "deposit"}
              onChange={() => setMode("deposit")}
              className="sr-only peer"
            />
            <span className={optionBase}>
              <span className="block font-display text-lg text-brand-text">50% deposit</span>
              <span className="block text-brand-muted text-sm">
                {deposit.ok ? `${formatCents(deposit.chargeCents)} today` : "Half today"}
              </span>
            </span>
          </label>
        </div>
        <p className="text-brand-muted/70 text-xs font-sans leading-relaxed">
          {mode === "deposit"
            ? deposit.ok
              ? `50% upfront (${formatCents(deposit.chargeCents)}). The remaining 50% (${formatCents(deposit.balanceCents)}) plus shipping is due before shipment. Shipping is additional and not included in the price.`
              : "50% upfront. The remaining 50% plus shipping is due before shipment. Shipping is additional and not included in the price."
            : "Or secure it with 50% upfront — the remaining 50% plus shipping is due before shipment. Shipping is additional and not included in the price."}
        </p>
      </fieldset>

      <div className="flex flex-col gap-3">
        <button
          type="button"
          onClick={handleOrder}
          disabled={status === "redirecting"}
          className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light disabled:opacity-40 disabled:cursor-not-allowed px-8 py-4 text-base sm:text-lg w-full sm:self-start sm:w-auto"
        >
          {status === "redirecting" ? "Redirecting…" : `Order This ${noun} →`}
        </button>
        {notice && (
          <p role="alert" className="text-brand-gold text-xs font-sans">
            {notice}
          </p>
        )}
        {status === "error" && (
          <p role="alert" className="text-red-400/90 text-xs font-sans">
            Something went wrong starting checkout — please try again.
          </p>
        )}
        <p className="text-brand-muted/60 text-xs font-sans">Secure checkout via Stripe</p>
      </div>
    </div>
  );
}

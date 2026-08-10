import type { Metadata } from "next";
import Link from "next/link";
import Footer from "@/components/sections/Footer";

// Post-checkout customer experience only — this page has no transaction
// authority. It never reads Stripe session data and never touches
// inventory; the webhook (src/app/api/stripe-webhook/route.ts) remains the
// sole authority for payment capture and marking an item sold. This page
// simply reassures the customer that checkout completed and tells them
// what happens next.
export const metadata: Metadata = {
  title: "Instrument Claimed | RootFlute",
  robots: { index: false, follow: false },
};

export default function CheckoutSuccessPage() {
  return (
    <main>
      <section className="relative bg-brand-dark py-28 sm:py-40 overflow-hidden min-h-[70vh] flex items-center">
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_50%_50%,rgba(196,151,58,0.08),transparent)]"
        />

        <div className="relative z-10 w-full max-w-2xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">
            Confirmed
          </p>

          <h1 className="font-display text-4xl sm:text-6xl font-light text-brand-text leading-tight">
            Your Instrument Has Been <span className="italic text-brand-gold">Claimed.</span>
          </h1>

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-xl">
            Your checkout was completed successfully. Daniel will personally follow up
            regarding your instrument and next steps — please watch the email address you
            used at checkout.
          </p>

          <Link
            href="/"
            className="inline-flex items-center justify-center font-semibold transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold bg-brand-gold text-brand-dark hover:bg-brand-gold-light px-8 py-4 text-base sm:text-lg mt-4"
          >
            Return to RootFlute
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}

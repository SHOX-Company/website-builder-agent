import type { Metadata } from "next";
import { SITE_URL } from "@/lib/siteMetadata";
import Footer from "@/components/sections/Footer";
import AcquisitionSupportForm from "@/components/sections/support/AcquisitionSupportForm";

// Local metadata — this is a post-purchase utility page, deliberately kept
// out of the protected siteMetadata.ts registry and out of the sitemap, and
// noindexed like /checkout/success. The explicit self-canonical is required
// (without `alternates`, Next falls back to the root layout's metadataBase
// alone and reports this page as a duplicate of "/").
export const metadata: Metadata = {
  title: "Acquisition Support | RootFlute",
  description:
    "Support and return requests for RootFlute acquisitions. Daniel personally reviews each request.",
  alternates: { canonical: `${SITE_URL}/acquisition-support` },
  robots: { index: false, follow: false },
};

export default function AcquisitionSupportPage() {
  return (
    <main>
      <section className="relative min-h-[100svh] bg-brand-dark overflow-hidden pt-32 sm:pt-40 pb-20">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.06),transparent_70%)]"
        />

        <div className="relative z-10 max-w-xl mx-auto px-6 flex flex-col items-center">
          <div className="text-center flex flex-col items-center gap-6 mb-12">
            <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
              RootFlute
            </p>
            <h1 className="font-display font-light text-brand-text text-4xl sm:text-5xl md:text-6xl leading-[1.05]">
              Acquisition Support
            </h1>
            <div
              aria-hidden="true"
              className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
            />
            <p className="text-brand-muted text-base leading-relaxed max-w-md">
              If you need help with a piece you&rsquo;ve acquired &mdash; a return, a shipping
              question, or anything else &mdash; send a note below. Daniel will personally
              review your request and follow up with you directly.
            </p>
          </div>

          <div className="w-full border border-brand-border bg-brand-surface p-7 sm:p-10">
            <AcquisitionSupportForm />
          </div>

          <p className="text-brand-muted/40 text-xs font-sans mt-6 text-center max-w-sm leading-relaxed">
            Submitting a request does not complete a return or issue a refund. Each request is
            reviewed individually.
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

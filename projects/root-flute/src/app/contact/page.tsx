// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import Button from "@/components/ui/Button";
import Footer from "@/components/sections/Footer";
import { getContactPage } from "@/lib/contactPageStore";

export const metadata = buildPageMetadata("contact");
export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const contact = await getContactPage();

  return (
    <main>
      <section className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-brand-dark">
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(196,151,58,0.06),transparent_70%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(45,74,62,0.18),transparent)] animate-ambient-drift"
        />

        <div className="relative z-10 max-w-xl mx-auto px-6 text-center flex flex-col items-center gap-8">
          <p className="text-brand-gold text-xs uppercase tracking-[0.35em] font-sans">
            RootFlute
          </p>

          <h1 className="font-display font-light text-brand-text text-5xl sm:text-6xl md:text-7xl leading-[1.02]">
            Contact
          </h1>

          <div
            aria-hidden="true"
            className="w-10 h-px bg-gradient-to-r from-transparent via-brand-gold/40 to-transparent"
          />

          <p className="text-brand-muted text-base sm:text-lg leading-relaxed max-w-md">
            Questions, collaborations, performances, private events, custom instruments, or general inquiries.
          </p>

          <div className="mt-2 flex flex-col items-center gap-3">
            <Button
              href={`mailto:${contact.email}`}
              variant="primary"
              size="lg"
              className="hover:scale-105 active:scale-100 transition-all duration-200 ease-out"
            >
              {contact.email}
            </Button>
            <Button href={`tel:${contact.phone.replace(/[^\d+]/g, "")}`} variant="secondary" size="sm">
              {contact.phone}
            </Button>
            <Button
              href={`https://wa.me/${contact.whatsapp.replace(/[^\d]/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="secondary"
              size="sm"
            >
              WhatsApp: {contact.whatsapp}
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

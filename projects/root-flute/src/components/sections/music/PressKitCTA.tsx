import Link from "next/link";

export default function PressKitCTA() {
  return (
    <div className="text-center mb-12">
      <Link
        href="/press-kit"
        className="inline-block px-8 py-3 border-2 border-brand-gold text-brand-gold hover:bg-brand-gold hover:text-brand-surface-2 transition-colors font-sans text-sm uppercase tracking-wider"
      >
        Press Kit Assets
      </Link>
    </div>
  );
}

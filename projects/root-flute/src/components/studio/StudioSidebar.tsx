import Link from "next/link";
import StudioSidebarNav from "@/components/studio/StudioSidebarNav";

export default function StudioSidebar() {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 h-screen sticky top-0 bg-brand-surface border-r border-brand-border">
      <div className="flex items-center h-16 px-6 border-b border-brand-border flex-shrink-0">
        <Link href="/studio" className="font-display text-xl font-normal text-brand-text">
          Root<span className="text-brand-gold">Flute</span>
          <span className="block text-[10px] tracking-[0.3em] text-brand-muted uppercase font-sans mt-0.5">
            Studio
          </span>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto py-4">
        <StudioSidebarNav />
      </div>
      <div className="px-6 py-4 border-t border-brand-border text-[11px] text-brand-muted/70 font-sans flex-shrink-0">
        Phase 1 · Foundation
      </div>
    </aside>
  );
}

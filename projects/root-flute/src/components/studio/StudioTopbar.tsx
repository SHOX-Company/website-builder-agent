"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import Breadcrumbs from "@/components/studio/ui/Breadcrumbs";
import StudioLogoutButton from "@/components/studio/StudioLogoutButton";
import { getStudioBreadcrumbs } from "@/lib/studioBreadcrumbs";

export default function StudioTopbar({ onOpenMobileNav }: { onOpenMobileNav: () => void }) {
  const pathname = usePathname();
  const crumbs = getStudioBreadcrumbs(pathname);

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 h-16 px-4 sm:px-6 bg-brand-dark/95 backdrop-blur-md border-b border-brand-border">
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          aria-label="Open navigation"
          onClick={onOpenMobileNav}
          className="lg:hidden -ml-1.5 p-2 text-brand-text hover:text-brand-gold transition-colors duration-150"
        >
          <Menu className="w-5 h-5" strokeWidth={1.75} />
        </button>
        <Breadcrumbs items={crumbs} />
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        <div className="hidden sm:flex flex-col items-end leading-tight mr-1">
          <span className="text-sm text-brand-text">Daniel Hansen</span>
          <span className="text-[11px] text-brand-muted uppercase tracking-wider">Owner</span>
        </div>
        <StudioLogoutButton />
      </div>
    </header>
  );
}

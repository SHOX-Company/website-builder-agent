"use client";

import { useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { X } from "lucide-react";
import StudioSidebarNav from "@/components/studio/StudioSidebarNav";

export default function StudioMobileDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  // Close automatically whenever the route changes (covers link taps and
  // browser back/forward within the dashboard's client-side router).
  useEffect(() => {
    onClose();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = "hidden";
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <div
      aria-hidden={!open}
      className={`lg:hidden fixed inset-0 z-[60] transition-opacity duration-300 ${
        open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      }`}
    >
      <div onClick={onClose} className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm" />

      <div
        className={`absolute inset-y-0 left-0 w-[280px] max-w-[85vw] bg-brand-surface border-r border-brand-border flex flex-col transition-transform duration-300 ease-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 h-16 border-b border-brand-border flex-shrink-0">
          <Link href="/studio" onClick={onClose} className="font-display text-xl font-normal text-brand-text">
            Root<span className="text-brand-gold">Flute</span>
          </Link>
          <button
            type="button"
            aria-label="Close navigation"
            onClick={onClose}
            className="p-1.5 text-brand-muted hover:text-brand-text"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto py-4">
          <StudioSidebarNav onNavigate={onClose} />
        </div>
      </div>
    </div>
  );
}

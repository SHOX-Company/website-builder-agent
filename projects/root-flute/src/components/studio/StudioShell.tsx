"use client";

import { useState, ReactNode } from "react";
import StudioSidebar from "@/components/studio/StudioSidebar";
import StudioMobileDrawer from "@/components/studio/StudioMobileDrawer";
import StudioTopbar from "@/components/studio/StudioTopbar";

export default function StudioShell({ children }: { children: ReactNode }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-brand-dark flex">
      <StudioSidebar />
      <StudioMobileDrawer open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex-1 min-w-0 flex flex-col">
        <StudioTopbar onOpenMobileNav={() => setMobileNavOpen(true)} />
        <main className="flex-1 px-4 sm:px-8 py-8 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";
import Modal from "@/components/studio/ui/Modal";
import StudioButton from "@/components/studio/ui/Button";

export default function StudioLogoutButton() {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogout() {
    setLoading(true);
    await fetch("/api/studio/logout", { method: "POST" });
    router.replace("/studio/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        aria-label="Log out"
        className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-sans text-brand-muted hover:text-brand-text hover:bg-brand-surface-2 transition-colors duration-150"
      >
        <LogOut className="w-4 h-4" strokeWidth={1.75} />
        <span className="hidden sm:inline">Log out</span>
      </button>

      <Modal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="Log out of Studio?"
        description="You'll need your password to sign back in."
        footer={
          <>
            <StudioButton variant="ghost" onClick={() => setConfirmOpen(false)}>
              Cancel
            </StudioButton>
            <StudioButton variant="danger" onClick={handleLogout} disabled={loading}>
              {loading ? "Signing out…" : "Log out"}
            </StudioButton>
          </>
        }
      />
    </>
  );
}

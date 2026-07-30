"use client";

import { useEffect, ReactNode } from "react";
import { X } from "lucide-react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children?: ReactNode;
  footer?: ReactNode;
}

export default function Modal({ open, onClose, title, description, children, footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="studio-modal-title"
      className="fixed inset-0 z-[100] flex items-center justify-center px-6"
    >
      <div
        aria-hidden="true"
        onClick={onClose}
        className="absolute inset-0 bg-brand-dark/80 backdrop-blur-sm"
      />

      <div
        style={{ animation: "modal-entry 0.18s ease-out" }}
        className="relative w-full max-w-md bg-brand-surface border border-brand-border rounded-lg shadow-[0_20px_60px_rgba(0,0,0,0.5)] p-6"
      >
        <div className="flex items-start justify-between gap-4 mb-4">
          <h2 id="studio-modal-title" className="font-display font-light text-brand-text text-xl">
            {title}
          </h2>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="text-brand-muted hover:text-brand-text transition-colors duration-150 -mr-1 -mt-1 p-1"
          >
            <X className="w-5 h-5" strokeWidth={1.75} />
          </button>
        </div>

        {description && <p className="text-brand-muted text-sm leading-relaxed mb-5">{description}</p>}
        {children}
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2 sm:gap-3 mt-6">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}

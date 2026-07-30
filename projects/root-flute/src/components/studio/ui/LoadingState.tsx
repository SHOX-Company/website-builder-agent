import { Loader2 } from "lucide-react";

export function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return <Loader2 className={`${className} animate-spin text-brand-gold`} strokeWidth={2} />;
}

export function Skeleton({ className = "" }: { className?: string }) {
  return <div className={`animate-pulse bg-brand-surface-2 rounded ${className}`} />;
}

export function LoadingState({ label = "Loading…" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-16">
      <Spinner />
      <p className="text-sm text-brand-muted">{label}</p>
    </div>
  );
}

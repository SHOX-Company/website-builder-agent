import { UploadCloud } from "lucide-react";

export default function UploadPlaceholder({ label = "Uploads arrive in a future phase" }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 border border-dashed border-brand-border rounded-lg py-12 px-6 text-center bg-brand-dark/40">
      <UploadCloud className="w-6 h-6 text-brand-muted" strokeWidth={1.5} />
      <p className="text-sm text-brand-muted">{label}</p>
    </div>
  );
}

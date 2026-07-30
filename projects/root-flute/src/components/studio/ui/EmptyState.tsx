import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  children?: ReactNode;
}

export default function EmptyState({ icon: Icon, title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center text-center gap-4 py-16 px-6">
      <div className="flex items-center justify-center w-14 h-14 rounded-full bg-brand-gold/10 border border-brand-gold/25">
        <Icon className="w-6 h-6 text-brand-gold" strokeWidth={1.5} />
      </div>
      <div className="flex flex-col gap-2 max-w-md">
        <h3 className="font-display font-light text-brand-text text-xl">{title}</h3>
        <p className="text-brand-muted text-sm leading-relaxed">{description}</p>
      </div>
      {children}
    </div>
  );
}

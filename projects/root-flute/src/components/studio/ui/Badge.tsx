import { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  tone?: "gold" | "muted" | "forest";
}

const TONES = {
  gold: "bg-brand-gold/10 text-brand-gold border-brand-gold/30",
  muted: "bg-brand-surface-2 text-brand-muted border-brand-border",
  forest: "bg-brand-forest/20 text-brand-text border-brand-forest/40",
};

export default function Badge({ children, tone = "muted" }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full border text-[11px] uppercase tracking-wider font-sans font-medium ${TONES[tone]}`}
    >
      {children}
    </span>
  );
}

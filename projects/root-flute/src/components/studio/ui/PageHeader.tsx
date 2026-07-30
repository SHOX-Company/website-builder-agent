import { ReactNode } from "react";

interface PageHeaderProps {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}

export default function PageHeader({ eyebrow, title, description, actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6 pb-8 border-b border-brand-border">
      <div className="flex flex-col gap-2">
        {eyebrow && (
          <p className="text-brand-gold text-xs uppercase tracking-[0.3em] font-sans">{eyebrow}</p>
        )}
        <h1 className="font-display font-light text-brand-text text-3xl sm:text-4xl leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-brand-muted text-sm sm:text-base max-w-2xl leading-relaxed">{description}</p>
        )}
      </div>
      {actions && <div className="flex items-center gap-3 flex-shrink-0">{actions}</div>}
    </div>
  );
}

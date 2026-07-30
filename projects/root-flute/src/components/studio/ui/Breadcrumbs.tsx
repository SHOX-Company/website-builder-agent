import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  href?: string;
}

export default function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs font-sans">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={`${item.label}-${i}`} className="flex items-center gap-1.5">
            {item.href && !isLast ? (
              <Link href={item.href} className="text-brand-muted hover:text-brand-gold transition-colors duration-150">
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "text-brand-text" : "text-brand-muted"}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="w-3 h-3 text-brand-muted/50" strokeWidth={2} />}
          </span>
        );
      })}
    </nav>
  );
}

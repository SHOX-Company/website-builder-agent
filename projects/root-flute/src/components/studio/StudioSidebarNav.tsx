"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { STUDIO_NAV } from "@/lib/studioNav";

function isActivePath(pathname: string, href: string) {
  if (href === "/studio") return pathname === "/studio";
  return pathname === href || pathname.startsWith(href + "/");
}

export default function StudioSidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(
    STUDIO_NAV.find((item) => item.children && isActivePath(pathname, item.href))?.label ?? null
  );

  return (
    <nav aria-label="Studio navigation" className="flex flex-col gap-0.5 px-3">
      {STUDIO_NAV.map((item) => {
        const Icon = item.icon;
        const active = isActivePath(pathname, item.href);
        const hasChildren = Boolean(item.children?.length);
        const expanded = hasChildren && (openGroup === item.label || active);

        return (
          <div key={item.label}>
            <div
              className={`group flex items-center rounded-md transition-colors duration-150 ${
                active ? "bg-brand-gold/10 text-brand-gold" : "text-brand-text/80 hover:bg-brand-surface-2 hover:text-brand-text"
              }`}
            >
              <Link
                href={item.href}
                onClick={onNavigate}
                className="flex flex-1 items-center gap-3 px-3 py-2.5 text-sm font-sans"
              >
                <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.75} />
                <span className="truncate">{item.label}</span>
              </Link>
              {hasChildren && (
                <button
                  type="button"
                  aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
                  aria-expanded={expanded}
                  onClick={() => setOpenGroup((g) => (g === item.label ? null : item.label))}
                  className="px-2.5 py-2.5 text-brand-muted hover:text-brand-gold"
                >
                  <ChevronDown
                    className={`w-3.5 h-3.5 transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}
                    strokeWidth={2}
                  />
                </button>
              )}
            </div>

            {hasChildren && (
              <div
                className={`grid transition-all duration-200 ease-out ${
                  expanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-0.5 pl-9 pr-3 pb-1 pt-0.5">
                    {item.children!.map((child) => {
                      const childActive = pathname === child.href;
                      return (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={onNavigate}
                          className={`rounded-md px-3 py-2 text-sm font-sans transition-colors duration-150 ${
                            childActive
                              ? "text-brand-gold bg-brand-gold/10"
                              : "text-brand-muted hover:text-brand-text hover:bg-brand-surface-2"
                          }`}
                        >
                          {child.label}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </nav>
  );
}

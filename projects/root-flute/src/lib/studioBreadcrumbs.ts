import { STUDIO_NAV } from "@/lib/studioNav";
import type { Crumb } from "@/components/studio/ui/Breadcrumbs";

export function getStudioBreadcrumbs(pathname: string): Crumb[] {
  if (pathname === "/studio") {
    return [{ label: "Dashboard" }];
  }

  for (const item of STUDIO_NAV) {
    if (item.href === pathname) {
      return [{ label: "Studio", href: "/studio" }, { label: item.label }];
    }
    if (item.children) {
      const child = item.children.find((c) => c.href === pathname);
      if (child) {
        return [
          { label: "Studio", href: "/studio" },
          { label: item.label, href: item.href },
          { label: child.label },
        ];
      }
    }
  }

  return [{ label: "Studio", href: "/studio" }];
}

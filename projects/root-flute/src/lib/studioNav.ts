import {
  LayoutDashboard,
  Package,
  Video,
  Music,
  Mountain,
  Ticket,
  UserRound,
  Quote,
  Mail,
  Home,
  Images,
  Settings,
  type LucideIcon,
} from "lucide-react";

export interface StudioNavChild {
  label: string;
  href: string;
}

export interface StudioNavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  description: string;
  children?: StudioNavChild[];
}

export const STUDIO_NAV: StudioNavItem[] = [
  { label: "Dashboard", href: "/studio", icon: LayoutDashboard, description: "Your overview" },
  {
    label: "Inventory",
    href: "/studio/inventory",
    icon: Package,
    description: "Flutes, instruments & talismans",
  },
  {
    label: "Videos",
    href: "/studio/videos",
    icon: Video,
    description: "RootFlute Live, Instruments & Lucid Meditation",
    children: [
      { label: "RootFlute Live", href: "/studio/videos/rootflute-live" },
      { label: "Instruments", href: "/studio/videos/instruments" },
      { label: "Lucid Meditation", href: "/studio/videos/lucid-meditation" },
    ],
  },
  { label: "Music", href: "/studio/music", icon: Music, description: "Curated featured videos" },
  { label: "Materials", href: "/studio/materials", icon: Mountain, description: "Page copy & imagery" },
  { label: "Tickets", href: "/studio/tickets", icon: Ticket, description: "Upcoming performances & events" },
  { label: "About", href: "/studio/about", icon: UserRound, description: "Biography & imagery" },
  { label: "Testimonials", href: "/studio/testimonials", icon: Quote, description: "Customer testimonials" },
  { label: "Contact", href: "/studio/contact", icon: Mail, description: "Contact information" },
  { label: "Homepage", href: "/studio/homepage", icon: Home, description: "Featured homepage content" },
  { label: "Media Library", href: "/studio/media-library", icon: Images, description: "Photos & video assets" },
  { label: "Settings", href: "/studio/settings", icon: Settings, description: "Studio preferences" },
];

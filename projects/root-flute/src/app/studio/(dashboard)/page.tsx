import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import Badge from "@/components/studio/ui/Badge";
import { Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell } from "@/components/studio/ui/Table";
import { STUDIO_NAV } from "@/lib/studioNav";
import testimonialsCopy from "@/content/testimonials/testimonials.json";
import tickets from "@/content/tickets/tickets.json";
import rootfluteLiveVideos from "@/content/videos/rootflute-live.json";
import instrumentVideos from "@/content/videos/instruments.json";
import lucidMeditationVideos from "@/content/videos/lucid-meditation.json";

const SITE_URL = "https://root-flute.vercel.app";

const PUBLIC_PAGES = [
  { label: "Home", path: "/" },
  { label: "Society", path: "/society" },
  { label: "Flutes", path: "/flutes" },
  { label: "Talismans", path: "/jewelry" },
  { label: "Instruments", path: "/instruments" },
  { label: "Materials", path: "/materials" },
  { label: "RootFlute Live", path: "/videos/rootflute-live" },
  { label: "Instrument Videos", path: "/videos/instruments" },
  { label: "Lucid Meditation", path: "/videos/lucid-meditation" },
  { label: "Music", path: "/music" },
  { label: "Tickets", path: "/tickets" },
  { label: "About", path: "/about" },
  { label: "Testimonials", path: "/testimonials" },
  { label: "Contact", path: "/contact" },
];

export default function StudioDashboardPage() {
  const videoCount = rootfluteLiveVideos.length + instrumentVideos.length + lucidMeditationVideos.length;
  const testimonialCount = testimonialsCopy.testimonials.length;
  const ticketCount = tickets.length;

  const stats = [
    { label: "Public pages", value: PUBLIC_PAGES.length },
    { label: "Videos published", value: videoCount },
    { label: "Testimonials", value: testimonialCount },
    { label: "Upcoming events", value: ticketCount },
  ];

  const sections = STUDIO_NAV.filter((item) => item.href !== "/studio");

  return (
    <div className="flex flex-col gap-10">
      <PageHeader
        eyebrow="RootFlute Studio"
        title="Welcome back, Daniel"
        description="A private operating system for running RootFlute — content, community, and commerce, all from one place."
      />

      {/* Quick stats — real counts pulled directly from the live site's content */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.label} padding="lg">
            <p className="text-3xl font-display font-light text-brand-text">{stat.value}</p>
            <p className="text-brand-muted text-xs uppercase tracking-widest font-sans mt-2">{stat.label}</p>
          </Card>
        ))}
      </div>

      {/* Section tiles */}
      <div className="flex flex-col gap-4">
        <h2 className="font-display font-light text-brand-text text-xl">Manage your site</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href}>
                <Card hover padding="lg" className="h-full flex items-start gap-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-md bg-brand-gold/10 border border-brand-gold/20 flex-shrink-0">
                    <Icon className="w-[18px] h-[18px] text-brand-gold" strokeWidth={1.75} />
                  </div>
                  <div className="flex flex-col gap-1 min-w-0">
                    <span className="text-brand-text text-sm font-medium font-sans">{item.label}</span>
                    <span className="text-brand-muted text-xs leading-relaxed">{item.description}</span>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Live site overview */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="font-display font-light text-brand-text text-xl">Live site overview</h2>
          <Badge tone="forest">{PUBLIC_PAGES.length} pages live</Badge>
        </div>
        <Table>
          <TableHead>
            <TableHeaderCell>Page</TableHeaderCell>
            <TableHeaderCell>Path</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>
              <span className="sr-only">View</span>
            </TableHeaderCell>
          </TableHead>
          <TableBody>
            {PUBLIC_PAGES.map((page) => (
              <TableRow key={page.path}>
                <TableCell className="font-medium">{page.label}</TableCell>
                <TableCell className="text-brand-muted font-mono text-xs">{page.path}</TableCell>
                <TableCell>
                  <Badge tone="forest">Live</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <a
                    href={`${SITE_URL}${page.path}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-gold hover:text-brand-gold-light text-xs font-sans font-medium"
                  >
                    View <ArrowUpRight className="w-3 h-3" strokeWidth={2} />
                  </a>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

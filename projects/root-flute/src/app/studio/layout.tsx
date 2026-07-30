import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "RootFlute Studio",
  description: "Private operations dashboard for RootFlute.",
  robots: { index: false, follow: false },
};

export default function StudioRootLayout({ children }: { children: React.ReactNode }) {
  return children;
}

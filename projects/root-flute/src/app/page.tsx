// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import HomepageHero from "@/components/sections/HomepageHero";
import HomepagePathways from "@/components/sections/HomepagePathways";
import Footer from "@/components/sections/Footer";

export const metadata = buildPageMetadata("home");

export default function Home() {
  return (
    <main>
      <HomepageHero />
      <HomepagePathways />
      <Footer />
    </main>
  );
}

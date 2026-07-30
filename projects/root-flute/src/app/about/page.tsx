// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import AboutHero from "@/components/sections/about/AboutHero";
import AboutIntro from "@/components/sections/about/AboutIntro";
import AboutStory from "@/components/sections/about/AboutStory";
import Footer from "@/components/sections/Footer";
import copy from "@/content/about/about-copy.json";
import { getAboutPage } from "@/lib/aboutPageStore";

export const metadata = buildPageMetadata("about");
export const dynamic = "force-dynamic";

export default async function AboutPage() {
  const aboutPage = await getAboutPage();

  return (
    <main>
      <AboutHero
        image={
          aboutPage.heroImage
            ? { src: aboutPage.heroImage.url, alt: aboutPage.heroImage.alt }
            : { src: "/images/about/daniel-hansen-elephant-hero-wide.jpg", alt: "Daniel Hansen" }
        }
      />
      <AboutIntro heading={copy.heading} />
      <AboutStory copy={aboutPage.copy} />
      <Footer />
    </main>
  );
}

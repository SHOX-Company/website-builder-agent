// PROTECTED SOCIAL METADATA INFRASTRUCTURE — DO NOT MODIFY
// Metadata is managed centrally in src/lib/siteMetadata.ts.
import { buildPageMetadata } from "@/lib/siteMetadata";
import MaterialsHero from "@/components/sections/materials/MaterialsHero";
import MaterialsIntro from "@/components/sections/materials/MaterialsIntro";
import SectionWrapper from "@/components/ui/SectionWrapper";
import Footer from "@/components/sections/Footer";
import type { MaterialsCopy } from "@/lib/materials";
import copy from "@/content/materials/materials-copy.json";

export const metadata = buildPageMetadata("materials");
export const dynamic = "force-dynamic";

export default async function MaterialsPage() {
  const materialsCopy = copy as MaterialsCopy;
  const [intro, ...remainingStatements] = materialsCopy.statements;

  return (
    <main>
      <MaterialsHero copy={materialsCopy} />
      <MaterialsIntro intro={intro} />
      <SectionWrapper className="bg-brand-surface">
        <div className="max-w-2xl mx-auto flex flex-col gap-8 text-center">
          {remainingStatements.map((statement, i) => (
            <p
              key={i}
              className={
                i === remainingStatements.length - 1
                  ? "font-display italic text-2xl sm:text-3xl text-brand-text/85 leading-relaxed"
                  : "text-brand-muted text-base sm:text-lg leading-relaxed"
              }
            >
              {statement}
            </p>
          ))}
        </div>
      </SectionWrapper>

      <Footer />
    </main>
  );
}

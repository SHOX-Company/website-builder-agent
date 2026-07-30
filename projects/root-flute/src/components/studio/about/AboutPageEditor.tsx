"use client";

import { useState } from "react";
import type { AboutImage, AboutPageContent } from "@/lib/aboutPage";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import Textarea from "@/components/studio/ui/Textarea";
import EditorFooter from "@/components/studio/ui/EditorFooter";
import { FeaturedImageUploader } from "@/components/studio/inventory/InventoryMediaUploader";

export default function AboutPageEditor({ initialContent }: { initialContent: AboutPageContent }) {
  const [copy, setCopy] = useState(initialContent.copy);
  const [heroImage, setHeroImage] = useState<AboutImage | null>(initialContent.heroImage);
  const [saved, setSaved] = useState(initialContent);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = copy !== saved.copy || heroImage?.url !== saved.heroImage?.url;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/about", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ copy, heroImage }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const content = data.content as AboutPageContent;
      setCopy(content.copy);
      setHeroImage(content.heroImage);
      setSaved(content);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="About"
        title="About"
        description="The biography and hero image shown on the public About page. Editing here updates the live site immediately."
      />

      <Card className="flex flex-col gap-5">
        <Textarea
          id="about-copy"
          label="About Copy"
          rows={18}
          value={copy}
          onChange={(e) => setCopy(e.target.value)}
        />
      </Card>

      <Card className="flex flex-col gap-4">
        <span className="text-xs uppercase tracking-widest text-brand-muted font-sans">Hero Image</span>
        <FeaturedImageUploader value={heroImage} onChange={setHeroImage} />
      </Card>

      <EditorFooter onSave={handleSave} saveLabel={saving ? "Saving…" : "Save Changes"} saveDisabled={!dirty || saving} error={error} />
    </div>
  );
}

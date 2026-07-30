"use client";

import { useState } from "react";
import type { MaterialsStatementContent } from "@/lib/material";
import PageHeader from "@/components/studio/ui/PageHeader";
import Card from "@/components/studio/ui/Card";
import Textarea from "@/components/studio/ui/Textarea";
import EditorFooter from "@/components/studio/ui/EditorFooter";

export default function MaterialsStatementEditor({
  initialContent,
}: {
  initialContent: MaterialsStatementContent;
}) {
  const [statement, setStatement] = useState(initialContent.statement);
  const [savedStatement, setSavedStatement] = useState(initialContent.statement);
  const [updatedAt, setUpdatedAt] = useState(initialContent.updatedAt);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dirty = statement !== savedStatement;

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/studio/materials", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ statement }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error ?? "Something went wrong. Please try again.");
        return;
      }
      const content = data.content as MaterialsStatementContent;
      setStatement(content.statement);
      setSavedStatement(content.statement);
      setUpdatedAt(content.updatedAt);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <PageHeader
        eyebrow="Materials"
        title="Materials Statement"
        description="The materials philosophy shown on the public Materials page. Editing here updates the live site immediately."
      />

      <Card className="flex flex-col gap-5">
        <Textarea
          id="materials-statement"
          label="Statement"
          rows={12}
          value={statement}
          onChange={(e) => setStatement(e.target.value)}
        />

        <p className="text-brand-muted text-xs font-sans">
          Last updated {new Date(updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </p>
      </Card>

      <EditorFooter onSave={handleSave} saveLabel={saving ? "Saving…" : "Save Changes"} saveDisabled={!dirty || saving} error={error} />
    </div>
  );
}
